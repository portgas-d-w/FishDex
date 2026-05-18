'use client'

import { useState, useTransition } from 'react'
import { Users, X, Send } from 'lucide-react'
import { createPost } from '@/app/actions/fishfeed'
import { useRouter } from 'next/navigation'

type Props = {
  catchId?: string
  sessionId?: string
  type: 'capture' | 'session' | 'memory'
  hasAccess: boolean
}

export function ShareToFeedButton({ catchId, sessionId, type, hasAccess }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!hasAccess) return null

  function handleShare() {
    startTransition(async () => {
      const { post_id, error } = await createPost({
        catch_id: catchId,
        session_id: sessionId,
        type,
        caption: caption.trim() || undefined,
      })
      if (error) return
      if (post_id) {
        setDone(true)
        setOpen(false)
        setTimeout(() => router.push('/fishfeed'), 400)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-white/8 transition-colors"
      >
        <Users size={14} />
        {done ? 'Partagé !' : 'Partager'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl bg-[#111820] border border-white/10 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
                Partager au FishFeed
              </p>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60">
                <X size={16} />
              </button>
            </div>

            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Ajoute quelques mots… (optionnel)"
              rows={3}
              maxLength={280}
              className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 resize-none"
            />
            <p className="text-[10px] text-white/20 text-right -mt-2">{caption.length}/280</p>

            <p className="text-[11px] text-white/25 leading-relaxed">
              Les commentaires et le partage externe sont désactivés.
              Seules 7 réactions contemplatives sont disponibles.
            </p>

            <button
              onClick={handleShare}
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400/15 border border-cyan-400/25 text-cyan-400 font-semibold text-sm disabled:opacity-40 transition-opacity"
            >
              <Send size={14} />
              {pending ? 'Publication…' : 'Publier'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
