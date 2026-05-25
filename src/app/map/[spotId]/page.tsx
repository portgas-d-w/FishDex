import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin, Fish, Calendar, TrendingUp, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { hasLegendeAccess } from '@/lib/stripe/access'
import { predictFishingWindows, type DayPrediction } from '@/lib/predictions/fishing-predictor'

export const metadata = { title: 'Spot — FishDex' }

const SCORE_COLOR = (score: number) =>
  score >= 75 ? 'text-emerald-400' :
  score >= 55 ? 'text-cyan-400' :
  score >= 35 ? 'text-amber-400' : 'text-red-400'

const SCORE_BG = (score: number) =>
  score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' :
  score >= 55 ? 'bg-cyan-500/10 border-cyan-500/20' :
  score >= 35 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'

export default async function SpotDetailPage({
  params,
}: { params: Promise<{ spotId: string }> }) {
  const { spotId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: spot } = await supabase
    .from('spots')
    .select('*')
    .eq('id', spotId)
    .eq('user_id', user.id)
    .single()

  if (!spot) notFound()

  // Stats captures sur ce spot
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, started_at, ended_at')
    .eq('spot_id', spotId)
    .eq('user_id', user.id)
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })

  const sessionIds = (sessions ?? []).map(s => s.id)
  let catchCount = 0
  let topSpecies: { nom: string; count: number }[] = []

  if (sessionIds.length > 0) {
    const { data: catchRows } = await supabase
      .from('catches')
      .select('species:species_id(nom_fr)')
      .in('session_id', sessionIds)

    catchCount = catchRows?.length ?? 0

    const speciesMap = new Map<string, number>()
    for (const c of catchRows ?? []) {
      const sp = Array.isArray(c.species) ? c.species[0] : c.species
      const nom = (sp as { nom_fr: string } | null)?.nom_fr
      if (nom) speciesMap.set(nom, (speciesMap.get(nom) ?? 0) + 1)
    }
    topSpecies = [...speciesMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nom, count]) => ({ nom, count }))
  }

  // Prédictions (Légende)
  const isLegende = await hasLegendeAccess(user.id)
  let predictions: DayPrediction[] = []
  if (isLegende && spot.latitude && spot.longitude) {
    predictions = await predictFishingWindows(spot.latitude, spot.longitude)
  }

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0f14]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link href="/map" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
          <ChevronLeft size={18} />
        </Link>
        <MapPin size={16} className="text-cyan-400" />
        <h1 className="text-lg font-bold text-white truncate">{spot.nom}</h1>
      </div>

      <div className="px-4 pb-32 pt-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: spot.nb_visites },
            { label: 'Captures', value: catchCount },
            { label: 'GPS', value: spot.latitude ? '✓' : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/8 p-3 text-center">
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Top espèces */}
        {topSpecies.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Fish size={14} className="text-cyan-400" />
              <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">Espèces capturées ici</p>
            </div>
            <div className="space-y-2">
              {topSpecies.map((s, i) => (
                <div key={s.nom} className="flex items-center gap-2">
                  <span className="w-4 text-xs text-white/30">{i + 1}</span>
                  <p className="flex-1 text-sm text-white">{s.nom}</p>
                  <span className="text-xs text-cyan-400">{s.count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions récentes */}
        {(sessions ?? []).length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-cyan-400" />
              <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">Sessions récentes</p>
            </div>
            <div className="space-y-2">
              {(sessions ?? []).slice(0, 5).map(s => (
                <Link key={s.id} href={`/sessions/${s.id}`} className="flex items-center gap-2 group">
                  <p className="flex-1 text-sm text-white/70 group-hover:text-white transition-colors">
                    {new Date(s.started_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <ChevronLeft size={12} className="text-white/20 rotate-180" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prédictions — Légende */}
        <div className="rounded-2xl border p-4 bg-amber-500/5 border-amber-500/15">
          <div className="flex items-center gap-2 mb-1">
            <Crown size={14} className="text-amber-400" />
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Prochaines fenêtres</p>
            <span className="ml-auto text-[10px] text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded-full">Légende</span>
          </div>

          {!isLegende ? (
            <div className="mt-3">
              <p className="text-xs text-white/50 mb-2">
                L&apos;analyse prédictive des conditions est réservée aux abonnés Légende.
              </p>
              <Link href="/parametres/abonnement" className="text-xs text-amber-300 underline underline-offset-2">
                Découvrir Légende →
              </Link>
            </div>
          ) : !spot.latitude ? (
            <p className="text-xs text-white/40 mt-3">
              Active la géolocalisation lors de ta prochaine session ici pour activer les prédictions.
            </p>
          ) : predictions.length === 0 ? (
            <p className="text-xs text-white/40 mt-3">Météo indisponible pour ce spot.</p>
          ) : (
            <div className="space-y-3 mt-3">
              {predictions.map(p => (
                <div key={p.date} className={`rounded-xl border p-3 ${SCORE_BG(p.score)}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-white">{p.label}</p>
                    <span className={`text-sm font-black ${SCORE_COLOR(p.score)}`}>{p.score}/100</span>
                  </div>
                  <p className="text-xs text-white/50 mb-1">
                    {p.conditions} · {p.temp}°C · Vent {p.windSpeed} km/h
                  </p>
                  {p.bestSpecies.length > 0 && (
                    <p className="text-xs text-white/60">
                      → {p.bestSpecies.join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-white/40 mt-1 italic">{p.reasoning}</p>
                  <p className="text-[10px] text-white/25 mt-1">{p.bestWindow}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
