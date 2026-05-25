import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Clock, Map } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveSession, getSessions } from '@/app/actions/sessions'
import { ActiveSessionBanner } from '@/components/sessions/ActiveSessionBanner'
import { SessionsList } from '@/components/sessions/SessionsList'
import { EmptyState } from '@/components/sessions/EmptyState'
import { PageBackground } from '@/components/ui/PageBackground'

export const metadata = { title: 'Sessions — FishDex' }

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [rawActive, sessions] = await Promise.all([
    getActiveSession(),
    getSessions(),
  ])

  // Enrichir activeSession avec spot
  let activeSession: {
    id: string; started_at: string; spot: { nom: string } | null; intention: string | null
  } | null = null

  if (rawActive) {
    const { data: spot } = rawActive.spot_id
      ? await supabase.from('spots').select('nom').eq('id', rawActive.spot_id).single()
      : { data: null }
    activeSession = {
      id: rawActive.id,
      started_at: rawActive.started_at,
      intention: rawActive.intention,
      spot: spot ? { nom: (spot as { nom: string }).nom } : null,
    }
  }

  // Catch counts par session
  const sessionIds = sessions.map(s => s.id)
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

  // Enrichir sessions avec spot + champs journal
  const spotIds = [...new Set(sessions.map(s => s.spot_id).filter(Boolean))] as string[]
  const spotMap: Record<string, string> = {}
  if (spotIds.length > 0) {
    const { data: spots } = await supabase.from('spots').select('id, nom').in('id', spotIds)
    for (const s of spots ?? []) spotMap[s.id] = s.nom
  }

  const enrichedSessions = sessions.map(s => ({
    ...s,
    spot:               s.spot_id ? { nom: spotMap[s.spot_id] ?? '' } : null,
    notes:              s.notes ?? null,
    ressenti:           s.ressenti ?? null,
    photo_ambiance_url: s.photo_ambiance_url ?? null,
    light_phase:        s.light_phase ?? null,
    meteo_data:         s.meteo_data ?? null,
    style_peche:        s.style_peche ?? null,
  }))

  return (
    <PageBackground
      bgUrl="/backgrounds/sessions-page-bg.webp"
      overlay="bg-[#060b12]/68"
      className="pb-28"
    >
      {/* ── Header journal ──────────────────────────────────────────────── */}
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-[2.6rem] font-bold leading-tight text-white/90">
          Les Sessions
        </h1>
        <p className="text-sm text-white/40 mt-1 italic">
          Tes souvenirs de pêche,<br />écrits par la nature.
        </p>
      </div>

      {/* ── Banner session active ────────────────────────────────────────── */}
      {activeSession && (
        <div className="px-4 mb-2">
          <ActiveSessionBanner session={activeSession} />
        </div>
      )}

      {/* ── CTAs ────────────────────────────────────────────────────────── */}
      {!activeSession && (
        <div className="px-4 mb-5 mt-3 space-y-2.5">
          <div className="flex gap-2.5">
            <Link
              href="/sessions/new"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1a4a3a 0%, #0f3328 100%)',
                border: '1px solid rgba(52,211,153,0.25)',
                color: '#6ee7b7',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Démarrer
            </Link>
            <Link
              href="/sessions/retro"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.55)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}
            >
              <Clock size={13} />
              Souvenir passé
            </Link>
          </div>
          <Link
            href="/map"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 w-full"
            style={{
              background: 'rgba(34,211,238,0.05)',
              border: '1px solid rgba(34,211,238,0.15)',
              color: 'rgba(34,211,238,0.7)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Map size={13} />
            Carte interactive
          </Link>
        </div>
      )}

      {/* ── Liste sessions ───────────────────────────────────────────────── */}
      {sessions.length === 0 ? (
        <EmptyState hasActive={!!activeSession} />
      ) : (
        <SessionsList sessions={enrichedSessions} catchCountMap={catchCountMap} />
      )}

      {/* ── Citation de bas de page ─────────────────────────────────────── */}
      {sessions.length > 0 && (
        <p
          className="text-center text-xs italic text-white/20 px-8 pb-4 pt-2"
          style={{ fontSize: '0.85rem' }}
        >
          &ldquo;Ce ne sont pas les prises qui restent,<br />ce sont les moments.&rdquo;
        </p>
      )}
    </PageBackground>
  )
}
