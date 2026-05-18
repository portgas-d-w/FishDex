import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FishDexV3Shell } from '@/components/fishdex-v3/FishDexV3Shell'
import { getSpeciesForCollection, getAllCollectionProgress } from '@/app/actions/collections'
import { buildCollectionProgress } from '@/lib/collections/labels'
import type { CollectionSlug, CollectionProgress } from '@/lib/collections/types'

export const metadata = {
  title: 'FishDex — Encyclopédie des espèces',
  description: 'Découvre et complète ta collection de poissons.',
}

export default async function FishDexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let preferredSlug: CollectionSlug | null = null
  let username  = 'Pêcheur'
  let email     = ''
  let avatarUrl: string | null = null
  let discoveredIds: string[] = []
  const slugs: CollectionSlug[] = ['paisibles', 'predateurs', 'eaux-vives']
  const progressBySlug = {} as Record<CollectionSlug, CollectionProgress>

  if (user) {
    // Profil, captures et progression en parallèle — 1 round-trip au lieu de 3
    const [profileRes, catchesRes, progressList] = await Promise.all([
      supabase
        .from('profiles')
        .select('username, avatar_url, preferred_collection_slug')
        .eq('id', user.id)
        .single(),
      supabase
        .from('catches')
        .select('species_id')
        .eq('user_id', user.id),
      getAllCollectionProgress(),
    ])

    preferredSlug = (profileRes.data?.preferred_collection_slug as CollectionSlug | null) ?? null
    username  = profileRes.data?.username  ?? 'Pêcheur'
    avatarUrl = profileRes.data?.avatar_url ?? null
    email     = user.email ?? ''

    discoveredIds = [...new Set((catchesRes.data ?? []).map(c => c.species_id).filter(Boolean))]

    for (const p of progressList) progressBySlug[p.slug] = p
  }

  // Toutes les espèces — après discoveredIds résolu
  const allSpecies = await getSpeciesForCollection(null, discoveredIds)

  if (!user) {
    for (const slug of slugs) {
      const cnt = allSpecies.filter(s => s.collections.includes(slug) && !s.is_hidden_in_dex).length
      progressBySlug[slug] = buildCollectionProgress(slug, cnt, 0, 0)
    }
  }

  return (
    <FishDexV3Shell
      allSpecies={allSpecies}
      discoveredIds={discoveredIds}
      preferredSlug={preferredSlug}
      progressBySlug={progressBySlug}
      username={username}
      email={email}
      avatarUrl={avatarUrl}
    />
  )
}
