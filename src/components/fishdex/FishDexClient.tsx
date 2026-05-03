'use client'

import { useState, useMemo } from 'react'
import { Search, X, Fish, Lock, BookOpen } from 'lucide-react'
import { SpeciesCard } from './SpeciesCard'
import { SpeciesCardLocked } from './SpeciesCardLocked'
import { rareteOrder, rareteConfig } from '@/lib/fishdex/rarete'
import type { SpeciesRow, Rarete } from '@/types/fishdex'

type Props = {
  species: SpeciesRow[]
  discoveredSlugs: string[]
}

export function FishDexClient({ species, discoveredSlugs }: Props) {
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [activeRarete, setActiveRarete] = useState<Rarete | 'toutes'>('toutes')

  const discoveredSet = useMemo(() => new Set(discoveredSlugs), [discoveredSlugs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return species.filter((s) => {
      const matchSearch = q === '' || s.nom_fr.toLowerCase().includes(q)
      const matchRarete = activeRarete === 'toutes' || s.rarete === activeRarete
      return matchSearch && matchRarete
    })
  }, [species, search, activeRarete])

  const discovered = filtered.filter((s) => discoveredSet.has(s.slug))
  const locked = filtered.filter((s) => !discoveredSet.has(s.slug))

  function toggleSearch() {
    setShowSearch((v) => !v)
    if (showSearch) setSearch('')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Barre de recherche (header inline) ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h1
            className="text-3xl font-black text-slate-100 tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            FishDex
          </h1>
        </div>
        <button
          onClick={toggleSearch}
          aria-label={showSearch ? 'Fermer la recherche' : 'Rechercher une espèce'}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-teal-400 hover:border-teal-500/40 transition-all"
        >
          {showSearch ? <X size={18} /> : <Search size={18} />}
        </button>
      </div>

      {showSearch && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            autoFocus
            type="text"
            placeholder="Rechercher une espèce…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
      )}

      {/* ── Filtres rareté ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        {/* Bouton "Toutes" */}
        <button
          onClick={() => setActiveRarete('toutes')}
          className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
            activeRarete === 'toutes'
              ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
              : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          Toutes
        </button>

        {/* Boutons par rareté */}
        {rareteOrder.map((r) => {
          const cfg = rareteConfig[r]
          const isActive = activeRarete === r
          return (
            <button
              key={r}
              onClick={() => setActiveRarete(r)}
              className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                isActive
                  ? `${cfg.badge} ${cfg.badgeBorder}`
                  : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Dot */}
              {r === 'shiny' ? (
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 shrink-0" />
              ) : (
                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
              )}
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* ── Espèces découvertes ── */}
      {discovered.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fish size={16} className="text-teal-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                Espèces découvertes
              </h2>
              <span className="text-xs font-bold text-teal-400 tabular-nums">
                ({discovered.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-600">Par numéro</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {discovered.map((s) => (
              <SpeciesCard key={s.id} species={s} />
            ))}
          </div>
        </section>
      )}

      {/* ── Espèces non découvertes ── */}
      {locked.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-slate-600" />
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Espèces non découvertes
            </h2>
            <span className="text-xs font-bold text-slate-600 tabular-nums">
              ({locked.length})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {locked.map((s) => (
              <SpeciesCardLocked key={s.id} species={s} />
            ))}
          </div>
        </section>
      )}

      {/* ── Aucun résultat ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Search size={32} className="text-slate-700" />
          <p className="text-slate-500 text-sm">
            Aucune espèce trouvée pour &quot;{search}&quot;
          </p>
          <button
            onClick={() => { setSearch(''); setShowSearch(false) }}
            className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}

      {/* ── Footer encourageant ── */}
      {search === '' && activeRarete === 'toutes' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-teal-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chaque prise t&apos;aide à compléter ton FishDex.{' '}
            <span className="text-teal-400 font-semibold">
              {discoveredSlugs.length} / {species.length}
            </span>{' '}
            espèces découvertes !
          </p>
        </div>
      )}

    </div>
  )
}
