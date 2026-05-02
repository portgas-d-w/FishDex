'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Fish } from 'lucide-react'

const TABS = [
  { href: '/',         label: 'Accueil',  Icon: Home },
  { href: '/fishdex',  label: 'FishDex',  Icon: BookOpen },
  { href: '/aquarium', label: 'Aquarium', Icon: Fish },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/90 backdrop-blur-sm border-t border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16">
        {TABS.map(({ href, label, Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href)
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
