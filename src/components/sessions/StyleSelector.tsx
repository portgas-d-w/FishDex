'use client'

const STYLES = [
  { value: 'carnassiers', label: 'Carnassiers' },
  { value: 'carpe',       label: 'Carpe'       },
  { value: 'truite',      label: 'Truite'      },
  { value: 'mouche',      label: 'Mouche'      },
  { value: 'feeder',      label: 'Feeder'      },
  { value: 'mer',         label: 'Mer'         },
  { value: 'autre',       label: 'Autre'       },
]

export function StyleSelector({
  value,
  onChange,
}: {
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLES.map(s => {
        const active = value === s.value
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(active ? null : s.value)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
              active
                ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
                : 'bg-white/4 border-white/10 text-white/60 hover:bg-white/8'
            }`}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
