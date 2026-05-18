'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Fish, FileText } from 'lucide-react'
import { createPost } from '@/app/actions/fishfeed'

type RecentCatch = {
  id: string
  species_nom: string | null
  photo_url: string | null
  created_at: string
}

export function CreatePostButton({ recentCatches }: { recentCatches: RecentCatch[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedCatchId, setSelectedCatchId] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [pending, startTransition] = useTransition()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  function reset() {
    setOpen(false)
    setSelectedCatchId(null)
    setCaption('')
  }

  function handlePublish() {
    startTransition(async () => {
      const { post_id, error } = await createPost({
        catch_id:   selectedCatchId ?? undefined,
        type:       selectedCatchId ? 'capture' : 'memory',
        caption:    caption.trim() || undefined,
      })
      if (error || !post_id) return
      reset()
      router.refresh()
    })
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.5)] hover:bg-cyan-300 transition-all active:scale-95"
        aria-label="Nouvelle publication"
      >
        <Plus size={24} strokeWidth={2.5} className="text-[#0a0f14]" />
      </button>

      {/* Bottom-sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={reset}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl bg-[#111820] border border-white/10 p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
                Nouvelle publication
              </p>
              <button onClick={reset} className="text-white/30 hover:text-white/60 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Sélection capture (optionnel) */}
            {recentCatches.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-white/40">Rattacher une capture <span className="text-white/20">(optionnel)</span></p>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {/* Option "texte seul" */}
                  <button
                    onClick={() => setSelectedCatchId(null)}
                    className={`shrink-0 flex flex-col items-center gap-1.5 w-16 rounded-xl p-2 border transition-colors ${
                      selectedCatchId === null
                        ? 'bg-cyan-400/12 border-cyan-400/30'
                        : 'bg-white/4 border-white/8 hover:bg-white/8'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center">
                      <FileText size={16} className="text-white/40" />
                    </div>
                    <span className="text-[9px] text-white/40 leading-tight text-center">Texte seul</span>
                  </button>

                  {recentCatches.map(c => {
                    const selected = selectedCatchId === c.id
                    const imgSrc = c.photo_url
                      ? `${supabaseUrl}/storage/v1/object/public/catches/${c.photo_url}`
                      : null
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCatchId(c.id)}
                        className={`shrink-0 flex flex-col items-center gap-1.5 w-16 rounded-xl p-2 border transition-colors ${
                          selected
                            ? 'bg-cyan-400/12 border-cyan-400/30'
                            : 'bg-white/4 border-white/8 hover:bg-white/8'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-black/30 overflow-hidden flex items-center justify-center">
                          {imgSrc
                            ? <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                            : <Fish size={16} className="text-white/20" />
                          }
                        </div>
                        <span className="text-[9px] text-white/50 leading-tight text-center truncate w-full">
                          {c.species_nom ?? '?'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Caption */}
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder={selectedCatchId ? 'Ajoute quelques mots sur cette prise…' : 'Partage un moment, une réflexion…'}
              rows={3}
              maxLength={280}
              className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 resize-none"
            />
            <p className="text-[10px] text-white/20 text-right -mt-2">{caption.length}/280</p>

            {/* Disclaimer */}
            <p className="text-[11px] text-white/20 leading-relaxed">
              Pas de commentaires · Pas de partage externe · 7 réactions contemplatives uniquement
            </p>

            {/* Submit */}
            <button
              onClick={handlePublish}
              disabled={pending || (!selectedCatchId && !caption.trim())}
              className="w-full py-3 rounded-xl bg-cyan-400 text-[#0a0f14] font-bold text-sm disabled:opacity-40 transition-opacity active:scale-[0.98]"
            >
              {pending ? 'Publication…' : 'Publier'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
