import { Calendar } from 'lucide-react'

export const metadata = {
  title: 'Sessions — FishDex',
}

export default function SessionsPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.07) 0%, transparent 60%), linear-gradient(to bottom, #020c14, #0a1929 50%, #0d1117)',
      }}
    >
      {/* Icône */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-white/8 flex items-center justify-center">
          <Calendar size={38} strokeWidth={1.4} className="text-slate-400" />
        </div>
        <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-2xl scale-150 pointer-events-none" />
      </div>

      {/* Texte */}
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/60 mb-3">
        Bientôt disponible
      </p>
      <h1 className="font-outfit text-2xl font-bold text-slate-200 text-center mb-4 leading-snug">
        Sessions
      </h1>
      <p className="text-slate-400 text-center text-[15px] leading-relaxed max-w-[280px]">
        Le carnet vivant de tes sorties — chaque session, chaque spot, chaque moment.
      </p>
    </div>
  )
}
