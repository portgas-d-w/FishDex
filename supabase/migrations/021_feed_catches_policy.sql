-- ============================================
-- H4.4 — FishFeed : politique lecture catches partagées
-- ============================================

-- Permet de lire les données d'une capture si elle est liée à un post public.
-- Sans ça, les photos des autres users sont invisibles dans le feed (RLS bloque).

DROP POLICY IF EXISTS "Lecture des prises" ON public.catches;

CREATE POLICY "Lecture des prises"
  ON public.catches FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_public = TRUE
    OR EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.catch_id = catches.id
        AND posts.is_public = TRUE
    )
  );
