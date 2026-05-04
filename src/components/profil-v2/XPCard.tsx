type Props = {
  xpCurrent: number
  xpNext: number
  nextLevel: number
}

export function XPCard({ xpCurrent, xpNext, nextLevel }: Props) {
  const pct = Math.min(Math.round((xpCurrent / xpNext) * 100), 100)
  const remaining = xpNext - xpCurrent

  return (
    <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        {/* Badge XP hexagonal */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center bg-cyan-500/15 border border-cyan-400/50 text-cyan-400 font-black text-xs
              shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
          >
            XP
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {xpCurrent.toLocaleString('fr-FR')} / {xpNext.toLocaleString('fr-FR')} XP
            </p>
            <p className="text-[11px] text-slate-400">{remaining} XP restants</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-slate-400">Prochain niveau</p>
          <p className="text-sm font-bold text-cyan-400">{nextLevel}</p>
        </div>
      </div>

      {/* Barre progression */}
      <div className="h-2.5 w-full bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-700
            shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
