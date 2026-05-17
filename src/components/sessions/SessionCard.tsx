import Link from 'next/link'
import { MapPin, Clock, Fish, Bookmark } from 'lucide-react'

type Session = {
  id: string
  title: string | null
  started_at: string
  ended_at: string | null
  season: string | null
  is_bookmarked: boolean
  spot: { nom: string } | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h${String(m).padStart(2,'0')}`
  return `${m} min`
}

const SEASON_DOT: Record<string, string> = {
  printemps: 'bg-emerald-400',
  été:       'bg-amber-400',
  automne:   'bg-orange-400',
  hiver:     'bg-blue-400',
}

export function SessionCard({ session, catchCount }: { session: Session; catchCount: number }) {
  const spot = Array.isArray(session.spot) ? session.spot[0] : session.spot
  const name = session.title ?? spot?.nom ?? 'Session'
  const dot  = SEASON_DOT[session.season ?? ''] ?? 'bg-white/20'

  return (
    <Link href={`/sessions/${session.id}`} className="block">
      <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 px-4 py-3.5 hover:bg-white/8 transition-colors">
        {/* Saison dot */}
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            {session.is_bookmarked && (
              <Bookmark size={10} className="text-amber-400 fill-amber-400 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-white/25 shrink-0" />
              <span className="text-[11px] text-white/35">{formatDate(session.started_at)}</span>
            </div>
            {session.ended_at && (
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-white/25 shrink-0" />
                <span className="text-[11px] text-white/35">
                  {formatTime(session.started_at)} – {formatTime(session.ended_at)}
                </span>
              </div>
            )}
            {catchCount > 0 && (
              <div className="flex items-center gap-1">
                <Fish size={10} className="text-cyan-400/60 shrink-0" />
                <span className="text-[11px] text-cyan-400/70">{catchCount} prise{catchCount > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
