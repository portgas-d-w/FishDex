'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MapPin, Book, Camera, Fish, Calendar } from 'lucide-react'
import { haptic } from '@/lib/haptics'

const LEFT_TABS  = [
  { href: '/',        label: 'Le Spot',  Icon: MapPin   },
  { href: '/fishdex', label: 'FishDex',  Icon: Book     },
]
const RIGHT_TABS = [
  { href: '/aquarium',  label: 'Aquarium', Icon: Fish     },
  { href: '/sessions',  label: 'Sessions', Icon: Calendar },
]

function NavTab({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  const pathname = usePathname()
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex-1 flex flex-col items-center justify-center gap-1 relative min-h-[48px]
        transition-colors duration-200 active:scale-95
        ${active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {active && (
        <span className="absolute top-0 inset-x-4 h-[3px] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
      )}
      {active && (
        <span className="absolute inset-x-1 inset-y-1 rounded-xl bg-cyan-400/8 pointer-events-none" />
      )}
      <Icon size={22} strokeWidth={active ? 2.5 : 1.8} className="relative" />
      <span className="text-[10px] font-medium relative leading-none">{label}</span>
    </Link>
  )
}

export function BottomNavV2() {
  const pathname = usePathname()
  const captureActive = pathname.startsWith('/capture')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 overflow-visible bg-slate-950/95 backdrop-blur-md border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[70px] px-2">
        {LEFT_TABS.map(t => <NavTab key={t.href} {...t} />)}

        {/* FAB Capture — slot central surélevé */}
        <div className="flex-none w-20 relative flex flex-col items-center justify-end pb-2.5">
          <motion.div
            className="absolute -top-5"
            animate={captureActive ? { scale: 1 } : {
              scale: [1, 1.04, 1],
            }}
            transition={{ duration: 2.8, repeat: captureActive ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <Link
              href="/capture"
              aria-label="Nouvelle capture"
              onClick={() => haptic('medium')}
              className={`flex items-center justify-center w-[56px] h-[56px] rounded-full
                bg-cyan-400 ring-2 ring-cyan-400/30 transition-all duration-150 active:scale-90
                ${captureActive
                  ? 'shadow-[0_0_40px_rgba(34,211,238,0.9)] ring-white/30'
                  : 'shadow-[0_0_30px_rgba(34,211,238,0.6)]'}`}
            >
              <Camera size={26} strokeWidth={2} className="text-slate-950" />
            </Link>
          </motion.div>
          <span className={`text-[10px] font-medium leading-none ${captureActive ? 'text-cyan-400' : 'text-slate-500'}`}>
            Capture
          </span>
        </div>

        {RIGHT_TABS.map(t => <NavTab key={t.href} {...t} />)}
      </div>
    </nav>
  )
}
