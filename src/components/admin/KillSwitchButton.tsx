'use client'

import { useTransition } from 'react'
import { toggleClaudeVision } from '@/app/actions/ai-dashboard'

export function KillSwitchButton({ enabled }: { enabled: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(() => { toggleClaudeVision(!enabled) })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40 ${
        enabled
          ? 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25'
          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
      }`}
    >
      {isPending ? '…' : enabled ? 'Désactiver' : 'Réactiver'}
    </button>
  )
}
