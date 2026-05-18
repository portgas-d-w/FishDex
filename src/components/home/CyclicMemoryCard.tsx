import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import type { CyclicMemory } from '@/lib/home/cyclic-memories'

export function CyclicMemoryCard({ memory }: { memory: CyclicMemory }) {
  const yearsLabel = memory.years_ago === 1 ? 'Il y a 1 an' : `Il y a ${memory.years_ago} ans`

  let description = ''
  let href = '/'

  if (memory.type === 'catch') {
    const parts: string[] = []
    if (memory.data.species_nom) parts.push(memory.data.species_nom)
    if (memory.data.taille_cm)   parts.push(`${memory.data.taille_cm} cm`)
    if (memory.data.poids_kg)    parts.push(`${memory.data.poids_kg} kg`)
    if (memory.data.lieu)        parts.push(`à ${memory.data.lieu}`)
    description = parts.join(' · ')
    href = `/aquarium/${memory.data.id}`
  } else {
    const parts: string[] = []
    if (memory.data.spot_nom) parts.push(`à ${memory.data.spot_nom}`)
    if (memory.data.catch_count) {
      const n = memory.data.catch_count
      parts.push(`${n} prise${n > 1 ? 's' : ''}`)
    }
    description = parts.join(' · ') || 'Session de pêche'
    href = `/sessions/${memory.data.id}`
  }

  return (
    <Link href={href} className="block rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 hover:bg-white/8 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 mt-0.5">
          <CalendarDays size={14} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-cyan-400 uppercase mb-0.5">
            {yearsLabel} aujourd&apos;hui
          </p>
          <p className="text-sm text-white/70 leading-snug">{description}</p>
        </div>
      </div>
    </Link>
  )
}
