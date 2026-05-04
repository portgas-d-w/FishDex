import Link from 'next/link'
import { Fish } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Illustration bocal vide */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-cyan-400/8 border border-cyan-400/20 flex items-center justify-center
          shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <Fish size={40} className="text-cyan-400/40" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
          <span className="text-lg">🪣</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Ton aquarium est vide</h2>
      <p className="text-sm text-slate-400 mb-8 max-w-[260px]">
        Capture ta première prise pour démarrer ta collection !
      </p>

      <Link
        href="/aquarium/nouvelle"
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-2xl transition-colors
          shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95"
      >
        Capturer ma première prise
      </Link>
    </div>
  )
}
