-- ============================================================
-- FishDex — Migration 007 : RPC atomique pour l'attribution XP
--
-- Remplace les opérations directes sur user_xp depuis le code TS.
-- SECURITY DEFINER = bypass RLS, exécution avec droits owner.
-- Idempotent : peut être relancé 2× sans double-compter.
-- ============================================================

-- ─── Helper : calcul de niveau depuis le total XP ────────────
-- Formule : level = floor(1 + sqrt(xp / 100)), minimum 1
-- Cohérente avec calcLevel() dans src/lib/xp/calculator.ts
CREATE OR REPLACE FUNCTION public.level_from_xp(xp INTEGER)
RETURNS INTEGER AS $$
  SELECT GREATEST(1, FLOOR(1 + SQRT(GREATEST(0, xp)::numeric / 100))::integer);
$$ LANGUAGE SQL IMMUTABLE;

GRANT EXECUTE ON FUNCTION public.level_from_xp(integer) TO authenticated;

-- ─── RPC principale : attribuer XP pour une prise ────────────
-- p_events : [{event_type, xp_amount, metadata?}]
-- Atomique  : INSERT xp_events + UPSERT user_xp dans la même transaction.
-- Idempotent: si un event 'capture' existe déjà pour p_catch_id,
--             retourne l'état actuel sans modifier quoi que ce soit.
CREATE OR REPLACE FUNCTION public.award_xp_for_catch(
  p_user_id           uuid,
  p_catch_id          uuid,
  p_events            jsonb,
  p_current_streak    integer,
  p_longest_streak    integer,
  p_last_capture_date date,
  p_joker_used_week   text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing  integer;
  v_xp_gained integer := 0;
  v_ev        jsonb;
  v_new_total integer;
  v_new_level integer;
BEGIN
  -- Idempotency guard: si la prise a déjà été traitée, ne rien faire
  SELECT COUNT(*) INTO v_existing
  FROM public.xp_events
  WHERE catch_id = p_catch_id AND event_type = 'capture';

  IF v_existing > 0 THEN
    SELECT total_xp, level INTO v_new_total, v_new_level
    FROM public.user_xp WHERE user_id = p_user_id;
    RETURN jsonb_build_object(
      'already_processed', true,
      'xp_gained', 0,
      'total_xp',  COALESCE(v_new_total, 0),
      'level',     COALESCE(v_new_level, 1)
    );
  END IF;

  -- Insérer chaque event XP
  FOR v_ev IN SELECT value FROM jsonb_array_elements(p_events)
  LOOP
    INSERT INTO public.xp_events (user_id, catch_id, event_type, xp_amount, metadata)
    VALUES (
      p_user_id,
      p_catch_id,
      v_ev->>'event_type',
      (v_ev->>'xp_amount')::integer,
      CASE WHEN v_ev ? 'metadata' THEN v_ev->'metadata' ELSE NULL END
    );
    v_xp_gained := v_xp_gained + (v_ev->>'xp_amount')::integer;
  END LOOP;

  -- Upsert atomique user_xp : total_xp incrémenté, jamais écrasé
  INSERT INTO public.user_xp (
    user_id, total_xp, level,
    current_streak, longest_streak,
    last_capture_date, joker_used_week,
    updated_at
  )
  VALUES (
    p_user_id,
    v_xp_gained,
    public.level_from_xp(v_xp_gained),
    p_current_streak,
    p_longest_streak,
    p_last_capture_date,
    p_joker_used_week,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_xp          = user_xp.total_xp + v_xp_gained,
    level             = public.level_from_xp(user_xp.total_xp + v_xp_gained),
    current_streak    = p_current_streak,
    longest_streak    = p_longest_streak,
    last_capture_date = p_last_capture_date,
    joker_used_week   = p_joker_used_week,
    updated_at        = now();

  SELECT total_xp, level INTO v_new_total, v_new_level
  FROM public.user_xp WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'already_processed', false,
    'xp_gained', v_xp_gained,
    'total_xp',  v_new_total,
    'level',     v_new_level
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.award_xp_for_catch(uuid, uuid, jsonb, integer, integer, date, text)
  TO authenticated;

-- ─── RPC secondaire : incrémenter XP (complétion de missions) ─
-- Atomique : UPSERT user_xp en un seul appel SQL, bypass RLS.
CREATE OR REPLACE FUNCTION public.increment_user_xp(
  p_user_id uuid,
  p_amount  integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_xp (user_id, total_xp, level, updated_at)
  VALUES (p_user_id, p_amount, public.level_from_xp(p_amount), now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_xp   = user_xp.total_xp + p_amount,
    level      = public.level_from_xp(user_xp.total_xp + p_amount),
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_user_xp(uuid, integer)
  TO authenticated;
