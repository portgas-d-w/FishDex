'use client'

import { motion } from 'framer-motion'
import { Fish, ChevronRight, Loader2 } from 'lucide-react'

type Props = {
  visible: boolean
  onContinue: () => void
  uploading: boolean
  error: string | null
}

export function CaptureFeedback({ visible, onContinue, uploading, error }: Props) {
  if (!visible) return null

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 px-4 pb-6"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-2xl border border-white/10 px-4 py-4"
        style={{
          background: 'rgba(10, 25, 41, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.4)',
        }}
      >
        {error ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <Fish size={18} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-400">Échec de l'envoi</p>
              <p className="text-xs text-slate-400 mt-0.5">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shrink-0"
                style={{ boxShadow: '0 0 16px rgba(34,211,238,0.25)' }}
              >
                <Fish size={18} className="text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Photo capturée !</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tu peux maintenant ajouter les détails de ta prise
                </p>
              </div>
            </div>

            <button
              onClick={onContinue}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 font-semibold text-sm
                hover:bg-cyan-500/30 transition-all duration-200 active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: uploading ? 'none' : '0 0 20px rgba(34,211,238,0.2)' }}
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Continuer
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
