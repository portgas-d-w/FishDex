import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AquariumHeader } from '@/components/aquarium-v2/Header'
import { CatchesGrid } from '@/components/aquarium-v2/CatchesGrid'
import { SessionSuggestToast } from '@/components/sessions/SessionSuggestToast'
import { PageBackground } from '@/components/ui/PageBackground'
import type { CatchWithSpecies, AquariumStats, RecordsMap } from '@/types/aquarium'

export const metadata = {
  title: 'Aquarium — Mes prises',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AquariumPage({ searchParams }: Props) {
  const params = await searchParams
  const suggest = params.suggest === '1'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Récupérer profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  // Récupérer toutes les prises avec species joinée
  const { data: rawCatches } = await supabase
    .from('catches')
    .select(`
      id, user_id, species_id, date_capture, created_at,
      lieu, poids_kg, taille_cm, notes, photo_url,
      capture_source, released, session_id,
      species:species_id (
        id, slug, nom_fr, nom_scientifique,
        image_url, rarete, description
      ),
      session:session_id (
        id,
        spot:spot_id (
          id, nom
        )
      )
    `)
    .eq('user_id', user.id)
    .order('date_capture', { ascending: false })
    .order('created_at', { ascending: false })

  const catches = (rawCatches ?? []) as unknown as CatchWithSpecies[]

  // Calcul des stats
  const speciesIds = catches.map(c => c.species_id)
  const uniqueSpeciesIds = [...new Set(speciesIds)]

  const rareRaretés = ['rare', 'epique', 'legendaire', 'mirage']
  const rareSpeciesIds = new Set(
    catches
      .filter(c => rareRaretés.includes(c.species.rarete ?? ''))
      .map(c => c.species_id)
  )

  // Records perso : pour chaque espèce, trouver le max poids
  const recordsMap: RecordsMap = {}
  for (const c of catches) {
    if (c.poids_kg != null) {
      if (recordsMap[c.species_id] == null || c.poids_kg > recordsMap[c.species_id]) {
        recordsMap[c.species_id] = c.poids_kg
      }
    }
  }

  // Nombre d'espèces dont l'user a au moins un record (ici = toutes les espèces avec poids)
  const recordCount = Object.keys(recordsMap).length

  const stats: AquariumStats = {
    total: catches.length,
    uniqueSpecies: uniqueSpeciesIds.length,
    rareSpecies: rareSpeciesIds.size,
    personalRecords: recordCount,
  }

  return (
    <PageBackground
      bgUrl="/backgrounds/aquarium-bg.webp"
      overlay="bg-gradient-to-b from-[#020c14]/55 via-[#020c14]/45 to-[#020c14]/75"
      className="flex flex-col pb-28"
    >
      <AquariumHeader
        username={profile?.username ?? 'Pêcheur'}
        email={user.email ?? ''}
        avatarUrl={profile?.avatar_url ?? null}
        totalCatches={catches.length}
      />

      <CatchesGrid
        catches={catches}
        stats={stats}
        recordsMap={recordsMap}
      />

      <SessionSuggestToast show={suggest} />
    </PageBackground>
  )
}
