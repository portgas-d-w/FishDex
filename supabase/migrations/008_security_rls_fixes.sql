-- ============================================================
-- FishDex — Migration 008 : Security RLS Fixes
-- ============================================================
-- Retrait des policies d'écriture côté user sur les tables
-- dont les écritures passent exclusivement par des fonctions
-- SECURITY DEFINER (award_xp_for_catch, increment_user_xp)
-- ou le client admin server-side (assigner.ts).
-- Un user authentifié ne doit jamais pouvoir écrire
-- directement dans ces tables via le client JS/REST.
-- ============================================================

-- ─── user_xp : retrait INSERT + UPDATE côté user ─────────────
-- Écritures gérées par award_xp_for_catch (SECURITY DEFINER)
DROP POLICY IF EXISTS "uxp_ins" ON public.user_xp;
DROP POLICY IF EXISTS "uxp_upd" ON public.user_xp;

-- ─── xp_events : retrait INSERT côté user ────────────────────
-- Events créés uniquement par award_xp_for_catch et assigner.ts
DROP POLICY IF EXISTS "xpe_ins" ON public.xp_events;

-- ─── user_missions : retrait INSERT + UPDATE côté user ───────
-- Assignation et progression gérées par assigner.ts (admin client)
DROP POLICY IF EXISTS "um_ins" ON public.user_missions;
DROP POLICY IF EXISTS "um_upd" ON public.user_missions;

-- ─── species : restreindre à authenticated (pas anon) ────────
DROP POLICY IF EXISTS "Lecture publique des espèces" ON public.species;
CREATE POLICY "Lecture publique des espèces"
  ON public.species FOR SELECT
  TO authenticated
  USING (true);
