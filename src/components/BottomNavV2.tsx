'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, MessageSquare, Fish, Trophy } from 'lucide-react'

const TABS = [
  { href: '/',         label: 'Le Spot',  Icon: Home,           disabled: false },
  { href: '/fishdex',  label: 'FishDex',  Icon: BookOpen,       disabled: false },
  { href: '/fishfeed', label: 'FishFeed', Icon: MessageSquare,  disabled: true  },
  { href: '/aquarium', label: 'Aquarium', Icon: Fish,           disabled: false },
  { href: '/missions', label: 'Missions', Icon: Trophy,         disabled: false },
]

export function BottomNavV2() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[70px] px-2">
        {TABS.map(({ href, label, Icon, disabled }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)

          if (disabled) {
            return (
              <div
                key={href}
                className="flex-1 flex flex-col items-center justify-center gap-1 select-none cursor-not-allowed min-h-[48px]"
              >
                <Icon size={22} strokeWidth={1.8} className="text-slate-700" />
                <span className="text-[10px] font-medium text-slate-700 leading-none">{label}</span>
                <span className="text-[9px] text-slate-700/60 leading-none">Bientôt</span>
              </div>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative min-h-[48px]
                transition-colors duration-200 active:scale-95
                ${active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {/* Ligne indicateur haut */}
              {active && (
                <span className="absolute top-0 inset-x-4 h-[3px] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              )}

              {/* Fond actif */}
              {active && (
                <span className="absolute inset-x-1 inset-y-1 rounded-xl bg-cyan-400/8 pointer-events-none" />
              )}

              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className="relative"
              />
              <span className="text-[10px] font-medium relative leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
