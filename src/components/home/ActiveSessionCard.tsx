import Link from 'next/link'
import { Timer, MapPin, ArrowRight } from 'lucide-react'

type Session = {
  id: string
  started_at: string
  lieu: string | null
}

function formatDuration(startedAt: string): string {
  const diff = Date.now() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`
  return `${m} min`
}

export function ActiveSessionCard({ session }: { session: Session }) {
  return (
    <Link
      href="/sessions"
      className="flex items-center gap-4 rounded-2xl bg-cyan-500/8 border border-cyan-400/20 backdrop-blur-sm px-4 py-4 hover:bg-cyan-500/12 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-cyan-400/15 flex items-center justify-center shrink-0">
        <Timer size={18} className="text-cyan-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">Session en cours</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-cyan-400 tabular-nums">{formatDuration(session.started_at)}</span>
          {session.lieu && (
            <>
              <span className="text-white/20">·</span>
              <MapPin size={10} className="text-slate-500 shrink-0" />
              <span className="text-xs text-slate-400 truncate">{session.lieu}</span>
            </>
          )}
        </div>
      </div>

      <ArrowRight size={16} className="text-slate-500 shrink-0" />
    </Link>
  )
}
