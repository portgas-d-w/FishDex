'use client'

import { useState, useTransition } from 'react'
import { Fish, Plus, Check } from 'lucide-react'
import { attachCaptureToSession } from '@/app/actions/sessions'

type OrphanCatch = {
  id: string
  created_at: string
  species_nom: string | null
  taille_cm: number | null
  poids_kg: number | null
  lieu: string | null
}

export function AttachOrphanCatches({
  sessionId,
  catches,
}: {
  sessionId: string
  catches: OrphanCatch[]
}) {
  const [attached, setAttached] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  if (catches.length === 0) return null

  function attach(catchId: string) {
    startTransition(async () => {
      const { success } = await attachCaptureToSession(catchId, sessionId)
      if (success) setAttached(prev => new Set([...prev, catchId]))
    })
  }

  const remaining = catches.filter(c => !attached.has(c.id))
  if (remaining.length === 0) return null

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Fish size={13} className="text-cyan-400 shrink-0" />
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
          Captures à rattacher
        </p>
      </div>
      <p className="text-xs text-white/35 mb-3">
        Ces captures sans session sont proches de cette date.
      </p>
      <div className="space-y-2">
        {remaining.map(c => {
          const dateStr = new Date(c.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short',
          })
          const detail = [
            c.taille_cm ? `${c.taille_cm} cm` : null,
            c.poids_kg  ? `${c.poids_kg} kg`  : null,
          ].filter(Boolean).join(' · ')

          return (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white/4 border border-white/8 px-3 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {c.species_nom ?? 'Espèce inconnue'}
                </p>
                <p className="text-[11px] text-white/35">
                  {dateStr}{detail ? ` · ${detail}` : ''}{c.lieu ? ` · ${c.lieu}` : ''}
                </p>
              </div>
              <button
                onClick={() => attach(c.id)}
                disabled={pending}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold disabled:opacity-40 transition-opacity hover:bg-cyan-400/15 shrink-0"
              >
                <Plus size={11} />
                Rattacher
              </button>
            </div>
          )
        })}
      </div>
      {attached.size > 0 && (
        <p className="text-[11px] text-white/30 mt-3 flex items-center gap-1">
          <Check size={10} className="text-emerald-400" />
          {attached.size} capture{attached.size > 1 ? 's' : ''} rattachée{attached.size > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
