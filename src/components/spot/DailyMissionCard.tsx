import { Target, Fish, Star } from 'lucide-react'
import { MOCK_DAILY_MISSIONS, MOCK_DAILY_REWARD_XP } from '@/lib/spot/mocks'

export function DailyMissionCard() {
  return (
    <div className="mx-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-emerald-400" />
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            Mission du jour
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-400">+{MOCK_DAILY_REWARD_XP} XP</span>
        </div>
      </div>

      {/* Missions */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {MOCK_DAILY_MISSIONS.map((mission) => {
          const pct = mission.target > 0
            ? Math.round((mission.progress / mission.target) * 100)
            : 0
          return (
            <div key={mission.id} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Fish size={14} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-200 truncate pr-2">
                    {mission.label}
                  </p>
                  <span className="text-[11px] font-bold text-slate-400 shrink-0 tabular-nums">
                    {mission.progress}/{mission.target}
                  </span>
                </div>
                <div className="h-1 bg-slate-700/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, 0)}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer bouton désactivé */}
      <div className="px-4 pb-3">
        <button
          disabled
          className="w-full py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs font-semibold text-slate-500 cursor-not-allowed"
        >
          Voir missions — Bientôt disponible
        </button>
      </div>
    </div>
  )
}
