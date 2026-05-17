import type { CollectionProgress, CollectionSlug } from '@/lib/collections/types'
import { COLLECTION_META } from '@/lib/collections/labels'

type Props = {
  progressList: CollectionProgress[]
  mainSlug: CollectionSlug
}

export function OtherPathsSection({ progressList, mainSlug }: Props) {
  const others = progressList.filter(p => p.slug !== mainSlug)
  if (others.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">
        🌊 Autres voies
      </p>
      <div className="grid grid-cols-2 gap-3">
        {others.map(p => {
          const meta = COLLECTION_META[p.slug]
          return (
            <div
              key={p.slug}
              className="rounded-2xl bg-white/5 border border-white/8 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl leading-none">{meta.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-white/70">{meta.nom}</p>
                  <p className="text-[10px] text-white/30">{p.titre}</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full ${
                    p.slug === 'paisibles'  ? 'bg-cyan-400/70' :
                    p.slug === 'predateurs' ? 'bg-red-400/70' :
                    'bg-emerald-400/70'
                  }`}
                  style={{ width: `${Math.min(p.percent, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-white/30 tabular-nums">
                {p.capturedVisible} / {p.totalVisible}
                {p.capturedMirages > 0 && <span className="text-amber-400 ml-1">+{p.capturedMirages}✦</span>}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
