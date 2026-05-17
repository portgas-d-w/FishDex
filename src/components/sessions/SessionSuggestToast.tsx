'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Fish, X } from 'lucide-react'
import { updateProfilePreference } from '@/app/actions/profiles'

const STORAGE_KEY = 'sessionSuggestSkips'
const MAX_SKIPS = 3

export function SessionSuggestToast({ show }: { show: boolean }) {
  const router = useRouter()
  const [visible, setVisible]     = useState(false)
  const [skipCount, setSkipCount] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!show) return
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    setSkipCount(stored)
    // Petit délai pour laisser la page se rendre
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [show])

  function handleStart() {
    setVisible(false)
    router.push('/sessions/new')
  }

  function handleSkip() {
    const next = skipCount + 1
    localStorage.setItem(STORAGE_KEY, String(next))
    setSkipCount(next)
    setVisible(false)
  }

  async function handleNeverAsk() {
    setVisible(false)
    setDismissed(true)
    localStorage.removeItem(STORAGE_KEY)
    await updateProfilePreference('suggest_session_on_capture', false)
  }

  if (!visible || dismissed) return null

  const showNeverAsk = skipCount >= MAX_SKIPS - 1

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-2xl p-4">
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-3 pr-4">
          <div className="w-9 h-9 rounded-full bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0">
            <Fish size={16} className="text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-snug">
              Belle prise !
            </p>
            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
              Tu veux démarrer une session pour suivre tes prochaines captures ?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 ml-12">
          <button
            onClick={handleStart}
            className="flex-1 py-2 rounded-xl bg-cyan-400 text-[#0a0f14] text-xs font-bold hover:bg-cyan-300 transition-colors"
          >
            Démarrer
          </button>
          <button
            onClick={showNeverAsk ? handleNeverAsk : handleSkip}
            className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/8 transition-colors"
          >
            {showNeverAsk ? 'Ne plus demander' : 'Plus tard'}
          </button>
        </div>
      </div>
    </div>
  )
}
