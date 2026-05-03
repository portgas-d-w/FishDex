import { UserProfileCard } from './spot/UserProfileCard'
import { DailyMissionCard } from './spot/DailyMissionCard'
import { CaptureButton } from './spot/CaptureButton'
import { RecentCatchesCarousel } from './spot/RecentCatchesCarousel'
import { InfoCards } from './spot/InfoCards'

type RecentCatch = {
  id: string
  date_capture: string
  photo_url: string | null
  poids_kg: number | null
  species: {
    nom_fr: string
    image_url: string | null
    rarete: string | null
  } | null
}

type Props = {
  userId: string
  username: string
  avatarUrl: string | null
  recentCatches: RecentCatch[]
  totalCatches: number
  discoveredSpecies: number
}

export function DashboardHome({
  userId,
  username,
  avatarUrl,
  recentCatches,
  totalCatches,
  discoveredSpecies,
}: Props) {
  return (
    <div className="flex flex-col gap-4 pb-6 max-w-md mx-auto">

      {/* En-tête + Carte profil */}
      <UserProfileCard username={username} avatarUrl={avatarUrl} />

      {/* Mission du jour */}
      <DailyMissionCard />

      {/* Bouton CAPTURER */}
      <section className="py-2">
        <CaptureButton userId={userId} />
      </section>

      {/* Dernières prises */}
      <RecentCatchesCarousel catches={recentCatches} />

      {/* Cartes info */}
      <InfoCards />

    </div>
  )
}
