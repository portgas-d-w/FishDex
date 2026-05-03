'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Fish, Newspaper, MapPin } from 'lucide-react'

const TABS = [
  { href: '/fishdex',  label: 'FishDex',  Icon: BookOpen,  disabled: false },
  { href: '/fishfeed', label: 'FishFeed', Icon: Newspaper, disabled: true  },
  { href: '/aquarium', label: 'Aquarium', Icon: Fish,       disabled: false },
  { href: '/',         label: 'Le Spot',  Icon: MapPin,     disabled: false },
]

export function BottomNavV2() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[70px]">
        {TABS.map(({ href, label, Icon, disabled }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (disabled) {
            return (
              <div
                key={href}
                className="flex-1 flex flex-col items-center justify-center gap-1 select-none cursor-not-allowed"
              >
                <Icon size={20} strokeWidth={2} className="text-slate-700" />
                <span className="text-[10px] font-medium text-slate-700 leading-none">{label}</span>
                <span className="text-[9px] text-slate-700 leading-none">Bientôt</span>
              </div>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors duration-200 ${
                active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {/* Indicateur actif */}
              {active && (
                <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}

              {/* Zone active background */}
              {active && (
                <span className="absolute inset-1 rounded-xl bg-cyan-400/8 pointer-events-none" />
              )}

              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                className="relative"
              />
              <span className="text-[11px] font-medium relative leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
