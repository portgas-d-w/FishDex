'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { SpeciesGrid } from './SpeciesGrid'
import { UserMenu } from '@/components/shared/UserMenu'
import type { SpeciesRow } from '@/types/fishdex'

type Props = {
  species: SpeciesRow[]
  discoveredSlugs: string[]
  username: string
  email: string
  avatarUrl: string | null
  children?: React.ReactNode
}

export function FishDexShell({ species, discoveredSlugs, username, email, avatarUrl, children }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div
      className="min-h-screen flex flex-col pb-24"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="w-10" />
        <h1 className="text-xl font-bold tracking-tight text-white">FishDex</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Ouvrir la recherche"
            className={`w-10 h-10 flex items-center justify-center rounded-full border backdrop-blur-sm transition-colors
              ${searchOpen
                ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-400'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
          >
            <Search size={18} />
          </button>
          <UserMenu username={username} email={email} avatarUrl={avatarUrl} />
        </div>
      </header>

      {/* ── ProgressionCard (Server Component passé en children) ── */}
      {children}

      {/* ── Grille filtrée ── */}
      <div className="flex flex-col gap-4 flex-1 mt-2">
        <SpeciesGrid
          species={species}
          discoveredSlugs={discoveredSlugs}
          showSearch={searchOpen}
          onCloseSearch={() => setSearchOpen(false)}
        />
      </div>
    </div>
  )
}
