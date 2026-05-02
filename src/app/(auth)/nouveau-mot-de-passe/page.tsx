'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { updatePassword, type UpdatePasswordState } from '@/app/actions/auth'

export default function NouveauMotDePassePage() {
  const [state, action, pending] = useActionState<UpdatePasswordState, FormData>(updatePassword, null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-teal-400">
            FishDex
          </Link>
          <p className="text-slate-400 mt-2">Choisis un nouveau mot de passe</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8">

          {state?.error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-5">

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
              {state?.fieldErrors?.password ? (
                <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.password}</p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-500">8 caractères minimum.</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirmer le mot de passe
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

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {pending ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
