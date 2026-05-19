'use client'

import { haptic } from '@/lib/haptics'

type Props = {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
}

export function ToggleSwitch({ checked, onChange, label }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => { haptic('light'); onChange(!checked) }}
      className={`relative w-12 h-6 rounded-full border transition-all duration-300 shrink-0
        ${checked
          ? 'bg-cyan-500/30 border-cyan-400/60 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
          : 'bg-white/5 border-white/15'
        }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow-md
          ${checked
            ? 'left-[calc(100%-1.375rem)] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
            : 'left-0.5 bg-slate-500'
          }`}
      />
    </button>
  )
}
