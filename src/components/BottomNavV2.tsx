'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MapPin, Book, Camera, Fish, Calendar } from 'lucide-react'
import { haptic } from '@/lib/haptics'

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
      className="flex-1 flex flex-col items-center justify-center gap-1 relative min-h-[52px] transition-all duration-200 active:scale-90"
    >
      {/* Pill de highlight actif */}
      <AnimatePresence>
        {active && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-x-1.5 inset-y-1 rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.05) 100%)',
              boxShadow: '0 0 12px rgba(34,211,238,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </AnimatePresence>

      {/* Icône */}
      <span className="relative flex items-center justify-center">
        <Icon
          size={21}
          strokeWidth={active ? 2.2 : 1.6}
          className={`relative transition-all duration-200 ${
            active ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]' : 'text-white/35'
          }`}
        />
        {/* Dot actif bioluminescent */}
        {active && (
          <motion.span
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 6px 1px rgba(34,211,238,0.8)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
          />
        )}
      </span>

      <span className={`text-[10px] font-semibold relative leading-none tracking-wide transition-all duration-200 ${
        active ? 'text-cyan-400' : 'text-white/25'
      }`}>
        {label}
      </span>
    </Link>
  )
}

export function BottomNavV2() {
  const pathname     = usePathname()
  const captureActive = pathname.startsWith('/capture')

  return (
    /* Wrapper safe-area + floating margin */
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
    >
      {/* Ambient cyan glow sous la barre */}
      <div
        className="absolute inset-x-8 bottom-[env(safe-area-inset-bottom)] h-12 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.12) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      <nav className="relative pointer-events-auto">
        {/* Verre dépoli — couche principale */}
        <div
          className="flex items-stretch h-[64px] rounded-[28px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            boxShadow: [
              '0 8px 32px rgba(0,0,0,0.45)',
              '0 2px 8px rgba(0,0,0,0.3)',
              'inset 0 1px 0 rgba(255,255,255,0.12)',
              'inset 0 -1px 0 rgba(255,255,255,0.04)',
              '0 0 0 1px rgba(255,255,255,0.08)',
            ].join(','),
          }}
        >
          {/* Reflet supérieur — shimmer linéaire */}
          <div
            className="absolute inset-x-0 top-0 h-[1px] rounded-t-[28px]"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.25) 40%, rgba(34,211,238,0.3) 60%, rgba(255,255,255,0.15) 80%, transparent 95%)',
            }}
          />

          {LEFT_TABS.map(t => <NavTab key={t.href} {...t} />)}

          {/* FAB Capture — slot central */}
          <div className="flex-none w-[72px] flex flex-col items-center justify-center gap-1 relative">
            {/* Séparateurs vitreux */}
            <div className="absolute left-0 top-3 bottom-3 w-px bg-white/6" />
            <div className="absolute right-0 top-3 bottom-3 w-px bg-white/6" />

            <motion.div
              animate={captureActive ? { scale: 1 } : { scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: captureActive ? 0 : Infinity, ease: 'easeInOut' }}
              style={{ marginTop: '-20px' }}
            >
              <Link
                href="/capture"
                aria-label="Nouvelle capture"
                onClick={() => haptic('medium')}
                className="flex items-center justify-center w-[54px] h-[54px] rounded-full active:scale-90 transition-transform duration-150"
                style={{
                  background: captureActive
                    ? 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)'
                    : 'linear-gradient(135deg, #a5f3fc 0%, #22d3ee 40%, #0891b2 100%)',
                  boxShadow: captureActive
                    ? [
                        '0 0 0 3px rgba(34,211,238,0.3)',
                        '0 0 20px 4px rgba(34,211,238,0.6)',
                        '0 0 40px 8px rgba(34,211,238,0.3)',
                        '0 0 80px 16px rgba(34,211,238,0.12)',
                        'inset 0 1px 0 rgba(255,255,255,0.4)',
                      ].join(',')
                    : [
                        '0 0 0 2px rgba(34,211,238,0.2)',
                        '0 0 16px 4px rgba(34,211,238,0.45)',
                        '0 0 32px 8px rgba(34,211,238,0.2)',
                        '0 4px 16px rgba(0,0,0,0.4)',
                        'inset 0 1px 0 rgba(255,255,255,0.35)',
                      ].join(','),
                }}
              >
                <Camera
                  size={24}
                  strokeWidth={2.2}
                  className="text-slate-950 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                />
              </Link>
            </motion.div>

            <span className={`text-[10px] font-semibold leading-none tracking-wide mt-0.5 ${
              captureActive ? 'text-cyan-400' : 'text-white/30'
            }`}>
              Capture
            </span>
          </div>

          {RIGHT_TABS.map(t => <NavTab key={t.href} {...t} />)}
        </div>
      </nav>
    </div>
  )
}
