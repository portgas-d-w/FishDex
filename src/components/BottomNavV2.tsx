'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MapPin, Book, Camera, Fish, Calendar } from 'lucide-react'
import { haptic } from '@/lib/haptics'

const PUBLIC_PATHS = ['/login', '/signup', '/mot-de-passe-oublie', '/nouveau-mot-de-passe', '/onboarding']

const LEFT_TABS = [
  { href: '/',        label: 'Le Spot', Icon: MapPin  },
  { href: '/fishdex', label: 'FishDex', Icon: Book    },
]
const RIGHT_TABS = [
  { href: '/aquarium', label: 'Aquarium', Icon: Fish     },
  { href: '/sessions', label: 'Sessions', Icon: Calendar },
]

function NavTab({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  const pathname = usePathname()
  const active   = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={() => haptic('light')}
      className="flex-1 flex flex-col items-center justify-center gap-1.5 relative h-full transition-all duration-200 active:scale-90"
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

      <Icon
        size={20}
        strokeWidth={active ? 2.2 : 1.6}
        className={`relative transition-all duration-200 ${
          active
            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
            : 'text-white/30'
        }`}
      />
      <span className={`text-[10px] font-semibold tracking-wide relative transition-colors duration-200 ${
        active ? 'text-cyan-400' : 'text-white/25'
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
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(14,20,28,0.75) 100%)',
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
            style={{ top: '-18px' }}
            animate={captureActive ? { scale: 1 } : { scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: captureActive ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <Link
              href="/capture"
              aria-label="Nouvelle capture"
              onClick={() => haptic('medium')}
              className="flex items-center justify-center w-[52px] h-[52px] rounded-full active:scale-90 transition-transform duration-100"
              style={{
                background: 'linear-gradient(145deg, #a5f3fc 0%, #22d3ee 45%, #0891b2 100%)',
                boxShadow: captureActive
                  ? '0 0 0 3px rgba(34,211,238,0.35), 0 0 20px 6px rgba(34,211,238,0.65), 0 0 50px 12px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.45)'
                  : '0 0 0 2px rgba(34,211,238,0.22), 0 0 16px 4px rgba(34,211,238,0.50), 0 0 36px 8px rgba(34,211,238,0.18), 0 4px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.38)',
              }}
            >
              <Camera size={22} strokeWidth={2.3} className="text-slate-950" />
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
