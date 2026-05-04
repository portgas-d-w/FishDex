import { TrendingUp } from 'lucide-react'

type Props = {
  currentWeight: number
  previousRecord: number
}

export function ComparisonSection({ currentWeight, previousRecord }: Props) {
  const diff = +(currentWeight - previousRecord).toFixed(2)
  const progress = Math.min((previousRecord / currentWeight) * 100, 98)

  return (
    <div className="px-5 mt-6">
      <h2 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Comparaison</h2>
      <div className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={20} className="text-cyan-400 shrink-0" />
          <div>
            <span className="text-2xl font-black text-cyan-400">+{diff} kg</span>
            <p className="text-xs text-slate-400 mt-0.5">vs ancien record ({previousRecord} kg)</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-500">Ancien : {previousRecord} kg</span>
          <span className="text-[10px] text-cyan-400 font-semibold">Nouveau : {currentWeight} kg</span>
        </div>
      </div>
    </div>
  )
}
