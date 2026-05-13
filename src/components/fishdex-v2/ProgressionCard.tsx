import { BookOpen } from 'lucide-react'
import { rareteOrder, rareteConfig, RARETE_COUNTS } from '@/lib/fishdex/rarete'
import type { Rarete } from '@/types/fishdex'

type Props = {
  total: number
  discovered: number
  byRarete: Record<Rarete, number>
}

function HexBadge() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
        <polygon points="28,2 52,15 52,41 28,54 4,41 4,15" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="2" />
      </svg>
      <BookOpen size={20} className="relative text-cyan-400 z-10" />
    </div>
  )
}

export function ProgressionCard({ total, discovered, byRarete }: Props) {
  const pct = total > 0 ? Math.round((discovered / total) * 100) : 0

  return (
    <div className="mx-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <HexBadge />

        {/* Progression principale */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Progression</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tabular-nums leading-none">{pct}%</span>
          </div>
          <p className="text-xs text-slate-400">
            <span className="text-slate-200 font-semibold tabular-nums">{discovered}</span> / {total} espèces
          </p>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mt-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-700"
              style={{ width: `${Math.max(pct, 1)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats par rareté */}
      <div className="border-t border-white/5 pt-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rareté découverte</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {rareteOrder.map((r) => {
            const cfg = rareteConfig[r]
            const count = byRarete[r] ?? 0
            const total = RARETE_COUNTS[r]
            return (
              <div key={r} className="flex items-center gap-2">
                {r === 'mirage' ? (
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 shrink-0" />
                ) : (
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                )}
                <span className="text-xs text-slate-400 flex-1 truncate">{cfg.label}</span>
                <span className="text-xs font-semibold tabular-nums text-slate-300">
                  {count}<span className="text-slate-600 font-normal"> / {total}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
