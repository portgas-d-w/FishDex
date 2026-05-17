import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Clock, Fish, Plus, ChevronRight,
  Bookmark, Calendar, Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Sessions — FishDex' }

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  })
}
function formatDuration(startedAt: string, endedAt: string): string {
  const diff = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`
  return `${m} min`
}

const SEASON_STYLE: Record<string, { label: string; dot: string }> = {
  printemps: { label: 'Printemps', dot: 'bg-emerald-400' },
  été:       { label: 'Été',       dot: 'bg-amber-400'   },
  automne:   { label: 'Automne',   dot: 'bg-orange-400'  },
  hiver:     { label: 'Hiver',     dot: 'bg-blue-400'    },
}
const LIGHT_LABELS: Record<string, string> = {
  aube: 'Aube', matin: 'Matin', midi: 'Midi',
  aprem: 'Après-midi', crépuscule: 'Crépuscule', nuit: 'Nuit',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Session active
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('id, started_at, spot:spot_id(nom), style_peche')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle()

  // Historique (sessions terminées)
  const { data: pastSessions } = await supabase
    .from('sessions')
    .select('id, title, started_at, ended_at, season, light_phase, is_bookmarked, spot:spot_id(nom), style_peche')
    .eq('user_id', user.id)
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(20)

  // Comptage des captures par session
  const sessionIds = pastSessions?.map(s => s.id) ?? []
  const catchCountMap: Record<string, number> = {}
  if (sessionIds.length > 0) {
    const { data: catchRows } = await supabase
      .from('catches')
      .select('session_id')
      .in('session_id', sessionIds)
    for (const c of catchRows ?? []) {
      if (c.session_id) catchCountMap[c.session_id] = (catchCountMap[c.session_id] ?? 0) + 1
    }
  }

  // Dernière session (pour la featured card)
  const lastSession = pastSessions?.[0] ?? null

  // Comptage total des captures de l'active session
  let activeCatchCount = 0
  if (activeSession) {
    const { count } = await supabase
      .from('catches')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', activeSession.id)
    activeCatchCount = count ?? 0
  }

  type Spot = { nom: string } | null
  const spotName = (spot: Spot | Spot[]): string | null => {
    const s = Array.isArray(spot) ? spot[0] : spot
    return s?.nom ?? null
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="px-4 pt-14 pb-6">
        <h1 className="text-3xl font-black text-white leading-tight">Les Sessions</h1>
        <p className="text-sm text-white/40 mt-1">Retrouve tes plus beaux souvenirs de pêche</p>
      </div>

      {/* ── SESSION ACTIVE ──────────────────────────────────── */}
      {activeSession && (
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">Session en cours</p>
          <Link
            href={`/sessions/${activeSession.id}`}
            className="flex items-center gap-4 rounded-2xl bg-cyan-400/8 border border-cyan-400/25 backdrop-blur-md p-4 hover:bg-cyan-400/12 transition-colors"
          >
            {/* Indicateur pulsant */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
                <Zap size={18} className="text-cyan-400" />
              </div>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0f14] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                {spotName(activeSession.spot as Spot | Spot[]) ?? 'Session en cours'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-cyan-400/80 tabular-nums">
                  Démarrée à {formatTime(activeSession.started_at)}
                </span>
                {activeCatchCount > 0 && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-xs text-white/50">{activeCatchCount} capture{activeCatchCount > 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>
            <ChevronRight size={16} className="text-white/30 shrink-0" />
          </Link>
        </div>
      )}

      {/* ── FEATURED : DERNIÈRE SESSION ─────────────────────── */}
      {lastSession && !activeSession && (
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">Dernière session</p>
          <Link href={`/sessions/${lastSession.id}`} className="block">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60">
              {/* Gradient fond */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg,
                    ${lastSession.season === 'été' ? 'rgba(251,191,36,0.15)' :
                      lastSession.season === 'printemps' ? 'rgba(52,211,153,0.15)' :
                      lastSession.season === 'automne' ? 'rgba(251,146,60,0.15)' :
                      'rgba(96,165,250,0.12)'
                    } 0%, rgba(10,15,20,0.95) 60%)`
                }}
              />
              {lastSession.is_bookmarked && (
                <div className="absolute top-3 right-3 z-10">
                  <Bookmark size={16} className="text-amber-400 fill-amber-400" />
                </div>
              )}
              <div className="relative p-5 space-y-3">
                {/* Location + date */}
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MapPin size={11} className="text-cyan-400/70 shrink-0" />
                    <p className="text-sm font-semibold text-white truncate">
                      {spotName(lastSession.spot as Spot | Spot[]) ?? 'Spot inconnu'}
                    </p>
                  </div>
                  <p className="text-xs text-white/40">
                    {formatDate(lastSession.started_at)} · {formatTime(lastSession.started_at)} – {formatTime(lastSession.ended_at!)}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-white/30" />
                    <span className="text-xs text-white/60">{formatDuration(lastSession.started_at, lastSession.ended_at!)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fish size={12} className="text-white/30" />
                    <span className="text-xs text-white/60">{catchCountMap[lastSession.id] ?? 0} capture{(catchCountMap[lastSession.id] ?? 0) > 1 ? 's' : ''}</span>
                  </div>
                  {lastSession.season && (
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${SEASON_STYLE[lastSession.season]?.dot ?? 'bg-white/30'}`} />
                      <span className="text-xs text-white/40">{SEASON_STYLE[lastSession.season]?.label}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── HISTORIQUE ──────────────────────────────────────── */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
            {pastSessions?.length ? 'Tes sessions' : 'Historique'}
          </p>
          {!activeSession && (
            <Link
              href="/sessions/nouvelle"
              className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
            >
              <Plus size={13} />
              Démarrer
            </Link>
          )}
        </div>

        {pastSessions && pastSessions.length > 0 ? (
          <div className="space-y-2">
            {pastSessions.map((session) => {
              const spot = spotName(session.spot as Spot | Spot[])
              const count = catchCountMap[session.id] ?? 0
              const dur = formatDuration(session.started_at, session.ended_at!)
              const season = SEASON_STYLE[session.season ?? '']

              return (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 px-4 py-3.5 hover:bg-white/8 transition-colors"
                >
                  {/* Indicateur saison */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    season ? `bg-${season.dot.replace('bg-', '')}/10` : 'bg-white/5'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${season?.dot ?? 'bg-white/20'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white truncate">
                        {spot ?? session.title ?? 'Session'}
                      </p>
                      {session.is_bookmarked && (
                        <Bookmark size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-white/30">{formatDate(session.started_at)}</span>
                      <span className="text-white/15">·</span>
                      <span className="text-xs text-white/30">{dur}</span>
                      {count > 0 && (
                        <>
                          <span className="text-white/15">·</span>
                          <span className="text-xs text-cyan-400/70">{count} prise{count > 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={15} className="text-white/20 shrink-0" />
                </Link>
              )
            })}
          </div>
        ) : !activeSession ? (
          /* État vide */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/8 flex items-center justify-center mb-4">
              <Calendar size={28} strokeWidth={1.4} className="text-white/25" />
            </div>
            <p className="text-sm font-medium text-white/40 mb-1">Aucune session pour l'instant</p>
            <p className="text-xs text-white/20 mb-6 max-w-[220px]">
              Démarre ta première sortie et immortalise chaque prise.
            </p>
            <Link
              href="/sessions/nouvelle"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-[#0a0f14] text-sm font-bold hover:bg-cyan-300 transition-colors"
            >
              <Plus size={16} />
              Démarrer une session
            </Link>
          </div>
        ) : null}
      </div>

      {/* ── FAB nouvelle session ─────────────────────────────── */}
      {!activeSession && (pastSessions?.length ?? 0) > 0 && (
        <Link
          href="/sessions/nouvelle"
          aria-label="Nouvelle session"
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.5)] hover:bg-cyan-300 transition-all active:scale-95 z-40"
        >
          <Plus size={24} strokeWidth={2.5} className="text-[#0a0f14]" />
        </Link>
      )}
    </div>
  )
}
