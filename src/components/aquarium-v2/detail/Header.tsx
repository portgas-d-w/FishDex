'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, MoreHorizontal, Fish } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'

type Props = {
  speciesName: string
  poidsKg: number | null
  dateCapture: string
}

export function DetailHeader({ speciesName, poidsKg, dateCapture }: Props) {
  const router = useRouter()

  const subtitle = [
    poidsKg != null ? `${poidsKg} kg` : null,
    new Date(dateCapture + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
  ].filter(Boolean).join(' · ')

  return (
    <PageHeader
      leftAction={
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/8 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
      }
      icon={<Fish size={15} className="text-cyan-400" />}
      title={speciesName}
      subtitle={subtitle}
      rightAction={
        <button
          aria-label="Plus d'options"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/8 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          <MoreHorizontal size={20} />
        </button>
      }
    />
  )
}
