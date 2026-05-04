import { BADGES, type BadgeDef } from '@/lib/profil/mocks'

type Props = {
  unlockedIds: string[]
}

function HexBadge({ badge, unlocked }: { badge: BadgeDef; unlocked: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-14 h-14 flex items-center justify-center text-2xl transition-all duration-300
          ${unlocked ? badge.color : 'bg-white/5'}
          border ${unlocked ? badge.borderColor : 'border-white/8'}`}
        style={{
          clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          boxShadow: unlocked ? badge.glowColor : 'none',
          filter: unlocked ? 'none' : 'grayscale(1) brightness(0.4)',
        }}
      >
        <span>{badge.icon}</span>
      </div>
      <span className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${unlocked ? 'text-slate-300' : 'text-slate-600'}`}>
        {badge.label}
      </span>
    </div>
  )
}

export function BadgesSection({ unlockedIds }: Props) {
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Mes badges</h2>
        <span className="text-[11px] text-slate-500">Bientôt</span>
      </div>

      <div className="flex justify-around items-end gap-2 overflow-x-auto scrollbar-none pb-1">
        {BADGES.map(badge => (
          <HexBadge
            key={badge.id}
            badge={badge}
            unlocked={unlockedIds.includes(badge.id)}
          />
        ))}
      </div>
    </div>
  )
}
