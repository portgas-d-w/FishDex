-- ============================================
-- H4.1 — Data flywheel IA
-- ============================================

-- 1. Consentement user sur profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_data_consent BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Table de données d'entraînement
CREATE TABLE public.ai_training_data (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catch_id                UUID NOT NULL REFERENCES public.catches(id) ON DELETE CASCADE,
  photo_url               TEXT NOT NULL,
  species_id_validated    UUID NOT NULL REFERENCES public.species(id),
  variant_id              UUID NULL,
  species_id_predicted    UUID NULL REFERENCES public.species(id),
  prediction_confidence   FLOAT NULL,
  user_corrected          BOOLEAN NOT NULL DEFAULT FALSE,
  quality_score           FLOAT NULL,
  is_usable_for_training  BOOLEAN NOT NULL DEFAULT TRUE,
  notes                   TEXT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_training_species   ON public.ai_training_data(species_id_validated);
CREATE INDEX idx_ai_training_corrected ON public.ai_training_data(user_corrected);
CREATE INDEX idx_ai_training_usable    ON public.ai_training_data(is_usable_for_training);
CREATE UNIQUE INDEX idx_ai_training_catch_unique ON public.ai_training_data(catch_id);

ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;

-- L'user peut voir et supprimer ses propres données (RGPD)
CREATE POLICY "ai_training_select_own" ON public.ai_training_data
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_training_delete_own" ON public.ai_training_data
  FOR DELETE USING (auth.uid() = user_id);

-- Insertion uniquement via service_role / server action
CREATE POLICY "ai_training_insert_own" ON public.ai_training_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);
