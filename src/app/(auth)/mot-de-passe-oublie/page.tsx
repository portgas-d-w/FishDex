'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset, type ResetState } from '@/app/actions/auth'

export default function MotDePasseOubliePage() {
  const [state, action, pending] = useActionState<ResetState, FormData>(requestPasswordReset, null)

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-3">Vérifie ta boîte mail</h1>
          <p className="text-slate-400 mb-6">
            Si cette adresse est associée à un compte, tu recevras un lien pour réinitialiser ton mot de passe.
          </p>
          <Link
            href="/login"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-teal-400">
            FishDex
          </Link>
          <p className="text-slate-400 mt-2">Réinitialise ton mot de passe</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8">

          {state?.error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <p className="text-sm text-slate-400 mb-5">
            Saisis ton adresse email et on t&apos;enverra un lien pour créer un nouveau mot de passe.
          </p>

          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="ton@email.com"
              />
              {state?.fieldErrors?.email && (
                <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {pending ? 'Envoi…' : 'Envoyer le lien'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              ← Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
