import Link from 'next/link'
import { Fish } from 'lucide-react'

export function LandingPageV2() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.15) 0%, transparent 60%), linear-gradient(to bottom, #020c14, #0a1929, #0d1117)',
      }}
    >
      {/* Effet lumière volumétrique */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />

      {/* Contenu */}
      <div className="relative flex flex-col items-center gap-6 text-center max-w-xs">
        {/* Logo */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-cyan-400/10 border border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
          <Fish size={40} className="text-cyan-400" strokeWidth={1.5} />
        </div>

        {/* Titre */}
        <div className="flex flex-col gap-1">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300 tracking-tight leading-none">
            FishDex
          </h1>
          <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase">
            Ton journal de pêche moderne
          </p>
        </div>

        {/* Tagline */}
        <p className="text-base text-slate-300 leading-relaxed">
          Découvre, capture, collectionne.
          <br />
          <span className="text-slate-500 text-sm">57 espèces à débloquer.</span>
        </p>

        {/* Boutons */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/signup"
            className="w-full py-3.5 rounded-2xl font-bold text-slate-900 text-base text-center
              bg-gradient-to-r from-cyan-400 to-cyan-500
              shadow-[0_0_40px_rgba(34,211,238,0.5)]
              hover:shadow-[0_0_60px_rgba(34,211,238,0.7)]
              hover:scale-[1.02] active:scale-95
              transition-all duration-300"
          >
            Commencer l&apos;aventure
          </Link>
          <Link
            href="/login"
            className="w-full py-3.5 rounded-2xl font-semibold text-slate-300 text-base text-center
              border border-white/15 bg-white/5 backdrop-blur-sm
              hover:border-cyan-400/40 hover:text-white
              hover:scale-[1.02] active:scale-95
              transition-all duration-300"
          >
            Se connecter
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-600">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  )
}
