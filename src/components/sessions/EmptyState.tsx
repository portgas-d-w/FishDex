import Link from 'next/link'
import { Calendar, Plus } from 'lucide-react'

export function EmptyState({ hasActive }: { hasActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/8 flex items-center justify-center">
          <Calendar size={32} strokeWidth={1.2} className="text-white/25" />
        </div>
        <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-2xl scale-150 pointer-events-none" />
      </div>

      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/50 mb-3">
        Aucune session
      </p>
      <h2 className="text-xl font-bold text-white mb-2">
        {hasActive ? 'Aucune session passée' : 'Ta première sortie t\'attend'}
      </h2>
      <p className="text-sm text-white/40 leading-relaxed max-w-[260px] mb-8">
        {hasActive
          ? 'Termine ta session en cours pour la voir apparaître ici.'
          : 'Chaque session, chaque spot, chaque prise — immortalisés.'}
      </p>

      {!hasActive && (
        <Link
          href="/sessions/new"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-400 text-[#0a0f14] text-sm font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_24px_rgba(34,211,238,0.35)]"
        >
          <Plus size={16} />
          Démarrer une session
        </Link>
      )}
    </div>
  )
}
