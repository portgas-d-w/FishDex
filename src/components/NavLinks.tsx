'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks() {
  const pathname = usePathname()
  const isFishDex = pathname.startsWith('/fishdex')
  const isAquarium = pathname.startsWith('/aquarium')

  return (
    <nav className="flex items-center gap-1">
      <Link
        href="/fishdex"
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          isFishDex
            ? 'text-teal-400 bg-teal-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        FishDex
      </Link>
      <Link
        href="/aquarium"
        className={`px-3 py-2 text-sm rounded-md transition-colors ${
          isAquarium
            ? 'text-teal-400 bg-teal-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        Aquarium
      </Link>
    </nav>
  )
}
