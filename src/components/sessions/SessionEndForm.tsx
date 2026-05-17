'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import { endSession } from '@/app/actions/sessions'
import { RessentiPicker } from './RessentiPicker'
import { PhotoAmbianceUpload } from './PhotoAmbianceUpload'
import type { RESSENTI_OPTIONS } from '@/lib/sessions/types'

type RessentiValue = typeof RESSENTI_OPTIONS[number]['value']

export function SessionEndForm({
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
  const [ressenti, setRessenti] = useState<RessentiValue | null>(null)
  const [notes, setNotes]       = useState(initialNotes ?? '')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)

  function handleSave() {
    startTransition(async () => {
      const result = await endSession({
        session_id:        sessionId,
        ressenti:          ressenti  ?? undefined,
        notes:             notes     || undefined,
        photo_ambiance_url: photoUrl ?? undefined,
      })
      if (result.error) setError(result.error)
      else { router.push(`/sessions/${sessionId}`); router.refresh() }
    })
  }

  return (
    <div className="space-y-4">
      {/* Ressenti */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Comment tu te sens ?
        </p>
        <RessentiPicker value={ressenti} onChange={v => setRessenti(v as RessentiValue | null)} />
      </div>

      {/* Note */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Une note pour te souvenir
        </p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          placeholder="Une phrase, une sensation…"
          className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 italic outline-none resize-none"
        />
      </div>

      {/* Photo */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Photo d&apos;ambiance
        </p>
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
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-4 text-base font-bold text-[#0a0f14] disabled:opacity-50 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
      >
        <Save size={18} />
        {isPending ? 'Enregistrement…' : 'Enregistrer le souvenir'}
      </button>
    </div>
  )
}
