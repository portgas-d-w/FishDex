-- SCRIPT DE RATTRAPAGE — Recalcule total_xp + level pour tous les users
-- À lancer UNE SEULE FOIS dans Supabase SQL Editor

-- 1. Update users qui ont déjà une ligne user_xp
UPDATE public.user_xp u
SET
  total_xp = COALESCE((
    SELECT SUM(xp_amount)
    FROM public.xp_events
    WHERE user_id = u.user_id
  ), 0),
  level = public.level_from_xp(COALESCE((
    SELECT SUM(xp_amount)
    FROM public.xp_events
    WHERE user_id = u.user_id
  ), 0)),
  updated_at = NOW();

-- 2. Insert lignes manquantes pour users avec events orphelins
INSERT INTO public.user_xp (user_id, total_xp, level, updated_at)
SELECT
  e.user_id,
  SUM(e.xp_amount) AS total_xp,
  public.level_from_xp(SUM(e.xp_amount)) AS level,
  NOW()
FROM public.xp_events e
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_xp x WHERE x.user_id = e.user_id
)
GROUP BY e.user_id;

-- 3. Vérification finale : doit retourner 0 lignes
SELECT
  u.user_id,
  u.total_xp AS xp_dans_user_xp,
  COALESCE(SUM(e.xp_amount), 0) AS xp_dans_events,
  u.total_xp - COALESCE(SUM(e.xp_amount), 0) AS delta
FROM public.user_xp u
LEFT JOIN public.xp_events e ON e.user_id = u.user_id
GROUP BY u.user_id, u.total_xp
HAVING u.total_xp != COALESCE(SUM(e.xp_amount), 0);
