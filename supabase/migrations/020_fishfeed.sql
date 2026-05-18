-- ============================================
-- H4.4 — FishFeed minimaliste
-- ============================================

-- 1. Table posts
CREATE TABLE public.posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catch_id     UUID NULL REFERENCES public.catches(id) ON DELETE SET NULL,
  session_id   UUID NULL REFERENCES public.sessions(id) ON DELETE SET NULL,
  type         TEXT NOT NULL CHECK (type IN ('capture', 'session', 'memory')),
  caption      TEXT NULL,
  is_public    BOOLEAN NOT NULL DEFAULT TRUE,
  report_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id    ON public.posts(user_id);
CREATE INDEX idx_posts_public     ON public.posts(is_public, created_at DESC);
CREATE INDEX idx_posts_catch_id   ON public.posts(catch_id);

-- 2. Table reactions (pas de "like", 7 émotions de pêcheur)
CREATE TABLE public.reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji      TEXT NOT NULL CHECK (emoji IN ('respect', 'beau', 'merci', 'inspire', 'sage', 'sourire', 'force')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id, emoji)
);

CREATE INDEX idx_reactions_post_id ON public.reactions(post_id);

-- 3. Table signalements
CREATE TABLE public.post_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, reporter_id)
);

CREATE INDEX idx_post_reports_post_id ON public.post_reports(post_id);

-- 4. Trigger : auto-hide après 3 signalements
CREATE OR REPLACE FUNCTION public.update_post_report_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET report_count = (
    SELECT COUNT(*) FROM public.post_reports WHERE post_id = NEW.post_id
  ),
  is_public = (
    SELECT COUNT(*) < 3 FROM public.post_reports WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_count_on_insert
AFTER INSERT ON public.post_reports
FOR EACH ROW EXECUTE FUNCTION public.update_post_report_count();

-- 5. RLS
ALTER TABLE public.posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

-- Posts : lecture publique des posts is_public, écriture = propriétaire
CREATE POLICY "posts_select_public"  ON public.posts FOR SELECT USING (is_public = TRUE);
CREATE POLICY "posts_insert_own"     ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_delete_own"     ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Reactions : lecture publique, écriture = propriétaire
CREATE POLICY "reactions_select_all"  ON public.reactions FOR SELECT USING (TRUE);
CREATE POLICY "reactions_insert_own"  ON public.reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete_own"  ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- Signalements : écriture = propriétaire, lecture admin
CREATE POLICY "reports_insert_own"   ON public.post_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_select_own"   ON public.post_reports FOR SELECT USING (auth.uid() = reporter_id);
