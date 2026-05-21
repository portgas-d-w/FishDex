'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, RotateCcw, FileText } from 'lucide-react'
import { endSession } from '@/app/actions/sessions'
import { RESSENTI_OPTIONS } from '@/lib/sessions/types'
import { PhotoAmbianceUpload } from './PhotoAmbianceUpload'

export function EndSessionForm({
  sessionId,
  userId,
  initialNotes,
}: {
  sessionId: string
  userId: string
  initialNotes: string | null
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [ressenti, setRessenti] = useState<string | null>(null)
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [title, setTitle] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    startTransition(async () => {
      const result = await endSession({
        session_id:         sessionId,
        ressenti:           ressenti  ?? undefined,
        notes:              notes     || undefined,
        title:              title     || undefined,
        photo_ambiance_url: photoUrl  ?? undefined,
      })
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/sessions/${sessionId}`)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">

      {/* Ressenti */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Comment tu te sens ?
        </p>
        <div className="flex flex-wrap gap-2">
          {RESSENTI_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRessenti(r => r === opt.value ? null : opt.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${
                ressenti === opt.value
                  ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
                  : 'bg-white/4 border-white/10 text-white/60 hover:bg-white/8'
              }`}
            >
              <span className="text-base leading-none">{opt.emoji}</span>
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Titre */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Titre de la session
        </p>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
          placeholder="Ex : Étang des Saules — belle journée"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/10 pb-1.5 focus:border-cyan-400/40 transition-colors"
        />
      </div>

      {/* Notes */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div className="flex items-center gap-1.5 mb-3">
          <FileText size={12} className="text-cyan-400" />
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Notes de session</p>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          placeholder="Tes observations, ressentis, conditions particulières…"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-cyan-400/40 transition-colors"
        />
      </div>

      {/* Photo d'ambiance */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Photo d&apos;ambiance</p>
        <PhotoAmbianceUpload
          sessionId={sessionId}
          userId={userId}
          value={photoUrl}
          onChange={setPhotoUrl}
        />
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-xs text-red-400 text-center px-4">{error}</p>
      )}

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-4 text-base font-bold text-[#0a0f14] disabled:opacity-50 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
        >
          <Save size={18} />
          {isPending ? 'Enregistrement…' : 'Enregistrer la Session'}
        </button>

        <Link
          href={`/sessions/${sessionId}`}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/8 transition-colors py-3.5 text-sm font-semibold text-white/60 hover:text-white"
        >
          <RotateCcw size={14} />
          Reprendre la session
        </Link>
      </div>
    </div>
  )
}
