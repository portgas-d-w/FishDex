'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Users, Play } from 'lucide-react'
import { startSession } from '@/app/actions/sessions'
import { StyleSelector } from './StyleSelector'
import { IntentionSelector } from './IntentionSelector'
import type { INTENTION_OPTIONS } from '@/lib/sessions/types'

type Spot = { id: string; nom: string; nb_visites: number }
type IntentionValue = typeof INTENTION_OPTIONS[number]['value']

export function StartSessionFormFull({ spots }: { spots: Spot[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [spotName, setSpotName]     = useState(spots[0]?.nom ?? '')
  const [showSugg, setShowSugg]     = useState(false)
  const [style, setStyle]           = useState<string | null>(null)
  const [intention, setIntention]   = useState<IntentionValue | null>(null)
  const [compagnons, setCompagnons] = useState('')

  const filtered = spots.filter(s =>
    s.nom.toLowerCase().includes(spotName.toLowerCase()) && s.nom !== spotName
  )

  function handleStart() {
    startTransition(async () => {
      const result = await startSession({
        spot_nom:    spotName.trim() || undefined,
        style_peche: style ?? undefined,
        intention:   intention ?? undefined,
        compagnons:  compagnons.trim() || undefined,
      })
      if (result.error) {
        setError(result.error)
      } else if (result.session) {
        router.push('/sessions/active')
      }
    })
  }

  return (
    <div className="space-y-4">

      {/* Spot */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Spot</p>
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 focus-within:border-cyan-400/30 transition-colors">
            <MapPin size={14} className="text-white/30 shrink-0" />
            <input
              value={spotName}
              onChange={e => { setSpotName(e.target.value); setShowSugg(true) }}
              onFocus={() => setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              placeholder="Étang, lac, rivière…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
            />
          </div>
          {showSugg && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-slate-900 border border-white/10 overflow-hidden z-10 shadow-xl">
              {filtered.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSpotName(s.nom); setShowSugg(false) }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-white">{s.nom}</span>
                  <span className="text-[11px] text-white/30">{s.nb_visites} visite{s.nb_visites !== 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chips spots récents */}
        {spots.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {spots.slice(0, 4).map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSpotName(s.nom)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  spotName === s.nom
                    ? 'bg-cyan-400/15 border-cyan-400/30 text-cyan-300'
                    : 'bg-white/4 border-white/10 text-white/50 hover:bg-white/8'
                }`}
              >
                {s.nom}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Style */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Style de pêche</p>
        <StyleSelector value={style} onChange={setStyle} />
      </div>

      {/* Intention */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Intention</p>
        <IntentionSelector value={intention} onChange={setIntention} />
      </div>

      {/* Compagnons */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Compagnons</p>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 focus-within:border-cyan-400/30 transition-colors">
          <Users size={14} className="text-white/30 shrink-0" />
          <input
            value={compagnons}
            onChange={e => setCompagnons(e.target.value)}
            placeholder="Ex : Marc, Julie…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      {/* CTA sticky */}
      <button
        onClick={handleStart}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-4 text-base font-bold text-[#0a0f14] disabled:opacity-50 shadow-[0_0_30px_rgba(34,211,238,0.35)]"
      >
        <Play size={18} fill="currentColor" />
        {isPending ? 'Démarrage…' : 'Démarrer la session'}
      </button>

      <p className="text-[10px] text-white/20 text-center">Vos données sont sauvegardées en temps réel.</p>
    </div>
  )
}
