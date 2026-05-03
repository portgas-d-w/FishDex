import { createClient } from '@/lib/supabase/server'
import { ProgressionCard } from '@/components/fishdex-v2/ProgressionCard'
import { FishDexShell } from '@/components/fishdex-v2/FishDexShell'
import { rareteOrder } from '@/lib/fishdex/rarete'
import type { SpeciesRow, Rarete } from '@/types/fishdex'

export const metadata = {
  title: 'FishDex — Encyclopédie des espèces',
  description: 'Découvre les 57 espèces de ton FishDex et complète ta collection.',
}

export default async function FishDexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: speciesData, error } = await supabase
    .from('species')
    .select('*')
    .order('numero_dex', { ascending: true })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400 font-semibold">Erreur de chargement : {error.message}</p>
      </div>
    )
  }

  const species: SpeciesRow[] = speciesData ?? []

  let username = 'Pêcheur'
  let email = ''
  let avatarUrl: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    username = profile?.username ?? 'Pêcheur'
    avatarUrl = profile?.avatar_url ?? null
    email = user.email ?? ''
  }

  let discoveredSlugs: string[] = []
  if (user) {
    const { data: catches } = await supabase
      .from('catches')
      .select('species:species_id ( slug )')
      .eq('user_id', user.id)

    if (catches) {
      const slugSet = new Set<string>()
      for (const c of catches) {
        const s = c.species as unknown as { slug: string } | null
        if (s?.slug) slugSet.add(s.slug)
      }
      discoveredSlugs = [...slugSet]
    }
  }

  const discoveredSet = new Set(discoveredSlugs)

  const byRarete = Object.fromEntries(
    rareteOrder.map((r) => [
      r,
      species.filter((s) => s.rarete === r && discoveredSet.has(s.slug)).length,
    ])
  ) as Record<Rarete, number>

  return (
    <FishDexShell species={species} discoveredSlugs={discoveredSlugs} username={username} email={email} avatarUrl={avatarUrl}>
      <ProgressionCard
        total={species.length}
        discovered={discoveredSlugs.length}
        byRarete={byRarete}
      />
    </FishDexShell>
  )
}
