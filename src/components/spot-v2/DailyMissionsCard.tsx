import Link from 'next/link'
import { Fish, Camera, MapPin, CheckCircle2 } from 'lucide-react'
import type { MissionWithProgress } from '@/lib/missions/types'

type IconKey = 'fish' | 'camera' | 'map-pin'

function getIconKey(mission: MissionWithProgress): IconKey {
  const action = (mission.conditions as { action?: string } | null)?.action
  if (action === 'catch_with_photo') return 'camera'
  if (action === 'new_spot')         return 'map-pin'
  return 'fish'
}

function MissionIcon({ icon }: { icon: IconKey }) {
  const cls = 'text-cyan-400'
  const size = 16
  if (icon === 'camera') return <Camera size={size} className={cls} />
  if (icon === 'map-pin') return <MapPin size={size} className={cls} />
  return <Fish size={size} className={cls} />
}

function HexIcon({ icon }: { icon: IconKey }) {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
        <polygon
          points="18,1 33,9.5 33,26.5 18,35 3,26.5 3,9.5"
          fill="rgba(34,211,238,0.1)"
          stroke="rgba(34,211,238,0.4)"
          strokeWidth="1.5"
        />
      </svg>
      <span className="relative">
        <MissionIcon icon={icon} />
      </span>
    </div>
  )
}

type Props = {
  missions: MissionWithProgress[]
}

export function DailyMissionsCard({ missions }: Props) {
  if (missions.length === 0) {
    return (
      <div className="mx-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white">Missions du jour</h2>
          <Link href="/missions" className="text-xs text-cyan-400 font-medium">Voir toutes</Link>
        </div>
        <p className="text-sm text-slate-400 text-center py-2">Reviens demain pour de nouvelles missions !</p>
      </div>
    )
  }

  return (
    <div className="mx-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Missions du jour</h2>
        <Link href="/missions" className="text-xs text-cyan-400 font-medium">Voir toutes</Link>
      </div>

      {/* Missions */}
      <div className="flex flex-col gap-3">
        {missions.map((mission) => {
          const pct = mission.target > 0 ? Math.min(Math.round((mission.progress / mission.target) * 100), 100) : 0
          const icon = getIconKey(mission)
          return (
            <div key={mission.userMissionId} className={`flex items-center gap-3 ${mission.completed ? 'opacity-60' : ''}`}>
              {mission.completed
                ? (
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  </div>
                )
                : <HexIcon icon={icon} />
              }

              {/* Texte + barre */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">{mission.title}</p>
                {mission.description && (
                  <p className="text-xs text-slate-400 leading-tight truncate">{mission.description}</p>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${mission.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-cyan-300'}`}
                      style={{ width: `${Math.max(pct, mission.completed ? 100 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                    {mission.progress} / {mission.target}
                  </span>
                </div>
              </div>

              {/* Badge XP */}
              <div className={`shrink-0 px-2 py-1 rounded-lg border flex flex-col items-center ${mission.completed ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-cyan-400/30 bg-cyan-400/10'}`}>
                <span className={`text-[9px] font-bold uppercase tracking-wider leading-none ${mission.completed ? 'text-emerald-400/70' : 'text-cyan-400/70'}`}>XP</span>
                <span className={`text-sm font-black tabular-nums leading-tight ${mission.completed ? 'text-emerald-400' : 'text-cyan-400'}`}>{mission.xp_reward}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
