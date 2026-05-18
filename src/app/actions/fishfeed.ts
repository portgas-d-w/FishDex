'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { REACTION_EMOJIS, type ReactionKey } from '@/lib/fishfeed/constants'

const FEED_GATE_CATCHES = 1

export type FeedPost = {
  id: string
  user_id: string
  username: string
  avatar_url: string | null
  catch_id: string | null
  photo_url: string | null
  species_nom: string | null
  caption: string | null
  created_at: string
  type: 'capture' | 'session' | 'memory'
  reactions: Record<ReactionKey, { count: number; userHasReacted: boolean }>
}

// ── Vérifier l'accès au feed ──────────────────────────────────────────────────

export async function checkFeedAccess(): Promise<{
  hasAccess: boolean
  catchCount: number
  required: number
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { hasAccess: false, catchCount: 0, required: FEED_GATE_CATCHES }

  const { count } = await supabase
    .from('catches')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const catchCount = count ?? 0
  return {
    hasAccess: catchCount >= FEED_GATE_CATCHES,
    catchCount,
    required: FEED_GATE_CATCHES,
  }
}

// ── Charger le feed ───────────────────────────────────────────────────────────

export async function getFeed(limit = 20): Promise<FeedPost[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Posts publics + auteur + capture
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id, user_id, catch_id, type, caption, created_at,
      author:profiles!user_id(username, avatar_url),
      catch:catches!catch_id(photo_url, species:species_id(nom_fr))
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!posts?.length) return []

  const postIds = posts.map(p => p.id)

  // Réactions pour ces posts
  const { data: allReactions } = await supabase
    .from('reactions')
    .select('post_id, emoji, user_id')
    .in('post_id', postIds)

  // Agréger
  const reactionMap: Record<string, Record<string, number>> = {}
  const userReacted  = new Set<string>()
  for (const r of allReactions ?? []) {
    if (!reactionMap[r.post_id]) reactionMap[r.post_id] = {}
    reactionMap[r.post_id][r.emoji] = (reactionMap[r.post_id][r.emoji] ?? 0) + 1
    if (r.user_id === user.id) userReacted.add(`${r.post_id}:${r.emoji}`)
  }

  return posts.map(p => {
    const author = Array.isArray(p.author) ? p.author[0] : p.author
    const catchData = p.catch_id ? (Array.isArray(p.catch) ? p.catch[0] : p.catch) : null
    const rawSpecies = (catchData as { species: unknown } | null)?.species
    const catchSpecies = Array.isArray(rawSpecies)
      ? (rawSpecies[0] as { nom_fr: string } | undefined) ?? null
      : (rawSpecies as { nom_fr: string } | null)

    const reactions = Object.fromEntries(
      REACTION_EMOJIS.map(({ key }) => [
        key,
        {
          count:           reactionMap[p.id]?.[key] ?? 0,
          userHasReacted:  userReacted.has(`${p.id}:${key}`),
        },
      ])
    ) as FeedPost['reactions']

    return {
      id:           p.id,
      user_id:      p.user_id,
      username:     (author as { username: string } | null)?.username ?? 'Pêcheur',
      avatar_url:   (author as { avatar_url: string | null } | null)?.avatar_url ?? null,
      catch_id:     p.catch_id,
      photo_url:    (catchData as { photo_url: string | null } | null)?.photo_url ?? null,
      species_nom:  (catchSpecies as { nom_fr: string } | null)?.nom_fr ?? null,
      caption:      p.caption,
      created_at:   p.created_at,
      type:         p.type as FeedPost['type'],
      reactions,
    }
  })
}

// ── Créer un post ─────────────────────────────────────────────────────────────

export async function createPost(input: {
  catch_id?: string
  session_id?: string
  type: 'capture' | 'session' | 'memory'
  caption?: string
}): Promise<{ post_id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id:    user.id,
      catch_id:   input.catch_id   ?? null,
      session_id: input.session_id ?? null,
      type:       input.type,
      caption:    input.caption?.trim() || null,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/fishfeed')
  return { post_id: data.id }
}

// ── Toggler une réaction ──────────────────────────────────────────────────────

export async function toggleReaction(
  postId: string,
  emoji: ReactionKey
): Promise<{ userHasReacted: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { userHasReacted: false, error: 'Non authentifié' }

  // Vérifier si la réaction existe déjà
  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .eq('emoji', emoji)
    .maybeSingle()

  if (existing) {
    await supabase.from('reactions').delete().eq('id', existing.id)
    return { userHasReacted: false }
  } else {
    await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, emoji })
    return { userHasReacted: true }
  }
}

// ── Signaler un post ──────────────────────────────────────────────────────────

export async function reportPost(
  postId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { error } = await supabase
    .from('post_reports')
    .insert({ post_id: postId, reporter_id: user.id, reason: reason ?? null })

  if (error?.code === '23505') return { success: true } // déjà signalé
  if (error) return { success: false, error: error.message }

  revalidatePath('/fishfeed')
  return { success: true }
}
