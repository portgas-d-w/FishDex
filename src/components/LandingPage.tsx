import Link from 'next/link'
import { BookOpen, Camera, Trophy } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Découvre 29 espèces',
    desc: 'Encyclopédie complète des poissons de nos rivières et lacs.',
  },
  {
    icon: Camera,
    title: 'Constitue ta collection',
    desc: 'Photos, lieux, poids, taille — chaque prise mérite sa fiche.',
  },
  {
    icon: Trophy,
    title: 'Débloque ton FishDex',
    desc: 'Chaque capture révèle une espèce dans ton encyclopédie.',
  },
]

export function LandingPage() {
  return (
    <div className="flex flex-col items-center px-4 py-12 gap-16 max-w-2xl mx-auto">

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-6xl">🎣</span>
          <h1
            className="text-5xl font-bold text-teal-400"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            FishDex
          </h1>
        </div>
        <p className="text-lg text-slate-300 max-w-sm leading-relaxed">
          Ton journal de pêche moderne et ton encyclopédie des espèces.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold rounded-xl transition-colors shadow-lg shadow-teal-500/20"
          >
            S&apos;inscrire
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-slate-100 rounded-xl transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* 3 cards concept */}
      <section className="w-full flex flex-col gap-4 sm:flex-row">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex-1 flex flex-col items-center text-center gap-3 p-5 bg-slate-900/40 border border-slate-800 rounded-xl"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
              <Icon size={22} />
            </div>
            <p className="font-semibold text-slate-100 text-sm">{title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="flex flex-col items-center gap-4 text-center">
        <p className="text-xl font-semibold text-slate-200">Prêt à pêcher ?</p>
        <Link
          href="/signup"
          className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold rounded-xl transition-colors shadow-lg shadow-teal-500/20"
        >
          Créer mon compte
        </Link>
      </section>

    </div>
  )
}
