import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Crown } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { CatchWithSpecies } from '@/types/aquarium'

type Props = {
  catch_: CatchWithSpecies
  photoUrl: string | null
  isRecord: boolean
  isNew: boolean
}

export function CatchCard({ catch_: c, photoUrl, isRecord, isNew }: Props) {
  const cfg = getRareteConfig(c.species.rarete)
  const isShiny = c.species.rarete === 'shiny'

  return (
    <Link
      href={`/aquarium/${c.id}`}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border bg-white/5 backdrop-blur-sm
        transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
        ${cfg.border} ${cfg.glow}`}
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] bg-slate-900/60 overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={c.species.nom_fr}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={c.species.image_url || '/fishes/placeholder.svg'}
            alt={c.species.nom_fr}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Shimmer shiny */}
        {isShiny && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent
            animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Gradient overlay bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Badge haut gauche : Record ou Nouveau */}
        {isRecord && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500/20 border border-amber-400/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            <Crown size={9} className="text-amber-400" />
            <span className="text-[9px] font-bold text-amber-300 leading-none">Record</span>
          </div>
        )}
        {!isRecord && isNew && (
          <div className="absolute top-2 left-2 bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-emerald-300 leading-none animate-pulse">Nouveau</span>
          </div>
        )}

        {/* Infos bas */}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
          <p className="font-bold text-sm text-white leading-tight truncate">{c.species.nom_fr}</p>
          {c.poids_kg != null && (
            <p className="text-sm font-bold text-cyan-400 leading-tight">{c.poids_kg} kg</p>
          )}
          {c.lieu && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={9} className="text-slate-400 shrink-0" />
              <span className="text-[10px] text-slate-300 truncate">{c.lieu}</span>
            </div>
          )}
          <div className="flex justify-end mt-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${cfg.badge} ${cfg.badgeBorder}`}>
              {cfg.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
