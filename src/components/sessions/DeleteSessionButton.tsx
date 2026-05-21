'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteSession } from '@/app/actions/sessions'

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [progress, setProgress] = useState(0)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)
  const THRESHOLD = 700

  function startPress() {
    startRef.current = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / THRESHOLD) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        cancelPress()
        startTransition(async () => {
          const result = await deleteSession(sessionId)
          if (result.success) router.push('/sessions')
        })
      }
    }, 16)
  }

  function cancelPress() {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(0)
  }

  return (
    <button
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      disabled={isPending}
      aria-label="Maintenir pour supprimer"
      className="relative flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400 transition-colors overflow-hidden rounded disabled:opacity-50 select-none"
    >
      {progress > 0 && (
        <span
          className="absolute inset-0 bg-red-500/20 rounded origin-left transition-none"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      )}
      <Trash2 size={12} className="relative" />
      <span className="relative">{isPending ? 'Suppression…' : 'Maintenir pour supprimer'}</span>
    </button>
  )
}
