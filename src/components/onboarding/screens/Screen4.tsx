// onboarding4.png — "Retrouve toutes tes prises"
const CATCHES = [
  { name: 'Perche', weight: '1.8 kg', rarity: 'Commun', color: '#22d3ee', top: true },
  { name: 'Brochet', weight: '8.2 kg', rarity: 'Rare', color: '#a855f7', top: true },
  { name: 'Sandre', weight: '4.3 kg', rarity: 'Rare', color: '#a855f7', top: false },
  { name: 'Gardon', weight: '0.4 kg', rarity: 'Commun', color: '#22d3ee', top: false },
  { name: 'Tanche', weight: '1.2 kg', rarity: 'Commun', color: '#22d3ee', top: false },
  { name: 'Silure', weight: '7.2 kg', rarity: 'Épique', color: '#f59e0b', top: false },
]

function MiniCard({ name, weight, rarity, color }: typeof CATCHES[0]) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}18 0%, rgba(5,13,23,0.9) 100%)`,
        border: `1px solid ${color}30`,
      }}>
      <div className="aspect-[4/5] relative">
        {/* Fond dégradé simulant une photo */}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}20 0%, rgba(5,13,23,0.95) 70%)` }} />
        {/* Poisson */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 40 28" className="w-8 h-6" fill="none">
            <ellipse cx="22" cy="14" rx="14" ry="9" fill={color} opacity="0.7" />
            <path d="M8 14 L0 6 L0 22 Z" fill={color} opacity="0.5" />
            <circle cx="32" cy="11" r="2" fill="rgba(5,13,23,0.9)" />
          </svg>
        </div>
        {/* Infos bas */}
        <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 bg-gradient-to-t from-slate-950/90 to-transparent">
          <p className="text-[9px] font-bold text-white leading-tight truncate">{name}</p>
          <p className="text-[9px] font-bold leading-tight" style={{ color }}>{weight}</p>
          <span className="text-[8px] font-bold px-1 py-0.5 rounded"
            style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
            {rarity}
          </span>
        </div>
      </div>
    </div>
  )
}

export function Screen4() {
  return (
    <div className="flex flex-col items-center justify-between h-full px-6 pt-12 pb-6">
      {/* Grille de prises */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        {/* Header simulé */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="rgb(34,211,238)" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span className="text-xs font-bold text-white">Mes prises</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-white/8">Toutes ▾</span>
        </div>

        {/* Hero card (carpe miroir) */}
        <div className="rounded-2xl p-3 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(5,13,23,0.9) 100%)',
            border: '1px solid rgba(34,211,238,0.3)',
            boxShadow: '0 0 20px rgba(34,211,238,0.15)',
          }}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
              <svg viewBox="0 0 40 28" className="w-10 h-7" fill="none">
                <ellipse cx="22" cy="14" rx="14" ry="9" fill="rgba(34,211,238,0.8)" />
                <path d="M8 14 L0 6 L0 22 Z" fill="rgba(34,211,238,0.6)" />
                <circle cx="32" cy="11" r="2.5" fill="rgba(5,13,23,0.9)" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Carpe miroir</p>
              <p className="text-xl font-black text-cyan-400">12.4 kg</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-400/30">Épique</span>
              <div className="flex items-center gap-1 text-[9px] text-slate-400">
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 1L6 11M1 6L11 6" />
                </svg>
                12 mai 2024
              </div>
            </div>
          </div>
        </div>

        {/* Grille 3x2 */}
        <div className="grid grid-cols-3 gap-1.5">
          {CATCHES.map((c, i) => (
            <MiniCard key={i} {...c} />
          ))}
        </div>
      </div>

      {/* Texte */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-black leading-tight tracking-tight">
          <span className="text-white">Retrouve toutes </span>
          <span className="text-cyan-400" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>tes prises</span>
        </h1>
        <p className="text-slate-400 mt-3 text-base leading-relaxed">
          Ton historique de pêche,<br />organisé et valorisé
        </p>
      </div>
    </div>
  )
}
