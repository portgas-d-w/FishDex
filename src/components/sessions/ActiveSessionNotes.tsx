'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { updateSessionNotes } from '@/lib/sessions/actions'
import { VoiceNoteButton } from './VoiceNoteButton'

export function ActiveSessionNotes({
  sessionId,
  initialNotes,
  isLegende,
}: {
  sessionId: string
  initialNotes: string | null
  isLegende: boolean
}) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      await updateSessionNotes(sessionId, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  function handleTranscription(text: string) {
    setNotes(prev => prev ? `${prev} ${text}` : text)
    setSaved(false)
  }

  return (
    <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Notes en direct</p>
        {isLegende && (
          <VoiceNoteButton isLegende={isLegende} onTranscription={handleTranscription} />
        )}
      </div>
      <textarea
        value={notes}
        onChange={e => { setNotes(e.target.value); setSaved(false) }}
        rows={3}
        placeholder="Tes observations, conditions, ressentis…"
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-cyan-400/40 transition-colors"
      />
      <div className="flex items-center justify-end mt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-400/20 transition-colors disabled:opacity-50"
        >
          {saved ? <><Check size={12} /> Sauvegardé</> : isPending ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
