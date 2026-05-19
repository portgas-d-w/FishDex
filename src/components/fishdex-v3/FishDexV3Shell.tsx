'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, X } from 'lucide-react'
import { PageBackground } from '@/components/ui/PageBackground'
import { SpeciesCardV3 } from './SpeciesCardV3'
import { CollectionToggle } from './CollectionToggle'
import { CollectionHeader } from './CollectionHeader'
import { UserMenu } from '@/components/shared/UserMenu'
import { PageHeader } from '@/components/shared/PageHeader'
import type { CollectionSlug, CollectionProgress } from '@/lib/collections/types'
import type { DexView } from './CollectionToggle'

type Species = {
  id: string
  slug: string
  nom_fr: string
  nom_scientifique: string
  rarete: string | null
  numero_dex: number | null
  image_url: string | null
  is_hidden_in_dex: boolean
  difficulte: number | null
  collections: CollectionSlug[]
}

type Props = {
  allSpecies: Species[]
  discoveredIds: string[]
  preferredSlug: CollectionSlug | null
  progressBySlug: Record<CollectionSlug, CollectionProgress>
  username: string
  email: string
  avatarUrl: string | null
}

export function FishDexV3Shell({
  allSpecies,
  discoveredIds,
  preferredSlug,
  progressBySlug,
  username,
  email,
  avatarUrl,
}: Props) {
  const defaultView: DexView = preferredSlug ?? 'toutes'
  const [activeView, setActiveView] = useState<DexView>(defaultView)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const discoveredSet = useMemo(() => new Set(discoveredIds), [discoveredIds])

  // Filtrer selon la vue active
  const filtered = useMemo(() => {
    let list = allSpecies

    if (activeView === 'ma-collection' && preferredSlug) {
      list = list.filter(s => s.collections.includes(preferredSlug))
    } else if (activeView !== 'toutes' && activeView !== 'ma-collection') {
      // Sous-onglet d'une collection spécifique
      list = list.filter(s => s.collections.includes(activeView as CollectionSlug))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.nom_fr.toLowerCase().includes(q) ||
        s.nom_scientifique.toLowerCase().includes(q)
      )
    }

    return list
  }, [allSpecies, activeView, preferredSlug, search])

  // Compteur pour le subtitle
  const visibleCount   = allSpecies.filter(s => !s.is_hidden_in_dex).length
  const discoveredCount = allSpecies.filter(s => !s.is_hidden_in_dex && discoveredSet.has(s.id)).length

  const activeProgress = activeView === 'ma-collection' && preferredSlug
    ? progressBySlug[preferredSlug]
    : null

  return (
    <PageBackground
      bgUrl="/backgrounds/fishdex-bg.webp"
      overlay="bg-[#020c14]/50"
      className="flex flex-col pb-24"
    >
      <PageHeader
        leftAction={
          <button
            onClick={() => { setSearchOpen(v => !v); if (searchOpen) setSearch('') }}
            className={`w-10 h-10 flex items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
              searchOpen
                ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-400'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
        }
        icon={<BookOpen size={16} className="text-cyan-400" />}
        title="FishDex"
        subtitle={`${discoveredCount} / ${visibleCount} espèces`}
        rightAction={
          <UserMenu username={username} email={email} avatarUrl={avatarUrl} />
        }
      />

      {/* Barre de recherche */}
      {searchOpen && (
        <div className="px-4 mb-2">
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une espèce…"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan-400/30 transition-colors"
          />
        </div>
      )}

      {/* Toggle collection */}
      <div className="px-4 mb-4">
        <CollectionToggle
          preferredSlug={preferredSlug}
          activeView={activeView}
          onViewChange={v => { setActiveView(v); setSearch(''); setSearchOpen(false) }}
        />
      </div>

      {/* Header progression (Ma voie uniquement) */}
      {activeProgress && !searchOpen && (
        <div className="px-4 mb-4">
          <CollectionHeader progress={activeProgress} />
        </div>
      )}

      {/* Grille */}
      <div className="px-4 flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-white/30 text-sm">Aucune espèce trouvée</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.38,
                  delay: Math.min(i * 0.04, 0.36),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <SpeciesCardV3
                  species={s}
                  isDiscovered={discoveredSet.has(s.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageBackground>
  )
}
