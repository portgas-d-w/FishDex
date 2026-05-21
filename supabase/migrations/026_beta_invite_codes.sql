-- ============================================================
-- 026 — Codes d'invitation bêta : is_developer + seed
-- ============================================================

-- Ajouter note et created_by à beta_invites
ALTER TABLE public.beta_invites
  ADD COLUMN IF NOT EXISTS note       TEXT,
  ADD COLUMN IF NOT EXISTS created_by TEXT NOT NULL DEFAULT 'admin';

-- Ajouter is_developer et invited_with_code aux profils
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_developer      BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS invited_with_code TEXT    NULL;

-- Tous les comptes existants = développeur (accès total permanent)
UPDATE public.profiles SET is_developer = TRUE;

-- Seed des 10 premiers codes
INSERT INTO public.beta_invites (code, note) VALUES
  ('FISH-2026-ALPHA1',  'Bêta testeur 01'),
  ('FISH-2026-ALPHA2',  'Bêta testeur 02'),
  ('FISH-2026-ALPHA3',  'Bêta testeur 03'),
  ('FISH-2026-ALPHA4',  'Bêta testeur 04'),
  ('FISH-2026-ALPHA5',  'Bêta testeur 05'),
  ('FISH-2026-ALPHA6',  'Bêta testeur 06'),
  ('FISH-2026-ALPHA7',  'Bêta testeur 07'),
  ('FISH-2026-ALPHA8',  'Bêta testeur 08'),
  ('FISH-2026-ALPHA9',  'Bêta testeur 09'),
  ('FISH-2026-ALPHA10', 'Bêta testeur 10')
ON CONFLICT (code) DO NOTHING;
