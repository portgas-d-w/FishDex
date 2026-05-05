import { Edit } from 'lucide-react'

export function ActionsSection() {
  return (
    <div className="px-4 mt-6 mb-4">
      <div className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 opacity-40 cursor-not-allowed">
          <Edit size={16} className="text-slate-400" />
          <span className="text-sm font-medium flex-1 text-slate-300">Éditer le profil</span>
          <span className="text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded-full">Bientôt</span>
        </div>
      </div>
    </div>
  )
}
