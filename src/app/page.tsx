import { createClient } from '@/lib/supabase/server'
import { LandingPage } from '@/components/LandingPage'
import { DashboardHome } from '@/components/DashboardHome'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <LandingPage />

  const [profileResult, catchesResult, statsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single(),

    supabase
      .from('catches')
      .select('id, date_capture, created_at, photo_url, species:species_id ( nom_fr, image_url )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4),

    supabase
      .from('catches')
      .select('species_id')
      .eq('user_id', user.id),
  ])

  const username = profileResult.data?.username ?? 'Pêcheur'
  const recentCatches = (catchesResult.data ?? []).map((c) => ({
    ...c,
    photo_url: (c as { photo_url?: string | null }).photo_url ?? null,
    species: Array.isArray(c.species) ? c.species[0] ?? null : (c.species as { nom_fr: string; image_url: string | null } | null),
  }))

  const allCatches = statsResult.data ?? []
  const totalCatches = allCatches.length
  const discoveredSpecies = new Set(allCatches.map((c) => c.species_id)).size

  return (
    <DashboardHome
      userId={user.id}
      username={username}
      recentCatches={recentCatches}
      totalCatches={totalCatches}
      discoveredSpecies={discoveredSpecies}
    />
  )
}
