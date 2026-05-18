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

  function handleToggle(key: ReactionKey) {
    if (pending) return

    // Optimistic update
    const current = reactions[key]
    setReactions(prev => ({
      ...prev,
      [key]: {
        count:          current.userHasReacted ? current.count - 1 : current.count + 1,
        userHasReacted: !current.userHasReacted,
      },
    }))

    startTransition(async () => {
      const { userHasReacted, error } = await toggleReaction(postId, key)
      if (error) {
        // Rollback
        setReactions(prev => ({
          ...prev,
          [key]: {
            count:          current.count,
            userHasReacted: current.userHasReacted,
          },
        }))
      } else {
        // Sync avec la vraie valeur
        setReactions(prev => ({
          ...prev,
          [key]: {
            count:          userHasReacted ? prev[key].count : Math.max(0, prev[key].count),
            userHasReacted,
          },
        }))
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {REACTION_EMOJIS.map(({ key, emoji, label }) => {
        const r = reactions[key]
        const active = r.userHasReacted
        return (
          <button
            key={key}
            onClick={() => handleToggle(key)}
            title={label}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all active:scale-95 ${
              active
                ? 'bg-cyan-400/12 border-cyan-400/30 text-white'
                : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white/70'
            }`}
          >
            <span className="text-sm leading-none">{emoji}</span>
            {r.count > 0 && (
              <span className={`font-semibold leading-none ${active ? 'text-cyan-400' : ''}`}>
                {r.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
