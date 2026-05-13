import Image from 'next/image'
import Link from 'next/link'
import { Fish } from 'lucide-react'
import { MOCK_RECENT_CATCHES } from '@/lib/spot/mocks'

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
  commun:     { border: 'border-emerald-400/30', badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/40', text: 'Commun' },
  rare:       { border: 'border-blue-400/30',    badge: 'bg-blue-400/20 text-blue-400 border-blue-400/40',         text: 'Rare' },
  epique:     { border: 'border-purple-500/30',  badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40',   text: 'Épique' },
  legendaire: { border: 'border-amber-400/30',   badge: 'bg-amber-400/20 text-amber-400 border-amber-400/40',      text: 'Légendaire' },
  mirage:     { border: 'border-pink-400/30',    badge: 'bg-gradient-to-r from-amber-400/20 via-pink-400/20 to-purple-500/20 text-pink-300 border-pink-400/40', text: '✦ Mirage' },
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
    <div
      className={`relative w-52 shrink-0 rounded-xl overflow-hidden border ${style.border} bg-slate-900/60 backdrop-blur-sm flex flex-col`}
    >
      {/* Photo */}
      <div className="relative aspect-square bg-slate-950/60">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.species?.nom_fr ?? 'Prise'}
            fill
            sizes="208px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Fish size={32} className="text-slate-600" />
          </div>
        )}

        {/* Overlay gradient bas */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />

        {/* Badge rareté */}
        <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${style.badge}`}>
          {style.text}
        </span>
      </div>

      {/* Infos */}
      <div className="px-2 pb-2 pt-1 flex flex-col gap-0.5">
        <p className="text-xs font-bold text-white leading-tight truncate">
          {item.species?.nom_fr ?? 'Inconnue'}
        </p>
        <div className="flex items-center justify-between">
          {item.poids_kg != null && (
            <span className="text-[10px] font-semibold text-cyan-400">{item.poids_kg} kg</span>
          )}
          {dateStr && (
            <span className="text-[10px] text-slate-500">{dateStr}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function RecentCatchesCarousel({ catches }: { catches: CatchItem[] }) {
  const allItems = [...catches, ...MOCK_RECENT_CATCHES]

  return (
    <div className="flex flex-col gap-3 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Mes dernières prises</h2>
        <Link href="/aquarium" className="text-xs text-cyan-400 font-medium">
          Voir tout
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none">
        {allItems.map((item) => (
          <div key={item.id} className="snap-start">
            <CatchCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
