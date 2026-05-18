'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Flag, Trash2, Droplets } from 'lucide-react'
import { reportPost, deletePost, type FeedPost } from '@/app/actions/fishfeed'
import { ReactionBar } from './ReactionBar'

const RARETE_BADGE: Record<string, string> = {
  commun:     'bg-white/10 text-slate-300 border-white/15',
  rare:       'bg-blue-400/15 text-blue-300 border-blue-400/25',
  epique:     'bg-purple-500/15 text-purple-300 border-purple-500/25',
  legendaire: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
  mirage:     'bg-gradient-to-r from-amber-400/15 via-pink-400/15 to-purple-500/15 text-pink-300 border-pink-400/25',
}
const RARETE_LABEL: Record<string, string> = {
  commun: 'Commun', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire', mirage: '✦ Mirage',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1)  return 'À l\'instant'
  if (h < 24) return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d < 7)  return `Il y a ${d}j`
  return `Il y a ${Math.floor(d / 7)} sem.`
}

export function FeedCard({
  post,
  currentUserId,
  onReported,
  onDeleted,
}: {
  post: FeedPost
  currentUserId: string
  onReported: () => void
  onDeleted: () => void
}) {
  const [gone, setGone] = useState(false)
  const [showReportConfirm, setShowReportConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pending, startTransition] = useTransition()
  const isOwnPost = post.user_id === currentUserId

  function handleReport() {
    startTransition(async () => {
      await reportPost(post.id)
      setGone(true)
      setShowReportConfirm(false)
      setTimeout(onReported, 600)
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const { success } = await deletePost(post.id)
      if (success) {
        setGone(true)
        setShowDeleteConfirm(false)
        setTimeout(onDeleted, 600)
      }
    })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const photoSrc = post.photo_url
    ? `${supabaseUrl}/storage/v1/object/public/catches/${post.photo_url}`
    : null

  const rarete = post.rarete ?? 'commun'
  const raretyBadge = RARETE_BADGE[rarete] ?? RARETE_BADGE.commun
  const raretyLabel = RARETE_LABEL[rarete] ?? rarete

  const hasStats = post.poids_kg || post.taille_cm || post.released

  return (
    <div className={`rounded-2xl bg-white/5 border border-white/8 overflow-hidden transition-opacity duration-500 ${gone ? 'opacity-0' : ''}`}>

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

        {/* Actions : supprimer (own) ou signaler (other) */}
        <div className="relative">
          {isOwnPost ? (
            <>
              <button
                onClick={() => setShowDeleteConfirm(v => !v)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/15 hover:text-red-400/50 transition-colors"
                aria-label="Supprimer"
              >
                <Trash2 size={13} />
              </button>
              {showDeleteConfirm && (
                <div className="absolute right-0 top-8 z-10 bg-[#111820] border border-white/10 rounded-xl p-3 w-44 shadow-xl">
                  <p className="text-xs text-white/70 mb-2">Supprimer ce post ?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={pending}
                      className="flex-1 py-1.5 rounded-lg bg-red-400/15 border border-red-400/20 text-red-400 text-xs font-semibold disabled:opacity-40"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
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
                      disabled={pending}
                      className="flex-1 py-1.5 rounded-lg bg-red-400/15 border border-red-400/20 text-red-400 text-xs font-semibold disabled:opacity-40"
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
            </>
          )}
        </div>
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
          {/* Espèce + rareté */}
          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
            {post.species_nom && (
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <p className="text-xs font-semibold text-white">{post.species_nom}</p>
              </div>
            )}
            {post.rarete && post.rarete !== 'commun' && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-sm ${raretyBadge}`}>
                {raretyLabel}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats prise (poids, taille, no-kill) */}
      {hasStats && (
        <div className="flex items-center gap-3 px-4 pt-3">
          {post.poids_kg && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">{post.poids_kg} kg</span>
            </div>
          )}
          {post.taille_cm && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">{post.taille_cm} cm</span>
            </div>
          )}
          {post.released && (
            <div className="flex items-center gap-1 ml-auto">
              <Droplets size={11} className="text-cyan-400" />
              <span className="text-[10px] font-semibold text-cyan-400">No-kill</span>
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pt-2">
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
