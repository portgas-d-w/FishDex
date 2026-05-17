import Link from 'next/link'
import { Timer, MapPin, Fish, Plus, ArrowRight } from 'lucide-react'

type Session = {
  id: string
  started_at: string
  spot: { nom: string } | null
}

type Props = {
  session: Session
  catchCount: number
  speciesCount: number
}

function formatDuration(startedAt: string): string {
  const diff = Date.now() - new Date(startedAt).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function ActiveSessionCard({ session, catchCount, speciesCount }: Props) {
  const duration = formatDuration(session.started_at)

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
          Session active
        </p>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          En cours
        </span>
      </div>

      {/* Spot */}
      {session.spot?.nom && (
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-white/40 shrink-0" />
          <p className="text-sm font-medium text-white truncate">{session.spot.nom}</p>
        </div>
      )}

      {/* Timer + stats */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] text-white/30 mb-0.5">Durée</p>
          <p className="text-3xl font-semibold tabular-nums text-white tracking-tight">
            {duration}
          </p>
        </div>
        <div className="flex gap-4 pb-1">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">{catchCount}</p>
            <p className="text-[10px] text-white/40">Captures</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-white">{speciesCount}</p>
            <p className="text-[10px] text-white/40">Espèces</p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-2.5 pt-1">
        <Link
          href="/aquarium/nouvelle"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-colors px-3 py-2.5 text-sm font-semibold text-[#0a0f14]"
        >
          <Plus size={15} />
          Ajouter une prise
        </Link>
        <Link
          href="/sessions"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors px-3 py-2.5 text-sm font-medium text-white"
        >
          Voir la session
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export function ActiveSessionInline({ session }: { session: Pick<Session, 'id' | 'started_at' | 'spot'> }) {
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
        {session.spot?.nom && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{session.spot.nom}</p>
        )}
      </div>
      <ArrowRight size={16} className="text-slate-500 shrink-0" />
    </Link>
  )
}
