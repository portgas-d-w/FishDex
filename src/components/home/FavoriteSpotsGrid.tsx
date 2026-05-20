import { MapPin, ChevronRight } from 'lucide-react'

type Spot = {
  name: string
  count: number
}

export function FavoriteSpotsGrid({ spots }: { spots: Spot[] }) {
  if (spots.length === 0) return null

  if (spots.length === 1) {
    return (
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <p className="font-semibold text-white">{spots[0].name}</p>
          </div>
          <p className="text-sm text-white/60">
            {spots[0].count} prise{spots[0].count > 1 ? 's' : ''}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-white/30" />
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
