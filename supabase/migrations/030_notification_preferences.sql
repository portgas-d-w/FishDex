-- Migration 030 : Préférences de notifications météo (F7)

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weather_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_lat         DOUBLE PRECISION DEFAULT NULL,
  preferred_lon         DOUBLE PRECISION DEFAULT NULL,
  notification_days     TEXT[]  NOT NULL DEFAULT ARRAY['saturday', 'sunday'],
  last_notified_at      TIMESTAMPTZ DEFAULT NULL,
  push_endpoint         TEXT    DEFAULT NULL,
  push_keys             JSONB   DEFAULT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notification preferences"
  ON public.notification_preferences FOR ALL
  USING (auth.uid() = user_id);
