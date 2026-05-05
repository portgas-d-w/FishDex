'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, Fish, Camera } from 'lucide-react'
import { completeOnboarding } from '@/app/actions/onboarding'
import { ProgressIndicators } from './ProgressIndicators'
import { Screen1 } from './screens/Screen1'
import { Screen2 } from './screens/Screen2'
import { Screen3 } from './screens/Screen3'
import { Screen4 } from './screens/Screen4'
import { Screen5 } from './screens/Screen5'

const SCREENS = [
  { component: Screen1, cta: "Commencer l'aventure", ctaIcon: ArrowRight },
  { component: Screen2, cta: 'Commencer la détection', ctaIcon: ArrowRight },
  { component: Screen3, cta: "Compléter mon FishDex", ctaIcon: Fish },
  { component: Screen4, cta: 'Voir mon historique', ctaIcon: Fish },
  { component: Screen5, cta: 'Rejoindre la communauté', ctaIcon: Camera },
]

const SWIPE_THRESHOLD = 50

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export function OnboardingCarousel() {
  const [[page, direction], setPage] = useState([0, 0])
  const [completing, setCompleting] = useState(false)

  const isLast = page === SCREENS.length - 1
  const Screen = SCREENS[page].component
  const { cta, ctaIcon: CtaIcon } = SCREENS[page]

  function go(newPage: number, dir: number) {
    if (newPage < 0 || newPage >= SCREENS.length) return
    setPage([newPage, dir])
  }

  async function handleComplete() {
    setCompleting(true)
    await completeOnboarding()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 50%), linear-gradient(to bottom, #020c14, #0a1929 50%, #0d1117)',
      }}
    >
      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-2 shrink-0">
        {/* Retour (caché sur écran 1) */}
        <div className="w-10">
          {page > 0 && (
            <button
              onClick={() => go(page - 1, -1)}
              aria-label="Précédent"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 20 14" className="w-5 h-3.5" fill="none">
            <ellipse cx="11" cy="7" rx="7" ry="4.5" fill="rgb(34,211,238)" opacity="0.9" />
            <path d="M4 7 L0 2.5 L0 11.5 Z" fill="rgb(34,211,238)" opacity="0.7" />
          </svg>
          <span className="text-sm font-bold text-cyan-400">FishDex</span>
        </div>

        {/* Passer */}
        <button
          onClick={handleComplete}
          disabled={completing}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
        >
          Passer
        </button>
      </div>

      {/* ── Écran actif ── */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -SWIPE_THRESHOLD) go(page + 1, 1)
              else if (offset.x > SWIPE_THRESHOLD) go(page - 1, -1)
            }}
            className="absolute inset-0"
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-12 pt-2 shrink-0">
        {/* Indicateurs */}
        <ProgressIndicators
          total={SCREENS.length}
          current={page}
          onChange={(i) => go(i, i > page ? 1 : -1)}
        />

        {/* CTA principal */}
        {isLast ? (
          <form action={handleComplete} className="w-full">
            <button
              type="submit"
              disabled={completing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-slate-900 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, rgb(34,211,238) 0%, rgb(6,182,212) 100%)',
                boxShadow: '0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(34,211,238,0.2)',
              }}
            >
              <CtaIcon size={18} />
              {completing ? 'Chargement…' : "C'est parti !"}
            </button>
          </form>
        ) : (
          <button
            onClick={() => go(page + 1, 1)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(6,182,212,0.08) 100%)',
              border: '1px solid rgba(34,211,238,0.4)',
              color: 'rgb(34,211,238)',
              boxShadow: '0 0 20px rgba(34,211,238,0.15)',
            }}
          >
            {cta}
            <ArrowRight size={18} />
          </button>
        )}

        {/* Se connecter */}
        <Link
          href="/login"
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors py-1"
        >
          Déjà un compte ?{' '}
          <span className="text-cyan-400/70 hover:text-cyan-400">Se connecter</span>
        </Link>
      </div>
    </div>
  )
}
