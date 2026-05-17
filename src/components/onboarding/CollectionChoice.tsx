'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { setPreferredCollection } from '@/app/actions/collections'
import { COLLECTION_META } from '@/lib/collections/labels'
import type { CollectionSlug } from '@/lib/collections/types'

const CHOICES: Array<{
  slug: CollectionSlug
  exemples: string
  badge?: string
}> = [
  { slug: 'paisibles',  exemples: 'Carpe · Brème · Esturgeon' },
  { slug: 'predateurs', exemples: 'Brochet · Sandre · Silure', badge: 'Carnassier' },
  { slug: 'eaux-vives', exemples: 'Truite · Saumon · Ombre' },
]

export function CollectionChoice() {
  const router   = useRouter()
  const [selected, setSelected] = useState<CollectionSlug | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChoose(slug: CollectionSlug | null) {
    setSelected(slug)
    startTransition(async () => {
      await setPreferredCollection(slug)
      router.push('/')
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Les 3 voies */}
      {CHOICES.map(({ slug, exemples, badge }) => {
        const meta   = COLLECTION_META[slug]
        const active = selected === slug
        return (
          <button
            key={slug}
            onClick={() => handleChoose(slug)}
            disabled={isPending}
            className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 disabled:opacity-50
              ${active
                ? 'bg-white/10 border-white/30 scale-[1.01]'
                : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
              }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl leading-none">{meta.emoji}</span>
                  <span className="text-base font-bold text-white">{meta.nom}</span>
                  {badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/50 mb-2">{meta.description}</p>
                <p className="text-xs text-white/30 font-mono">{exemples}</p>
              </div>
              <div className={`shrink-0 mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                active ? 'border-cyan-400 bg-cyan-400' : 'border-white/20'
              }`}>
                {active && <div className="w-2 h-2 rounded-full bg-[#0a0f14]" />}
              </div>
            </div>
          </button>
        )
      })}

      {/* Séparateur */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/25">ou</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Tout explorer */}
      <button
        onClick={() => handleChoose(null)}
        disabled={isPending}
        className="w-full flex items-center justify-between rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all p-4 disabled:opacity-50"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-white/40" />
          <div className="text-left">
            <p className="text-sm font-medium text-white/70">Tout explorer</p>
            <p className="text-xs text-white/30">Sans voie principale — toutes les espèces</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-white/25" />
      </button>

      {isPending && (
        <p className="text-xs text-center text-white/30 animate-pulse">
          Préparation de ton FishDex…
        </p>
      )}
    </div>
  )
}
