'use client'

import { useState } from 'react'
import type { FeedPost } from '@/app/actions/fishfeed'
import { FeedCard } from './FeedCard'

export function FeedList({
  initialPosts,
  currentUserId,
}: {
  initialPosts: FeedPost[]
  currentUserId: string
}) {
  const [posts, setPosts] = useState(initialPosts)

  function removePost(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <p className="text-4xl mb-4">🎣</p>
        <p className="text-white/50 text-sm">
          Le feed est vide pour l&apos;instant.<br />
          Partage ta prochaine prise !
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 space-y-4">
      {posts.map(post => (
        <FeedCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onReported={() => removePost(post.id)}
        />
      ))}
    </div>
  )
}
