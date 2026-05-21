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
  rarete: string | null
  poids_kg: number | null
  taille_cm: number | null
  released: boolean | null
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

  // 1. Posts publics (sans joins — FK vers auth.users incompatible avec PostgREST)
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, user_id, catch_id, type, caption, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (postsError) {
    console.error('[getFeed] posts error:', postsError.message)
    return []
  }
  if (!posts?.length) return []

  const postIds  = posts.map(p => p.id)
  const userIds  = [...new Set(posts.map(p => p.user_id))]
  const catchIds = posts.map(p => p.catch_id).filter(Boolean) as string[]

  // 2. Profils des auteurs
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds)

  if (profilesError) console.error('[getFeed] profiles error:', profilesError.message)

  const profileMap: Record<string, { username: string; avatar_url: string | null }> = {}
  for (const p of profiles ?? []) profileMap[p.id] = p

  // 3. Données des captures (nécessite la policy 021)
  const catchMap: Record<string, { photo_url: string | null; species_nom: string | null; rarete: string | null; poids_kg: number | null; taille_cm: number | null; released: boolean | null }> = {}
  if (catchIds.length > 0) {
    const { data: catches, error: catchesError } = await supabase
      .from('catches')
      .select('id, photo_url, poids_kg, taille_cm, released, species:species_id(nom_fr, rarete)')
      .in('id', catchIds)

    if (catchesError) console.error('[getFeed] catches error:', catchesError.message)

    for (const c of catches ?? []) {
      const sp = Array.isArray(c.species) ? c.species[0] : c.species
      catchMap[c.id] = {
        photo_url:   c.photo_url ?? null,
        species_nom: (sp as { nom_fr: string; rarete: string | null } | null)?.nom_fr ?? null,
        rarete:      (sp as { nom_fr: string; rarete: string | null } | null)?.rarete ?? null,
        poids_kg:    c.poids_kg ?? null,
        taille_cm:   c.taille_cm ?? null,
        released:    c.released ?? null,
      }
    }
  }

  // 4. Réactions
  const { data: allReactions } = await supabase
    .from('reactions')
    .select('post_id, emoji, user_id')
    .in('post_id', postIds)

  const reactionMap: Record<string, Record<string, number>> = {}
  const userReacted = new Set<string>()
  for (const r of allReactions ?? []) {
    if (!reactionMap[r.post_id]) reactionMap[r.post_id] = {}
    reactionMap[r.post_id][r.emoji] = (reactionMap[r.post_id][r.emoji] ?? 0) + 1
    if (r.user_id === user.id) userReacted.add(`${r.post_id}:${r.emoji}`)
  }

  // 5. Assembler
  return posts.map(p => {
    const profile  = profileMap[p.user_id] ?? null
    const catchInfo = p.catch_id ? (catchMap[p.catch_id] ?? null) : null

    const reactions = Object.fromEntries(
      REACTION_EMOJIS.map(({ key }) => [
        key,
        {
          count:          reactionMap[p.id]?.[key] ?? 0,
          userHasReacted: userReacted.has(`${p.id}:${key}`),
        },
      ])
    ) as FeedPost['reactions']

    return {
      id:          p.id,
      user_id:     p.user_id,
      username:    profile?.username   ?? 'Pêcheur',
      avatar_url:  profile?.avatar_url ?? null,
      catch_id:    p.catch_id,
      photo_url:   catchInfo?.photo_url   ?? null,
      species_nom: catchInfo?.species_nom ?? null,
      rarete:      catchInfo?.rarete      ?? null,
      poids_kg:    catchInfo?.poids_kg    ?? null,
      taille_cm:   catchInfo?.taille_cm   ?? null,
      released:    catchInfo?.released    ?? null,
      caption:     p.caption,
      created_at:  p.created_at,
      type:        p.type as FeedPost['type'],
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

  // Validation côté serveur : si capture liée, elle doit avoir une photo
  if (input.catch_id) {
    const { data: catchData } = await supabase
      .from('catches')
      .select('photo_url')
      .eq('id', input.catch_id)
      .single()
    if (!catchData?.photo_url) {
      return { error: 'Cette capture n\'a pas de photo. Ajoute une photo avant de partager.' }
    }
  }

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

// ── Toggler une réaction (une seule par user par post) ───────────────────────

export async function toggleReaction(
  postId: string,
  emoji: ReactionKey
): Promise<{ selected: ReactionKey | null; previous: ReactionKey | null; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { selected: null, previous: null, error: 'Non authentifié' }

  // Réaction actuelle de l'user sur ce post (au plus 1 avec la new contrainte)
  const { data: existing } = await supabase
    .from('reactions')
    .select('id, emoji')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  const previous = (existing?.emoji as ReactionKey) ?? null

  if (existing) {
    if (existing.emoji === emoji) {
      // Même réaction → désélectionner
      await supabase.from('reactions').delete().eq('id', existing.id)
      return { selected: null, previous }
    } else {
      // Réaction différente → remplacer
      await supabase.from('reactions').update({ emoji }).eq('id', existing.id)
      return { selected: emoji, previous }
    }
  } else {
    // Pas encore de réaction → insérer
    await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, emoji })
    return { selected: emoji, previous: null }
  }
}

// ── Supprimer son propre post ─────────────────────────────────────────────────

export async function deletePost(
  postId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/fishfeed')
  return { success: true }
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
