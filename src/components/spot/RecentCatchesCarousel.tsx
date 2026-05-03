'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Fish } from 'lucide-react'

type RecentCatch = {
  id: string
  date_capture: string
  photo_url: string | null
  poids_kg: number | null
  species: {
    nom_fr: string
    image_url: string | null
    rarete: string | null
  } | null
}

type Props = {
  catches: RecentCatch[]
}

const RARETE_CONFIG: Record<string, { label: string; classes: string }> = {
  commun:      { label: 'Commun',     classes: 'bg-slate-700/80 text-slate-300 border-slate-600/50' },
  peu_commun:  { label: 'Peu commun', classes: 'bg-emerald-900/80 text-emerald-300 border-emerald-600/50' },
  rare:        { label: 'Rare',       classes: 'bg-blue-900/80 text-blue-300 border-blue-600/50' },
  tres_rare:   { label: 'Épique',     classes: 'bg-purple-900/80 text-purple-300 border-purple-600/50' },
  legendaire:  { label: 'Légendaire', classes: 'bg-amber-900/80 text-amber-300 border-amber-600/50' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year  = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function RecentCatchesCarousel({ catches }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function handleScroll() {
    const el = scrollRef.current
    if (!el || catches.length === 0) return
    const cardWidth = el.scrollWidth / catches.length
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.max(0, Math.min(index, catches.length - 1)))
  }

  return (
    <section className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Fish size={16} className="text-teal-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Dernières prises
          </h2>
        </div>
        <Link
          href="/aquarium"
          className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>

      {catches.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-3 py-10 border border-dashed border-slate-700 rounded-2xl text-center">
          <span className="text-3xl">🎣</span>
          <p className="text-sm text-slate-400">
            Pas encore de prise. Capture-en une !
          </p>
        </div>
      ) : (
        <>
          {/* Carrousel scroll-x */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto pl-4 pr-4 pb-1 scrollbar-none snap-x snap-mandatory"
          >
            {catches.map((c) => {
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
              const imgSrc = c.photo_url
                ? `${supabaseUrl}/storage/v1/object/public/catches/${c.photo_url}`
                : c.species?.image_url ?? '/fishes/placeholder.svg'
              const rareteConfig = c.species?.rarete
                ? RARETE_CONFIG[c.species.rarete] ?? null
                : null

              return (
                <Link
                  key={c.id}
                  href="/aquarium"
                  className="flex-shrink-0 w-40 snap-start rounded-2xl overflow-hidden
                    bg-slate-900/60 border border-slate-700/50
                    hover:border-teal-500/40 transition-all duration-200 group"
                >
                  {/* Photo */}
                  <div className="relative w-full aspect-[4/3] bg-slate-800 overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={c.species?.nom_fr ?? 'Poisson'}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {rareteConfig && (
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm leading-tight ${rareteConfig.classes}`}
                      >
                        {rareteConfig.label}
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="p-2.5 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-100 truncate leading-tight">
                      {c.species?.nom_fr ?? 'Espèce inconnue'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {c.poids_kg != null ? `${c.poids_kg} kg` : '—'}
                      </span>
                      <span className="text-[10px] text-slate-600 tabular-nums">
                        {formatDate(c.date_capture)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Dots de pagination */}
          {catches.length > 1 && (
            <div className="flex justify-center gap-1.5">
              {catches.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-4 h-1.5 bg-teal-400'
                      : 'w-1.5 h-1.5 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
