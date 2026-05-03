'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Fish, Newspaper } from 'lucide-react'

const TABS = [
  { href: '/fishdex',  label: 'FishDex',  Icon: BookOpen,   disabled: false },
  { href: '/fishfeed', label: 'FishFeed', Icon: Newspaper,  disabled: true  },
  { href: '/aquarium', label: 'Aquarium', Icon: Fish,        disabled: false },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/90 backdrop-blur-sm border-t border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16">
        {TABS.map(({ href, label, Icon, disabled }) => {
          if (disabled) {
            return (
              <div
                key={href}
                className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[48px] text-slate-700 cursor-not-allowed select-none"
              >
                <Icon size={20} strokeWidth={2} />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {label}
                  <br />
                  <span className="text-[9px] text-slate-600">Bientôt</span>
                </span>
              </div>
            )
          }

          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[48px] transition-colors ${
                active ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
