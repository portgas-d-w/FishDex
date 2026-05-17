import { MapPin } from 'lucide-react'

type Spot = {
  name: string
  count: number
}

export function FavoriteSpotsGrid({ spots }: { spots: Spot[] }) {
  if (spots.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/4 border border-white/8 px-4 py-4 text-white/30">
        <MapPin size={16} />
        <span className="text-sm">Aucun spot enregistré pour l&apos;instant.</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {spots.map((spot) => (
        <div
          key={spot.name}
          className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3.5 flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-cyan-400/70 shrink-0" />
            <p className="text-xs font-semibold text-white truncate">{spot.name}</p>
          </div>
          <p className="text-sm font-semibold text-white/60">
            {spot.count}
            <span className="text-xs font-normal text-white/30"> prise{spot.count > 1 ? 's' : ''}</span>
          </p>
        </div>
      ))}
    </div>
  )
}
