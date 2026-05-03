import Link from 'next/link'
import { BookOpen, Camera, Trophy } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Découvre les espèces',
    desc: 'Encyclopédie complète des poissons de rivières et de lacs.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
  },
  {
    icon: Camera,
    title: 'Constitue ta collection',
    desc: 'Photos, lieux, poids, taille — chaque prise mérite sa fiche.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Trophy,
    title: 'Débloque ton FishDex',
    desc: 'Chaque capture révèle une espèce dans ton encyclopédie.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-12 gap-6 relative overflow-hidden">
        {/* Halo décoratif */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center gap-3">
          <span className="text-7xl select-none">🎣</span>
          <h1
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-teal-500 leading-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Le Spot
          </h1>
          <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase">
            by FishDex
          </p>
        </div>

        <p className="text-lg text-slate-300 max-w-xs leading-relaxed">
          Ton journal de pêche moderne.<br />
          Capture, collectionne, explore.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/signup"
            className="px-7 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40 hover:scale-105 active:scale-95"
          >
            S&apos;inscrire
          </Link>
          <Link
            href="/login"
            className="px-7 py-3 border border-slate-600 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 rounded-2xl transition-all duration-200 hover:bg-teal-500/5"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="flex flex-col gap-3 px-4 pb-4 max-w-md mx-auto w-full sm:flex-row sm:max-w-2xl">
        {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
          <div
            key={title}
            className="flex-1 flex flex-col gap-3 p-5 bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm rounded-2xl hover:border-slate-700/60 transition-colors"
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${bg} ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm mb-1">{title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="flex flex-col items-center gap-4 px-4 pt-6 pb-16 text-center">
        <p className="text-slate-400 text-sm">Rejoint la communauté de pêcheurs</p>
        <Link
          href="/signup"
          className="px-10 py-3.5 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-900 font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-teal-500/25 hover:scale-105 active:scale-95"
        >
          Créer mon compte gratuitement
        </Link>
      </section>
    </div>
  )
}
