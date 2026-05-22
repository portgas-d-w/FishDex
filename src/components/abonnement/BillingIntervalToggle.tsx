'use client'

import type { BillingInterval } from '@/lib/stripe/client'

type Props = {
  value: BillingInterval
  onChange: (value: BillingInterval) => void
}

export function BillingIntervalToggle({ value, onChange }: Props) {
  return (
    <div className="mx-auto inline-flex p-1 rounded-full bg-white/5 border border-white/10">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
          value === 'monthly'
            ? 'bg-cyan-500 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Mensuel
      </button>
      <button
        type="button"
        onClick={() => onChange('yearly')}
        className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors inline-flex items-center gap-1.5 ${
          value === 'yearly'
            ? 'bg-cyan-500 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Annuel
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            value === 'yearly'
              ? 'bg-white/20 text-white'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}
        >
          -2 mois
        </span>
      </button>
    </div>
  )
}
