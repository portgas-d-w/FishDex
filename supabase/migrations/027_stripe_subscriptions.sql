-- ============================================================
-- 027 — Abonnements Stripe : tiers Free / Pro / Légende
-- ============================================================

-- Colonnes d'abonnement sur profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT
    NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT
    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT NULL;

-- Contraintes CHECK (ajoutées séparément pour idempotence)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_tier_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_subscription_tier_check
      CHECK (subscription_tier IN ('free', 'pro', 'legende'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_subscription_status_check
      CHECK (subscription_status IN (
        'active', 'canceled', 'past_due', 'trialing', 'incomplete',
        'incomplete_expired', 'unpaid', 'paused'
      ) OR subscription_status IS NULL);
  END IF;
END
$$;

-- Index uniques (partiels pour permettre les NULL multiples)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_stripe_customer_id_unique
  ON public.profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_stripe_subscription_id_unique
  ON public.profiles(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Index pour les queries fréquentes
CREATE INDEX IF NOT EXISTS profiles_subscription_tier_idx
  ON public.profiles(subscription_tier);

-- Les comptes développeur ont accès Légende permanent
UPDATE public.profiles
SET subscription_tier = 'legende'
WHERE is_developer = TRUE;
