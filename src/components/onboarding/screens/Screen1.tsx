// onboarding1.png — "Découvre un nouveau monde"
export function Screen1() {
  return (
    <div className="flex flex-col items-center justify-between h-full px-6 pt-20 pb-6">
      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Halos extérieurs */}
          <div className="absolute w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />
          <div className="absolute w-56 h-56 rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)' }} />

          {/* Cercle principal */}
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25) 0%, rgba(6,182,212,0.08) 60%, transparent 100%)',
              border: '2px solid rgba(34,211,238,0.7)',
              boxShadow: '0 0 40px rgba(34,211,238,0.5), 0 0 80px rgba(34,211,238,0.2), inset 0 0 30px rgba(34,211,238,0.1)',
            }}
          >
            {/* Poisson SVG */}
            <svg viewBox="0 0 120 80" className="w-28 h-20" fill="none">
              {/* Corps */}
              <ellipse cx="55" cy="40" rx="38" ry="22" fill="rgba(34,211,238,0.85)" />
              {/* Queue */}
              <path d="M17 40 L0 20 L0 60 Z" fill="rgba(34,211,238,0.7)" />
              {/* Nageoire dorsale */}
              <path d="M40 18 Q55 5 70 18" stroke="rgba(34,211,238,0.9)" strokeWidth="2" fill="rgba(34,211,238,0.3)" />
              {/* Œil */}
              <circle cx="80" cy="36" r="5" fill="rgba(5,13,23,0.9)" />
              <circle cx="82" cy="34" r="1.5" fill="rgba(255,255,255,0.9)" />
              {/* Reflets */}
              <ellipse cx="50" cy="32" rx="12" ry="6" fill="rgba(255,255,255,0.15)" transform="rotate(-15 50 32)" />
            </svg>
          </div>

          {/* Particules flottantes */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 45}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 45}%`,
                opacity: 0.4 + (i % 3) * 0.2,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Texte */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
          Découvre un<br />
          <span className="text-cyan-400" style={{ textShadow: '0 0 20px rgba(34,211,238,0.5)' }}>
            nouveau monde
          </span>
        </h1>
        <p className="text-slate-400 mt-3 text-base leading-relaxed">
          Chaque poisson que tu captures<br />devient une découverte
        </p>
      </div>
    </div>
  )
}
