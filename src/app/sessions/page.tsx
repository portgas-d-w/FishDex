import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
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
        {!activeSession && sessions.length > 0 && (
          <Link
            href="/sessions/new"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-cyan-400 text-[#0a0f14] hover:bg-cyan-300 transition-colors shadow-[0_0_16px_rgba(34,211,238,0.4)]"
          >
            <Plus size={18} strokeWidth={2.5} />
          </Link>
        )}
      </div>

      {/* Banner active */}
      {activeSession && <ActiveSessionBanner session={activeSession} />}

      {/* Contenu */}
      {sessions.length === 0 ? (
        <EmptyState hasActive={!!activeSession} />
      ) : (
        <SessionsList sessions={enrichedSessions} catchCountMap={catchCountMap} />
      )}

      {/* FAB */}
      {!activeSession && sessions.length > 0 && (
        <Link
          href="/sessions/new"
          aria-label="Nouvelle session"
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.5)] hover:bg-cyan-300 transition-all active:scale-95 z-40"
        >
          <Plus size={24} strokeWidth={2.5} className="text-[#0a0f14]" />
        </Link>
      )}
    </div>
  )
}
