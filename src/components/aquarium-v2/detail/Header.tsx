'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, MoreHorizontal } from 'lucide-react'

export function DetailHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <button
        onClick={() => router.back()}
        aria-label="Retour"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/8 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors active:scale-95"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        aria-label="Plus d'options"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/8 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors active:scale-95"
      >
        <MoreHorizontal size={20} />
      </button>
    </div>
  )
}
