-- ============================================================
-- H2.5 — Enrichissement schéma espèces
-- ============================================================
-- 1. Contrainte rarete : ajoute 'peu commun'
-- 2. Colonnes riches manquantes sur species
-- 3. Table species_variants
-- ============================================================

-- ── 1. Contrainte rarete — ajoute 'peu commun' ───────────────────────────────

-- Supprimer toute contrainte CHECK existante sur rarete
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'species'
      AND nsp.nspname = 'public'
      AND con.contype = 'c'
      AND con.conname ILIKE '%rarete%'
  LOOP
    EXECUTE 'ALTER TABLE public.species DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

ALTER TABLE public.species
  ADD CONSTRAINT species_rarete_check
  CHECK (rarete IN ('commun', 'peu commun', 'rare', 'epique', 'legendaire', 'mirage'));

-- ── 2. Colonnes enrichies ─────────────────────────────────────────────────────

ALTER TABLE public.species
  ADD COLUMN IF NOT EXISTS longevite_annees         TEXT,
  ADD COLUMN IF NOT EXISTS taille_moyenne_cm        INT,
  ADD COLUMN IF NOT EXISTS poids_moyen_kg           DECIMAL(8,3),
  ADD COLUMN IF NOT EXISTS temperature_eau          TEXT,
  ADD COLUMN IF NOT EXISTS saison_active            TEXT,
  ADD COLUMN IF NOT EXISTS conseil_fishdex          TEXT,
  ADD COLUMN IF NOT EXISTS statut_reglementaire     TEXT,
  ADD COLUMN IF NOT EXISTS techniques_recommandees  JSONB,
  ADD COLUMN IF NOT EXISTS conditions_ideales       JSONB;

-- ── 3. Table species_variants ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.species_variants (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id         UUID        NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  slug               TEXT        UNIQUE NOT NULL,
  nom_fr             TEXT        NOT NULL,
  description_courte TEXT,
  is_mirage          BOOLEAN     NOT NULL DEFAULT FALSE,
  rarete_relative    TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.species_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants_public_read"
  ON public.species_variants FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_sv_species    ON public.species_variants(species_id);
CREATE INDEX IF NOT EXISTS idx_sv_is_mirage  ON public.species_variants(is_mirage);
