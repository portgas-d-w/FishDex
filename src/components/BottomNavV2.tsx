'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Camera } from 'lucide-react'
import { haptic } from '@/lib/haptics'

const PUBLIC_PATHS = ['/login', '/signup', '/mot-de-passe-oublie', '/nouveau-mot-de-passe', '/onboarding']

const LEFT_TABS = [
  { href: '/',        label: 'Le Spot', img: '/nav/spot.png'    },
  { href: '/fishdex', label: 'FishDex', img: '/nav/fishdex.png' },
]
const RIGHT_TABS = [
  { href: '/aquarium', label: 'Aquarium', img: '/nav/aquarium.png'  },
  { href: '/sessions', label: 'Sessions', img: '/nav/sessions.png'  },
]

function NavTab({ href, label, img }: { href: string; label: string; img: string }) {
  const pathname = usePathname()
  const active   = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={() => haptic('light')}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 relative h-full transition-all duration-200 active:scale-90"
    >
      {/* Pill actif — slide via layoutId */}
      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-x-2 inset-y-2 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.04) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          />
        )}
      </AnimatePresence>

      <span
        className="relative transition-all duration-200"
        style={{
          filter: active
            ? 'drop-shadow(0 0 8px rgba(34,211,238,0.85)) drop-shadow(0 0 3px rgba(34,211,238,0.6)) brightness(1.1)'
            : 'brightness(0.82) saturate(0.6) drop-shadow(0 1px 6px rgba(255,255,255,0.18))',
        }}
      >
        <Image
          src={img}
          alt={label}
          width={44}
          height={44}
          className="object-contain"
          unoptimized
        />
      </span>

      <span className={`text-[10px] font-semibold tracking-wide relative transition-colors duration-200 ${
        active ? 'text-cyan-400' : 'text-white/50'
      }`}>
        {label}
      </span>

      {/* Dot bioluminescent */}
      {active && (
        <motion.span
          className="absolute bottom-1.5 w-1 h-1 rounded-full bg-cyan-400"
          style={{ boxShadow: '0 0 6px 2px rgba(34,211,238,0.7)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 500, damping: 25 }}
        />
      )}
    </Link>
  )
}

export function BottomNavV2() {
  const pathname      = usePathname()
  const captureActive = pathname.startsWith('/capture')

  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-3.5"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
    >
      {/* Halo ambiant cyan sous la barre */}
      <div
        className="absolute inset-x-12 bottom-0 h-16 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(34,211,238,0.14) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Barre principale — PAS d'overflow:hidden pour laisser le FAB déborder */}
      <div
        className="relative flex items-center rounded-[26px] h-[62px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(14,20,28,0.92) 100%)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          boxShadow: [
            '0 0 0 1px rgba(255,255,255,0.09)',
            '0 8px 32px rgba(0,0,0,0.50)',
            '0 2px 8px rgba(0,0,0,0.35)',
            'inset 0 1px 0 rgba(255,255,255,0.13)',
          ].join(','),
        }}
      >
        {/* Reflet supérieur */}
        <div
          className="absolute top-0 inset-x-0 h-px rounded-t-[26px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.22) 35%, rgba(34,211,238,0.35) 55%, rgba(255,255,255,0.15) 80%, transparent 95%)',
          }}
        />

        {LEFT_TABS.map(t => <NavTab key={t.href} {...t} />)}

        {/* Slot FAB central */}
        <div className="flex-none w-[72px] flex flex-col items-center justify-center gap-1 relative h-full">
          {/* Séparateurs */}
          <div className="absolute left-0 top-3 bottom-3 w-px bg-white/8 pointer-events-none" />
          <div className="absolute right-0 top-3 bottom-3 w-px bg-white/8 pointer-events-none" />

          {/* FAB surélevé — en dehors du flux, pas besoin d'overflow:hidden */}
          <motion.div
            className="absolute"
            style={{ top: '-20px' }}
            animate={captureActive ? { scale: 1 } : { scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: captureActive ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <Link
              href="/capture"
              aria-label="Nouvelle capture"
              onClick={() => haptic('medium')}
              className="group relative isolate flex h-[56px] w-[56px] items-center justify-center rounded-full active:scale-90 transition-transform duration-100"
              style={{
                boxShadow: captureActive
                  ? '0 0 0 1px rgba(255,255,255,0.24), 0 0 12px 1px rgba(255,255,255,0.22), 0 10px 24px rgba(0,0,0,0.46)'
                  : '0 0 0 1px rgba(255,255,255,0.15), 0 8px 18px rgba(0,0,0,0.44)',
              }}
            >
              <span className="beam-glow" />
              <span className="beam-ring" />
              <span
                className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/20 backdrop-blur-[18px]"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.12) 46%, rgba(255,255,255,0.06) 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.52), inset 0 -13px 20px rgba(2,8,23,0.24), inset -7px -8px 18px rgba(255,255,255,0.05)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-75 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 29% 17%, rgba(255,255,255,0.52) 0%, transparent 25%), linear-gradient(145deg, rgba(255,255,255,0.16) 0%, transparent 36%)',
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-1 top-2 h-7 w-px rotate-[30deg] bg-white/55 blur-[0.5px] pointer-events-none"
                />
                <Camera
                  size={22}
                  strokeWidth={2.35}
                  className="relative z-10 text-white/92 drop-shadow-[0_1px_6px_rgba(255,255,255,0.35)]"
                />
              </span>
            </Link>
          </motion.div>

          {/* Label Capture */}
          <span
            className={`absolute bottom-2 text-[10px] font-semibold tracking-wide ${
              captureActive ? 'text-cyan-400' : 'text-white/28'
            }`}
          >
            Capture
          </span>
        </div>

        {RIGHT_TABS.map(t => <NavTab key={t.href} {...t} />)}
      </div>
    </div>
  )
}
