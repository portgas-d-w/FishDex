-- ============================================================
-- IA3.4 — Dashboard admin IA : paramètres applicatifs + logs
-- ============================================================

-- 1. Table de paramètres applicatifs (clé-valeur)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kill switch Claude Vision (true = activé) + budget mensuel
INSERT INTO public.app_settings (key, value) VALUES
  ('claude_vision_enabled',     'true'),
  ('claude_monthly_budget_eur', '20')
ON CONFLICT (key) DO NOTHING;

-- Lisible par tous (non sensible) — modification uniquement via service_role
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_read_all" ON public.app_settings
  FOR SELECT USING (true);

-- 2. Table de logs de coûts IA (un enregistrement par appel Claude)
CREATE TABLE IF NOT EXISTS public.ai_scan_logs (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  user_id       UUID           REFERENCES auth.users(id) ON DELETE SET NULL,
  catch_id      UUID           REFERENCES public.catches(id) ON DELETE SET NULL,
  model_used    TEXT           NOT NULL DEFAULT 'claude',
  input_tokens  INTEGER        NOT NULL DEFAULT 0,
  output_tokens INTEGER        NOT NULL DEFAULT 0,
  cost_eur      NUMERIC(10, 6) NOT NULL DEFAULT 0
);

CREATE INDEX idx_ai_scan_logs_created ON public.ai_scan_logs(created_at);
CREATE INDEX idx_ai_scan_logs_month   ON public.ai_scan_logs(date_trunc('month', created_at));
CREATE INDEX idx_ai_scan_logs_user    ON public.ai_scan_logs(user_id);

-- Accessible uniquement via service_role (pas de lecture côté client)
ALTER TABLE public.ai_scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_scan_logs_admin_only" ON public.ai_scan_logs
  FOR ALL USING (false);
