'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createRetroSession } from '@/app/actions/sessions'
import { RESSENTI_OPTIONS } from '@/lib/sessions/types'
import type { Spot } from '@/lib/sessions/types'
import type { OrphanCatch } from '@/app/sessions/retro/page'

const STYLES = [
  { value: 'carnassiers', label: 'Carnassiers' },
  { value: 'carpe',       label: 'Carpe' },
  { value: 'truite',      label: 'Truite' },
  { value: 'mouche',      label: 'Mouche' },
  { value: 'feeder',      label: 'Feeder' },
  { value: 'mer',         label: 'Mer' },
]

export function RetroSessionForm({
  spots,
  orphanCatches,
}: {
  spots: Spot[]
  orphanCatches: OrphanCatch[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [date, setDate]             = useState('')
  const [spotNom, setSpotNom]       = useState('')
  const [style, setStyle]           = useState('')
  const [notes, setNotes]           = useState('')
  const [ressenti, setRessenti]     = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [error, setError]           = useState<string | null>(null)

  // Filtrer les captures orphelines proches de la date sélectionnée (±30j)
  const filteredCatches = date
    ? orphanCatches.filter(c => {
        const diff = Math.abs(new Date(c.created_at).getTime() - new Date(date).getTime())
        return diff < 30 * 24 * 60 * 60 * 1000
      })
    : orphanCatches

  function toggleCatch(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) { setError('Choisis une date'); return }
    setError(null)

    startTransition(async () => {
      const existing = spots.find(s => s.nom.toLowerCase() === spotNom.toLowerCase().trim())
      const { session, error: serverError } = await createRetroSession({
        date,
        spot_id:     existing?.id,
        spot_nom:    existing ? undefined : spotNom.trim() || undefined,
        style_peche: style || undefined,
        notes:       notes.trim() || undefined,
        ressenti:    ressenti || undefined,
        catch_ids:   selectedIds.size > 0 ? [...selectedIds] : undefined,
      })

      if (serverError) { setError(serverError); return }
      if (session) router.push(`/sessions/${session.id}`)
    })
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Date */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Date de la sortie</p>
        <input
          type="date"
          value={date}
          max={today}
          onChange={e => setDate(e.target.value)}
          required
          className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/50 [color-scheme:dark]"
        />
      </div>

      {/* Spot */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Spot</p>
        <input
          type="text"
          list="spots-list"
          value={spotNom}
          onChange={e => setSpotNom(e.target.value)}
          placeholder="Étang des Saules, Rivière Armance…"
          className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50"
        />
        <datalist id="spots-list">
          {spots.map(s => <option key={s.id} value={s.nom} />)}
        </datalist>
      </div>

      {/* Style de pêche */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Style de pêche</p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(prev => prev === s.value ? '' : s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                style === s.value
                  ? 'bg-cyan-400/15 border-cyan-400/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Captures orphelines */}
      {orphanCatches.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Captures à rattacher</p>
            {selectedIds.size > 0 && (
              <span className="text-[11px] text-cyan-400 font-semibold">{selectedIds.size} sélectionnée{selectedIds.size > 1 ? 's' : ''}</span>
            )}
          </div>
          {date && filteredCatches.length === 0 ? (
            <p className="text-xs text-white/30 italic">Aucune capture sans session dans les 30 jours autour de cette date</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(date ? filteredCatches : orphanCatches).map(c => {
                const checked = selectedIds.has(c.id)
                const dateStr = new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                const detail = [c.taille_cm ? `${c.taille_cm} cm` : null, c.poids_kg ? `${c.poids_kg} kg` : null].filter(Boolean).join(' · ')
                return (
                  <label
                    key={c.id}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                      checked ? 'bg-cyan-400/8 border-cyan-400/25' : 'bg-white/4 border-white/8 hover:bg-white/6'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCatch(c.id)}
                      className="accent-cyan-400 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{c.species_nom ?? 'Espèce inconnue'}</p>
                      <p className="text-[11px] text-white/35">{dateStr}{detail ? ` · ${detail}` : ''}{c.lieu ? ` · ${c.lieu}` : ''}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
          {!date && (
            <p className="text-[11px] text-white/25 italic">Sélectionne une date pour filtrer les captures proches</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Ce que tu veux te rappeler de cette sortie…"
          rows={3}
          className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 resize-none"
        />
      </div>

      {/* Ressenti */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Ressenti</p>
        <div className="flex flex-wrap gap-2">
          {RESSENTI_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setRessenti(prev => prev === o.value ? '' : o.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                ressenti === o.value
                  ? 'bg-cyan-400/15 border-cyan-400/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
              }`}
            >
              <span>{o.emoji}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending || !date}
        className="w-full py-4 rounded-2xl bg-cyan-400 text-[#0a0f14] font-bold text-base disabled:opacity-40 transition-opacity active:scale-[0.98]"
      >
        {pending ? 'Enregistrement…' : 'Sauvegarder le souvenir'}
      </button>
    </form>
  )
}
