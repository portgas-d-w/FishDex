import Image from 'next/image'
import Link from 'next/link'
import { Fish } from 'lucide-react'

type CatchItem = {
  id: string
  created_at: string | null
  photo_url: string | null
  poids_kg: number | null
  taille_cm: number | null
  species: {
    nom_fr: string
    image_url: string | null
    rarete: string | null
  } | null
}

const RARETE_STYLES: Record<string, { border: string; badge: string; text: string }> = {
  commun:     { border: 'border-white/10',          badge: 'bg-white/10 text-slate-300 border-white/15',              text: 'Commun' },
  peu_commun: { border: 'border-emerald-400/25',    badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30', text: 'Peu commun' },
  rare:       { border: 'border-blue-400/25',       badge: 'bg-blue-400/15 text-blue-300 border-blue-400/30',          text: 'Rare' },
  epique:     { border: 'border-purple-500/25',     badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',    text: 'Épique' },
  legendaire: { border: 'border-amber-400/25',      badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',       text: 'Légendaire' },
  mirage:     { border: 'border-pink-400/25',       badge: 'bg-gradient-to-r from-amber-400/15 via-pink-400/15 to-purple-500/15 text-pink-300 border-pink-400/30', text: '✦ Mirage' },
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'À l\'instant'
  if (min < 60) return `Il y a ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Il y a ${h}h`
  return `Il y a ${Math.floor(h / 24)}j`
}

function CatchCard({ item }: { item: CatchItem }) {
  const r = item.species?.rarete ?? 'commun'
  const style = RARETE_STYLES[r] ?? RARETE_STYLES.commun
  const imgSrc = item.photo_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${item.photo_url}`
    : item.species?.image_url ?? null

  const stat = item.taille_cm != null
    ? `${item.taille_cm} cm`
    : item.poids_kg != null
    ? `${item.poids_kg} kg`
    : null

  return (
    <Link
      href={`/aquarium/${item.id}`}
      className={`group relative rounded-xl overflow-hidden border ${style.border} bg-black/30 backdrop-blur-sm flex flex-col`}
    >
      <div className="relative aspect-[4/3] bg-black/40">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.species?.nom_fr ?? 'Prise'}
            fill
            sizes="(min-width: 768px) 25vw, 44vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Fish size={28} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
        <span className={`absolute top-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${style.badge}`}>
          {style.text}
        </span>
      </div>

      <div className="px-2.5 pb-2.5 pt-2 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-white leading-tight truncate">
          {item.species?.nom_fr ?? 'Inconnue'}
        </p>
        <div className="flex items-center justify-between gap-1">
          {stat && <span className="text-[10px] text-cyan-400/80">{stat}</span>}
          <span className="text-[10px] text-white/30 ml-auto">{relativeTime(item.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}

export function RecentCatchesGrid({ catches }: { catches: CatchItem[] }) {
  if (catches.length === 0) {
    return (
      <Link
        href="/aquarium/nouvelle"
        className="flex items-center gap-3 rounded-xl bg-white/4 border border-white/8 px-4 py-4 text-slate-500 hover:text-slate-400 transition-colors"
      >
        <Fish size={16} />
        <span className="text-sm">Pas encore de prises — ajoutes-en une.</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile : scroll horizontal */}
      <div className="flex md:hidden gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
        {catches.map((item) => (
          <div key={item.id} className="snap-start w-[44vw] min-w-[160px] shrink-0">
            <CatchCard item={item} />
          </div>
        ))}
        <Link
          href="/aquarium"
          className="snap-start w-14 shrink-0 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-slate-600 hover:text-slate-400 transition-colors self-stretch"
        >
          <span className="text-xs rotate-90 select-none">›</span>
        </Link>
      </div>

      {/* Desktop : grille 4 colonnes */}
      <div className="hidden md:grid grid-cols-4 gap-3 w-full">
        {catches.map((item) => (
          <CatchCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}

// Alias pour compatibilité éventuelle
export { RecentCatchesGrid as RecentCatchesCarousel }
