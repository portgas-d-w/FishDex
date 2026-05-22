'use client'

import { useActionState, useState, useEffect, useTransition, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ArrowRight, ChevronDown, X, AlertTriangle, Wand2, Sparkles } from 'lucide-react'
import { createCatch, type CatchState } from '@/app/actions/catches'
import { identifySpeciesFromPhoto, type AIPrediction } from '@/app/actions/ai-identify'
import { validateCatchValues, type ValidationWarning } from '@/lib/catches/validation'
import { estimateWeight, estimateLength, getGenericFormula, getConfidenceInterval } from '@/lib/catches/size-weight-calculator'

type Species = {
  id: string
  nom_fr: string
  categorie: string | null
  slug: string | null
  weight_formula_a: number | null
  weight_formula_b: number | null
}

type Props = {
  species: Species[]
  today: string
  photoPath?: string | null
  captureSource?: 'camera' | 'gallery' | null
  defaultRelease?: boolean
  isProUser?: boolean
}

// ── Helpers UI ────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-teal-500' : 'bg-slate-700'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color = pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-slate-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-slate-500'}`}>
        {pct}%
      </span>
    </div>
  )
}

// ── Screen 1 — Identification IA ──────────────────────────────────────────────

type IdentifyScreenProps = {
  photoUrl: string
  onConfirm: (speciesId: string, speciesName: string) => void
  onSkip: () => void
}

