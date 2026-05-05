// onboarding3.png — "Complète ton FishDex"
const SPECIES = [
  { name: 'Brochet', latin: 'Esox lucius', rarity: 'Rare', color: '#a855f7', discovered: true },
  { name: 'Carpe commune', latin: 'Cyprinus carpio', rarity: 'Commun', color: '#22d3ee', discovered: true },
  { name: 'Perche', latin: 'Perca fluvialis', rarity: 'Commun', color: '#22d3ee', discovered: true },
  { name: 'Silure glane', latin: 'Silurus glanis', rarity: 'Épique', color: '#f59e0b', discovered: true },
  { name: 'Esturgeon européen', latin: 'Acipenser sturio', rarity: 'Légendaire', color: '#f97316', discovered: true },
  { name: '???', latin: 'Non découvert', rarity: '?', color: '#475569', discovered: false },
]

export function Screen3() {
  return (
    <div className="flex flex-col items-center justify-between h-full px-6 pt-12 pb-6">
      {/* Icône livre + progression */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(34,211,238,0.15)',
            border: '2px solid rgba(34,211,238,0.5)',
            boxShadow: '0 0 24px rgba(34,211,238,0.4)',
          }}>
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="rgb(34,211,238)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">68 / 200 espèces découvertes</p>
          <div className="w-48 h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
              style={{ width: '34%', boxShadow: '0 0 8px rgba(34,211,238,0.6)' }} />
          </div>
        </div>
      </div>

      {/* Grille espèces */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4 flex-1">
        {SPECIES.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: s.discovered
                ? `linear-gradient(135deg, ${s.color}22 0%, rgba(5,13,23,0.8) 100%)`
                : 'rgba(5,13,23,0.8)',
              border: `1px solid ${s.discovered ? s.color + '40' : 'rgba(255,255,255,0.06)'}`,
              boxShadow: s.discovered ? `0 0 12px ${s.color}20` : 'none',
            }}
          >
            <div className="p-2.5">
              {/* Silhouette poisson */}
              <div className="flex justify-center mb-1.5">
                {s.discovered ? (
                  <svg viewBox="0 0 40 28" className="w-10 h-7" fill="none">
                    <ellipse cx="22" cy="14" rx="14" ry="9" fill={s.color} opacity="0.8" />
                    <path d="M8 14 L0 6 L0 22 Z" fill={s.color} opacity="0.6" />
                    <circle cx="32" cy="11" r="2" fill="rgba(5,13,23,0.9)" />
                  </svg>
                ) : (
                  <div className="w-10 h-7 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="rgba(100,116,139,0.6)" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-[10px] font-bold leading-tight truncate"
                style={{ color: s.discovered ? 'rgba(255,255,255,0.9)' : 'rgba(100,116,139,0.7)' }}>
                {s.name}
              </p>
              {s.discovered && (
                <p className="text-[9px] leading-none mt-0.5 truncate"
                  style={{ color: s.color, opacity: 0.85 }}>
                  {s.rarity}
                </p>
              )}
            </div>

            {/* Checkmark discovered */}
            {s.discovered && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}>
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
                  <path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Texte */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-black leading-tight tracking-tight">
          <span className="text-white">Complète ton </span>
          <span className="text-cyan-400" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>FishDex</span>
        </h1>
        <p className="text-slate-400 mt-3 text-base leading-relaxed">
          Capture de nouvelles espèces et<br />débloque toute la collection
        </p>
      </div>
    </div>
  )
}
