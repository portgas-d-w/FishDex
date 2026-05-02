'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updatePassword, type UpdatePasswordState } from '@/app/actions/auth'

export const metadata = undefined // page client, pas de metadata statique

export default function ParametresPage() {
  const [state, action, pending] = useActionState<UpdatePasswordState, FormData>(updatePassword, null)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Paramètres</h1>

      {/* Section : Changer le mot de passe */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-1">Mot de passe</h2>
        <p className="text-sm text-slate-400 mb-6">
          Choisis un nouveau mot de passe d&apos;au moins 8 caractères.
        </p>

        {state?.error && (
          <div className="mb-5 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="••••••••"
            />
            {state?.fieldErrors?.password && (
              <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              placeholder="••••••••"
            />
            {state?.fieldErrors?.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={pending}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {pending ? 'Enregistrement…' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </section>

      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
