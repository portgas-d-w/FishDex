import { Fish, BookOpen, Trophy, Star } from 'lucide-react'

type Props = {
  totalCatches: number
  uniqueSpecies: number
  maxPoids: number | null
  rareSpecies: number
}

type StatItem = {
  icon: React.ElementType
  value: string
  label: string
  iconColor: string
}

function StatCard({ icon: Icon, value, label, iconColor }: StatItem) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm p-3">
      <Icon size={18} className={iconColor} />
      <span className="text-xl font-bold text-white leading-none">{value}</span>
      <span className="text-[10px] text-slate-400 text-center leading-tight">{label}</span>
    </div>
  )
}

export function GlobalStats({ totalCatches, uniqueSpecies, maxPoids, rareSpecies }: Props) {
  const stats: StatItem[] = [
    { icon: Fish,     value: String(totalCatches),  label: 'Prises totales',      iconColor: 'text-cyan-400'   },
    { icon: BookOpen, value: String(uniqueSpecies),  label: 'Espèces découvertes', iconColor: 'text-cyan-400'   },
    { icon: Trophy,   value: maxPoids != null ? `${maxPoids} kg` : '—', label: 'Plus grosse prise', iconColor: 'text-amber-400'  },
    { icon: Star,     value: String(rareSpecies),   label: 'Espèces rares',       iconColor: 'text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 px-4 mt-4">
      {stats.map(s => <StatCard key={s.label} {...s} />)}
    </div>
  )
}
