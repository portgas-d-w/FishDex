import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RESSENTI_OPTIONS } from '@/lib/sessions/types'
import { WrappedSlides } from './WrappedSlides'

export type WrappedStats = {
  year: number
  totalSessions: number
  fishingDays: number
  totalCatches: number
  uniqueSpecies: number
  bestCatch: {
    id: string
    species_nom: string
    taille_cm: number | null
    poids_kg: number | null
    photo_url: string | null
  } | null
  favoritePlaces: Array<{ name: string; count: number }>
  favoriteSeason: string | null
  topRessenti: { value: string; emoji: string; label: string; count: number } | null
}

export default async function WrappedPage({
  params,
}: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params
  const year = parseInt(yearStr, 10)
  if (isNaN(year) || year < 2020 || year > 2100) notFound()

  // Accessible uniquement en décembre et janvier
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const isDecember = currentMonth === 12
  const isJanuary  = currentMonth === 1

  const validYear = isDecember ? currentYear : isJanuary ? currentYear - 1 : null
  if (validYear === null || year !== validYear) {
    // Hors période → page d'attente
    return (
      <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-4xl mb-4">🎣</p>
        <h1 className="text-2xl font-bold text-white mb-2">FishDex Wrapped</h1>
        <p className="text-white/50 text-sm leading-relaxed">
          Le récap annuel est disponible<br />
          uniquement en décembre et en janvier.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const start = `${year}-01-01T00:00:00`
  const end   = `${year + 1}-01-01T00:00:00`

  const [sessionsResult, catchesResult] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, started_at, season, ressenti, spot_id')
      .eq('user_id', user.id)
      .gte('started_at', start)
      .lt('started_at', end)
      .not('ended_at', 'is', null),

    supabase
      .from('catches')
      .select('id, poids_kg, taille_cm, photo_url, lieu, species:species_id(nom_fr)')
      .eq('user_id', user.id)
      .gte('created_at', start)
      .lt('created_at', end),
  ])

  const sessions = sessionsResult.data ?? []
  const catches  = catchesResult.data  ?? []

  // Jours de pêche (dates uniques)
  const fishingDays = new Set(sessions.map(s => s.started_at.slice(0, 10))).size

  // Espèces uniques — on n'a pas species_id ici, on approx par nom_fr
  type CatchRow = typeof catches[number]
  function speciesName(c: CatchRow): string | null {
    const sp = Array.isArray(c.species) ? c.species[0] : c.species
    return (sp as { nom_fr: string } | null)?.nom_fr ?? null
  }
  const uniqueSpecies = new Set(catches.map(speciesName).filter(Boolean)).size

  // Meilleure prise (poids > taille > première)
  const bestCatch = catches.reduce<CatchRow | null>((best, c) => {
    if (!best) return c
    if ((c.poids_kg ?? 0) > (best.poids_kg ?? 0)) return c
    if ((c.taille_cm ?? 0) > (best.taille_cm ?? 0)) return c
    return best
  }, null)

  // Lieux favoris (depuis catch.lieu)
  const lieuxMap = new Map<string, number>()
  for (const c of catches) {
    if (c.lieu) lieuxMap.set(c.lieu, (lieuxMap.get(c.lieu) ?? 0) + 1)
  }
  const favoritePlaces = [...lieuxMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))

  // Saison favorite
  const seasonMap = new Map<string, number>()
  for (const s of sessions) {
    if (s.season) seasonMap.set(s.season, (seasonMap.get(s.season) ?? 0) + 1)
  }
  const favoriteSeason = seasonMap.size > 0
    ? [...seasonMap.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : null

  // Ressenti dominant
  const ressentiMap = new Map<string, number>()
  for (const s of sessions) {
    if (s.ressenti) ressentiMap.set(s.ressenti, (ressentiMap.get(s.ressenti) ?? 0) + 1)
  }
  const topRessentiEntry = ressentiMap.size > 0
    ? [...ressentiMap.entries()].sort((a, b) => b[1] - a[1])[0]
    : null
  const topRessentiOption = topRessentiEntry
    ? RESSENTI_OPTIONS.find(o => o.value === topRessentiEntry[0]) ?? null
    : null
  const topRessenti = topRessentiOption && topRessentiEntry
    ? { ...topRessentiOption, count: topRessentiEntry[1] }
    : null

  const stats: WrappedStats = {
    year,
    totalSessions: sessions.length,
    fishingDays,
    totalCatches: catches.length,
    uniqueSpecies,
    bestCatch: bestCatch
      ? {
          id: bestCatch.id,
          species_nom: speciesName(bestCatch) ?? 'Espèce inconnue',
          taille_cm: bestCatch.taille_cm ?? null,
          poids_kg: bestCatch.poids_kg ?? null,
          photo_url: bestCatch.photo_url ?? null,
        }
      : null,
    favoritePlaces,
    favoriteSeason,
    topRessenti,
  }

  return <WrappedSlides stats={stats} />
}
