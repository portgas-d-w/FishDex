import { Sun, Wind, Fish } from 'lucide-react'
import { MOCK_WEATHER, MOCK_FISH_ACTIVITY } from '@/lib/spot/mocks'

export function InfoCards() {
  const { temperature, condition, vent_kmh } = MOCK_WEATHER
  const { label, niveau } = MOCK_FISH_ACTIVITY

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {/* Conditions météo */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-amber-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conditions</span>
        </div>
        <p className="text-2xl font-black text-white leading-none">{temperature}°C</p>
        <p className="text-sm font-semibold text-cyan-400">{condition}</p>
        <div className="flex items-center gap-1.5 mt-auto">
          <Wind size={12} className="text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500">Vent {vent_kmh} km/h</span>
        </div>
      </div>

      {/* Activité des poissons */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activité</span>
        <p className="text-sm text-slate-300 leading-tight">Activité des poissons</p>
        <p className="text-xl font-black text-cyan-400 leading-none">{label}</p>
        {/* Indicateur visuel 5 poissons */}
        <div className="flex items-center gap-1 mt-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Fish
              key={i}
              size={14}
              className={i < niveau ? 'text-cyan-400' : 'text-slate-700'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
