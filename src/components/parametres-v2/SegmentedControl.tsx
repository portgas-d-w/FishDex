'use client'

type Option = {
  value: string
  label: string
  disabled?: boolean
}

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl bg-white/5 border border-white/10 p-0.5 shrink-0">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => !opt.disabled && onChange(opt.value)}
          disabled={opt.disabled}
          className={`relative px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200
            ${value === opt.value
              ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
              : opt.disabled
                ? 'text-slate-700 cursor-not-allowed'
                : 'text-slate-400 hover:text-slate-300'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
