import Link from 'next/link'
import { Fish, ChevronRight } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { Rarete } from '@/types/fishdex'

type Props = {
  nomFr: string
  nomScientifique: string
  description: string | null
  rarete: Rarete | null
  slug: string
}

export function SpeciesInfo({ nomFr, nomScientifique, description, rarete, slug }: Props) {
  const cfg = getRareteConfig(rarete)

  return (
    <div className="px-5 mt-6">
      <h2 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Informations sur le poisson</h2>
      <Link
        href={`/fishdex/${slug}`}
        className="block rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-4 py-4
          hover:bg-white/8 transition-colors active:scale-[0.99]"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Fish size={16} className="text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{nomFr}</p>
            <p className="text-xs text-slate-400 italic mt-0.5">{nomScientifique}</p>
            {description && (
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{description}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.badge} ${cfg.badgeBorder}`}>
                {cfg.label}
              </span>
              <div className="flex items-center gap-1 text-xs text-cyan-400">
                <span>Voir la fiche</span>
                <ChevronRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
