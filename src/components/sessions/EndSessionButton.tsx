'use client'

import Link from 'next/link'
import { Square } from 'lucide-react'

export function EndSessionButton({ sessionId }: { sessionId: string }) {
  return (
    <Link
      href={`/sessions/${sessionId}/fin`}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-semibold"
    >
      <Square size={14} fill="currentColor" />
      Fin de session
    </Link>
  )
}
