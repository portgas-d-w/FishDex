import { Cloud } from 'lucide-react'

export function ConditionsWidget() {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex flex-col">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
        Conditions actuelles
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-5 w-5 text-white/50" />
        <span className="text-2xl font-semibold text-white">10°C</span>
        <span className="text-sm text-white/50">Temps couvert</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 flex-1">
        {[
          { label: 'Vent',          value: '—' },
          { label: 'Pression',      value: '—' },
          { label: 'Lever soleil',  value: '—' },
          { label: 'Coucher soleil', value: '—' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] text-white/30">{label}</p>
            <p className="text-xs text-white/60">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-white/20 mt-4 pt-2 border-t border-white/8">
        Météo dynamique — H3
      </p>
    </div>
  )
}
