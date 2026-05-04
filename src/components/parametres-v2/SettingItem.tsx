import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  subtitle?: string
  control?: ReactNode
  onClick?: () => void
  last?: boolean
}

export function SettingItem({ icon, label, subtitle, control, onClick, last }: Props) {
  const base = `flex items-center gap-3 px-4 py-3.5 ${last ? '' : 'border-b border-white/5'}`

  const inner = (
    <>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 leading-tight">{label}</p>
        {subtitle && (
          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {control && <div className="shrink-0 ml-2">{control}</div>}
    </>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full text-left ${base} hover:bg-white/3 transition-colors active:bg-white/5`}>
        {inner}
      </button>
    )
  }

  return <div className={base}>{inner}</div>
}
