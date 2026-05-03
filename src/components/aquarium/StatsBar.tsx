import { Fish, BookOpen, Sparkles, Trophy } from 'lucide-react'

type Props = {
  totalCatches: number
  uniqueSpecies: number
  rareSpecies: number
  withRecord: number
}

const STATS = [
  {
    key: 'totalCatches' as const,
    label: 'Prises',
    icon: Fish,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
  },
  {
    key: 'uniqueSpecies' as const,
    label: 'Espèces',
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    key: 'rareSpecies' as const,
    label: 'Rares+',
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    key: 'withRecord' as const,
    label: 'Records',
    icon: Trophy,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
]

export function StatsBar({ totalCatches, uniqueSpecies, rareSpecies, withRecord }: Props) {
  const values = { totalCatches, uniqueSpecies, rareSpecies, withRecord }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATS.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm"
        >
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${bg}`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className={`text-2xl font-black tabular-nums leading-none ${color}`}>
              {values[key]}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
