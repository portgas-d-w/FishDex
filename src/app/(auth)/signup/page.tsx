'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signUp, type AuthState } from '@/app/actions/auth'
import { validateInviteCode } from '@/app/actions/beta'

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, null)
  const searchParams = useSearchParams()

  const [step, setStep] = useState<'code' | 'form'>('code')
  const [inviteCode, setInviteCode] = useState(searchParams.get('code')?.toUpperCase() ?? '')
  const [codeError, setCodeError] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  async function handleCodeSubmit() {
    setIsChecking(true)
    setCodeError('')

    const result = await validateInviteCode(inviteCode)

    if (result.valid) {
      setStep('form')
    } else {
      setCodeError(result.error ?? 'Code invalide.')
    }
    setIsChecking(false)
  }

  if (step === 'code') {
    return (
      <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-2 mb-6">
          <Image
            src="/logo/icon-192.png"
            alt="FishDex"
            width={64}
            height={64}
            className="rounded-2xl"
            priority
          />
          <h1 className="text-2xl font-semibold text-white">FishDex</h1>
        </Link>

        {/* Card glassmorphism */}
        <div className="w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-base font-medium text-white">Accès bêta fermée</p>
            <p className="text-sm text-white/60">
              FishDex est en accès anticipé.<br />
              Entre ton code d&apos;invitation pour continuer.
            </p>
          </div>

          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === 'Enter' && inviteCode.length >= 5) handleCodeSubmit() }}
            placeholder="FISH-2026-XXXXX"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 text-center font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {codeError && (
            <p className="text-sm text-red-400 text-center">{codeError}</p>
          )}

          <button
            onClick={handleCodeSubmit}
            disabled={isChecking || inviteCode.length < 5}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isChecking ? 'Vérification...' : 'Continuer →'}
          </button>
        </div>

        <p className="mt-6 text-sm text-white/40">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    )
  }

  // Étape 2 : formulaire d'inscription
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
          <p className="text-slate-400 text-sm">Crée ton compte de pêcheur</p>
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

            {/* Code d'invitation (caché, déjà vérifié à l'étape 1) */}
            <input type="hidden" name="invite_code" value={inviteCode} />

            {/* Pseudo */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5">
                Pseudo
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="MonPseudo"
              />
              {state?.fieldErrors?.username ? (
                <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.username}</p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-500">3 à 20 caractères, lettres, chiffres et _ uniquement.</p>
              )}
            </div>

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

            {/* Confirmation mot de passe */}
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

            {/* Bouton */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {pending ? 'Création du compte…' : 'Créer mon compte'}
            </button>
          </form>

          {/* Navigation */}
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <button
              onClick={() => setStep('code')}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Changer de code
            </button>
            <p className="text-slate-400">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
