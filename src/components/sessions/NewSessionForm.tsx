'use client'

import { useTransition, useState } from 'react'
import { MapPin, Fish, Play } from 'lucide-react'
import { startSession } from '@/lib/sessions/actions'

const STYLES = [
  { value: 'carnassiers', label: 'Carnassiers' },
  { value: 'carpe',       label: 'Carpe' },
  { value: 'truite',      label: 'Truite' },
  { value: 'feeder',      label: 'Feeder / Coup' },
  { value: 'mer',         label: 'Mer' },
  { value: 'autre',       label: 'Autre' },
]

type Spot = { id: string; nom: string; nb_visites: number }

export function NewSessionForm({ spots }: { spots: Spot[] }) {
  const [isPending, startTransition] = useTransition()
  const [spotName, setSpotName] = useState(spots[0]?.nom ?? '')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filtered = spots.filter(s =>
    s.nom.toLowerCase().includes(spotName.toLowerCase()) && s.nom !== spotName
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => startSession(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Info card */}
      <div className="rounded-2xl bg-cyan-400/5 border border-cyan-400/15 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-400/15 flex items-center justify-center shrink-0">
            <Fish size={14} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Prêt pour une nouvelle session</p>
            <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
              Toutes tes prises pendant cette sortie seront automatiquement enregistrées.
            </p>
          </div>
        </div>
      </div>

      {/* Spot */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Options rapides</p>

        <div className="relative">
          <label className="text-xs text-white/40 mb-1.5 block">Nom du spot</label>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 focus-within:border-cyan-400/30 transition-colors">
            <MapPin size={14} className="text-white/30 shrink-0" />
            <input
              name="spot_name"
              value={spotName}
              onChange={e => { setSpotName(e.target.value); setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ex : Étang des Saules, Lac du Héron…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
            />
          </div>

          {/* Suggestions */}
          {showSuggestions && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-slate-900 border border-white/10 overflow-hidden z-10 shadow-xl">
              {filtered.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSpotName(s.nom); setShowSuggestions(false) }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-white">{s.nom}</span>
                  <span className="text-xs text-white/30">{s.nb_visites} visite{s.nb_visites > 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Style de pêche */}
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Technique utilisée</label>
          <select
            name="style_peche"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-cyan-400/30 transition-colors appearance-none"
          >
            <option value="" className="bg-slate-900">Non précisée</option>
            {STYLES.map(s => (
              <option key={s.value} value={s.value} className="bg-slate-900">{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Info FishDex */}
      <p className="text-xs text-white/25 text-center px-4">
        FishDex va préparer votre session — Météo, conditions… tout sera prêt.
      </p>

      {/* CTA */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-4 text-base font-bold text-[#0a0f14] disabled:opacity-60 shadow-[0_0_30px_rgba(34,211,238,0.35)]"
      >
        <Play size={18} fill="currentColor" />
        {isPending ? 'Démarrage…' : 'Démarrer la Session'}
      </button>

      <p className="text-[10px] text-white/20 text-center">
        Vos données sont sauvegardées en temps réel.
      </p>
    </form>
  )
}
