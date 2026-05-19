'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MapPin, BookOpen, Camera, Fish, CalendarDays } from 'lucide-react'
import { haptic } from '@/lib/haptics'

const TABS = [
  { href: '/',         label: 'Le Spot',  Icon: MapPin      },
  { href: '/fishdex',  label: 'FishDex',  Icon: BookOpen    },
  { href: '/capture',  label: 'Capture',  Icon: Camera, isFab: true },
  { href: '/aquarium', label: 'Aquarium', Icon: Fish        },
  { href: '/sessions', label: 'Sessions', Icon: CalendarDays },
]

export function BottomNavV2() {
  const pathname = usePathname()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-2"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
    >
      {/* Halo ambiant derrière la barre */}
      <div
        className="absolute inset-x-4 bottom-0 h-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.10) 0%, transparent 65%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Barre principale */}
      <nav
        className="relative w-full flex items-center justify-around h-[62px] rounded-full px-2"
        style={{
          background: 'rgba(6, 10, 16, 0.88)',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          boxShadow: [
            '0 0 0 1px rgba(34,211,238,0.18)',
            '0 0 16px rgba(34,211,238,0.08)',
            '0 8px 30px rgba(0,0,0,0.6)',
            'inset 0 1px 0 rgba(255,255,255,0.06)',
          ].join(','),
        }}
      >
        {TABS.map(({ href, label, Icon, isFab }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (isFab) {
            return (
              <Link
                key={href}
                href={href}
                aria-label="Nouvelle capture"
                onClick={() => haptic('medium')}
                className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform duration-100"
              >
                <motion.div
                  animate={active ? { scale: 1 } : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 3.2, repeat: active ? 0 : Infinity, ease: 'easeInOut' }}
                  className="flex items-center justify-center w-[52px] h-[52px] rounded-full"
                  style={{
                    background: 'rgba(8, 14, 22, 0.9)',
                    boxShadow: active
                      ? [
                          '0 0 0 2.5px rgba(34,211,238,0.9)',
                          '0 0 16px 3px rgba(34,211,238,0.7)',
                          '0 0 40px 8px rgba(34,211,238,0.25)',
                        ].join(',')
                      : [
                          '0 0 0 2px rgba(34,211,238,0.55)',
                          '0 0 12px 2px rgba(34,211,238,0.40)',
                          '0 0 28px 6px rgba(34,211,238,0.14)',
                        ].join(','),
                  }}
                >
                  <Camera
                    size={22}
                    strokeWidth={1.8}
                    className={active ? 'text-cyan-300' : 'text-white/80'}
                  />
                </motion.div>
                <span className={`text-[10px] font-medium leading-none ${active ? 'text-cyan-400' : 'text-white/35'}`}>
                  {label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              onClick={() => haptic('light')}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-90 transition-all duration-150"
            >
              <Icon
                size={20}
                strokeWidth={active ? 2 : 1.5}
                className={`transition-all duration-200 ${
                  active
                    ? 'text-white drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]'
                    : 'text-white/30'
                }`}
              />
              <span className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                active ? 'text-white/80' : 'text-white/25'
              }`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
