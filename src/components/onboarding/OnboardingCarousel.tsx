'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { completeOnboarding } from '@/app/actions/onboarding'
import { ProgressIndicators } from './ProgressIndicators'
import { Screen1 } from './screens/Screen1'
import { Screen2 } from './screens/Screen2'
import { Screen3 } from './screens/Screen3'
import { Screen4 } from './screens/Screen4'

const SCREENS = [
  { component: Screen1, cta: 'Suivant',           ctaIcon: ArrowRight },
  { component: Screen2, cta: 'Suivant',           ctaIcon: ArrowRight },
  { component: Screen3, cta: 'Suivant',           ctaIcon: ArrowRight },
  { component: Screen4, cta: 'Découvrir FishDex', ctaIcon: ArrowRight },
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
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black">
      {/* ── Header flottant (par-dessus les photos) ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-2">
        {/* Retour (caché sur écran 1) */}
        <div className="w-10">
          {page > 0 && (
            <button
              onClick={() => go(page - 1, -1)}
              aria-label="Précédent"
              className="w-10 h-10 rounded-full bg-black/40 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Passer (discret) */}
        <button
          onClick={handleComplete}
          disabled={completing}
          className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm"
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

      {/* ── Footer flottant ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-4 px-6 pb-12 pt-6"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
      >
        {/* Progress dots */}
        <ProgressIndicators
          total={SCREENS.length}
          current={page}
          onChange={(i) => go(i, i > page ? 1 : -1)}
        />

        {/* CTA */}
        {isLast ? (
          <form action={handleComplete} className="w-full">
            <button
              type="submit"
              disabled={completing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-[#0a0f14] transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, rgb(34,211,238) 0%, rgb(6,182,212) 100%)',
                boxShadow: '0 0 30px rgba(34,211,238,0.5)',
              }}
            >
              <CtaIcon size={18} />
              {completing ? 'Chargement…' : cta}
            </button>
          </form>
        ) : (
          <button
            onClick={() => go(page + 1, 1)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {cta}
            <ArrowRight size={18} />
          </button>
        )}

        {/* Se connecter */}
        <Link
          href="/login"
          className="text-sm text-white/35 hover:text-white/60 transition-colors py-1"
        >
          Déjà un compte ?{' '}
          <span className="text-cyan-400/60 hover:text-cyan-400">Se connecter</span>
        </Link>
      </div>
    </div>
  )
}
