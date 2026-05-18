'use client'

import { useState, useTransition } from 'react'
import { toggleReaction, type FeedPost } from '@/app/actions/fishfeed'
import { REACTION_EMOJIS, type ReactionKey } from '@/lib/fishfeed/constants'

type Props = {
  postId: string
  initialReactions: FeedPost['reactions']
}

export function ReactionBar({ postId, initialReactions }: Props) {
  const [reactions, setReactions] = useState(initialReactions)
  const [pending, startTransition] = useTransition()

  // Réaction actuellement sélectionnée par l'user (au plus 1)
  const currentKey = (Object.entries(reactions).find(([, r]) => r.userHasReacted)?.[0] ?? null) as ReactionKey | null

  function handleToggle(key: ReactionKey) {
    if (pending) return

    // Snapshot pour rollback
    const snapshot = { ...reactions }

    // Optimistic update
    setReactions(prev => {
      const next = { ...prev } as FeedPost['reactions']
      // Retirer l'ancienne réaction si différente
      if (currentKey && currentKey !== key) {
        next[currentKey] = { count: Math.max(0, prev[currentKey].count - 1), userHasReacted: false }
      }
      // Toggler la nouvelle
      if (currentKey === key) {
        next[key] = { count: Math.max(0, prev[key].count - 1), userHasReacted: false }
      } else {
        next[key] = { count: prev[key].count + 1, userHasReacted: true }
      }
      return next
    })

    startTransition(async () => {
      const { selected, previous, error } = await toggleReaction(postId, key)
      if (error) {
        // Rollback
        setReactions(snapshot)
        return
      }
      // Sync état final (évite dérive avec les counts)
      setReactions(prev => {
        const next = { ...prev } as FeedPost['reactions']
        if (previous && previous !== selected) {
          next[previous] = { ...prev[previous], userHasReacted: false }
        }
        if (selected) {
          next[selected] = { ...prev[selected], userHasReacted: true }
        } else if (previous) {
          next[previous] = { ...prev[previous], userHasReacted: false }
        }
        return next
      })
    })
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {(REACTION_EMOJIS as readonly { key: ReactionKey; emoji: string; label: string }[]).map(({ key, emoji, label }) => {
        const r = reactions[key]
        const active = r.userHasReacted
        const isOtherSelected = !active && currentKey !== null
        return (
          <button
            key={key}
            onClick={() => handleToggle(key)}
            title={label}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all active:scale-95 ${
              active
                ? 'bg-cyan-400/12 border-cyan-400/30 text-white'
                : isOtherSelected
                  ? 'bg-white/3 border-white/6 text-white/30 hover:text-white/50 hover:bg-white/6'
                  : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white/70'
            }`}
          >
            <span className={`text-sm leading-none transition-transform ${active ? 'scale-110' : ''}`}>{emoji}</span>
            {r.count > 0 && (
              <span className={`font-semibold leading-none ${active ? 'text-cyan-400' : 'text-white/40'}`}>
                {r.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
