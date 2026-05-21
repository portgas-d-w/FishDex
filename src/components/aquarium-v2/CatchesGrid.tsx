'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Fish } from 'lucide-react'
import { PullToRefresh } from '@/components/ui/PullToRefresh'
import { Filters, type FilterState } from './Filters'
import { HeroCard } from './HeroCard'
import { CatchCard } from './CatchCard'
import { EmptyState } from './EmptyState'
import { StatsCards } from './StatsCards'
import type { CatchWithSpecies, AquariumStats, RecordsMap } from '@/types/aquarium'

import { buildCatchImageUrl } from '@/components/ui/CatchImage'

function buildPhotoUrl(photoUrl: string | null, variant: 'thumb' | 'medium' = 'thumb'): string | null {
  if (!photoUrl) return null
  return buildCatchImageUrl(photoUrl, variant)
}

function isNew(dateCapture: string): boolean {
  const d = new Date(dateCapture + 'T00:00:00')
  const diff = Date.now() - d.getTime()
  return diff < 7 * 24 * 60 * 60 * 1000
}

type Props = {
  catches: CatchWithSpecies[]
  stats: AquariumStats
  recordsMap: RecordsMap
}

function GroupedGrid({
  groups,
  recordsMap,
  headerIcon,
}: {
  groups: { key: string; label: string; catches: CatchWithSpecies[] }[]
  recordsMap: RecordsMap
  headerIcon: React.ReactNode
}) {
  let globalIndex = 0
  return (
    <div className="px-4 mt-4 flex flex-col gap-6">
      {groups.map(group => (
        <div key={group.key}>
          <div className="flex items-center gap-2 mb-3">
            {headerIcon}
            <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">{group.label}</p>
            <span className="text-xs text-white/30">({group.catches.length})</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.catches.map(c => {
              const idx = globalIndex++
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.42,
                    delay: Math.min(idx * 0.04, 0.42),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <CatchCard
                    catch_={c}
                    photoUrl={buildPhotoUrl(c.photo_url)}
                    isRecord={c.poids_kg != null && recordsMap[c.species_id] === c.poids_kg}
                    isNew={isNew(c.date_capture)}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CatchesGrid({ catches, stats, recordsMap }: Props) {
  const [filter, setFilter] = useState<FilterState>({ mode: 'all', rarity: null })

  const filtered = useMemo(() => {
    if (filter.mode === 'records') {
      return catches.filter(c => c.poids_kg != null && recordsMap[c.species_id] === c.poids_kg)
    }
    if (filter.mode === 'rarity' && filter.rarity) {
      return catches.filter(c => c.species.rarete === filter.rarity)
    }
    return catches
  }, [catches, filter, recordsMap])

  const speciesGroups = useMemo(() => {
    const map = new Map<string, { label: string; catches: CatchWithSpecies[] }>()
    for (const c of catches) {
      const key = c.species_id
      if (!map.has(key)) map.set(key, { label: c.species.nom_fr, catches: [] })
      map.get(key)!.catches.push(c)
    }
    return Array.from(map.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.catches.length - a.catches.length)
  }, [catches])

  const spotGroups = useMemo(() => {
    const map = new Map<string, { label: string; catches: CatchWithSpecies[] }>()
    for (const c of catches) {
      const key = c.session?.spot?.nom ?? '__nospot__'
      const label = c.session?.spot?.nom ?? 'Sans spot'
      if (!map.has(key)) map.set(key, { label, catches: [] })
      map.get(key)!.catches.push(c)
    }
    return Array.from(map.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => {
        if (a.key === '__nospot__') return 1
        if (b.key === '__nospot__') return -1
        return b.catches.length - a.catches.length
      })
  }, [catches])

  if (catches.length === 0) return <EmptyState />

  const hero = catches.reduce((best, c) =>
    (c.poids_kg ?? 0) > (best.poids_kg ?? 0) ? c : best
  , catches[0])

  const gridCatches = filter.mode === 'all'
    ? filtered.filter(c => c.id !== hero.id)
    : filtered

  return (
    <PullToRefresh>
    <>
      <StatsCards stats={stats} />
      <Filters filter={filter} onChange={setFilter} />

      {filter.mode === 'species' && (
        <GroupedGrid
          groups={speciesGroups}
          recordsMap={recordsMap}
          headerIcon={<Fish className="h-4 w-4 text-cyan-400" />}
        />
      )}

      {filter.mode === 'spot' && (
        <GroupedGrid
          groups={spotGroups}
          recordsMap={recordsMap}
          headerIcon={<MapPin className="h-4 w-4 text-cyan-400" />}
        />
      )}

      {filter.mode !== 'species' && filter.mode !== 'spot' && (
        <>
          {filter.mode === 'all' && (
            <HeroCard
              catch_={hero}
              photoUrl={buildPhotoUrl(hero.photo_url, 'medium')}
            />
          )}

          {gridCatches.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4 mt-4">
              {gridCatches.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.42,
                    delay: Math.min(i * 0.06, 0.42),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <CatchCard
                    catch_={c}
                    photoUrl={buildPhotoUrl(c.photo_url)}
                    isRecord={c.poids_kg != null && recordsMap[c.species_id] === c.poids_kg}
                    isNew={isNew(c.date_capture)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-sm">
              Aucune prise pour ce filtre.
            </div>
          )}
        </>
      )}
    </>
    </PullToRefresh>
  )
}
