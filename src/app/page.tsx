import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { HeroWithParallax } from '@/components/home/HeroWithParallax'
import { createClient } from '@/lib/supabase/server'
import { LandingPageV2 } from '@/components/spot-v2/LandingPage'
import { NotificationBell } from '@/components/home/NotificationBell'
import { UserAvatar } from '@/components/home/UserAvatar'
import { ActiveSessionCard } from '@/components/home/ActiveSessionCard'
import { StartSessionCard } from '@/components/home/StartSessionCard'
import { RecentCatchesGrid } from '@/components/home/RecentCatchesCarousel'
import { FavoriteSpotsGrid } from '@/components/home/FavoriteSpotsGrid'
import { DailyAdviceCard } from '@/components/home/DailyAdviceCard'
import { ConditionsWidget } from '@/components/home/ConditionsWidget'
import { FishdexObjectivesWidget } from '@/components/home/FishdexObjectivesWidget'
import { getCurrentContext, getReadableLightPhase, getReadableDate, formatTime } from '@/lib/home/context'
import { getPoeticPhrase } from '@/lib/home/poetic-phrases'
import { getHomeBackground } from '@/lib/home/background-selector'
import { getWeatherForUser } from '@/app/actions/weather'
import { classifyWeather } from '@/lib/weather/classifier'
import { getCyclicMemory } from '@/lib/home/cyclic-memories'
import { CyclicMemoryCard } from '@/components/home/CyclicMemoryCard'
import { FishFeedWidget } from '@/components/home/FishFeedWidget'
import { checkFeedAccess, getFeed } from '@/app/actions/fishfeed'
import { ensureMissions } from '@/lib/missions/assigner'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <LandingPageV2 />

  const [profileResult, catchesResult, spotsResult, speciesCountResult, totalSpeciesResult, weatherResult, cyclicMemory, feedAccess] = await Promise.all([
    supabase
      .from('profiles')
      .select('username, avatar_url, onboarding_completed, collection_choice_completed')
      .eq('id', user.id)
      .single(),

    supabase
      .from('catches')
      .select('id, created_at, photo_url, poids_kg, taille_cm, species:species_id(nom_fr, image_url, rarete)')
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

    supabase
      .from('catches')
      .select('species_id, species:species_id(rarete)')
      .eq('user_id', user.id)
      .not('species_id', 'is', null),

    supabase
      .from('species')
      .select('id', { count: 'exact', head: true })
      .neq('rarete', 'mirage'),

    getWeatherForUser(),
    getCyclicMemory(user.id),
    checkFeedAccess(),
  ])

  if (!profileResult.data?.onboarding_completed) redirect('/onboarding')
  if (!profileResult.data?.collection_choice_completed) redirect('/onboarding/collection')

  const username  = profileResult.data?.username ?? 'Pêcheur'
  const avatarUrl = profileResult.data?.avatar_url ?? null
  const email     = user.email ?? ''

  // Session active
  let activeSession: { id: string; started_at: string; spot: { nom: string } | null } | null = null
  let sessionCatchCount = 0
  let sessionSpeciesCount = 0
  try {
    const { data } = await supabase
      .from('sessions')
      .select('id, started_at, spot:spot_id(nom)')
      .eq('user_id', user.id)
      .is('ended_at', null)
      .single()
    if (data) {
      activeSession = {
        ...data,
        spot: Array.isArray(data.spot) ? (data.spot[0] ?? null) : data.spot,
      }
    }

    if (activeSession) {
      const { data: sessionCatches } = await supabase
        .from('catches')
        .select('species_id')
        .eq('session_id', activeSession.id)
      const sc = sessionCatches ?? []
      sessionCatchCount   = sc.length
      sessionSpeciesCount = new Set(sc.map(c => c.species_id).filter(Boolean)).size
    }
  } catch {
    // session non disponible
  }

  ensureMissions(user.id).catch(() => null)

  // Prises récentes
  type RawCatch = {
    id: string
    created_at: string | null
    photo_url?: string | null
    poids_kg?: number | null
    taille_cm?: number | null
    species: { nom_fr: string; image_url: string | null; rarete: string | null } | { nom_fr: string; image_url: string | null; rarete: string | null }[] | null
  }
  const recentCatches = (catchesResult.data as RawCatch[] ?? []).map((c) => ({
    id:         c.id,
    created_at: c.created_at ?? null,
    photo_url:  c.photo_url ?? null,
    poids_kg:   c.poids_kg ?? null,
    taille_cm:  c.taille_cm ?? null,
    species: Array.isArray(c.species)
      ? (c.species[0] as { nom_fr: string; image_url: string | null; rarete: string | null } | undefined) ?? null
      : (c.species as { nom_fr: string; image_url: string | null; rarete: string | null } | null),
  }))

  // Spots favoris
  const spotsMap = new Map<string, number>()
  for (const c of (spotsResult.data ?? [])) {
    if (c.lieu) spotsMap.set(c.lieu, (spotsMap.get(c.lieu) ?? 0) + 1)
  }
  const favoriteSpots = [...spotsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([name, count]) => ({ name, count }))

  // Objectifs FishDex
  type CaughtSpeciesRow = {
    species_id: string | null
    species: { rarete: string | null } | { rarete: string | null }[] | null
  }
  const caughtRows = speciesCountResult.data as CaughtSpeciesRow[] ?? []
  const caughtSpeciesIds = new Set(caughtRows.map(c => c.species_id).filter(Boolean))
  const mirageSpeciesIds = new Set(
    caughtRows
      .filter(c => {
        const r = Array.isArray(c.species) ? c.species[0]?.rarete : c.species?.rarete
        return r === 'mirage'
      })
      .map(c => c.species_id)
      .filter(Boolean)
  )
  const caughtSpeciesCount = caughtSpeciesIds.size
  const miragesCapturedCount = mirageSpeciesIds.size
  const totalSpeciesCount = totalSpeciesResult.count ?? 92

  // Contexte, phrase et background dynamique
  const now              = new Date()
  const { weather, source: weatherSource } = weatherResult
  const feedPreview = feedAccess.hasAccess ? await getFeed(2) : []
  const classified       = weather ? classifyWeather(weather) : 'clear' as const
  const context          = getCurrentContext(classified)
  const phrase           = getPoeticPhrase(context, user.id)
  const bgUrl            = getHomeBackground(context)

  return (
    <main className="relative min-h-screen bg-[#0a0f14]">

      {/* ── HERO 70vh avec parallax ──────────────────────────────── */}
      <HeroWithParallax bgUrl={bgUrl}>
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />

        {/* Header transparent */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-safe-top py-4">
          <NotificationBell />
          <UserAvatar username={username} email={email} avatarUrl={avatarUrl} />
        </div>

        {/* Greeting */}
        <div className="absolute bottom-12 left-6 right-6 z-10 space-y-1.5">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-cyan-400 uppercase">
            {getReadableDate(now)} · {getReadableLightPhase(context.light)} · {formatTime(now)}
          </p>
          <h1 className="text-[2rem] font-semibold tracking-tight text-white leading-tight">
            Bonjour {username}.
          </h1>
          <p className="text-base italic text-white/75 leading-snug">{phrase}</p>
        </div>

        {/* Chevron */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronDown size={20} className="text-white/25" />
        </div>

        {/* Gradient transition vers le fond sombre */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0f14] pointer-events-none z-10" />
      </HeroWithParallax>

      {/* ── CONTENU SCROLLABLE ───────────────────────────────────── */}
      <section className="px-4 py-6 space-y-4 pb-32">

        {/* WIDGET 1 — SESSION */}
        {activeSession
          ? <ActiveSessionCard session={activeSession} catchCount={sessionCatchCount} speciesCount={sessionSpeciesCount} />
          : <StartSessionCard />
        }

        {/* WIDGET 2 + 3 — CONDITIONS / OBJECTIFS (côte à côte) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConditionsWidget weather={weather} classified={classified} source={weatherSource} />
          <FishdexObjectivesWidget
            caughtCount={caughtSpeciesCount}
            totalCount={totalSpeciesCount}
            miragesCaptured={miragesCapturedCount}
          />
        </div>

        {/* WIDGET 4 — DERNIÈRES CAPTURES (full width) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
              Mes dernières captures
            </p>
            <Link href="/aquarium" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Voir tout
            </Link>
          </div>
          <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
            <RecentCatchesGrid catches={recentCatches} />
          </div>
        </div>

        {/* WIDGET 5 — SPOTS FAVORIS */}
        {favoriteSpots.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
              Tes spots favoris
            </p>
            <FavoriteSpotsGrid spots={favoriteSpots} />
          </div>
        )}

        {/* WIDGET 6 — FISHFEED */}
        <FishFeedWidget
          hasAccess={feedAccess.hasAccess}
          catchCount={feedAccess.catchCount}
          required={feedAccess.required}
          previewPosts={feedPreview}
        />

        {/* WIDGET 7 — SOUVENIR CYCLIQUE */}
        {cyclicMemory && <CyclicMemoryCard memory={cyclicMemory} />}

        {/* WIDGET 7 — CONSEIL DU JOUR */}
        <DailyAdviceCard context={context} />

      </section>
    </main>
  )
}
