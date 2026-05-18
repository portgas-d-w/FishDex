import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveSession, getSessions } from '@/app/actions/sessions'
import { ActiveSessionBanner } from '@/components/sessions/ActiveSessionBanner'
import { SessionsList } from '@/components/sessions/SessionsList'
import { EmptyState } from '@/components/sessions/EmptyState'

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

  // Enrichir sessions avec spot
  const spotIds = [...new Set(sessions.map(s => s.spot_id).filter(Boolean))] as string[]
  const spotMap: Record<string, string> = {}
  if (spotIds.length > 0) {
    const { data: spots } = await supabase.from('spots').select('id, nom').in('id', spotIds)
    for (const s of spots ?? []) spotMap[s.id] = s.nom
  }

  const enrichedSessions = sessions.map(s => ({
    ...s,
    spot: s.spot_id ? { nom: spotMap[s.spot_id] ?? '' } : null,
  }))

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Les Sessions</h1>
          <p className="text-sm text-white/40 mt-0.5">Retrouve tes plus beaux souvenirs de pêche</p>
        </div>
        {/* vide : CTAs déplacés plus bas */}
      </div>

      {/* Banner active */}
      {activeSession && <ActiveSessionBanner session={activeSession} />}

      {/* CTAs si pas de session active */}
      {!activeSession && (
        <div className="px-4 mb-4 flex gap-2">
          <Link
            href="/sessions/new"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400 text-[#0a0f14] font-semibold text-sm hover:bg-cyan-300 transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            Démarrer
          </Link>
          <Link
            href="/sessions/retro"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/8 transition-colors"
          >
            <Clock size={14} />
            Souvenir passé
          </Link>
        </div>
      )}

      {/* Contenu */}
      {sessions.length === 0 ? (
        <EmptyState hasActive={!!activeSession} />
      ) : (
        <SessionsList sessions={enrichedSessions} catchCountMap={catchCountMap} />
      )}
    </div>
  )
}
