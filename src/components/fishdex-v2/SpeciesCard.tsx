import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { SpeciesRow } from '@/types/fishdex'

type Props = {
  species: SpeciesRow
}

export function SpeciesCard({ species }: Props) {
  const cfg = getRareteConfig(species.rarete)
  const dexNum = String(species.numero_dex ?? 0).padStart(3, '0')
  const isMirage = species.rarete === 'mirage'

  return (
    <Link
      href={`/fishdex/${species.slug}`}
      className={`group flex flex-col rounded-2xl overflow-hidden border bg-white/5 backdrop-blur-sm
        transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
        ${cfg.border} ${cfg.glow}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-950/60 overflow-hidden">
        <Image
          src={species.image_url || '/fishes/placeholder.svg'}
          alt={species.nom_fr}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
        />

        {/* Shimmer mirage */}
        {isMirage && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent
            animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Badge #XXX */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-300 bg-slate-900/80 border border-white/10 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
          #{dexNum}
        </span>

        {/* Checkmark découverte */}
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_8px_rgba(52,211,153,0.6)]">
          <Check size={11} strokeWidth={3} className="text-white" />
        </span>
      </div>

      {/* Infos */}
      <div className="px-2.5 pb-2.5 pt-2 flex flex-col gap-1">
        <p className="font-bold text-sm text-white leading-tight truncate group-hover:text-cyan-300 transition-colors">
          {species.nom_fr}
        </p>
        <p className="text-[10px] text-slate-500 italic truncate leading-tight">
          {species.nom_scientifique}
        </p>
        <span className={`self-start mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm
          ${cfg.badge} ${cfg.badgeBorder}`}>
          {cfg.label}
        </span>
      </div>
    </Link>
  )
}
