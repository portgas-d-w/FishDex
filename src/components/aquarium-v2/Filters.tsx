'use client'

import type { Rarete } from '@/types/fishdex'

export type FilterState = {
  mode: 'all' | 'rarity' | 'records'
  rarity: Rarete | null
}

const RARITY_OPTIONS: { value: Rarete; label: string }[] = [
  { value: 'commun',     label: 'Commun' },
  { value: 'rare',       label: 'Rare' },
  { value: 'epique',     label: 'Épique' },
  { value: 'legendaire', label: 'Légendaire' },
  { value: 'shiny',      label: 'Shiny ✨' },
]

type Props = {
  filter: FilterState
  onChange: (f: FilterState) => void
}

export function Filters({ filter, onChange }: Props) {
  const mainTabs = [
    { key: 'all',     label: 'Toutes' },
    { key: 'rarity',  label: 'Rareté' },
    { key: 'records', label: 'Records' },
  ] as const

  return (
    <div className="px-4 mt-3 flex flex-col gap-2">
      {/* Onglets principaux */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {mainTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange({
              mode: tab.key,
              rarity: tab.key === 'rarity' ? filter.rarity : null,
            })}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200
              ${filter.mode === tab.key
                ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sous-filtres rareté */}
      {filter.mode === 'rarity' && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {RARITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({
                mode: 'rarity',
                rarity: filter.rarity === opt.value ? null : opt.value,
              })}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors duration-200
                ${filter.rarity === opt.value
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/5 border-white/8 text-slate-500 hover:text-slate-300'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
