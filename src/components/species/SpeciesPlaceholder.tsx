import type { Rarete } from '@/types/fishdex'

const GRADIENTS: Record<string, string> = {
  commun:     'from-emerald-900/40 to-emerald-700/20',
  rare:       'from-blue-900/40 to-blue-700/20',
  epique:     'from-purple-900/40 to-purple-700/20',
  legendaire: 'from-amber-900/40 to-amber-700/20',
  mirage:     'from-amber-500/30 via-pink-500/30 to-purple-700/30',
}

type Props = {
  rarete: Rarete | null
  className?: string
}

export function SpeciesPlaceholder({ rarete, className = '' }: Props) {
  const gradient = GRADIENTS[rarete ?? 'commun'] ?? GRADIENTS.commun
  const isMirage = rarete === 'mirage'

  return (
    <div className={`relative bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}>
      {isMirage && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
      )}
      <svg viewBox="0 0 120 80" className="w-2/3 max-w-[200px] opacity-25" aria-hidden>
        {/* Corps */}
        <ellipse cx="55" cy="40" rx="32" ry="18" fill="white" />
        {/* Queue */}
        <path d="M 87 40 L 105 25 L 108 40 L 105 55 Z" fill="white" opacity="0.8" />
        {/* Nageoire dorsale */}
        <path d="M 45 22 Q 55 10 65 22" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
        {/* Œil */}
        <circle cx="38" cy="38" r="4" fill="rgba(10,15,20,0.6)" />
        <circle cx="37" cy="37" r="1.5" fill="white" opacity="0.4" />
      </svg>
    </div>
  )
}
