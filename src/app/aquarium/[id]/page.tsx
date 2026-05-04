import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DetailHeader } from '@/components/aquarium-v2/detail/Header'
import { DetailHero } from '@/components/aquarium-v2/detail/Hero'
import { MainInfo } from '@/components/aquarium-v2/detail/MainInfo'
import { StatsRow } from '@/components/aquarium-v2/detail/StatsRow'
import { BadgesSection } from '@/components/aquarium-v2/detail/BadgesSection'
import { ComparisonSection } from '@/components/aquarium-v2/detail/ComparisonSection'
import { SpeciesInfo } from '@/components/aquarium-v2/detail/SpeciesInfo'
import { ActionsBar } from '@/components/aquarium-v2/detail/ActionsBar'
import type { Rarete } from '@/types/fishdex'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

type Props = { params: Promise<{ id: string }> }

export default async function CatchDetailPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Récupérer la prise + species
  const { data: catch_ } = await supabase
    .from('catches')
    .select(`
      id, user_id, species_id, date_capture, created_at,
      lieu, poids_kg, taille_cm, notes, photo_url,
      species:species_id (
        id, slug, nom_fr, nom_scientifique,
        image_url, rarete, description
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!catch_) notFound()

  const species = catch_.species as unknown as {
    id: string; slug: string; nom_fr: string; nom_scientifique: string
    image_url: string | null; rarete: Rarete | null; description: string | null
  }

  // Calcul : est-ce un record perso pour cette espèce ?
  const { data: catchesForSpecies } = await supabase
    .from('catches')
    .select('id, poids_kg')
    .eq('user_id', user.id)
    .eq('species_id', catch_.species_id)
    .not('poids_kg', 'is', null)
    .order('poids_kg', { ascending: false })

  const allWeights = (catchesForSpecies ?? []).map(c => c.poids_kg as number)
  const maxWeight = allWeights[0] ?? null
  const isRecord = catch_.poids_kg != null && catch_.poids_kg === maxWeight

  // Ancien record = 2e meilleur poids (différent de la prise actuelle)
  const otherWeights = (catchesForSpecies ?? [])
    .filter(c => c.id !== catch_.id)
    .map(c => c.poids_kg as number)
  const previousRecord = otherWeights[0] ?? null

  // Est-ce la 1ère prise de cette espèce pour l'user ?
  const totalForSpecies = (catchesForSpecies ?? []).length
  const isNewSpecies = totalForSpecies === 1

  // URLs photo
  const photoUrl = catch_.photo_url
    ? `${SUPABASE_URL}/storage/v1/object/public/catches/${catch_.photo_url}`
    : null
  const fallbackUrl = species.image_url

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.10) 0%, transparent 50%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      <DetailHeader />

      <DetailHero
        photoUrl={photoUrl}
        fallbackUrl={fallbackUrl}
        altText={species.nom_fr}
        rarete={species.rarete}
      />

      <MainInfo
        nomFr={species.nom_fr}
        rarete={species.rarete}
        poidsKg={catch_.poids_kg}
      />

      <StatsRow
        lieu={catch_.lieu}
        dateCapture={catch_.date_capture}
        createdAt={catch_.created_at}
      />

      <BadgesSection
        isRecord={isRecord}
        isNewSpecies={isNewSpecies}
        rarete={species.rarete}
      />

      {isRecord && catch_.poids_kg != null && previousRecord != null && (
        <ComparisonSection
          currentWeight={catch_.poids_kg}
          previousRecord={previousRecord}
        />
      )}

      <SpeciesInfo
        nomFr={species.nom_fr}
        nomScientifique={species.nom_scientifique}
        description={species.description}
        rarete={species.rarete}
        slug={species.slug}
      />

      <ActionsBar
        catchId={catch_.id}
        speciesName={species.nom_fr}
        photoUrl={photoUrl}
      />
    </div>
  )
}
