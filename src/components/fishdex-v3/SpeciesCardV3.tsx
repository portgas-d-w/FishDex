import Link from 'next/link'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import { COLLECTION_META } from '@/lib/collections/labels'
import type { CollectionSlug } from '@/lib/collections/types'

const COLLECTION_BG: Record<CollectionSlug, string> = {
  'paisibles':  '/backgrounds/species-paisibles.webp',
  'predateurs': '/backgrounds/species-predateurs.webp',
  'eaux-vives': '/backgrounds/species-eaux-vives.webp',
}

type Props = {
  species: {
    id: string
    slug: string
    nom_fr: string
    nom_scientifique: string
    rarete: string | null
    numero_dex: number | null
    image_url: string | null
    is_hidden_in_dex: boolean
    difficulte: number | null
    collections: CollectionSlug[]
  }
  isDiscovered: boolean
}

export function SpeciesCardV3({ species: s, isDiscovered }: Props) {
  const cfg      = getRareteConfig(s.rarete)
  const isMirage = s.rarete === 'mirage'
  const dexNum   = String(s.numero_dex ?? 0).padStart(3, '0')

  // Background selon la première collection (ou aquatique par défaut)
  const bgImage  = s.collections[0] ? COLLECTION_BG[s.collections[0]] : '/backgrounds/species-aquatic.webp'

  // Mirage non capturé → invisible (ne doit jamais arriver côté client si filtré serveur)
  if (s.is_hidden_in_dex && !isDiscovered) return null

  return (
    <Link
      href={`/fishdex/${s.slug}`}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border bg-white/5 backdrop-blur-sm
        transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]
        ${cfg.border} ${cfg.glow}`}
    >
      {/* Photo zone */}
      <div className="relative aspect-square overflow-hidden">
        {/* Background de collection */}
        <Image
          src={bgImage}
          alt=""
          fill
          aria-hidden
          sizes="(max-width: 640px) 50vw, 33vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
            isDiscovered ? 'opacity-100' : 'opacity-30 brightness-50'
          }`}
        />
        {/* Overlay sombre pour lisibilité du poisson */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        {isDiscovered ? (
          <Image
            src={s.image_url || '/fishes/placeholder.svg'}
            alt={s.nom_fr}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className={`relative object-contain p-2 transition-transform duration-300 group-hover:scale-105 drop-shadow-lg ${
              isMirage ? 'drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]' : ''
            }`}
          />
        ) : (
          // Espèce non capturée : silhouette + cadenas
          <>
            <Image
              src={s.image_url || '/fishes/placeholder.svg'}
              alt="Espèce non découverte"
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="relative object-contain p-2 brightness-0 opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                <Lock size={14} className="text-white/50" />
              </div>
            </div>
          </>
        )}

        {/* Shimmer mirage découvert */}
        {isMirage && isDiscovered && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Numéro Dex */}
        <span className="absolute top-1.5 left-1.5 font-mono text-[9px] text-slate-500 bg-slate-900/70 border border-slate-800/60 px-1.5 py-0.5 rounded">
          #{dexNum}
        </span>

        {/* Badge rareté */}
        <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm ${cfg.badge} ${cfg.badgeBorder}`}>
          {cfg.label}
        </span>

        {/* Badges collections (multi-collection) */}
        {isDiscovered && s.collections.length > 1 && (
          <div className="absolute bottom-1 left-1 flex gap-0.5">
            {s.collections.map(slug => (
              <span key={slug} className="text-xs leading-none bg-black/50 rounded px-0.5">
                {COLLECTION_META[slug]?.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Infos bas */}
      <div className="px-2.5 pb-2.5 pt-2 flex flex-col gap-0.5">
        {isDiscovered ? (
          <>
            <p className="font-bold text-sm text-white leading-tight truncate">{s.nom_fr}</p>
            <p className="text-[10px] text-white/35 italic truncate">{s.nom_scientifique}</p>
          </>
        ) : (
          <>
            <p className="font-bold text-sm text-slate-600 leading-tight">???</p>
            <p className="text-[10px] text-slate-700 italic">Non découvert</p>
          </>
        )}

      </div>
    </Link>
  )
}
