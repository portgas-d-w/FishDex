'use client'

import { useActionState } from 'react'
import { submitBetaSignup, type BetaSignupState } from '@/app/actions/beta'
import { CheckCircle } from 'lucide-react'

const ESPECES = ['Carpe', 'Brochet', 'Truite', 'Perche', 'Sandre', 'Black-bass', 'Silure', 'Mer']
const FREQUENCES = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'mensuel',  label: '1× par mois' },
  { value: 'hebdo',    label: '1× par semaine' },
  { value: 'passionne', label: 'Plusieurs fois/semaine' },
]
const EAUX = [
  { value: 'douce',    label: 'Eau douce' },
  { value: 'mer',      label: 'Mer' },
  { value: 'les_deux', label: 'Les deux' },
]

export function BetaSignupForm() {
  const [state, action, pending] = useActionState<BetaSignupState, FormData>(
    submitBetaSignup, null
  )

  if (state?.success) {
    return (
      <div className="rounded-2xl bg-emerald-400/8 border border-emerald-400/20 p-6 flex flex-col items-center gap-3 text-center">
        <CheckCircle size={32} className="text-emerald-400" />
        <p className="text-base font-bold text-white">Candidature reçue !</p>
        <p className="text-sm text-white/50 leading-relaxed">
          On revient vers toi dès qu&apos;on a une place.<br />
          Garde un œil sur ton email.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">

      {/* Email */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Email</p>
        <input
          name="email"
          type="email"
          required
          placeholder="ton@email.com"
          className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      {/* Type d'eau */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Type d&apos;eau</p>
        <div className="flex gap-2 flex-wrap">
          {EAUX.map(e => (
            <label key={e.value} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="type_eau" value={e.value} className="accent-cyan-400" />
              <span className="text-sm text-white/70">{e.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Espèces */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Espèces ciblées</p>
        <div className="flex flex-wrap gap-2">
          {ESPECES.map(e => (
            <label key={e} className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
              <input type="checkbox" name="especes" value={e.toLowerCase()} className="accent-cyan-400" />
              <span className="text-xs text-white/70">{e}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fréquence */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Fréquence de pêche</p>
        <div className="space-y-2">
          {FREQUENCES.map(f => (
            <label key={f.value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="frequence" value={f.value} className="accent-cyan-400" />
              <span className="text-sm text-white/70">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
          Pourquoi veux-tu tester FishDex ? <span className="text-white/25 font-normal normal-case tracking-normal">(optionnel)</span>
        </p>
        <textarea
          name="message"
          rows={3}
          placeholder="En quelques mots…"
          className="w-full rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-cyan-400/50 resize-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400 text-center">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-2xl bg-cyan-400 text-[#0a0f14] font-bold text-base disabled:opacity-40 transition-opacity active:scale-[0.98]"
      >
        {pending ? 'Envoi…' : 'Rejoindre la liste d\'attente'}
      </button>
    </form>
  )
}
