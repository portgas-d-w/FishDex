-- ============================================
-- H3.7 — Sessions rétroactives
-- ============================================

ALTER TABLE public.sessions
  ADD COLUMN is_retro BOOLEAN NOT NULL DEFAULT FALSE;
