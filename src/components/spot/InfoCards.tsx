import { Sun, Users } from 'lucide-react'
import { MOCK_WEATHER, MOCK_ACTIVITY } from '@/lib/spot/mocks'

export function InfoCards() {
  return (
    <div className="mx-4 grid grid-cols-2 gap-3">
      {/* Conditions idéales */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm p-3.5 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Sun size={15} className="text-amber-400 shrink-0" />
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
            Conditions
          </span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-100 leading-tight">
            {MOCK_WEATHER.temp}
          </p>
          <p className="text-xs text-slate-400 leading-snug mt-0.5">
            {MOCK_WEATHER.condition}
            <br />
            {MOCK_WEATHER.wind}
          </p>
        </div>
      </div>

      {/* Activité près de toi */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm p-3.5 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Users size={15} className="text-teal-400 shrink-0" />
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
            Activité
          </span>
        </div>
        <div>
          <p className="text-base font-bold text-slate-100 leading-tight">
            {MOCK_ACTIVITY.activeFishers === 0
              ? '0 pêcheur'
              : `${MOCK_ACTIVITY.activeFishers} pêcheur${MOCK_ACTIVITY.activeFishers > 1 ? 's' : ''}`}
          </p>
          <p className="text-xs text-slate-400 leading-snug mt-0.5">
            {MOCK_ACTIVITY.distanceKm
              ? `actif${MOCK_ACTIVITY.activeFishers > 1 ? 's' : ''} à ${MOCK_ACTIVITY.distanceKm} km`
              : 'actif près de toi'}
          </p>
        </div>
      </div>
    </div>
  )
}
