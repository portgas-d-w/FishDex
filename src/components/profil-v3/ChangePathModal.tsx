'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X, ArrowRight, Sparkles } from 'lucide-react'
import { setPreferredCollection } from '@/app/actions/collections'
import { COLLECTION_META } from '@/lib/collections/labels'
import type { CollectionSlug } from '@/lib/collections/types'

const CHOICES: { slug: CollectionSlug; exemples: string }[] = [
  { slug: 'paisibles',  exemples: 'Carpe · Brème · Esturgeon' },
  { slug: 'predateurs', exemples: 'Brochet · Sandre · Silure'  },
  { slug: 'eaux-vives', exemples: 'Truite · Saumon · Ombre'   },
]

type Props = {
  currentSlug: CollectionSlug | null
  onClose: () => void
}

export function ChangePathModal({ currentSlug, onClose }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<CollectionSlug | null>(currentSlug)
  const [isPending, startTransition] = useTransition()
  const [confirmed, setConfirmed] = useState(false)

  function handleSelect(slug: CollectionSlug | null) {
    setSelected(slug)
    setConfirmed(false)
  }

  function handleConfirm() {
    if (!confirmed) { setConfirmed(true); return }
    startTransition(async () => {
      await setPreferredCollection(selected)
      router.refresh()
      onClose()
    })
  }

  const selectedMeta = selected ? COLLECTION_META[selected] : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#0d1927] border border-white/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Changer de voie</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Choix */}
        <div className="space-y-2">
          {CHOICES.map(({ slug, exemples }) => {
            const meta   = COLLECTION_META[slug]
            const active = selected === slug
            return (
              <button
                key={slug}
                onClick={() => handleSelect(slug)}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                  active ? 'bg-white/10 border-white/25' : 'bg-white/4 border-white/8 hover:bg-white/7'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{meta.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{meta.nom}</p>
                    <p className="text-xs text-white/35">{exemples}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${active ? 'border-cyan-400 bg-cyan-400' : 'border-white/20'}`} />
                </div>
              </button>
            )
          })}

          {/* Tout explorer */}
          <button
            onClick={() => handleSelect(null)}
            className={`w-full flex items-center gap-3 rounded-2xl border p-4 transition-all ${
              selected === null ? 'bg-white/10 border-white/25' : 'bg-white/4 border-white/8 hover:bg-white/7'
            }`}
          >
            <Sparkles size={18} className="text-white/40" />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white/70">Tout explorer</p>
              <p className="text-xs text-white/30">Sans voie principale</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ${selected === null ? 'border-cyan-400 bg-cyan-400' : 'border-white/20'}`} />
          </button>
        </div>

        {/* Message rassurant (1er clic) */}
        {confirmed && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/50 leading-relaxed">
            {selectedMeta ? (
              <>Ta progression <strong className="text-white/70">{currentSlug ? COLLECTION_META[currentSlug]?.nom : 'actuelle'}</strong> est conservée. Tes captures restent inchangées. Ta voie principale devient <strong className="text-white/70">{selectedMeta.nom}</strong>.</>
            ) : (
              <>Tu passes en mode libre — toutes les espèces, sans voie principale. Tes captures restent inchangées.</>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={isPending || selected === currentSlug}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-colors py-3.5 text-sm font-bold text-[#0a0f14] disabled:opacity-40"
        >
          <ArrowRight size={16} />
          {isPending ? 'Changement…' : confirmed ? 'Confirmer le changement' : 'Changer ma voie'}
        </button>
      </div>
    </div>
  )
}
