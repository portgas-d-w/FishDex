import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllCollectionProgress } from '@/app/actions/collections'
import { PathSection } from '@/components/profil-v3/PathSection'
import type { CollectionSlug } from '@/lib/collections/types'
import { ProfilHeader } from '@/components/profil-v2/Header'
import { ProfileHero } from '@/components/profil-v2/ProfileHero'
import { GlobalStats } from '@/components/profil-v2/GlobalStats'
import { RecordsSection } from '@/components/profil-v2/RecordsSection'
import { BadgesSection } from '@/components/profil-v2/BadgesSection'
import { DetailedStats } from '@/components/profil-v2/DetailedStats'
import { ActionsSection } from '@/components/profil-v2/ActionsSection'
import { LevelDisplay } from '@/components/profile/LevelDisplay'
import { MOCK_COUNTRY } from '@/lib/profil/mocks'
import { getLevelTitle, xpCurrentInLevel, xpNeededForNextLevel } from '@/lib/xp/calculator'
import { getMasteriesAfterLevel50, XP_FOR_LEVEL_50 } from '@/lib/levels/masteries'
import type { CatchWithSpecies } from '@/types/aquarium'

export const metadata = {
  title: 'Mon Profil',
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: rawCatches }, { data: xpRow }, collectionsProgress] = await Promise.all([
    supabase
      .from('profiles')
      .select('username, avatar_url, created_at, preferred_collection_slug')
      .eq('id', user.id)
      .single(),

    supabase
      .from('catches')
      .select(`
        id, user_id, species_id, date_capture, created_at,
        lieu, poids_kg, taille_cm, notes, photo_url,
        species:species_id (
          id, slug, nom_fr, nom_scientifique,
          image_url, rarete, description
        )
      `)
      .eq('user_id', user.id),

    supabase
      .from('user_xp')
      .select('total_xp, level, current_streak, longest_streak')
      .eq('user_id', user.id)
      .single(),

    getAllCollectionProgress(),
  ])

  const catches        = (rawCatches ?? []) as unknown as CatchWithSpecies[]
  const preferredSlug  = (profile?.preferred_collection_slug as CollectionSlug | null) ?? null

  // XP réelles
  const niveau        = xpRow?.level ?? 1
  const totalXp       = xpRow?.total_xp ?? 0
  const xpActuel      = xpCurrentInLevel(totalXp)
  const xpSuivant     = xpNeededForNextLevel(niveau)
  const levelTitle    = getLevelTitle(niveau)
  const currentStreak = xpRow?.current_streak ?? 0
  const longestStreak = xpRow?.longest_streak ?? 0

  // Maîtrises (niveau 50+)
  const mastery = getMasteriesAfterLevel50(totalXp, XP_FOR_LEVEL_50)
  const levelProgress = niveau >= 50
    ? (mastery?.progress ?? 0)
    : Math.min(100, Math.round((xpActuel / xpSuivant) * 100))

  // Stats globales
  const uniqueSpeciesIds = [...new Set(catches.map(c => c.species_id))]
  const rareRaretés = ['rare', 'epique', 'legendaire', 'mirage']
  const rareSpeciesIds = new Set(
    catches
      .filter(c => rareRaretés.includes(c.species.rarete ?? ''))
      .map(c => c.species_id)
  )
  const maxPoids = catches.reduce<number | null>((max, c) => {
    if (c.poids_kg == null) return max
    return max == null || c.poids_kg > max ? c.poids_kg : max
  }, null)

  // Stats détaillées
  const joursPeche = new Set(catches.map(c => c.date_capture?.slice(0, 10)).filter(Boolean)).size
  const spots = new Set(catches.map(c => c.lieu).filter(Boolean)).size
  const photos = catches.filter(c => c.photo_url).length

  // Records
  const catchesAvecPoids = catches.filter(c => c.poids_kg != null)
  const catchesAvecTaille = catches.filter(c => c.taille_cm != null)

  const heaviestCatch = catchesAvecPoids.reduce<CatchWithSpecies | null>((best, c) => {
    if (!best || (c.poids_kg ?? 0) > (best.poids_kg ?? 0)) return c
    return best
  }, null)

  const longestCatch = catchesAvecTaille.reduce<CatchWithSpecies | null>((best, c) => {
    if (!best || (c.taille_cm ?? 0) > (best.taille_cm ?? 0)) return c
    return best
  }, null)

  const rarestOrder = ['mirage', 'legendaire', 'epique', 'rare', 'peu_commun', 'commun']
  const rarestCatch = catches.reduce<CatchWithSpecies | null>((best, c) => {
    if (!best) return c
    const iCur = rarestOrder.indexOf(c.species.rarete ?? '')
    const iBest = rarestOrder.indexOf(best.species.rarete ?? '')
    return iCur !== -1 && (iBest === -1 || iCur < iBest) ? c : best
  }, null)

  // Badges débloqués
  const unlockedBadgeIds: string[] = []
  if (catches.length >= 1) unlockedBadgeIds.push('first_catch')
  if (uniqueSpeciesIds.length >= 10) unlockedBadgeIds.push('collector')
  if (maxPoids != null && maxPoids >= 5) unlockedBadgeIds.push('big_fish')
  if (joursPeche >= 10) unlockedBadgeIds.push('regular')

  const memberSince = profile?.created_at ?? user.created_at

  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      <ProfilHeader memberSince={memberSince} />

      {/* ── Section Voie principale ── */}
      {collectionsProgress.length > 0 && (
        <div className="mt-4">
          <PathSection
            progressList={collectionsProgress}
            mainSlug={preferredSlug}
          />
        </div>
      )}

      <ProfileHero
        username={profile?.username ?? 'Pêcheur'}
        avatarUrl={profile?.avatar_url ?? null}
        memberSince={memberSince}
        country={MOCK_COUNTRY}
      />

      <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-4 py-4">
        <LevelDisplay
          title={levelTitle}
          level={niveau}
          progress={levelProgress}
          mastery={mastery}
        />
      </div>

      <GlobalStats
        totalCatches={catches.length}
        uniqueSpecies={uniqueSpeciesIds.length}
        maxPoids={maxPoids}
        rareSpecies={rareSpeciesIds.size}
      />

      <RecordsSection
        heaviest={heaviestCatch ? {
          value: heaviestCatch.poids_kg!,
          speciesName: heaviestCatch.species.nom_fr,
          imageUrl: heaviestCatch.species.image_url ?? null,
          rarete: heaviestCatch.species.rarete ?? null,
          catchId: heaviestCatch.id,
        } : null}
        longest={longestCatch ? {
          value: longestCatch.taille_cm!,
          speciesName: longestCatch.species.nom_fr,
          imageUrl: longestCatch.species.image_url ?? null,
          rarete: longestCatch.species.rarete ?? null,
          catchId: longestCatch.id,
        } : null}
        rarest={rarestCatch ? {
          speciesName: rarestCatch.species.nom_fr,
          imageUrl: rarestCatch.species.image_url ?? null,
          rarete: rarestCatch.species.rarete ?? null,
          catchId: rarestCatch.id,
        } : null}
      />

      <BadgesSection unlockedIds={unlockedBadgeIds} />

      <DetailedStats
        joursPeche={joursPeche}
        spots={spots}
        photos={photos}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
      />

      <ActionsSection />
    </div>
  )
}