function IdentifyScreen({ photoUrl, onConfirm, onSkip }: IdentifyScreenProps) {
  const [aiPending, startAI] = useTransition()
  const [predictions, setPredictions] = useState<AIPrediction[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pickedId, setPickedId] = useState<string>('')
  const [pickedName, setPickedName] = useState<string>('')

  // Extraire le photoPath depuis l'URL complète
  const photoPath = photoUrl.split('/catches/')[1] ?? ''

  useEffect(() => {
    if (!photoPath) return
    startAI(async () => {
      const result = await identifySpeciesFromPhoto(photoPath)
      if (result.source === 'failed' || result.predictions.length === 0) {
        setError(result.error ?? 'Aucune espèce reconnue')
        setPredictions([])
      } else {
        setPredictions(result.predictions)
        // Pré-sélectionner si match unique direct
        const top = result.predictions[0]
        if (top?.variants.length === 1) {
          setPickedId(top.variants[0].id)
          setPickedName(top.variants[0].nom_fr)
        }
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoPath])

  const topPrediction = predictions?.[0] ?? null

  function pick(id: string, name: string) {
    setPickedId(id)
    setPickedName(name)
  }

  return (
    <div className="flex flex-col min-h-[80vh]" style={{ background: '#0a0f14' }}>

      {/* Photo grande */}
      <div className="relative w-full aspect-[3/4] max-h-[58vh] overflow-hidden rounded-2xl">
        <Image
          src={photoUrl}
          alt="Photo de la prise"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dégradé bas */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0f14] to-transparent" />
      </div>

      {/* Carte IA */}
      <div className="flex-1 flex flex-col px-4 pt-4 pb-6 gap-4">

        {/* Loading */}
        {aiPending && (
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Identification en cours…</p>
                <p className="text-xs text-white/40 mt-0.5">iNaturalist analyse ta photo</p>
              </div>
            </div>
          </div>
        )}

        {/* Erreur / pas de résultat */}
        {!aiPending && (error || predictions?.length === 0) && (
          <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
            <p className="text-sm text-white/60">
              {error ?? 'Aucune espèce reconnue automatiquement.'}
            </p>
            <p className="text-xs text-white/30 mt-1">Tu pourras la sélectionner manuellement.</p>
          </div>
        )}

        {/* Résultats */}
        {!aiPending && topPrediction && (
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                Suggestion IA
              </span>
              <span className="text-[10px] text-white/30 italic">{topPrediction.scientific_name}</span>
            </div>

            <ConfidenceBar value={topPrediction.confidence} />

            {/* Cas : absent BDD */}
            {topPrediction.variants.length === 0 && (
              <p className="text-xs text-amber-400/80">
                Espèce non disponible dans FishDex — sélection manuelle requise.
              </p>
            )}

            {/* Cas : match unique — bouton direct */}
            {topPrediction.variants.length === 1 && (
              <button
                type="button"
                onClick={() => pick(topPrediction.variants[0].id, topPrediction.variants[0].nom_fr)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  pickedId === topPrediction.variants[0].id
                    ? 'bg-cyan-400 text-slate-900 shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                    : 'bg-white/8 text-white hover:bg-white/12 border border-white/10'
                }`}
              >
                {topPrediction.variants[0].nom_fr}
              </button>
            )}

            {/* Cas : disambiguation */}
            {topPrediction.variants.length > 1 && (
              <div className="space-y-2">
                <p className="text-xs text-white/50">Quelle variété ?</p>
                <div className="flex flex-wrap gap-2">
                  {topPrediction.variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => pick(v.id, v.nom_fr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        pickedId === v.id
                          ? 'bg-cyan-400 text-slate-900 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                          : 'bg-white/8 text-white/80 hover:bg-white/12 border border-white/10'
                      }`}
                    >
                      {v.nom_fr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Autres prédictions */}
            {(predictions?.length ?? 0) > 1 && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 mb-1.5">Autres suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {predictions!.slice(1, 4).map((p, i) => (
                    p.variants[0] && (
                      <button
                        key={i}
                        type="button"
                        onClick={() => pick(p.variants[0].id, p.variants[0].nom_fr)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                          pickedId === p.variants[0].id
                            ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                            : 'bg-white/5 text-white/50 border border-white/8 hover:bg-white/8'
                        }`}
                      >
                        {p.variants.length === 1 ? p.variants[0].nom_fr : p.species_name}
                        <span className="ml-1 opacity-50">{Math.round(p.confidence * 100)}%</span>
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Boutons navigation */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={() => pickedId && onConfirm(pickedId, pickedName)}
            disabled={!pickedId || aiPending}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-cyan-400 text-slate-900 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            {pickedId ? `Confirmer — ${pickedName}` : 'Sélectionne une espèce'}
            {pickedId && <ArrowRight size={16} strokeWidth={2.5} />}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full py-3 rounded-2xl text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Passer sans identification
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Screen 2 — Formulaire détails ─────────────────────────────────────────────

type DetailsFormProps = {
  species: Species[]
  today: string
  photoPath?: string | null
  captureSource?: 'camera' | 'gallery' | null
  defaultRelease: boolean
  prefilledSpeciesId: string
  prefilledSpeciesName: string
  onBack: () => void
  isProUser?: boolean
}

// ── Combobox espèce — cherche en tapant OU défile la liste ──────────────────

function SpeciesCombobox({
  species,
  value,
  onChange,
  error,
}: {
  species: Species[]
  value: string
  onChange: (id: string) => void
  error?: string
}) {
  const [inputText, setInputText]   = useState('')
  const [open, setOpen]             = useState(false)
  const containerRef                = useRef<HTMLDivElement>(null)

  // Affiche le nom quand une valeur est sélectionnée (y compris depuis l'IA)
  const selectedName = species.find(s => s.id === value)?.nom_fr ?? ''

  // Quand la valeur change depuis l'extérieur (suggestion IA), ferme le dropdown
  useEffect(() => {
    if (value) setOpen(false)
  }, [value])

  // Filtre : si l'user tape, filtre ; sinon affiche tout
  const query    = inputText.trim().toLowerCase()
  const filtered = query
    ? species.filter(s => s.nom_fr.toLowerCase().includes(query))
    : species

  const poissons  = filtered.filter(s => s.categorie !== 'crustace')
  const crustaces = filtered.filter(s => s.categorie === 'crustace')

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value)
    setOpen(true)
    if (!e.target.value) onChange('')   // désélectionne si texte effacé
  }

  function handleSelect(id: string) {
    onChange(id)
    setInputText('')
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
    setInputText('')
    setOpen(false)
  }

  // Ferme au clic en dehors
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Champ texte */}
      <div
        className={`flex items-center gap-2 w-full px-4 py-2.5 bg-white/5 border rounded-xl transition-colors cursor-text ${
          open ? 'border-cyan-500/50' : error ? 'border-red-500/50' : 'border-white/10'
        }`}
        onClick={() => setOpen(v => !v)}
      >
        <input
          type="text"
          value={open ? inputText : selectedName}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={selectedName || '— Rechercher ou défiler —'}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
        />
        {/* Champ caché pour la soumission du formulaire */}
        <input type="hidden" name="species_id" value={value} />

        {value ? (
          <button type="button" onClick={handleClear} className="text-white/30 hover:text-white/60 transition-colors shrink-0">
            <X size={14} />
          </button>
        ) : (
          <ChevronDown size={14} className={`text-white/30 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-white/10 shadow-2xl"
          style={{ background: 'rgba(8,14,22,0.97)', backdropFilter: 'blur(16px)' }}
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/30">Aucune espèce trouvée</p>
          ) : (
            <>
              {poissons.length > 0 && (
                <>
                  {crustaces.length > 0 && (
                    <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold tracking-widest text-white/25 uppercase">Poissons</p>
                  )}
                  {poissons.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={() => handleSelect(s.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        s.id === value
                          ? 'text-cyan-400 bg-cyan-400/8'
                          : 'text-white/80 hover:bg-white/6 hover:text-white'
                      }`}
                    >
                      {s.nom_fr}
                    </button>
                  ))}
                </>
              )}
              {crustaces.length > 0 && (
                <>
                  <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold tracking-widest text-white/25 uppercase border-t border-white/5 mt-1">Crustacés</p>
                  {crustaces.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={() => handleSelect(s.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        s.id === value
                          ? 'text-cyan-400 bg-cyan-400/8'
                          : 'text-white/80 hover:bg-white/6 hover:text-white'
                      }`}
                    >
                      {s.nom_fr}
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function DetailsForm({
  species, today, photoPath, captureSource,
  defaultRelease, prefilledSpeciesId, prefilledSpeciesName, onBack, isProUser,
}: DetailsFormProps) {
  const [state, action, pending] = useActionState<CatchState, FormData>(createCatch, null)
  const [released, setReleased] = useState(defaultRelease)
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(prefilledSpeciesId)
  const [tailleValue, setTailleValue] = useState('')
  const [poidsValue, setPoidsValue] = useState('')
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarning[]>([])
  const [estimationInfo, setEstimationInfo] = useState<string | null>(null)

  useEffect(() => {
    const selected = species.find(s => s.id === selectedSpeciesId)
    const slug = selected?.slug ?? 'default'
    const taille = tailleValue ? parseFloat(tailleValue) : undefined
    const poids = poidsValue ? parseFloat(poidsValue) : undefined
    if (taille !== undefined || poids !== undefined) {
      setValidationWarnings(validateCatchValues(slug, taille, poids))
    } else {
      setValidationWarnings([])
    }
  }, [selectedSpeciesId, tailleValue, poidsValue, species])

  const photoPreviewUrl = photoPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${photoPath}`
    : null

  return (
    <div className="flex flex-col gap-5">
      {/* Header avec retour */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Retour à l'identification"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h2 className="text-base font-bold text-white">Détails de la capture</h2>
          {prefilledSpeciesName && (
            <p className="text-xs text-cyan-400 mt-0.5">{prefilledSpeciesName} · identifiée par IA</p>
          )}
        </div>
      </div>

      {state?.error && (
        <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        {captureSource && <input type="hidden" name="capture_source" value={captureSource} />}
        <input type="hidden" name="released" value={released ? 'true' : 'false'} />

        {/* Miniature photo */}
        {photoPreviewUrl && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
              <Image
                src={photoPreviewUrl}
                alt="Photo"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-white/60">Photo enregistrée</p>
              {prefilledSpeciesName && (
                <p className="text-xs text-cyan-400 font-medium mt-0.5">{prefilledSpeciesName}</p>
              )}
            </div>
            <input type="hidden" name="photo_url" value={photoPath ?? ''} />
          </div>
        )}

        {/* Espèce */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Espèce <span className="text-red-400">*</span>
          </label>
          <SpeciesCombobox
            species={species}
            value={selectedSpeciesId}
            onChange={setSelectedSpeciesId}
            error={state?.fieldErrors?.species_id}
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date_capture" className="block text-sm font-medium text-white/70 mb-1.5">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            id="date_capture" name="date_capture" type="date"
            defaultValue={today} required
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {state?.fieldErrors?.date_capture && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.date_capture}</p>
          )}
        </div>

        {/* Lieu */}
        <div>
          <label htmlFor="lieu" className="block text-sm font-medium text-white/70 mb-1.5">
            Lieu <span className="text-white/30 text-xs font-normal">(optionnel)</span>
          </label>
          <input
            id="lieu" name="lieu" type="text"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
            placeholder="Étang de Viry, Lac du Bourget…"
          />
        </div>

        {/* Poids / Taille */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="poids_kg" className="block text-sm font-medium text-white/70 mb-1.5">
              Poids (kg) <span className="text-white/30 text-xs">(opt.)</span>
            </label>
            <input
              id="poids_kg" name="poids_kg" type="number" min="0.001" step="0.001"
              value={poidsValue}
              onChange={e => setPoidsValue(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="3.250"
            />
            {state?.fieldErrors?.poids_kg && (
              <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.poids_kg}</p>
            )}
          </div>
          <div>
            <label htmlFor="taille_cm" className="block text-sm font-medium text-white/70 mb-1.5">
              Taille (cm) <span className="text-white/30 text-xs">(opt.)</span>
            </label>
            <input
              id="taille_cm" name="taille_cm" type="number" min="0.1" step="0.1"
              value={tailleValue}
              onChange={e => setTailleValue(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="52.0"
            />
            {state?.fieldErrors?.taille_cm && (
              <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.taille_cm}</p>
            )}
          </div>
        </div>

        {/* Estimation taille/poids */}
        {(() => {
          const selected = species.find(s => s.id === selectedSpeciesId)
          const formula = selected?.weight_formula_a && selected?.weight_formula_b
            ? { a: selected.weight_formula_a, b: selected.weight_formula_b }
            : getGenericFormula()
          const taille = tailleValue ? parseFloat(tailleValue) : null
          const poids = poidsValue ? parseFloat(poidsValue) : null
          const canEstimateWeight = taille !== null && !poidsValue
          const canEstimateLength = poids !== null && !tailleValue

          if (!canEstimateWeight && !canEstimateLength) return null

          if (!isProUser) {
            return (
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <Sparkles className="h-3 w-3 text-cyan-500/50" />
                <span>Estimation automatique disponible en <a href="/parametres/abonnement" className="text-cyan-400/70 underline underline-offset-2">Pro</a></span>
              </div>
            )
          }

          return (
            <div className="space-y-1">
              {canEstimateWeight && (
                <button
                  type="button"
                  onClick={() => {
                    const estimated = estimateWeight(taille!, formula)
                    const interval = getConfidenceInterval(estimated)
                    setPoidsValue(String(estimated))
                    setEstimationInfo(`Estimation ±15% : ${interval.min} – ${interval.max} kg`)
                  }}
                  className="text-xs text-cyan-400 flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  <Wand2 className="h-3 w-3" />
                  Estimer le poids
                </button>
              )}
              {canEstimateLength && (
                <button
                  type="button"
                  onClick={() => {
                    const estimated = estimateLength(poids!, formula)
                    const interval = getConfidenceInterval(estimated)
                    setTailleValue(String(estimated))
                    setEstimationInfo(`Estimation ±15% : ${interval.min} – ${interval.max} cm`)
                  }}
                  className="text-xs text-cyan-400 flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  <Wand2 className="h-3 w-3" />
                  Estimer la taille
                </button>
              )}
              {estimationInfo && (
                <p className="text-xs text-white/40 italic">{estimationInfo}</p>
              )}
            </div>
          )
        })()}

        {validationWarnings.length > 0 && (
          <div className="space-y-1">
            {validationWarnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                {w.message}
              </p>
            ))}
          </div>
        )}

        {/* No-kill */}
        <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/8 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-white">Poisson relâché</p>
            <p className="text-xs text-white/30 mt-0.5">No-kill — retour à l&apos;eau</p>
          </div>
          <Toggle checked={released} onChange={setReleased} />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-white/70 mb-1.5">
            Notes <span className="text-white/30 text-xs font-normal">(optionnel)</span>
          </label>
          <textarea
            id="notes" name="notes" rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            placeholder="Capturée au vif, beau combat de 10 minutes…"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Link
            href="/aquarium"
            className="flex-1 py-3 text-center text-sm text-white/40 border border-white/10 hover:border-white/20 rounded-xl transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors"
          >
            {pending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Orchestrateur ─────────────────────────────────────────────────────────────

export function CatchForm({ species, today, photoPath, captureSource, defaultRelease = false, isProUser = false }: Props) {
  const photoPreviewUrl = photoPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${photoPath}`
    : null

  // Si pas de photo, on saute l'écran IA directement
  const [step, setStep] = useState<'identify' | 'form'>(photoPath ? 'identify' : 'form')
  const [confirmedId, setConfirmedId] = useState('')
  const [confirmedName, setConfirmedName] = useState('')

  function handleConfirm(id: string, name: string) {
    setConfirmedId(id)
    setConfirmedName(name)
    setStep('form')
  }

  function handleSkip() {
    setStep('form')
  }

  if (step === 'identify' && photoPreviewUrl) {
    return (
      <IdentifyScreen
        photoUrl={photoPreviewUrl}
        onConfirm={handleConfirm}
        onSkip={handleSkip}
      />
    )
  }

  return (
    <DetailsForm
      species={species}
      today={today}
      photoPath={photoPath}
      captureSource={captureSource}
      defaultRelease={defaultRelease}
      prefilledSpeciesId={confirmedId}
      prefilledSpeciesName={confirmedName}
      onBack={photoPath ? () => setStep('identify') : undefined as never}
      isProUser={isProUser}
    />
  )
}
