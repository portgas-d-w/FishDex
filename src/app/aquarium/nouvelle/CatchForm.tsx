'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createCatch, type CatchState } from '@/app/actions/catches'

type Species = {
  id: string
  nom_fr: string
  categorie: string | null
}

type Props = {
  species: Species[]
  today: string
  photoPath?: string | null
}

export function CatchForm({ species, today, photoPath }: Props) {
  const [state, action, pending] = useActionState<CatchState, FormData>(createCatch, null)

  const photoPreviewUrl = photoPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${photoPath}`
    : null

  const poissons = species.filter(s => s.categorie !== 'crustace')
  const crustaces = species.filter(s => s.categorie === 'crustace')

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8">
      {state?.error && (
        <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
          {state.error}
        </div>
      )}

      <form action={action} className="space-y-5">
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

        {/* Espèce */}
        <div>
          <label htmlFor="species_id" className="block text-sm font-medium text-slate-300 mb-1.5">
            Espèce <span className="text-red-400">*</span>
          </label>
          <select
            id="species_id"
            name="species_id"
            required
            defaultValue=""
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
          >
            <option value="" disabled>— Sélectionne une espèce —</option>
            {poissons.length > 0 && (
              <optgroup label="Poissons">
                {poissons.map(s => (
                  <option key={s.id} value={s.id}>{s.nom_fr}</option>
                ))}
              </optgroup>
            )}
            {crustaces.length > 0 && (
              <optgroup label="Crustacés">
                {crustaces.map(s => (
                  <option key={s.id} value={s.id}>{s.nom_fr}</option>
                ))}
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
            Lieu{' '}
            <span className="text-slate-500 text-xs font-normal">(optionnel)</span>
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
              Poids (kg){' '}
              <span className="text-slate-500 text-xs font-normal">(opt.)</span>
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
              Taille (cm){' '}
              <span className="text-slate-500 text-xs font-normal">(opt.)</span>
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

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1.5">
            Notes{' '}
            <span className="text-slate-500 text-xs font-normal">(optionnel)</span>
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
