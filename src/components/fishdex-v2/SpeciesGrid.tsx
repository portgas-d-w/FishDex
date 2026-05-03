'use client'

import { useState } from 'react'
import { Fish, Lock, BookOpen, RotateCcw } from 'lucide-react'
import { RarityFilters } from './RarityFilters'
import { SearchBar } from './SearchBar'
import { SpeciesCard } from './SpeciesCard'
import { SpeciesCardLocked } from './SpeciesCardLocked'
import type { SpeciesRow, Rarete } from '@/types/fishdex'

type Props = {
  species: SpeciesRow[]
  discoveredSlugs: string[]
  showSearch: boolean
  onCloseSearch: () => void
}

export function SpeciesGrid({ species, discoveredSlugs, showSearch, onCloseSearch }: Props) {
  const [activeFilter, setActiveFilter] = useState<Rarete | 'toutes'>('toutes')
  const [query, setQuery] = useState('')

  const discoveredSet = new Set(discoveredSlugs)

  const filtered = species.filter((s) => {
    if (activeFilter !== 'toutes' && s.rarete !== activeFilter) return false
    if (query.trim()) {
      const q = query.toLowerCase()
      return (
        s.nom_fr.toLowerCase().includes(q) ||
        s.nom_scientifique.toLowerCase().includes(q)
      )
    }
    return true
  })

  const discovered = filtered.filter((s) => discoveredSet.has(s.slug))
  const locked = filtered.filter((s) => !discoveredSet.has(s.slug))
  const noResults = filtered.length === 0
  const noFilter = activeFilter === 'toutes' && !query.trim()

  function reset() {
    setActiveFilter('toutes')
    setQuery('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filtres rareté */}
      <RarityFilters active={activeFilter} onChange={setActiveFilter} />

      {/* Barre de recherche */}
      {showSearch && (
        <SearchBar
          value={query}
          onChange={setQuery}
          onClose={() => { setQuery(''); onCloseSearch() }}
        />
      )}

      {noResults ? (
        /* ── État vide ── */
        <div className="flex flex-col items-center justify-center py-16 gap-4 px-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Fish size={28} className="text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-300 mb-1">Aucune espèce trouvée</p>
            <p className="text-xs text-slate-500">Essaie un autre filtre ou modifie ta recherche</p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold hover:bg-cyan-400/20 transition-colors"
          >
            <RotateCcw size={12} />
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-4">
          {/* ── Espèces découvertes ── */}
          {discovered.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Fish size={14} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Espèces découvertes
                </span>
                <span className="ml-auto text-[10px] font-bold text-cyan-400 tabular-nums">
                  {discovered.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {discovered.map((s) => (
                  <SpeciesCard key={s.slug} species={s} />
                ))}
              </div>
            </div>
          )}

          {/* ── Espèces non découvertes ── */}
          {locked.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Non découvertes
                </span>
                <span className="ml-auto text-[10px] font-bold text-slate-600 tabular-nums">
                  {locked.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {locked.map((s) => (
                  <SpeciesCardLocked key={s.slug} species={s} />
                ))}
              </div>
            </div>
          )}

          {/* ── Footer motivationnel (aucun filtre actif) ── */}
          {noFilter && locked.length > 0 && (
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 flex items-center gap-3">
              <BookOpen size={20} className="text-cyan-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  Complète ton FishDex !
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {locked.length} espèce{locked.length > 1 ? 's' : ''} à débloquer — reviens pêcher pour les découvrir.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
