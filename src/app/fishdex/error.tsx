'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function FishDexError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0a0f14]">
      <p className="text-5xl mb-6">📖</p>
      <h2 className="text-xl font-semibold text-white mb-2">
        L&apos;encyclopédie est temporairement indisponible
      </h2>
      <p className="text-sm text-white/50 mb-8 max-w-xs leading-relaxed">
        Les espèces reviendront dans un instant.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-colors active:scale-95"
      >
        <RefreshCw size={14} />
        Réessayer
      </button>
    </div>
  )
}
