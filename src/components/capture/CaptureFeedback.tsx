'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Fish, CheckCircle2 } from 'lucide-react'

type Props = {
  visible: boolean
  uploading: boolean
  error: string | null
}

export function CaptureFeedback({ visible, uploading: _uploading, error }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-3 pb-4"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-2xl border px-4 py-3.5 flex items-center gap-3"
            style={{
              background: error ? 'rgba(30, 10, 10, 0.88)' : 'rgba(5, 20, 35, 0.88)',
              backdropFilter: 'blur(20px)',
              borderColor: error ? 'rgba(248,113,113,0.3)' : 'rgba(34,211,238,0.3)',
              boxShadow: error
                ? '0 0 24px rgba(239,68,68,0.15)'
                : '0 0 24px rgba(34,211,238,0.15)',
            }}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                ${error ? 'bg-red-500/15 border border-red-500/30' : 'bg-cyan-500/15 border border-cyan-400/40'}`}
              style={error ? undefined : { boxShadow: '0 0 12px rgba(34,211,238,0.3)' }}
            >
              {error
                ? <Fish size={16} className="text-red-400" />
                : <CheckCircle2 size={16} className="text-cyan-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              {error ? (
                <>
                  <p className="text-sm font-bold text-red-400">Échec de l'envoi</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{error}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-white">Photo capturée !</p>
                  <p className="text-xs text-slate-400 mt-0.5">Redirection en cours…</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
