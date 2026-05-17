'use client'

import { RESSENTI_OPTIONS } from '@/lib/sessions/types'

type RessentiValue = typeof RESSENTI_OPTIONS[number]['value']

export function RessentiPicker({
  value,
  onChange,
}: {
  value: RessentiValue | null
  onChange: (v: RessentiValue | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {RESSENTI_OPTIONS.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? null : opt.value as RessentiValue)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
              active
                ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300 ring-1 ring-cyan-400/30'
                : 'bg-white/4 border-white/10 text-white/60 hover:bg-white/8 hover:border-white/20'
            }`}
          >
            <span className="text-base leading-none">{opt.emoji}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
