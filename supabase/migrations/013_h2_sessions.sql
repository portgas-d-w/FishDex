-- ============================================
-- H2 SESSIONS — Migration complète
-- ============================================

-- 1. Table SPOTS (lieux de pêche favoris)
CREATE TABLE public.spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  nb_visites INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_spots_user_id ON public.spots(user_id);

-- 2. Table SESSIONS
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES public.spots(id) ON DELETE SET NULL,
  title TEXT,
  intention TEXT,
  compagnons TEXT,
  style_peche TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  editable_until TIMESTAMPTZ,
  photo_ambiance_url TEXT,
  ressenti TEXT,
  notes TEXT,
  is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
  season TEXT,
  light_phase TEXT,
  meteo_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_started_at ON public.sessions(started_at DESC);
CREATE INDEX idx_sessions_user_active ON public.sessions(user_id) WHERE ended_at IS NULL;

-- 3. ALTER catches : ajouter session_id + capture_source + released
ALTER TABLE public.catches
  ADD COLUMN session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  ADD COLUMN capture_source TEXT CHECK (capture_source IN ('camera', 'gallery')),
  ADD COLUMN released BOOLEAN DEFAULT NULL;

CREATE INDEX idx_catches_session_id ON public.catches(session_id);

-- 4. ALTER profiles : préférences sessions + no-kill par défaut
ALTER TABLE public.profiles
  ADD COLUMN suggest_session_on_capture BOOLEAN DEFAULT TRUE,
  ADD COLUMN default_release BOOLEAN DEFAULT FALSE;

-- 5. FUNCTION : calcule season + light_phase au INSERT
CREATE OR REPLACE FUNCTION public.calculate_session_context()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcul season depuis le mois
  NEW.season := CASE
    WHEN EXTRACT(MONTH FROM NEW.started_at) IN (3, 4, 5) THEN 'printemps'
    WHEN EXTRACT(MONTH FROM NEW.started_at) IN (6, 7, 8) THEN 'été'
    WHEN EXTRACT(MONTH FROM NEW.started_at) IN (9, 10, 11) THEN 'automne'
    ELSE 'hiver'
  END;

  -- Calcul light_phase depuis l'heure
  NEW.light_phase := CASE
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 5 AND 7 THEN 'aube'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 8 AND 11 THEN 'matin'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 12 AND 14 THEN 'midi'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 15 AND 17 THEN 'aprem'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 18 AND 20 THEN 'crépuscule'
    ELSE 'nuit'
  END;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_session_context
BEFORE INSERT ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.calculate_session_context();

-- 6. FUNCTION : calcule editable_until quand ended_at est set
CREATE OR REPLACE FUNCTION public.set_editable_until()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.editable_until := NEW.ended_at + INTERVAL '48 hours';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_editable_until_trigger
BEFORE UPDATE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.set_editable_until();

-- 7. FUNCTION : bloque édition après editable_until
CREATE OR REPLACE FUNCTION public.check_session_editable()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la session est fermée ET la fenêtre est dépassée
  IF OLD.ended_at IS NOT NULL
     AND OLD.editable_until IS NOT NULL
     AND NOW() > OLD.editable_until THEN
    -- Autoriser uniquement is_bookmarked (peut toujours être changé)
    IF (NEW.title IS DISTINCT FROM OLD.title) OR
       (NEW.intention IS DISTINCT FROM OLD.intention) OR
       (NEW.compagnons IS DISTINCT FROM OLD.compagnons) OR
       (NEW.style_peche IS DISTINCT FROM OLD.style_peche) OR
       (NEW.started_at IS DISTINCT FROM OLD.started_at) OR
       (NEW.ended_at IS DISTINCT FROM OLD.ended_at) OR
       (NEW.photo_ambiance_url IS DISTINCT FROM OLD.photo_ambiance_url) OR
       (NEW.ressenti IS DISTINCT FROM OLD.ressenti) OR
       (NEW.notes IS DISTINCT FROM OLD.notes) OR
       (NEW.spot_id IS DISTINCT FROM OLD.spot_id) THEN
      RAISE EXCEPTION 'Session is no longer editable (48h window expired)';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_late_session_edit
BEFORE UPDATE ON public.sessions
FOR EACH ROW
WHEN (OLD.ended_at IS NOT NULL)
EXECUTE FUNCTION public.check_session_editable();

-- 8. RLS Policies
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Spots : owner only
CREATE POLICY "spots_select_own" ON public.spots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "spots_insert_own" ON public.spots
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spots_update_own" ON public.spots
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "spots_delete_own" ON public.spots
  FOR DELETE USING (auth.uid() = user_id);

-- Sessions : owner only
CREATE POLICY "sessions_select_own" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert_own" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update_own" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessions_delete_own" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);
