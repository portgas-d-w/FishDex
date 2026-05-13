import Image from 'next/image'
import type { Rarete } from '@/types/fishdex'

const glowByRarete: Record<string, string> = {
  commun:     '0 0 60px rgba(52,211,153,0.35)',
  rare:       '0 0 60px rgba(96,165,250,0.40)',
  epique:     '0 0 60px rgba(168,85,247,0.45)',
  legendaire: '0 0 70px rgba(251,191,36,0.50)',
  mirage:     '0 0 80px rgba(244,114,182,0.55)',
}

type Props = {
  photoUrl: string | null
  fallbackUrl: string | null
  altText: string
  rarete: Rarete | null
}

export function DetailHero({ photoUrl, fallbackUrl, altText, rarete }: Props) {
  const glow = glowByRarete[rarete ?? 'commun'] ?? glowByRarete.commun
  const isMirage = rarete === 'mirage'
  const src = photoUrl ?? fallbackUrl ?? '/fishes/placeholder.svg'

  return (
    <div className="px-4 mt-2">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ boxShadow: glow }}
      >
        <div className="relative aspect-[4/5] bg-slate-900">
          <Image
            src={src}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className={`${photoUrl ? 'object-cover' : 'object-contain p-6'}`}
            priority
          />

          {/* Shimmer mirage */}
          {isMirage && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent
              animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
          )}

          {/* Gradient léger en bas pour lisibilité */}
          {photoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  )
}
