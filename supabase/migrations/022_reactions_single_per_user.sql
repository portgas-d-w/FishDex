-- ============================================
-- H4.4 — Une seule réaction par user par post
-- ============================================

-- Supprimer l'ancienne contrainte (post_id, user_id, emoji)
ALTER TABLE public.reactions
  DROP CONSTRAINT IF EXISTS reactions_post_id_user_id_emoji_key;

-- Nettoyer les doublons éventuels (garder le plus récent par user/post)
DELETE FROM public.reactions
WHERE id NOT IN (
  SELECT DISTINCT ON (post_id, user_id) id
  FROM public.reactions
  ORDER BY post_id, user_id, created_at DESC
);

-- Nouvelle contrainte : 1 seule réaction par user par post
ALTER TABLE public.reactions
  ADD CONSTRAINT reactions_post_id_user_id_key UNIQUE (post_id, user_id);
