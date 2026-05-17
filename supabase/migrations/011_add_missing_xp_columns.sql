-- Colonnes ajoutées à user_xp après la migration initiale 004.
-- Idempotent : ADD COLUMN IF NOT EXISTS ne casse rien si elles existent déjà.
ALTER TABLE public.user_xp ADD COLUMN IF NOT EXISTS joker_used_week text;
ALTER TABLE public.user_xp ADD COLUMN IF NOT EXISTS vacation_mode_until date;
ALTER TABLE public.user_xp ADD COLUMN IF NOT EXISTS vacation_days_used integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_xp ADD COLUMN IF NOT EXISTS vacation_year integer NOT NULL DEFAULT extract(year from current_date)::integer;
