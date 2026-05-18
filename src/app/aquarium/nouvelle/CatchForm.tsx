'use client'

import { useActionState, useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createCatch, type CatchState } from '@/app/actions/catches'
import { identifySpeciesFromPhoto, type AIPrediction } from '@/app/actions/ai-identify'

type Species = {
  id: string
  nom_fr: string
  categorie: string | null
}

type Props = {
  species: Species[]
  today: string
  photoPath?: string | null
  captureSource?: 'camera' | 'gallery' | null
  defaultRelease?: boolean
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
        checked ? 'bg-teal-500' : 'bg-slate-700'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function ConfidenceDot({ confidence }: { confidence: number }) {
  const color =
    confidence >= 0.8 ? 'bg-emerald-400' :
    confidence >= 0.6 ? 'bg-amber-400' :
    'bg-slate-500'
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
}

export function CatchForm({
  species,
  today,
  photoPath,
  captureSource,
  defaultRelease = false,
}: Props) {
  const [state, action, pending] = useActionState<CatchState, FormData>(createCatch, null)
  const [released, setReleased] = useState(defaultRelease)
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('')

  // ── IA identification ──────────────────────────────────────────────────────
  const [aiPending, startAI] = useTransition()
  const [aiPredictions, setAiPredictions] = useState<AIPrediction[] | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiDismissed, setAiDismissed] = useState(false)

  useEffect(() => {
    if (!photoPath) return
    startAI(async () => {
      const result = await identifySpeciesFromPhoto(photoPath)
      if (result.source === 'failed' || result.predictions.length === 0) {
        setAiError(result.error ?? 'Aucune espèce reconnue')
        setAiPredictions([])
      } else {
        setAiPredictions(result.predictions)
        setAiError(null)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPath])

  const topPrediction = aiPredictions?.[0] ?? null
  const showBanner = !aiDismissed && photoPath &&
    (aiPending || aiPredictions !== null)

  // ── Données formulaire ─────────────────────────────────────────────────────
  const photoPreviewUrl = photoPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${photoPath}`
    : null

  const poissons  = species.filter(s => s.categorie !== 'crustace')
  const crustaces = species.filter(s => s.categorie === 'crustace')

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8">
      {state?.error && (
        <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-5">
        {/* Champs cachés */}
        {captureSource && <input type="hidden" name="capture_source" value={captureSource} />}
        <input type="hidden" name="released" value={released ? 'true' : 'false'} />

        {/* Photo pré-uploadée */}
        {photoPreviewUrl && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
              <Image
                src={photoPreviewUrl}
                alt="Photo de la prise"
                fill
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-contain"
              />
            </div>
            <p className="text-xs text-teal-400">📸 Photo prête à être enregistrée</p>
            <input type="hidden" name="photo_url" value={photoPath ?? ''} />
          </div>
        )}

        {/* ── Bannière suggestion IA ─────────────────────────────────────── */}
        {showBanner && (
          <div className={`rounded-xl border px-4 py-3 ${
            aiError
              ? 'border-slate-600/40 bg-slate-800/40'
              : 'border-cyan-500/25 bg-cyan-950/30'
          }`}>
            {/* En-tête commun */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-semibold tracking-widest uppercase ${
                aiError ? 'text-slate-400' : 'text-cyan-400'
              }`}>
                Suggestion IA
              </span>
              {!aiPending && (
                <button
                  type="button"
                  onClick={() => setAiDismissed(true)}
                  className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
                  aria-label="Ignorer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* États */}
            {aiPending && (
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="text-xs text-cyan-400/80">Identification de l&apos;espèce en cours…</span>
              </div>
            )}

            {!aiPending && aiError && (
              <p className="text-xs text-slate-400">{aiError}</p>
            )}

            {!aiPending && !aiError && topPrediction && (
              <div className="space-y-2">
                {/* Nom scientifique + confiance */}
                <div className="flex items-center gap-1.5">
                  <ConfidenceDot confidence={topPrediction.confidence} />
                  <p className="text-sm font-semibold text-white truncate">
                    {topPrediction.species_name}
                  </p>
                  <span className="text-[11px] text-slate-400 italic shrink-0">
                    {topPrediction.scientific_name} · {Math.round(topPrediction.confidence * 100)}%
                  </span>
                </div>

                {/* Cas 1 — absent de FishDex */}
                {topPrediction.variants.length === 0 && (
                  <p className="text-[11px] text-amber-500/80">Espèce non encore disponible dans FishDex</p>
                )}

                {/* Cas 2 — match direct : un seul bouton Appliquer */}
                {topPrediction.variants.length === 1 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSpeciesId(topPrediction.variants[0].id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 transition-colors"
                  >
                    Appliquer — {topPrediction.variants[0].nom_fr}
                  </button>
                )}

                {/* Cas 3 — disambiguation : plusieurs variétés pour ce nom scientifique */}
                {topPrediction.variants.length > 1 && (
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1.5">Quelle variété ?</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topPrediction.variants.map(v => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedSpeciesId(v.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-colors"
                        >
                          {v.nom_fr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Autres prédictions (rang 2-4) */}
                {aiPredictions && aiPredictions.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5">
                    {aiPredictions.slice(1, 4).map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (p.variants[0]) setSelectedSpeciesId(p.variants[0].id)
                        }}
                        disabled={p.variants.length === 0}
                        className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title={p.variants.length === 0 ? 'Absent de FishDex' : undefined}
                      >
                        {p.species_name}
                        <span className="ml-1 text-slate-500">{Math.round(p.confidence * 100)}%</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!aiPending && !aiError && aiPredictions?.length === 0 && (
              <p className="text-xs text-slate-400">Aucune espèce reconnue sur cette photo.</p>
            )}
          </div>
        )}

        {/* Espèce */}
        <div>
          <label htmlFor="species_id" className="block text-sm font-medium text-slate-300 mb-1.5">
            Espèce <span className="text-red-400">*</span>
          </label>
          <select
            id="species_id"
            name="species_id"
            required
            value={selectedSpeciesId}
            onChange={e => setSelectedSpeciesId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
          >
            <option value="" disabled>— Sélectionne une espèce —</option>
            {poissons.length > 0 && (
              <optgroup label="Poissons">
                {poissons.map(s => <option key={s.id} value={s.id}>{s.nom_fr}</option>)}
              </optgroup>
            )}
            {crustaces.length > 0 && (
              <optgroup label="Crustacés">
                {crustaces.map(s => <option key={s.id} value={s.id}>{s.nom_fr}</option>)}
              </optgroup>
            )}
          </select>
          {state?.fieldErrors?.species_id && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.species_id}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date_capture" className="block text-sm font-medium text-slate-300 mb-1.5">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            id="date_capture"
            name="date_capture"
            type="date"
            defaultValue={today}
            required
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
          />
          {state?.fieldErrors?.date_capture && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.date_capture}</p>
          )}
        </div>

        {/* Lieu */}
        <div>
          <label htmlFor="lieu" className="block text-sm font-medium text-slate-300 mb-1.5">
            Lieu <span className="text-slate-500 text-xs font-normal">(optionnel)</span>
          </label>
          <input
            id="lieu"
            name="lieu"
            type="text"
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            placeholder="Étang de Viry, Lac du Bourget…"
          />
        </div>

        {/* Poids / Taille */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="poids_kg" className="block text-sm font-medium text-slate-300 mb-1.5">
              Poids (kg) <span className="text-slate-500 text-xs font-normal">(opt.)</span>
            </label>
            <input
              id="poids_kg"
              name="poids_kg"
              type="number"
              min="0.001"
              step="0.001"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="3.250"
            />
            {state?.fieldErrors?.poids_kg && (
              <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.poids_kg}</p>
            )}
          </div>
          <div>
            <label htmlFor="taille_cm" className="block text-sm font-medium text-slate-300 mb-1.5">
              Taille (cm) <span className="text-slate-500 text-xs font-normal">(opt.)</span>
            </label>
            <input
              id="taille_cm"
              name="taille_cm"
              type="number"
              min="0.1"
              step="0.1"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="52.0"
            />
            {state?.fieldErrors?.taille_cm && (
              <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.taille_cm}</p>
            )}
          </div>
        </div>

        {/* No-kill toggle */}
        <div className="flex items-center justify-between rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-200">Poisson relâché</p>
            <p className="text-xs text-slate-500 mt-0.5">No-kill — retour à l&apos;eau</p>
          </div>
          <Toggle checked={released} onChange={setReleased} />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1.5">
            Notes <span className="text-slate-500 text-xs font-normal">(optionnel)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
            placeholder="Capturée au vif, beau combat de 10 minutes…"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Link
            href="/aquarium"
            className="flex-1 py-2.5 text-center text-sm text-slate-400 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
          >
            {pending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
