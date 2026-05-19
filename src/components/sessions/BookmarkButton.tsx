'use client'

import { useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { toggleBookmark } from '@/lib/sessions/actions'
import { haptic } from '@/lib/haptics'

export function BookmarkButton({
  sessionId,
  isBookmarked,
}: {
  sessionId: string
  isBookmarked: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => { haptic('light'); startTransition(() => toggleBookmark(sessionId, isBookmarked)) }}
      disabled={isPending}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 border border-white/10 hover:border-white/25 transition-colors disabled:opacity-50"
      aria-label={isBookmarked ? 'Retirer des favoris' : 'Mettre en favori'}
    >
      <Bookmark
        size={14}
        className={isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-white/40'}
      />
    </button>
  )
}
