import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Fish, Calendar, Trophy, MapPin, TrendingUp, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProGate } from '@/components/billing/ProGate'
import { MonthlyCapturesChart, RarityPieChart, SeasonChart } from './StatsCharts'

export const metadata = { title: 'Mes statistiques — FishDex' }

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const RARITY_LABEL: Record<string, string> = {
  commun: 'Commun', 'peu commun': 'Peu commun', rare: 'Rare',
  epique: 'Épique', legendaire: 'Légendaire', mirage: 'Mirage',
}

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      <div className="sticky top-0 z-20 bg-[#0a0f14]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link href="/profil" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-lg font-bold text-white">Mes statistiques</h1>
      </div>

      <ProGate requiredTier="pro">
        <StatsContent userId={user.id} />
      </ProGate>
    </div>
  )
}

async function StatsContent({ userId }: { userId: string }) {
  const supabase = await createClient()

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()

  const [catchesResult, sessionsResult, speciesResult] = await Promise.all([
    supabase
      .from('catches')
      .select('id, poids_kg, taille_cm, date_capture, species_id, species:species_id(nom_fr, rarete)')
      .eq('user_id', userId)
      .order('date_capture', { ascending: true }),

    supabase
      .from('sessions')
      .select('id, started_at, ended_at, season, spot_id')
      .eq('user_id', userId)
      .not('ended_at', 'is', null),

    supabase
      .from('catches')
      .select('species_id, species:species_id(nom_fr, rarete)')
      .eq('user_id', userId),
  ])

  const catches  = catchesResult.data  ?? []
  const sessions = sessionsResult.data ?? []

  type CatchRow = typeof catches[number]
  type SpeciesRef = { nom_fr: string; rarete: string | null } | null

  function sp(c: CatchRow): SpeciesRef {
    const s = Array.isArray(c.species) ? c.species[0] : c.species
    return s as SpeciesRef
  }

  // ── Overview ─────────────────────────────────────────────────────────────────
  const totalCatches   = catches.length
  const uniqueSpecies  = new Set(catches.map(c => c.species_id).filter(Boolean)).size
  const totalSessions  = sessions.length

  let totalFishingMs = 0
  for (const s of sessions) {
    if (s.ended_at) totalFishingMs += new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()
  }
  const totalHours = Math.round(totalFishingMs / 3_600_000)

  const heaviest = catches.reduce<CatchRow | null>((best, c) => {
    if (!best || (c.poids_kg ?? 0) > (best.poids_kg ?? 0)) return c
    return best
  }, null)
  const longest = catches.reduce<CatchRow | null>((best, c) => {
    if (!best || (c.taille_cm ?? 0) > (best.taille_cm ?? 0)) return c
    return best
  }, null)

  // ── Captures par mois (12 derniers mois) ─────────────────────────────────────
  const monthlyMap = new Map<string, number>()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthlyMap.set(`${d.getFullYear()}-${d.getMonth()}`, 0)
  }
  for (const c of catches) {
    if (!c.date_capture) continue
    const d = new Date(c.date_capture)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1)
  }
  const monthlyData = [...monthlyMap.entries()].map(([key, captures]) => {
    const [y, m] = key.split('-').map(Number)
    return { month: MONTHS_FR[m], captures }
  })

  // ── Répartition par rareté ───────────────────────────────────────────────────
  const rarityMap = new Map<string, number>()
  for (const c of catches) {
    const rarete = sp(c)?.rarete ?? 'commun'
    rarityMap.set(rarete, (rarityMap.get(rarete) ?? 0) + 1)
  }
  const rarityData = [...rarityMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // ── Par saison ───────────────────────────────────────────────────────────────
  const seasonCatch = new Map<string, number>()
  const seasonSess  = new Map<string, number>()
  for (const s of sessions) {
    if (s.season) seasonSess.set(s.season, (seasonSess.get(s.season) ?? 0) + 1)
  }
  // Note: catches don't have season directly, we approximate from date
  for (const c of catches) {
    if (!c.date_capture) continue
    const month = new Date(c.date_capture).getMonth() + 1
    const season =
      [3, 4, 5].includes(month) ? 'printemps' :
      [6, 7, 8].includes(month) ? 'été' :
      [9, 10, 11].includes(month) ? 'automne' : 'hiver'
    seasonCatch.set(season, (seasonCatch.get(season) ?? 0) + 1)
  }
  const seasonData = ['printemps', 'été', 'automne', 'hiver'].map(season => ({
    season: season.charAt(0).toUpperCase() + season.slice(1),
    captures: seasonCatch.get(season) ?? 0,
    sessions: seasonSess.get(season) ?? 0,
  }))

  // ── Top 5 espèces ────────────────────────────────────────────────────────────
  const speciesCountMap = new Map<string, { nom: string; count: number; rarete: string }>()
  for (const c of catches) {
    const s = sp(c)
    if (!s || !c.species_id) continue
    const prev = speciesCountMap.get(c.species_id)
    speciesCountMap.set(c.species_id, {
      nom: s.nom_fr,
      count: (prev?.count ?? 0) + 1,
      rarete: s.rarete ?? 'commun',
    })
  }
  const topSpecies = [...speciesCountMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // ── Top 5 spots ──────────────────────────────────────────────────────────────
  const spotCountMap = new Map<string, number>()
  for (const s of sessions) {
    if (s.spot_id) spotCountMap.set(s.spot_id, (spotCountMap.get(s.spot_id) ?? 0) + 1)
  }
  let topSpots: { nom: string; count: number }[] = []
  if (spotCountMap.size > 0) {
    const spotIds = [...spotCountMap.keys()]
    const { data: spotRows } = await supabase
      .from('spots')
      .select('id, nom')
      .in('id', spotIds)
    topSpots = (spotRows ?? [])
      .map(s => ({ nom: s.nom, count: spotCountMap.get(s.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const RARITY_DOT: Record<string, string> = {
    commun: 'bg-slate-400', 'peu commun': 'bg-blue-400', rare: 'bg-purple-400',
    epique: 'bg-amber-400', legendaire: 'bg-amber-400', mirage: 'bg-pink-400',
  }

  return (
    <div className="px-4 pb-32 pt-6 space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Fish,      label: 'Captures',   value: totalCatches,  color: 'text-cyan-400' },
          { icon: Fish,      label: 'Espèces',     value: `${uniqueSpecies} / 92`, color: 'text-purple-400' },
          { icon: Calendar,  label: 'Sessions',    value: totalSessions, color: 'text-emerald-400' },
          { icon: Clock,     label: 'Heures pêchées', value: `${totalHours}h`, color: 'text-amber-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl bg-white/5 border border-white/8 p-4">
            <Icon size={16} className={`${color} mb-2`} />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Records */}
      {(heaviest || longest) && (
        <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={14} className="text-amber-400" />
            <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">Tes records</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {heaviest && (heaviest.poids_kg ?? 0) > 0 && (
              <div>
                <p className="text-xl font-black text-white">{heaviest.poids_kg} kg</p>
                <p className="text-xs text-white/40 mt-0.5">Plus lourd · {sp(heaviest)?.nom_fr ?? '—'}</p>
              </div>
            )}
            {longest && (longest.taille_cm ?? 0) > 0 && (
              <div>
                <p className="text-xl font-black text-white">{longest.taille_cm} cm</p>
                <p className="text-xs text-white/40 mt-0.5">Plus long · {sp(longest)?.nom_fr ?? '—'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Captures par mois */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
        <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Captures — 12 derniers mois</p>
        <MonthlyCapturesChart data={monthlyData} />
      </div>

      {/* Répartition rareté */}
      {rarityData.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Répartition par rareté</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <RarityPieChart data={rarityData} />
            </div>
            <div className="flex flex-col gap-2">
              {rarityData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${RARITY_DOT[d.name] ?? 'bg-slate-400'}`} />
                  <span className="text-xs text-white/60 capitalize">{RARITY_LABEL[d.name] ?? d.name}</span>
                  <span className="text-xs text-white/40 ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Par saison */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
        <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Captures par saison</p>
        <SeasonChart data={seasonData} />
      </div>

      {/* Top espèces */}
      {topSpecies.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">Top espèces</p>
          <div className="space-y-3">
            {topSpecies.map((s, i) => (
              <div key={s.nom} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-white/30 text-center">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{s.nom}</p>
                  <p className="text-xs text-white/40 capitalize">{RARITY_LABEL[s.rarete] ?? s.rarete}</p>
                </div>
                <span className="text-sm font-bold text-cyan-400">{s.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top spots */}
      {topSpots.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-cyan-400" />
            <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">Top spots</p>
          </div>
          <div className="space-y-3">
            {topSpots.map((s, i) => (
              <div key={s.nom} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-white/30 text-center">{i + 1}</span>
                <p className="flex-1 text-sm font-semibold text-white">{s.nom}</p>
                <span className="text-xs text-white/40">{s.count} session{s.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saisons tableau */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-cyan-400" />
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">Activité par saison</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/30">
              <th className="text-left pb-2 font-normal">Saison</th>
              <th className="text-right pb-2 font-normal">Captures</th>
              <th className="text-right pb-2 font-normal">Sessions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {seasonData.map(s => (
              <tr key={s.season}>
                <td className="py-2 text-white/70">{s.season}</td>
                <td className="py-2 text-right text-white font-semibold">{s.captures}</td>
                <td className="py-2 text-right text-white/50">{s.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
