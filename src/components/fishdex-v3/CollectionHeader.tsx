import type { CollectionProgress } from '@/lib/collections/types'
import { COLLECTION_META, TITRES } from '@/lib/collections/labels'

type Props = {
  progress: CollectionProgress
}

export function CollectionHeader({ progress }: Props) {
  const meta = COLLECTION_META[progress.slug]
  const nextTitre = TITRES.find(t => t.minPercent > progress.percent)

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${meta.bgGradient} border border-white/10 p-5 backdrop-blur-md`}>
      {/* Titre de section */}
      <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-3">
        Ma voie
      </p>

      {/* Nom de la collection + titre */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl leading-none">{meta.emoji}</span>
            <h2 className="text-lg font-black text-white">{meta.nom}</h2>
          </div>
          <p className={`text-sm font-semibold ${meta.color}`}>
            {progress.titre}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-white tabular-nums">
            {progress.capturedVisible}
            <span className="text-sm font-medium text-white/40">/{progress.totalVisible}</span>
          </p>
          <p className={`text-xs font-semibold ${meta.color}`}>
            {progress.percent}%
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            progress.percent >= 100 ? 'bg-amber-400' :
            progress.slug === 'paisibles'  ? 'bg-cyan-400' :
            progress.slug === 'predateurs' ? 'bg-red-400' :
            'bg-emerald-400'
          }`}
          style={{ width: `${Math.min(progress.percent, 100)}%` }}
        />
      </div>

      {/* Mirages + prochain titre */}
      <div className="flex items-center justify-between text-xs">
        {progress.capturedMirages > 0 ? (
          <span className="text-amber-400 font-medium">
            ✦ +{progress.capturedMirages} Mirage{progress.capturedMirages > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-white/20">Aucun Mirage capturé</span>
        )}

        {nextTitre && progress.nextTitreAt !== null && (
          <span className="text-white/30">
            {progress.nextTitreAt} espèce{progress.nextTitreAt > 1 ? 's' : ''} → {nextTitre.label}
          </span>
        )}
        {progress.percent >= 100 && (
          <span className="text-amber-400 font-semibold animate-pulse">
            ✦ Collection complète !
          </span>
        )}
      </div>
    </div>
  )
}
