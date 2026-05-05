import Link from 'next/link'
import { ChevronRight, Edit, Settings } from 'lucide-react'

function ActionRowDisabled({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 opacity-40 cursor-not-allowed">
      <Icon size={16} className="text-slate-400" />
      <span className="text-sm font-medium flex-1 text-slate-300">{label}</span>
      <span className="text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded-full">Bientôt</span>
    </div>
  )
}

function ActionRowLink({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
    >
      <Icon size={16} className="text-slate-400" />
      <span className="text-sm font-medium flex-1 text-slate-300">{label}</span>
      <ChevronRight size={14} className="text-slate-600" />
    </Link>
  )
}

export function ActionsSection() {
  return (
    <div className="px-4 mt-6 mb-4">
      <div className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm overflow-hidden">
        <ActionRowDisabled icon={Edit}     label="Éditer le profil" />
        <ActionRowLink     icon={Settings} label="Paramètres"       href="/parametres" />
      </div>
    </div>
  )
}
