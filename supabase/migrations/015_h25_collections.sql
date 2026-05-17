-- ============================================================
-- H2.5 COLLECTIONS — Migration complète
-- ============================================================
-- Nouvelles tables : collections, species_collections
-- ALTER species : +is_hidden_in_dex
-- ALTER profiles : +preferred_collection_slug, +collection_choice_completed
-- ============================================================

-- ── 1. Table COLLECTIONS ─────────────────────────────────────────────────────
CREATE TABLE public.collections (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT    UNIQUE NOT NULL,
  nom         TEXT    NOT NULL,
  description TEXT,
  emoji       TEXT    NOT NULL DEFAULT '🐟',
  ordre       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Lecture publique (données de référence non personnelles)
CREATE POLICY "collections_public_read"
  ON public.collections FOR SELECT USING (true);

-- Seed des 3 voies
INSERT INTO public.collections (slug, nom, emoji, description, ordre) VALUES
  ('paisibles',  'Paisibles',  '🐟', 'Cyprinidés, carpes et espèces de fond', 1),
  ('predateurs', 'Prédateurs', '🦈', 'Carnassiers et espèces de chasse',      2),
  ('eaux-vives', 'Eaux vives', '🌊', 'Salmonidés et espèces de rivière',      3);

-- ── 2. Pivot SPECIES ↔ COLLECTIONS ──────────────────────────────────────────
CREATE TABLE public.species_collections (
  species_id    UUID NOT NULL REFERENCES public.species(id)    ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  PRIMARY KEY (species_id, collection_id)
);

CREATE INDEX idx_sc_collection ON public.species_collections(collection_id);
CREATE INDEX idx_sc_species    ON public.species_collections(species_id);

ALTER TABLE public.species_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sc_public_read"
  ON public.species_collections FOR SELECT USING (true);

-- ── 3. ALTER SPECIES : colonne is_hidden_in_dex ──────────────────────────────
-- TRUE = Mirage → invisible tant que non capturé par l'user
ALTER TABLE public.species
  ADD COLUMN IF NOT EXISTS is_hidden_in_dex BOOLEAN NOT NULL DEFAULT FALSE;

-- Masquer automatiquement tous les Mirages existants
UPDATE public.species
  SET is_hidden_in_dex = TRUE
  WHERE rarete = 'mirage';

-- ── 4. ALTER PROFILES : préférences collections ───────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_collection_slug TEXT,
  ADD COLUMN IF NOT EXISTS collection_choice_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Contrainte FK vers le slug de collection (nullable = "Tout explorer")
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_collection
  FOREIGN KEY (preferred_collection_slug)
  REFERENCES public.collections(slug)
  ON DELETE SET NULL;

-- ── 5. Fonction utilitaire : progression d'un user dans une collection ────────
-- Appel : SELECT * FROM get_collection_progress(auth.uid(), 'paisibles');
CREATE OR REPLACE FUNCTION public.get_collection_progress(
  p_user_id      UUID,
  p_collection_slug TEXT
)
RETURNS TABLE (
  total_visible     BIGINT,
  captured_visible  BIGINT,
  captured_mirages  BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(s.id) FILTER (WHERE s.is_hidden_in_dex = FALSE)                          AS total_visible,
    COUNT(s.id) FILTER (WHERE s.is_hidden_in_dex = FALSE AND ca.species_id IS NOT NULL) AS captured_visible,
    COUNT(s.id) FILTER (WHERE s.is_hidden_in_dex = TRUE  AND ca.species_id IS NOT NULL) AS captured_mirages
  FROM public.collections c
  JOIN public.species_collections sc ON sc.collection_id = c.id
  JOIN public.species s ON s.id = sc.species_id
  LEFT JOIN (
    SELECT DISTINCT species_id FROM public.catches WHERE user_id = p_user_id
  ) ca ON ca.species_id = s.id
  WHERE c.slug = p_collection_slug;
$$;

GRANT EXECUTE ON FUNCTION public.get_collection_progress(UUID, TEXT) TO authenticated;
