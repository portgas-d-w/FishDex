import { Trophy, Fish, Crown } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { Rarete } from '@/types/fishdex'

type Props = {
  isRecord: boolean
  isNewSpecies: boolean
  rarete: Rarete | null
}

type BadgeCardProps = {
  icon: React.ElementType
  title: string
  subtitle: string
  borderColor: string
  glowColor: string
  iconColor: string
}

function BadgeCard({ icon: Icon, title, subtitle, borderColor, glowColor, iconColor }: BadgeCardProps) {
  return (
    <div className={`flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 border backdrop-blur-sm px-3 py-3 ${borderColor}`}
      style={{ boxShadow: glowColor }}>
      <Icon size={18} className={iconColor} />
      <span className="text-xs font-bold text-white leading-none">{title}</span>
      <span className="text-[10px] text-slate-400 leading-none">{subtitle}</span>
    </div>
  )
}

export function BadgesSection({ isRecord, isNewSpecies, rarete }: Props) {
  const cfg = getRareteConfig(rarete)

  const badges: BadgeCardProps[] = []

  if (isRecord) {
    badges.push({
      icon: Trophy,
      title: 'Record perso',
      subtitle: 'Nouveau record !',
      borderColor: 'border-cyan-400/50',
      glowColor: '0 0 16px rgba(34,211,238,0.25)',
      iconColor: 'text-cyan-400',
    })
  }

  if (isNewSpecies) {
    badges.push({
      icon: Fish,
      title: 'Nouvelle espèce',
      subtitle: 'Première capture',
      borderColor: 'border-emerald-400/50',
      glowColor: '0 0 16px rgba(52,211,153,0.25)',
      iconColor: 'text-emerald-400',
    })
  }

  badges.push({
    icon: Crown,
    title: cfg.label,
    subtitle: 'Espèce rare',
    borderColor: cfg.border,
    glowColor: '',
    iconColor: cfg.text.startsWith('bg-') ? 'text-pink-300' : cfg.text,
  })

  return (
    <div className="px-5 mt-6">
      <h2 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Badges</h2>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${badges.length}, 1fr)` }}>
        {badges.map(b => <BadgeCard key={b.title} {...b} />)}
      </div>
    </div>
  )
}
