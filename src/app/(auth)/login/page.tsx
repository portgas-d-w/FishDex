'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, type AuthState } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link href="/" className="flex flex-col items-center gap-2">
            <Image
              src="/logo/icon-192.png"
              alt="FishDex"
              width={64}
              height={64}
              className="rounded-2xl"
              priority
            />
            <span className="text-2xl font-black text-white tracking-tight">FishDex</span>
          </Link>
          <p className="text-slate-400 text-sm">Connecte-toi à ton compte</p>
        </div>

        {/* Carte formulaire */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8">

          {/* Erreur globale */}
          {state?.error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-5">

            {/* Email */}
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

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••"
              />
              {state?.fieldErrors?.password && (
                <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.password}</p>
              )}
            </div>

            {/* Lien mot de passe oublié */}
            <div className="text-right -mt-1">
              <Link
                href="/mot-de-passe-oublie"
                className="text-xs text-slate-500 hover:text-teal-400 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {pending ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte ?{' '}
            <Link href="/signup" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
