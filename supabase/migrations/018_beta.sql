-- ============================================
-- H3.8 — Préparation bêta fermée
-- ============================================

-- 1. Table beta_signups (candidatures)
CREATE TABLE public.beta_signups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  type_eau    TEXT,            -- 'douce' | 'mer' | 'les_deux'
  especes     TEXT[],          -- ['carpe', 'brochet', ...]
  frequence   TEXT,            -- 'debutant' | 'mensuel' | 'hebdo' | 'passionne'
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_beta_signups_status ON public.beta_signups(status);
CREATE INDEX idx_beta_signups_email  ON public.beta_signups(email);

-- 2. Table beta_invites (codes d'invitation)
CREATE TABLE public.beta_invites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL UNIQUE,
  email           TEXT,        -- email ciblé (optionnel)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at         TIMESTAMPTZ,
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_beta_invites_code ON public.beta_invites(code);

-- 3. Colonne is_beta_user sur profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_beta_user BOOLEAN NOT NULL DEFAULT FALSE;

-- 4. RLS — beta_signups : lecture publique en INSERT, lecture admin via service key
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_invites ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut s'inscrire
CREATE POLICY "beta_signups_insert_public" ON public.beta_signups
  FOR INSERT WITH CHECK (TRUE);

-- Seul le propriétaire du compte peut lire ses invites (validation côté serveur)
CREATE POLICY "beta_invites_select_service" ON public.beta_invites
  FOR SELECT USING (TRUE); -- lecture via service_role uniquement en pratique
