import Link from 'next/link'
import { Users, Lock, ArrowRight } from 'lucide-react'
import type { FeedPost } from '@/app/actions/fishfeed'
import { REACTION_EMOJIS } from '@/lib/fishfeed/constants'

type Props = {
  hasAccess: boolean
  catchCount: number
  required: number
  previewPosts: FeedPost[]
}

export function FishFeedWidget({ hasAccess, catchCount, required, previewPosts }: Props) {
  if (!hasAccess) {
    return (
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">FishFeed</p>
          <Lock size={12} className="text-white/20" />
        </div>
        <p className="text-sm text-white/40">
          Enregistre ta première capture pour accéder à la communauté.
        </p>
      </div>
    )
  }

  if (previewPosts.length === 0) {
    return (
      <Link href="/fishfeed" className="block rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:bg-white/8 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">FishFeed</p>
          <ArrowRight size={14} className="text-white/25" />
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-white/20" />
          <p className="text-sm text-white/40 italic">Sois le premier à partager une prise</p>
        </div>
      </Link>
    )
  }

  const latest = previewPosts.slice(0, 2)

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">FishFeed</p>
        <Link href="/fishfeed" className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
          Voir tout
          <ArrowRight size={11} />
        </Link>
      </div>

      <div className="space-y-3">
        {latest.map(post => {
          const totalReactions = Object.values(post.reactions).reduce((s, r) => s + r.count, 0)
          const topReactions = REACTION_EMOJIS
            .filter(({ key }) => post.reactions[key].count > 0)
            .sort((a, b) => post.reactions[b.key].count - post.reactions[a.key].count)
            .slice(0, 3)

          return (
            <Link key={post.id} href="/fishfeed" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/20 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-cyan-400">
                  {post.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-semibold text-white">{post.username}</p>
                  {post.species_nom && (
                    <span className="text-[10px] text-white/35">· {post.species_nom}</span>
                  )}
                </div>
                {post.caption && (
                  <p className="text-xs text-white/50 truncate">{post.caption}</p>
                )}
                {totalReactions > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {topReactions.map(({ key, emoji }) => (
                      <span key={key} className="text-xs">{emoji}</span>
                    ))}
                    <span className="text-[10px] text-white/25">{totalReactions}</span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
