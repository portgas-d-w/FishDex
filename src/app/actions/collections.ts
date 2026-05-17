'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { buildCollectionProgress } from '@/lib/collections/labels'
import type { CollectionSlug, CollectionProgress, Collection } from '@/lib/collections/types'

// ── Toutes les collections (données de référence) ──────────────────────────────
export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('ordre')
  return (data ?? []) as Collection[]
}

// ── Progression d'un user dans une collection spécifique ──────────────────────
export async function getCollectionProgress(
  collectionSlug: CollectionSlug
): Promise<CollectionProgress | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .rpc('get_collection_progress', {
      p_user_id:         user.id,
      p_collection_slug: collectionSlug,
    })
    .single()

  if (error || !data) return null

  const row = data as { total_visible: number; captured_visible: number; captured_mirages: number }

  return buildCollectionProgress(
    collectionSlug,
    Number(row.total_visible),
    Number(row.captured_visible),
    Number(row.captured_mirages),
  )
}

// ── Progression dans toutes les collections d'un user ─────────────────────────
export async function getAllCollectionProgress(): Promise<CollectionProgress[]> {
  const slugs: CollectionSlug[] = ['paisibles', 'predateurs', 'eaux-vives']
  const results = await Promise.all(slugs.map(s => getCollectionProgress(s)))
  return results.filter(Boolean) as CollectionProgress[]
}

// ── Définir la voie principale de l'user ──────────────────────────────────────
export async function setPreferredCollection(
  slug: CollectionSlug | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { error } = await supabase
    .from('profiles')
    .update({
      preferred_collection_slug:  slug,
      collection_choice_completed: true,
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/profil')
  revalidatePath('/fishdex')
  revalidatePath('/')
  return { success: true }
}

// ── Marquer le choix de collection comme fait (sans changer la voie) ──────────
export async function markCollectionChoiceCompleted(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('profiles')
    .update({ collection_choice_completed: true })
    .eq('id', user.id)
}

// ── Données FishDex filtrées selon collection + visibilité Mirages ─────────────
type SpeciesForDex = {
  id: string
  slug: string
  nom_fr: string
  nom_scientifique: string
  famille: string | null
  rarete: string | null
  numero_dex: number | null
  image_url: string | null
  is_hidden_in_dex: boolean
  difficulte: number | null
  taille_max_cm: number | null
  poids_max_kg: number | null
  collections: CollectionSlug[]
}

export async function getSpeciesForCollection(
  collectionSlug: CollectionSlug | null,
  discoveredSpeciesIds: string[]
): Promise<SpeciesForDex[]> {
  const supabase = await createClient()
  const discoveredSet = new Set(discoveredSpeciesIds)

  let query = supabase
    .from('species')
    .select(`
      id, slug, nom_fr, nom_scientifique, famille,
      rarete, numero_dex, image_url, is_hidden_in_dex,
      difficulte, taille_max_cm, poids_max_kg,
      species_collections(collection_id, collections(slug))
    `)
    .order('numero_dex', { ascending: true })

  // Filtrer par collection si spécifié
  if (collectionSlug) {
    // Sous-requête via la table pivot
    const { data: collectionSpeciesIds } = await supabase
      .from('species_collections')
      .select('species_id, collections!inner(slug)')
      .eq('collections.slug', collectionSlug)

    const ids = (collectionSpeciesIds ?? []).map(r => r.species_id)
    if (ids.length === 0) return []
    query = query.in('id', ids)
  }

  const { data, error } = await query
  if (error) return []

  return (data ?? [])
    .filter(sp => {
      // Les Mirages non capturés sont invisibles
      if (sp.is_hidden_in_dex && !discoveredSet.has(sp.id)) return false
      return true
    })
    .map(sp => {
      // Extraire les slugs de collections
      const colls = ((sp.species_collections as unknown as Array<{
        collection_id: string
        collections: { slug: string } | null
      }>) ?? [])
        .map(sc => sc.collections?.slug)
        .filter(Boolean) as CollectionSlug[]

      return {
        id:               sp.id,
        slug:             sp.slug,
        nom_fr:           sp.nom_fr,
        nom_scientifique: sp.nom_scientifique,
        famille:          sp.famille,
        rarete:           sp.rarete,
        numero_dex:       sp.numero_dex,
        image_url:        sp.image_url,
        is_hidden_in_dex: sp.is_hidden_in_dex,
        difficulte:       sp.difficulte,
        taille_max_cm:    sp.taille_max_cm,
        poids_max_kg:     sp.poids_max_kg,
        collections:      colls,
      }
    })
}
