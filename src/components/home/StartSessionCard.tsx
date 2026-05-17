import Link from 'next/link'
import { Plus } from 'lucide-react'

export function StartSessionCard() {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
        Aujourd&apos;hui
      </p>
      <p className="text-sm text-white/50 mb-4">Aucune session en cours.</p>
      <Link
        href="/sessions"
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2.5 text-sm font-medium text-white"
      >
        <Plus size={15} />
        Démarrer une session
      </Link>
    </div>
  )
}
