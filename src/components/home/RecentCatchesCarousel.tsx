import Image from 'next/image'
import Link from 'next/link'
import { Fish } from 'lucide-react'

type CatchItem = {
  id: string
  date_capture: string | null
  photo_url: string | null
  poids_kg: number | null
  species: {
    nom_fr: string
    image_url: string | null
    rarete: string | null
  } | null
}

const RARETE_STYLES: Record<string, { border: string; badge: string; text: string }> = {
  commun:     { border: 'border-white/10',           badge: 'bg-white/10 text-slate-300 border-white/15',             text: 'Commun' },
  peu_commun: { border: 'border-emerald-400/25',     badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30', text: 'Peu commun' },
  rare:       { border: 'border-blue-400/25',        badge: 'bg-blue-400/15 text-blue-300 border-blue-400/30',         text: 'Rare' },
  epique:     { border: 'border-purple-500/25',      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',   text: 'Épique' },
  legendaire: { border: 'border-amber-400/25',       badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',      text: 'Légendaire' },
  mirage:     { border: 'border-pink-400/25',        badge: 'bg-gradient-to-r from-amber-400/15 via-pink-400/15 to-purple-500/15 text-pink-300 border-pink-400/30', text: '✦ Mirage' },
}

function CatchCard({ item }: { item: CatchItem }) {
  const r = item.species?.rarete ?? 'commun'
  const style = RARETE_STYLES[r] ?? RARETE_STYLES.commun
  const imgSrc = item.photo_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${item.photo_url}`
    : item.species?.image_url ?? null

  const dateStr = item.date_capture
    ? new Date(item.date_capture).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : null

  return (
    <Link
      href={`/aquarium/${item.id}`}
      className={`relative w-44 shrink-0 rounded-xl overflow-hidden border ${style.border} bg-black/30 backdrop-blur-sm flex flex-col`}
    >
      <div className="relative aspect-[4/3] bg-black/40">
        {imgSrc ? (
          <Image src={imgSrc} alt={item.species?.nom_fr ?? 'Prise'} fill sizes="176px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Fish size={28} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent" />
        <span className={`absolute top-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${style.badge}`}>
          {style.text}
        </span>
      </div>

      <div className="px-2 pb-2 pt-1.5 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-white leading-tight truncate">
          {item.species?.nom_fr ?? 'Inconnue'}
        </p>
        <div className="flex items-center justify-between">
          {item.poids_kg != null && (
            <span className="text-[10px] text-cyan-400/80">{item.poids_kg} kg</span>
          )}
          {dateStr && (
            <span className="text-[10px] text-slate-500">{dateStr}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function RecentCatchesCarousel({ catches }: { catches: CatchItem[] }) {
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
    <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
      {catches.map((item) => (
        <div key={item.id} className="snap-start">
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
  )
}
