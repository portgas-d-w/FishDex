'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Square } from 'lucide-react'
import { endSession } from '@/lib/sessions/actions'

export function EndSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleEnd() {
    startTransition(async () => {
      await endSession(sessionId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleEnd}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-semibold disabled:opacity-50"
    >
      <Square size={14} fill="currentColor" />
      {isPending ? 'Fermeture…' : 'Fin de session'}
    </button>
  )
}
