import Link from 'next/link'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import type { SpeciesRow } from '@/types/fishdex'

type Props = {
  species: SpeciesRow
}

export function SpeciesCardLocked({ species }: Props) {
  const dexNum = String(species.numero_dex ?? 0).padStart(3, '0')

  return (
    <Link
      href={`/fishdex/${species.slug}`}
      className="flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40
        transition-all duration-200 hover:opacity-75 hover:border-slate-700"
    >
      {/* Image silhouette */}
      <div className="relative aspect-square bg-slate-950/40 overflow-hidden">
        <Image
          src={species.image_url || '/fishes/placeholder.svg'}
          alt="Espèce non découverte"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 [filter:brightness(0)] opacity-40"
        />

        {/* Numéro dex */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-600 bg-slate-900/80 border border-slate-700/40 px-1.5 py-0.5 rounded-md">
          #{dexNum}
        </span>

        {/* Icône cadenas centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock size={20} className="text-slate-600 opacity-80" />
        </div>
      </div>

      {/* Infos */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="font-bold text-sm text-slate-600 leading-tight truncate">
          ???
        </p>
        <p className="text-[11px] text-slate-700 italic truncate">
          — — —
        </p>

        {/* Ligne bas */}
        <div className="flex items-center gap-1 mt-auto pt-1.5 border-t border-slate-800/40">
          <Lock size={9} className="text-slate-700 shrink-0" />
          <span className="text-[10px] text-slate-700">Non découvert</span>
        </div>
      </div>
    </Link>
  )
}
