import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { CollectionProgress } from '@/lib/collections/types'
import { COLLECTION_META, TITRES } from '@/lib/collections/labels'

type Props = {
  progress: CollectionProgress
}

export function MainPathCard({ progress }: Props) {
  const meta     = COLLECTION_META[progress.slug]
  const nextTitre = TITRES.find(t => t.minPercent > progress.percent)

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${meta.bgGradient} border border-white/10 p-5`}>
      {/* Label */}
      <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
        🎣 Ma voie
      </p>

      {/* Collection + titre */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{meta.emoji}</span>
          <div>
            <p className="text-lg font-black text-white">{meta.nom}</p>
            <p className={`text-sm font-semibold ${meta.color}`}>{progress.titre}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white tabular-nums">{progress.percent}<span className="text-base font-medium text-white/40">%</span></p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-white/50">{progress.capturedVisible} / {progress.totalVisible} espèces</span>
          {progress.capturedMirages > 0 && (
            <span className="text-amber-400 font-medium">✦ +{progress.capturedMirages} Mirage{progress.capturedMirages > 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              progress.percent >= 100 ? 'bg-amber-400' :
              progress.slug === 'paisibles'  ? 'bg-cyan-400' :
              progress.slug === 'predateurs' ? 'bg-red-400' :
              'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(progress.percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Prochain titre */}
      {nextTitre && progress.nextTitreAt !== null ? (
        <p className="text-xs text-white/30">
          {progress.nextTitreAt} espèce{progress.nextTitreAt > 1 ? 's' : ''} de plus pour atteindre <span className="text-white/50 font-medium">{nextTitre.label}</span>
        </p>
      ) : progress.percent >= 100 ? (
        <p className="text-xs text-amber-400 font-semibold animate-pulse">✦ Collection complète — tu es Maître {meta.nom} !</p>
      ) : null}

      {/* Lien FishDex */}
      <Link
        href="/fishdex"
        className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
      >
        Voir ma collection
        <ChevronRight size={12} />
      </Link>
    </div>
  )
}
