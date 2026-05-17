import { MapPin } from 'lucide-react'

type Spot = {
  name: string
  count: number
}

export function FavoriteSpotsGrid({ spots }: { spots: Spot[] }) {
  if (spots.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/4 border border-white/8 px-4 py-4 text-slate-500">
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
          className="rounded-xl bg-white/4 border border-white/8 backdrop-blur-sm px-3 py-3 flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-cyan-400/60 shrink-0" />
            <p className="text-xs font-medium text-white truncate">{spot.name}</p>
          </div>
          <p className="text-[11px] text-slate-500">{spot.count} prise{spot.count > 1 ? 's' : ''}</p>
        </div>
      ))}
    </div>
  )
}
