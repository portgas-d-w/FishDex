import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Scale } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { SpeciesRow } from '@/types/fishdex'

type Props = {
  species: SpeciesRow
}

function formatHabitat(habitat: string[] | null): string {
  if (!habitat || habitat.length === 0) return '—'
  return habitat
    .slice(0, 2)
    .map((h) => h.charAt(0).toUpperCase() + h.slice(1).replace(/_/g, ' '))
    .join(', ')
}

export function SpeciesCard({ species }: Props) {
  const cfg = getRareteConfig(species.rarete)
  const dexNum = String(species.numero_dex ?? 0).padStart(3, '0')

  return (
    <Link
      href={`/fishdex/${species.slug}`}
      className={`group flex flex-col rounded-2xl overflow-hidden border bg-slate-900/60 backdrop-blur-sm
        transition-all duration-200 hover:scale-[1.03] hover:shadow-lg
        ${cfg.border} ${cfg.glow}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-950/60 overflow-hidden">
        <Image
          src={species.image_url || '/fishes/placeholder.svg'}
          alt={species.nom_fr}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Numéro dex */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-400 bg-slate-900/80 border border-slate-700/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
          #{dexNum}
        </span>

        {/* Badge rareté */}
        {species.rarete && (
          <span
            className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm
              ${cfg.badge} ${cfg.badgeBorder}`}
          >
            {cfg.label}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="font-bold text-sm text-slate-100 leading-tight group-hover:text-teal-300 transition-colors truncate">
          {species.nom_fr}
        </p>
        <p className="text-[11px] text-slate-500 italic truncate leading-tight">
          {species.nom_scientifique}
        </p>

        {/* Ligne infos */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-slate-800/60">
          <span className="flex items-center gap-1 text-[10px] text-slate-500 min-w-0">
            <MapPin size={10} className="shrink-0 text-slate-600" />
            <span className="truncate">{formatHabitat(species.habitat)}</span>
          </span>
          {species.poids_max_kg != null && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0 ml-1">
              <Scale size={10} className="text-slate-600" />
              {species.poids_max_kg} kg
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
