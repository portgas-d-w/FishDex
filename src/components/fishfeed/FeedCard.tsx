'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Flag } from 'lucide-react'
import { reportPost, type FeedPost } from '@/app/actions/fishfeed'
import { ReactionBar } from './ReactionBar'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1)   return 'À l\'instant'
  if (h < 24)  return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d < 7)   return `Il y a ${d}j`
  const w = Math.floor(d / 7)
  return `Il y a ${w} sem.`
}

export function FeedCard({
  post,
  currentUserId,
  onReported,
}: {
  post: FeedPost
  currentUserId: string
  onReported: () => void
}) {
  const [reported, setReported] = useState(false)
  const [showReportConfirm, setShowReportConfirm] = useState(false)
  const isOwnPost = post.user_id === currentUserId

  async function handleReport() {
    await reportPost(post.id)
    setReported(true)
    setShowReportConfirm(false)
    setTimeout(onReported, 600)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const photoSrc = post.photo_url
    ? `${supabaseUrl}/storage/v1/object/public/catches/${post.photo_url}`
    : null

  return (
    <div className={`rounded-2xl bg-white/5 border border-white/8 overflow-hidden transition-opacity duration-500 ${reported ? 'opacity-0' : ''}`}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/20 flex items-center justify-center shrink-0 overflow-hidden">
            {post.avatar_url ? (
              <Image src={post.avatar_url} alt={post.username} width={32} height={32} className="object-cover" />
            ) : (
              <span className="text-[11px] font-bold text-cyan-400">{post.username.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">{post.username}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        {!isOwnPost && !reported && (
          <div className="relative">
            <button
              onClick={() => setShowReportConfirm(v => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-white/15 hover:text-white/30 transition-colors"
              aria-label="Signaler"
            >
              <Flag size={12} />
            </button>
            {showReportConfirm && (
              <div className="absolute right-0 top-8 z-10 bg-[#111820] border border-white/10 rounded-xl p-3 w-44 shadow-xl">
                <p className="text-xs text-white/70 mb-2">Signaler ce post ?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReport}
                    className="flex-1 py-1.5 rounded-lg bg-red-400/15 border border-red-400/20 text-red-400 text-xs font-semibold"
                  >
                    Signaler
                  </button>
                  <button
                    onClick={() => setShowReportConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo */}
      {photoSrc && (
        <div className="relative w-full aspect-[4/3] bg-black/30">
          <Image
            src={photoSrc}
            alt={post.species_nom ?? 'Capture'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          {post.species_nom && (
            <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
              <p className="text-xs font-semibold text-white">{post.species_nom}</p>
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pt-3">
          <p className="text-sm text-white/75 leading-relaxed">{post.caption}</p>
        </div>
      )}

      {/* Reactions */}
      <div className="px-4 py-3">
        <ReactionBar postId={post.id} initialReactions={post.reactions} />
      </div>
    </div>
  )
}
