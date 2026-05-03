import { createClient } from '@/lib/supabase/server'
import { LandingPageV2 } from '@/components/spot-v2/LandingPage'
import { SpotHeader } from '@/components/spot-v2/Header'
import { UserProfileCard } from '@/components/spot-v2/UserProfileCard'
import { DailyMissionsCard } from '@/components/spot-v2/DailyMissionsCard'
import { CaptureZone } from '@/components/spot-v2/CaptureZone'
import { RecentCatchesCarousel } from '@/components/spot-v2/RecentCatchesCarousel'
import { InfoCards } from '@/components/spot-v2/InfoCards'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <LandingPageV2 />

  const [profileResult, catchesResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single(),

    supabase
      .from('catches')
      .select('id, date_capture, photo_url, poids_kg, species:species_id ( nom_fr, image_url, rarete )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const username = profileResult.data?.username ?? 'Pêcheur'
  const avatarUrl = profileResult.data?.avatar_url ?? null
  const email = user.email ?? ''

  const recentCatches = (catchesResult.data ?? []).map((c) => ({
    id: c.id,
    date_capture: c.date_capture ?? null,
    photo_url: (c as { photo_url?: string | null }).photo_url ?? null,
    poids_kg: (c as { poids_kg?: number | null }).poids_kg ?? null,
    species: Array.isArray(c.species)
      ? (c.species[0] as { nom_fr: string; image_url: string | null; rarete: string | null } | undefined) ?? null
      : (c.species as { nom_fr: string; image_url: string | null; rarete: string | null } | null),
  }))

  return (
    <div
      className="min-h-screen flex flex-col gap-4 pb-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      <SpotHeader avatarUrl={avatarUrl} username={username} email={email} />
      <UserProfileCard username={username} avatarUrl={avatarUrl} />
      <DailyMissionsCard />
      <CaptureZone userId={user.id} />
      <RecentCatchesCarousel catches={recentCatches} />
      <InfoCards />
    </div>
  )
}
