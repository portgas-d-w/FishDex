'use client'

import { INTENTION_OPTIONS } from '@/lib/sessions/types'

type IntentionValue = typeof INTENTION_OPTIONS[number]['value']

export function IntentionSelector({
  value,
  onChange,
}: {
  value: IntentionValue | null
  onChange: (v: IntentionValue | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {INTENTION_OPTIONS.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? null : opt.value as IntentionValue)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              active
                ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
                : 'bg-white/4 border-white/10 text-white/60 hover:bg-white/8'
            }`}
          >
            <span className="text-sm leading-none">{opt.emoji}</span>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
