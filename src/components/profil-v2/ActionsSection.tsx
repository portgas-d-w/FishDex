import { ChevronRight, Edit, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

type ActionRowProps = {
  icon: React.ElementType
  label: string
  iconColor?: string
  textColor?: string
  disabled?: boolean
  action?: () => Promise<void>
}

function ActionRow({ icon: Icon, label, iconColor = 'text-slate-400', textColor = 'text-slate-300', disabled, action }: ActionRowProps) {
  if (action) {
    return (
      <form action={action}>
        <button
          type="submit"
          className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 transition-colors hover:bg-white/5 ${textColor}`}
        >
          <Icon size={16} className={iconColor} />
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          <ChevronRight size={14} className="text-slate-600" />
        </button>
      </form>
    )
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <Icon size={16} className={iconColor} />
      <span className={`text-sm font-medium flex-1 ${textColor}`}>{label}</span>
      {disabled ? (
        <span className="text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded-full">Bientôt</span>
      ) : (
        <ChevronRight size={14} className="text-slate-600" />
      )}
    </div>
  )
}

export function ActionsSection() {
  return (
    <div className="px-4 mt-6 mb-4">
      <div className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm overflow-hidden">
        <ActionRow icon={Edit}     label="Éditer le profil" disabled />
        <ActionRow icon={Settings} label="Paramètres"       disabled />
        <ActionRow
          icon={LogOut}
          label="Déconnexion"
          iconColor="text-red-400"
          textColor="text-red-400"
          action={signOut}
        />
      </div>
    </div>
  )
}
