import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Crown } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { CatchWithSpecies } from '@/types/aquarium'

type Props = {
  catch_: CatchWithSpecies
  photoUrl: string | null
}

export function HeroCard({ catch_: c, photoUrl }: Props) {
  const cfg = getRareteConfig(c.species.rarete)
  const isMirage = c.species.rarete === 'mirage'

  return (
    <Link
      href={`/aquarium/${c.id}`}
      className={`relative mx-4 mt-4 rounded-2xl overflow-hidden border-2 ${cfg.border}
        block transition-transform duration-300 active:scale-[0.98]
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
      style={{ boxShadow: isMirage
        ? '0 0 40px rgba(244,114,182,0.35), 0 8px 32px rgba(0,0,0,0.4)'
        : undefined }}
    >
      {/* Photo */}
      <div className="relative aspect-[16/9] bg-slate-900">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={c.species.nom_fr}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src={c.species.image_url || '/fishes/placeholder.svg'}
            alt={c.species.nom_fr}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain p-4"
            priority
          />
        )}

        {/* Shimmer mirage */}
        {isMirage && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent
            animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Gradient overlay bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

        {/* Badge record (haut gauche) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/50 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
          <Crown size={12} className="text-amber-400" />
          <span className="text-[11px] font-bold text-amber-300">Record perso</span>
        </div>

        {/* Infos bas */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-2xl font-bold text-white leading-tight truncate">{c.species.nom_fr}</p>
              {c.poids_kg != null && (
                <p className="text-xl font-bold text-cyan-400 leading-tight">{c.poids_kg} kg</p>
              )}
              {c.lieu && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate">{c.lieu}</span>
                </div>
              )}
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border backdrop-blur-sm ${cfg.badge} ${cfg.badgeBorder}`}>
              {cfg.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
