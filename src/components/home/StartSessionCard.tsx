import Link from 'next/link'
import { Camera } from 'lucide-react'

export function StartSessionCard() {
  return (
    <Link
      href="/capture"
      className="flex items-center gap-4 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-sm px-4 py-4 hover:bg-white/6 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center shrink-0">
        <Camera size={18} className="text-slate-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">Ajouter une prise</p>
        <p className="text-xs text-slate-500 mt-0.5">Enregistre ta première capture du jour</p>
      </div>
    </Link>
  )
}
