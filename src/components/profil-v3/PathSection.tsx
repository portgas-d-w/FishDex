'use client'

import { useState } from 'react'
import { Settings2 } from 'lucide-react'
import { MainPathCard } from './MainPathCard'
import { OtherPathsSection } from './OtherPathsSection'
import { ChangePathModal } from './ChangePathModal'
import type { CollectionProgress, CollectionSlug } from '@/lib/collections/types'

type Props = {
  progressList: CollectionProgress[]
  mainSlug: CollectionSlug | null
}

export function PathSection({ progressList, mainSlug }: Props) {
  const [showModal, setShowModal] = useState(false)
  const mainProgress = mainSlug ? progressList.find(p => p.slug === mainSlug) ?? null : null

  return (
    <div className="px-4 space-y-4">
      {mainProgress ? (
        <>
          <MainPathCard progress={mainProgress} />
          <OtherPathsSection progressList={progressList} mainSlug={mainSlug!} />
        </>
      ) : (
        /* Mode "Tout explorer" */
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">🎣 Ma voie</p>
          <p className="text-sm text-white/50 mb-2">Mode libre — toutes les espèces</p>
          <div className="grid grid-cols-3 gap-2">
            {progressList.map(p => (
              <div key={p.slug} className="text-center rounded-xl bg-white/5 border border-white/8 p-2.5">
                <p className="text-base mb-0.5">{p.slug === 'paisibles' ? '🐟' : p.slug === 'predateurs' ? '🦈' : '🌊'}</p>
                <p className="text-xs font-bold text-white tabular-nums">{p.percent}%</p>
                <p className="text-[9px] text-white/30">{p.capturedVisible}/{p.totalVisible}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton changer de voie */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 hover:bg-white/7 transition-colors py-2.5 text-xs font-medium text-white/40 hover:text-white/70"
      >
        <Settings2 size={13} />
        Changer ma voie principale
      </button>

      {showModal && (
        <ChangePathModal
          currentSlug={mainSlug}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
