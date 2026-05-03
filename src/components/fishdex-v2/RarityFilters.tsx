'use client'

import type { Rarete } from '@/types/fishdex'

type Props = {
  active: Rarete | 'toutes'
  onChange: (r: Rarete | 'toutes') => void
}

const FILTERS: { value: Rarete | 'toutes'; label: string; dot?: string; active: string; shadow?: string }[] = [
  {
    value: 'toutes',
    label: 'Toutes',
    active: 'bg-cyan-400 text-slate-900 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]',
  },
  {
    value: 'commun',
    label: 'Commun',
    dot: 'bg-emerald-400',
    active: 'bg-emerald-400 text-slate-900 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]',
  },
  {
    value: 'rare',
    label: 'Rare',
    dot: 'bg-blue-400',
    active: 'bg-blue-400 text-slate-900 border-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]',
  },
  {
    value: 'epique',
    label: 'Épique',
    dot: 'bg-purple-500',
    active: 'bg-purple-500 text-white border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
  },
  {
    value: 'legendaire',
    label: 'Légendaire',
    dot: 'bg-amber-400',
    active: 'bg-amber-400 text-slate-900 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]',
  },
  {
    value: 'shiny',
    label: 'Shiny ✨',
    active: 'bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 text-white border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.5)]',
  },
]

export function RarityFilters({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 px-4 scrollbar-none snap-x">
      {FILTERS.map((f) => {
        const isActive = active === f.value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200
              ${isActive
                ? f.active
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white backdrop-blur-sm'
              }`}
          >
            {f.dot && (
              <span className={`w-2 h-2 rounded-full shrink-0 ${f.dot}`} />
            )}
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
