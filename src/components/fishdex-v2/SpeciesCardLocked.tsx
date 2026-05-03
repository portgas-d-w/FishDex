import Image from 'next/image'
import { Lock } from 'lucide-react'
import type { SpeciesRow } from '@/types/fishdex'

type Props = {
  species: SpeciesRow
}

export function SpeciesCardLocked({ species }: Props) {
  const dexNum = String(species.numero_dex ?? 0).padStart(3, '0')

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm select-none">
      {/* Image silhouette */}
      <div className="relative aspect-square bg-slate-950/80 overflow-hidden">
        {species.image_url && (
          <Image
            src={species.image_url}
            alt="Espèce non découverte"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 brightness-0 opacity-15"
          />
        )}

        {/* Cadenas centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center backdrop-blur-sm">
            <Lock size={18} className="text-slate-500" />
          </div>
        </div>

        {/* Badge #XXX */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-600 bg-slate-900/80 border border-slate-800/60 px-1.5 py-0.5 rounded-md">
          #{dexNum}
        </span>
      </div>

      {/* Infos masquées */}
      <div className="px-2.5 pb-2.5 pt-2 flex flex-col gap-1">
        <p className="font-bold text-sm text-slate-600 leading-tight">???</p>
        <p className="text-[10px] text-slate-700 italic truncate leading-tight">Non découvert</p>
        <span className="self-start mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-slate-800 bg-slate-800/60 text-slate-600">
          🔒
        </span>
      </div>
    </div>
  )
}
