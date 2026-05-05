// onboarding2.png — "Identifie tes prises"
export function Screen2() {
  return (
    <div className="flex flex-col items-center justify-between h-full px-6 pt-16 pb-6">
      {/* Illustration scanner */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative w-72 h-56">
          {/* Fond du scanner */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(5,13,23,0.6)', border: '1px solid rgba(34,211,238,0.15)' }}>
            {/* Fond nature flouté simulé */}
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(20,50,30,0.8) 0%, rgba(5,13,23,0.95) 70%)' }} />
          </div>

          {/* Coins cyan L */}
          {[
            { top: 8, left: 8, borderTop: 2, borderLeft: 2, borderRight: 0, borderBottom: 0, borderRadius: '4px 0 0 0' },
            { top: 8, right: 8, borderTop: 2, borderRight: 2, borderLeft: 0, borderBottom: 0, borderRadius: '0 4px 0 0' },
            { bottom: 8, left: 8, borderBottom: 2, borderLeft: 2, borderTop: 0, borderRight: 0, borderRadius: '0 0 0 4px' },
            { bottom: 8, right: 8, borderBottom: 2, borderRight: 2, borderTop: 0, borderLeft: 0, borderRadius: '0 0 4px 0' },
          ].map((s, i) => (
            <div key={i} className="absolute w-8 h-8" style={{
              ...s,
              borderColor: 'rgba(34,211,238,0.9)',
              boxShadow: '0 0 8px rgba(34,211,238,0.7)',
            }} />
          ))}

          {/* Truite SVG au centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 160 90" className="w-44 h-28" fill="none">
              <ellipse cx="75" cy="45" rx="52" ry="28" fill="rgba(34,211,238,0.7)" />
              <ellipse cx="75" cy="45" rx="40" ry="20" fill="rgba(34,211,238,0.5)" />
              <path d="M23 45 L0 22 L0 68 Z" fill="rgba(34,211,238,0.6)" />
              <path d="M50 17 Q75 2 100 17" stroke="rgba(34,211,238,0.8)" strokeWidth="3" fill="rgba(34,211,238,0.2)" />
              <path d="M50 73 Q75 88 100 73" stroke="rgba(34,211,238,0.5)" strokeWidth="2" fill="none" />
              <circle cx="108" cy="38" r="6" fill="rgba(5,13,23,0.95)" />
              <circle cx="110" cy="36" r="2" fill="rgba(255,255,255,0.9)" />
              {/* Taches truite */}
              <circle cx="70" cy="38" r="3" fill="rgba(255,100,50,0.5)" />
              <circle cx="85" cy="42" r="2.5" fill="rgba(255,100,50,0.4)" />
              <circle cx="60" cy="46" r="2" fill="rgba(255,100,50,0.4)" />
              <ellipse cx="72" cy="32" rx="14" ry="7" fill="rgba(255,255,255,0.12)" transform="rotate(-10 72 32)" />
              {/* Glow */}
              <ellipse cx="75" cy="45" rx="55" ry="30" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
            </svg>
          </div>

          {/* Ligne de scan */}
          <div className="absolute left-2 right-2 h-px animate-bounce"
            style={{
              top: '45%',
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.9), transparent)',
              boxShadow: '0 0 8px rgba(34,211,238,0.8)',
            }}
          />

          {/* Carte d'identification */}
          <div className="absolute bottom-3 left-3 right-3 rounded-xl px-3 py-2 flex items-center gap-2"
            style={{ background: 'rgba(5,13,23,0.9)', border: '1px solid rgba(34,211,238,0.3)', backdropFilter: 'blur(8px)' }}>
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 14" className="w-4 h-3" fill="rgba(34,211,238,0.9)">
                <ellipse cx="10" cy="7" rx="7" ry="4" />
                <path d="M3 7 L0 3 L0 11 Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white leading-none">Truite fario</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Salmo trutta</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-cyan-400">98%</p>
              <p className="text-[9px] text-slate-500">Confiance</p>
            </div>
          </div>

          {/* Icônes coins (flash, IA, etc.) */}
          {[
            { top: 8, left: 8, label: '⚡' },
            { top: 8, right: 8, label: '🤖' },
          ].map((item, i) => (
            <div key={i} className="absolute w-7 h-7 rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center text-xs"
              style={{ top: item.top, left: (item as { left?: number }).left, right: (item as { right?: number }).right }}>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Texte */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black leading-tight tracking-tight">
          <span className="text-cyan-400" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>Identifie</span>
          <span className="text-white"> tes prises</span>
        </h1>
        <p className="text-slate-400 mt-3 text-base leading-relaxed">
          Capture tes prises et identifie<br />facilement chaque espèce
        </p>
      </div>
    </div>
  )
}
