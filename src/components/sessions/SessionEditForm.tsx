'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, MapPin } from 'lucide-react'
import { updateSession } from '@/app/actions/sessions'
import { RessentiPicker } from './RessentiPicker'
import { PhotoAmbianceUpload } from './PhotoAmbianceUpload'
import type { RESSENTI_OPTIONS } from '@/lib/sessions/types'

type RessentiValue = typeof RESSENTI_OPTIONS[number]['value']

type Props = {
  sessionId: string
  userId: string
  initialTitle: string | null
  initialNotes: string | null
  initialRessenti: string | null
  initialPhotoUrl: string | null
  spotNom: string | null
}

export function SessionEditForm({
  sessionId, userId, initialTitle, initialNotes, initialRessenti, initialPhotoUrl, spotNom,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [title,    setTitle]    = useState(initialTitle    ?? '')
  const [notes,    setNotes]    = useState(initialNotes    ?? '')
  const [ressenti, setRessenti] = useState<RessentiValue | null>(initialRessenti as RessentiValue | null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl)

  function handleSave() {
    startTransition(async () => {
      const result = await updateSession(sessionId, {
        title:             title     || undefined,
        notes:             notes     || undefined,
        ressenti:          ressenti  ?? undefined,
        photo_ambiance_url: photoUrl ?? undefined,
      } as Parameters<typeof updateSession>[1])
      if (result.error) setError(result.error)
      else { router.push(`/sessions/${sessionId}`); router.refresh() }
    })
  }

  return (
    <div className="space-y-4">
      {/* Spot (lecture seule) */}
      {spotNom && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">Spot</p>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-white/30 shrink-0" />
            <p className="text-sm text-white/70">{spotNom}</p>
          </div>
        </div>
      )}

      {/* Titre */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Titre</p>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
          placeholder="Ex : Étang des Saules — belle journée"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/20 outline-none border-b border-white/10 pb-1.5 focus:border-cyan-400/40 transition-colors"
        />
      </div>

      {/* Ressenti */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Ressenti</p>
        <RessentiPicker value={ressenti} onChange={v => setRessenti(v as RessentiValue | null)} />
      </div>

      {/* Notes */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={5}
          placeholder="Une phrase, une sensation…"
          className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 italic outline-none resize-none"
        />
      </div>

      {/* Photo */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Photo d&apos;ambiance</p>
        <PhotoAmbianceUpload
          sessionId={sessionId}
          userId={userId}
          value={photoUrl}
          onChange={setPhotoUrl}
        />
      </div>

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-4 text-base font-bold text-[#0a0f14] disabled:opacity-50 shadow-[0_0_24px_rgba(34,211,238,0.3)]"
      >
        <Save size={18} />
        {isPending ? 'Sauvegarde…' : 'Sauvegarder les modifications'}
      </button>
    </div>
  )
}
