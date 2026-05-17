import { redirect } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LandingPageV2 } from '@/components/spot-v2/LandingPage'
import { NotificationBell } from '@/components/home/NotificationBell'
import { UserAvatar } from '@/components/home/UserAvatar'
import { ActiveSessionCard } from '@/components/home/ActiveSessionCard'
import { StartSessionCard } from '@/components/home/StartSessionCard'
import { RecentCatchesCarousel } from '@/components/home/RecentCatchesCarousel'
import { FavoriteSpotsGrid } from '@/components/home/FavoriteSpotsGrid'
import { DailyAdviceCard } from '@/components/home/DailyAdviceCard'
import { getCurrentContext, getReadableLightPhase, getReadableDate, formatTime } from '@/lib/home/context'
import { getPoeticPhrase } from '@/lib/home/poetic-phrases'
import { ensureMissions } from '@/lib/missions/assigner'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <LandingPageV2 />

  const [profileResult, catchesResult, spotsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('username, avatar_url, onboarding_completed')
      .eq('id', user.id)
      .single(),

    supabase
      .from('catches')
      .select('id, date_capture, photo_url, poids_kg, species:species_id(nom_fr, image_url, rarete)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4),

    supabase
      .from('catches')
      .select('lieu')
      .eq('user_id', user.id)
      .not('lieu', 'is', null)
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  if (!profileResult.data?.onboarding_completed) redirect('/onboarding')

  const username  = profileResult.data?.username ?? 'Pêcheur'
  const avatarUrl = profileResult.data?.avatar_url ?? null
  const email     = user.email ?? ''

  // Session active (feature H2 — table peut ne pas encore exister)
  let activeSession: { id: string; started_at: string; lieu: string | null } | null = null
  try {
    const { data } = await supabase
      .from('sessions')
      .select('id, started_at, lieu')
      .eq('user_id', user.id)
      .is('ended_at', null)
      .single()
    activeSession = data
  } catch {
    // table sessions pas encore créée en H2
  }

  // Missions en arrière-plan (pas affichées sur le Home, assignées pour /missions)
  ensureMissions(user.id).catch(() => null)

  // Prises récentes
  const recentCatches = (catchesResult.data ?? []).map((c) => ({
    id: c.id,
    date_capture: c.date_capture ?? null,
    photo_url: (c as { photo_url?: string | null }).photo_url ?? null,
    poids_kg: (c as { poids_kg?: number | null }).poids_kg ?? null,
    species: Array.isArray(c.species)
      ? (c.species[0] as { nom_fr: string; image_url: string | null; rarete: string | null } | undefined) ?? null
      : (c.species as { nom_fr: string; image_url: string | null; rarete: string | null } | null),
  }))

  // Spots favoris déduits des prises
  const spotsMap = new Map<string, number>()
  for (const c of (spotsResult.data ?? [])) {
    if (c.lieu) spotsMap.set(c.lieu, (spotsMap.get(c.lieu) ?? 0) + 1)
  }
  const favoriteSpots = [...spotsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([name, count]) => ({ name, count }))

  // Contexte et phrase
  const now     = new Date()
  const context = getCurrentContext()
  const phrase  = getPoeticPhrase(context, user.id)

  return (
    <main className="relative min-h-screen bg-[#020c14]">
      {/* ── HERO 75vh ──────────────────────────────────────────── */}
      <section className="relative h-[75vh] overflow-hidden">
        {/* Photo de fond — remplace l'URL par /backgrounds/home-default.webp en H3 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80)',
          }}
        />

        {/* Vignette : transparent en haut, noir en bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

        {/* Header transparent */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-safe-top py-4 z-10">
          <NotificationBell />
          <UserAvatar username={username} email={email} avatarUrl={avatarUrl} />
        </div>

        {/* Texte en bas du hero */}
        <div className="absolute bottom-10 left-6 right-6 z-10 space-y-1.5">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-cyan-400">
            {getReadableDate(now)} · {getReadableLightPhase(context.light)} · {formatTime(now)}
          </p>
          <h1 className="text-[2rem] font-semibold tracking-tight text-white leading-tight">
            Bonjour {username}.
          </h1>
          <p className="text-base italic text-white/75 leading-snug">
            {phrase}
          </p>
        </div>

        {/* Chevron discret */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} className="text-white/25" />
        </div>
      </section>

      {/* ── CONTENU SCROLLABLE ─────────────────────────────────── */}
      <section className="px-4 py-8 space-y-8 pb-32">

        {/* AUJOURD'HUI */}
        <div>
          <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white/30 mb-3">
            AUJOURD&apos;HUI
          </h2>
          {activeSession
            ? <ActiveSessionCard session={activeSession} />
            : <StartSessionCard />
          }
        </div>

        {/* DERNIÈRES PRISES */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white/30">
              DERNIÈRES PRISES
            </h2>
          </div>
          <RecentCatchesCarousel catches={recentCatches} />
        </div>

        {/* TES SPOTS FAVORIS */}
        {favoriteSpots.length > 0 && (
          <div>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white/30 mb-3">
              TES SPOTS FAVORIS
            </h2>
            <FavoriteSpotsGrid spots={favoriteSpots} />
          </div>
        )}

        {/* CONSEIL DU MOMENT */}
        <DailyAdviceCard context={context} />

      </section>
    </main>
  )
}
