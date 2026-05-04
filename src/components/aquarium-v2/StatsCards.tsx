import { Fish, BookOpen, Star, Trophy } from 'lucide-react'
import type { AquariumStats } from '@/types/aquarium'

type StatCardProps = {
  icon: React.ElementType
  value: number
  label: string
  iconColor: string
  glowColor: string
}

function StatCard({ icon: Icon, value, label, iconColor, glowColor }: StatCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm p-3 ${glowColor}`}>
      <Icon size={18} className={iconColor} />
      <span className="text-xl font-bold text-white leading-none">{value}</span>
      <span className="text-[10px] text-slate-400 text-center leading-tight">{label}</span>
    </div>
  )
}

export function StatsCards({ stats }: { stats: AquariumStats }) {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 mt-3">
      <StatCard
        icon={Fish}
        value={stats.total}
        label="Poissons capturés"
        iconColor="text-cyan-400"
        glowColor=""
      />
      <StatCard
        icon={BookOpen}
        value={stats.uniqueSpecies}
        label="Espèces découvertes"
        iconColor="text-cyan-400"
        glowColor=""
      />
      <StatCard
        icon={Star}
        value={stats.rareSpecies}
        label="Espèces rares"
        iconColor="text-purple-400"
        glowColor=""
      />
      <StatCard
        icon={Trophy}
        value={stats.personalRecords}
        label="Records perso"
        iconColor="text-amber-400"
        glowColor=""
      />
    </div>
  )
}
