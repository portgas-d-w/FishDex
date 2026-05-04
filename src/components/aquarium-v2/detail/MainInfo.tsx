import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { Rarete } from '@/types/fishdex'

type Props = {
  nomFr: string
  rarete: Rarete | null
  poidsKg: number | null
}

export function MainInfo({ nomFr, rarete, poidsKg }: Props) {
  const cfg = getRareteConfig(rarete)

  return (
    <div className="px-5 mt-5">
      <div className="flex items-start gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-white leading-tight">{nomFr}</h1>
        <span className={`mt-1 text-xs font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm ${cfg.badge} ${cfg.badgeBorder}`}>
          {cfg.label}
        </span>
      </div>

      {poidsKg != null && (
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-5xl font-black text-cyan-400 leading-none">{poidsKg}</span>
          <span className="text-2xl font-bold text-cyan-400/70">kg</span>
        </div>
      )}
    </div>
  )
}
