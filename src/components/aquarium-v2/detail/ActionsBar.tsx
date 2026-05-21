'use client'

import { Heart, Share2, Edit } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  catchId: string
  speciesName: string
  photoUrl: string | null
}

export function ActionsBar({ catchId, speciesName, photoUrl }: Props) {
  async function handleShare() {
    const url = `${window.location.origin}/aquarium/${catchId}`
    const text = `J'ai capturé : ${speciesName} ! 🎣`

    if (navigator.share) {
      try {
        await navigator.share({ title: speciesName, text, url })
      } catch {
        // annulé par l'user
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast('Lien copié dans le presse-papier !')
    }
  }

  const actions = [
    {
      icon: Heart,
      label: 'Favoris',
      onClick: () => { /* TODO: toggle is_favorite */ },
      disabled: true,
    },
    {
      icon: Share2,
      label: 'Partager',
      onClick: handleShare,
      disabled: false,
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: () => { /* TODO: /aquarium/[id]/edit */ },
      disabled: true,
    },
  ]

  return (
    <div className="px-5 mt-6 mb-8">
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ icon: Icon, label, onClick, disabled }) => (
          <button
            key={label}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={`flex flex-col items-center gap-2 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm py-4
              transition-all duration-200
              ${disabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-white/10 hover:border-white/15 active:scale-95'
              }`}
          >
            <Icon size={20} className="text-slate-300" />
            <span className="text-xs font-medium text-slate-400">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
