'use client'

import { useState, useMemo } from 'react'
import { Filters, type FilterState } from './Filters'
import { HeroCard } from './HeroCard'
import { CatchCard } from './CatchCard'
import { EmptyState } from './EmptyState'
import { StatsCards } from './StatsCards'
import type { CatchWithSpecies, AquariumStats, RecordsMap } from '@/types/aquarium'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

function buildPhotoUrl(photoUrl: string | null): string | null {
  if (!photoUrl) return null
  return `${SUPABASE_URL}/storage/v1/object/public/catches/${photoUrl}`
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

  if (catches.length === 0) return <EmptyState />

  // Hero = prise la plus lourde (record absolu user)
  const hero = catches.reduce((best, c) =>
    (c.poids_kg ?? 0) > (best.poids_kg ?? 0) ? c : best
  , catches[0])

  // Reste = tout sauf le hero (quand filtre = all)
  const gridCatches = filter.mode === 'all'
    ? filtered.filter(c => c.id !== hero.id)
    : filtered

  return (
    <>
      <StatsCards stats={stats} />
      <Filters filter={filter} onChange={setFilter} />

      {/* Hero (seulement en mode "Toutes") */}
      {filter.mode === 'all' && (
        <HeroCard
          catch_={hero}
          photoUrl={buildPhotoUrl(hero.photo_url)}
        />
      )}

      {/* Grille */}
      {gridCatches.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4 mt-4">
          {gridCatches.map(c => (
            <CatchCard
              key={c.id}
              catch_={c}
              photoUrl={buildPhotoUrl(c.photo_url)}
              isRecord={c.poids_kg != null && recordsMap[c.species_id] === c.poids_kg}
              isNew={isNew(c.date_capture)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-sm">
          Aucune prise pour ce filtre.
        </div>
      )}
    </>
  )
}
