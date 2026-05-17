'use client'

import { useTransition, useState } from 'react'
import { Check } from 'lucide-react'
import { updateSessionNotes } from '@/lib/sessions/actions'

export function SessionNotesEditor({
  sessionId,
  initialNotes,
  readonly,
}: {
  sessionId: string
  initialNotes: string | null
  readonly?: boolean
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

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setSaved(false) }}
        disabled={readonly}
        rows={4}
        placeholder="Tes observations, ressentis, conditions particulières…"
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-cyan-400/40 transition-colors disabled:opacity-50"
      />
      {!readonly && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-400/20 transition-colors disabled:opacity-50"
          >
            {saved ? <><Check size={12} /> Sauvegardé</> : isPending ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      )}
    </div>
  )
}
