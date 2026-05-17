'use client'

import { useState } from 'react'
import type { CollectionSlug } from '@/lib/collections/types'
import { COLLECTION_META } from '@/lib/collections/labels'

export type DexView = 'ma-collection' | 'toutes' | CollectionSlug

type Props = {
  preferredSlug: CollectionSlug | null
  activeView: DexView
  onViewChange: (v: DexView) => void
}

const ALL_TABS: { value: CollectionSlug; emoji: string; label: string }[] = [
  { value: 'paisibles',  emoji: '🐟', label: 'Paisibles'  },
  { value: 'predateurs', emoji: '🦈', label: 'Prédateurs' },
  { value: 'eaux-vives', emoji: '🌊', label: 'Eaux vives' },
]

export function CollectionToggle({ preferredSlug, activeView, onViewChange }: Props) {
  const [showSubs, setShowSubs] = useState(activeView === 'toutes' || ALL_TABS.some(t => t.value === activeView))

  function handleMain(view: DexView) {
    setShowSubs(view === 'toutes')
    onViewChange(view)
  }

  const hasPref = !!preferredSlug
  const prefMeta = preferredSlug ? COLLECTION_META[preferredSlug] : null

  return (
    <div className="space-y-2">
      {/* Toggle principal : Ma Collection ↔ Toutes */}
      <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1 border border-white/8">
        {/* Ma Collection (affiché seulement si voie choisie) */}
        {hasPref && (
          <button
            onClick={() => handleMain('ma-collection')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
              activeView === 'ma-collection'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <span className="text-base leading-none">{prefMeta?.emoji}</span>
            <span>Ma voie</span>
          </button>
        )}

        {/* Toutes les espèces */}
        <button
          onClick={() => handleMain('toutes')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
            (activeView === 'toutes' || ALL_TABS.some(t => t.value === activeView)) && activeView !== 'ma-collection'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Toutes
        </button>
      </div>

      {/* Sous-onglets collections (affichés quand "Toutes" est actif) */}
      {showSubs && (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onViewChange('toutes')}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              activeView === 'toutes'
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            Globale
          </button>
          {ALL_TABS.map(({ value, emoji, label }) => (
            <button
              key={value}
              onClick={() => onViewChange(value)}
              className={`shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                activeView === value
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              <span className="text-sm leading-none">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
