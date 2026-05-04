import { CalendarDays, Clock, MapPin, Flame, Camera, Heart } from 'lucide-react'

type StatItem = {
  icon: React.ElementType
  label: string
  value: string
  iconColor: string
}

function StatRow({ icon: Icon, label, value, iconColor }: StatItem) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        <Icon size={14} className={iconColor} />
      </div>
      <span className="text-sm text-slate-400 flex-1">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  )
}

type Props = {
  joursPeche: number
  spots: number
  photos: number
}

export function DetailedStats({ joursPeche, spots, photos }: Props) {
  const stats: StatItem[] = [
    { icon: CalendarDays, label: 'Jours de pêche',     value: String(joursPeche), iconColor: 'text-cyan-400'   },
    { icon: Clock,        label: 'Heures de pêche',    value: '—',                iconColor: 'text-cyan-400'   },
    { icon: MapPin,       label: 'Spots découverts',   value: String(spots),      iconColor: 'text-emerald-400'},
    { icon: Flame,        label: 'Meilleure série',    value: '—',                iconColor: 'text-amber-400'  },
    { icon: Camera,       label: 'Photos enregistrées',value: String(photos),     iconColor: 'text-purple-400' },
    { icon: Heart,        label: 'Likes reçus',        value: '—',                iconColor: 'text-red-400'    },
  ]

  return (
    <div className="px-4 mt-6">
      <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Mes stats globales</h2>
      <div className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-4">
        {stats.map(s => <StatRow key={s.label} {...s} />)}
      </div>
    </div>
  )
}
