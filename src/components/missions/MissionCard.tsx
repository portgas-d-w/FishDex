import { Fish, Camera, MapPin, CheckCircle2, Star, Zap, Trophy } from 'lucide-react'
import type { MissionWithProgress } from '@/lib/missions/types'

type IconKey = 'fish' | 'camera' | 'map-pin' | 'star' | 'zap' | 'trophy'

function getIconKey(mission: MissionWithProgress): IconKey {
  const action = (mission.conditions as { action?: string } | null)?.action
  if (action === 'catch_with_photo')            return 'camera'
  if (action === 'new_spot')                    return 'map-pin'
  if (action === 'unique_species_total')        return 'trophy'
  if (action === 'all_rarity_types')            return 'star'
  if (action === 'catch_min_rarity')            return 'zap'
  return 'fish'
}

const RARITY_COLORS: Record<string, string> = {
  commun:     'text-emerald-400',
  peu_commun: 'text-sky-400',
  rare:       'text-blue-400',
  epique:     'text-purple-500',
  legendaire: 'text-amber-500',
  shiny:      'text-pink-400',
}

function MissionIconEl({ icon }: { icon: IconKey }) {
  const cls = 'text-cyan-400'
  const size = 18
  if (icon === 'camera')  return <Camera  size={size} className={cls} />
  if (icon === 'map-pin') return <MapPin  size={size} className={cls} />
  if (icon === 'star')    return <Star    size={size} className={cls} />
  if (icon === 'zap')     return <Zap     size={size} className={cls} />
  if (icon === 'trophy')  return <Trophy  size={size} className={cls} />
  return <Fish size={size} className={cls} />
}

function HexIcon({ icon }: { icon: IconKey }) {
  return (
    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
        <polygon
          points="22,2 40,12 40,32 22,42 4,32 4,12"
          fill="rgba(34,211,238,0.08)"
          stroke="rgba(34,211,238,0.35)"
          strokeWidth="1.5"
        />
      </svg>
      <span className="relative"><MissionIconEl icon={icon} /></span>
    </div>
  )
}

export function MissionCard({ mission }: { mission: MissionWithProgress }) {
  const pct = mission.target > 0
    ? Math.min(Math.round((mission.progress / mission.target) * 100), 100)
    : 0
  const icon = getIconKey(mission)
  const rarity = (mission.conditions as { rarity?: string } | null)?.rarity
  const rarityColor = rarity ? (RARITY_COLORS[rarity] ?? 'text-cyan-400') : undefined

  return (
    <div className={`rounded-2xl bg-white/5 border backdrop-blur-sm p-4 flex items-start gap-3 transition-opacity ${mission.completed ? 'border-emerald-400/20 opacity-70' : 'border-white/8'}`}>
      {mission.completed ? (
        <div className="w-11 h-11 flex items-center justify-center shrink-0">
          <CheckCircle2 size={26} className="text-emerald-400" />
        </div>
      ) : (
        <HexIcon icon={icon} />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-snug">{mission.title}</p>
        {mission.description && (
          <p className={`text-xs mt-0.5 leading-snug ${rarityColor ?? 'text-slate-400'}`}>{mission.description}</p>
        )}

        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${mission.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.5)]'}`}
              style={{ width: `${mission.completed ? 100 : Math.max(pct, 2)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
            {mission.progress}/{mission.target}
          </span>
        </div>
      </div>

      {/* XP badge */}
      <div className={`shrink-0 px-2.5 py-1.5 rounded-xl border flex flex-col items-center ${mission.completed ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-cyan-400/25 bg-cyan-400/8'}`}>
        <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${mission.completed ? 'text-emerald-400/70' : 'text-cyan-400/60'}`}>XP</span>
        <span className={`text-sm font-black tabular-nums leading-tight ${mission.completed ? 'text-emerald-400' : 'text-cyan-400'}`}>{mission.xp_reward}</span>
      </div>
    </div>
  )
}
