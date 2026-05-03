import { Fish, Camera, MapPin } from 'lucide-react'
import { MOCK_MISSIONS, type MockMissionIcon } from '@/lib/spot/mocks'

function MissionIcon({ icon }: { icon: MockMissionIcon }) {
  const cls = 'text-cyan-400'
  const size = 16
  if (icon === 'fish') return <Fish size={size} className={cls} />
  if (icon === 'camera') return <Camera size={size} className={cls} />
  return <MapPin size={size} className={cls} />
}

function HexIcon({ icon }: { icon: MockMissionIcon }) {
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

export function DailyMissionsCard() {
  return (
    <div className="mx-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Missions du jour</h2>
        <span className="text-xs text-cyan-400 font-medium cursor-default">Voir toutes</span>
      </div>

      {/* Missions */}
      <div className="flex flex-col gap-3">
        {MOCK_MISSIONS.map((mission) => {
          const pct = Math.round((mission.progression / mission.objectif) * 100)
          return (
            <div key={mission.id} className="flex items-center gap-3">
              <HexIcon icon={mission.icon} />

              {/* Texte + barre */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">{mission.titre}</p>
                <p className="text-xs text-slate-400 leading-tight truncate">{mission.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                    {mission.progression} / {mission.objectif}
                  </span>
                </div>
              </div>

              {/* Badge XP */}
              <div className="shrink-0 px-2 py-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 flex flex-col items-center">
                <span className="text-[9px] text-cyan-400/70 font-bold uppercase tracking-wider leading-none">XP</span>
                <span className="text-sm font-black text-cyan-400 tabular-nums leading-tight">{mission.xp}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
