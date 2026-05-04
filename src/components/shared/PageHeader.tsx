import type { ReactNode } from 'react'

type Props = {
  leftAction: ReactNode
  icon?: ReactNode
  title: string
  subtitle?: string
  rightAction: ReactNode
}

export function PageHeader({ leftAction, icon, title, subtitle, rightAction }: Props) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="w-10 flex justify-start shrink-0">{leftAction}</div>

      <div className="flex flex-col items-center min-w-0">
        <div className="flex items-center gap-1.5">
          {icon}
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 leading-none mt-0.5 truncate max-w-[180px]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="w-10 flex justify-end shrink-0">{rightAction}</div>
    </header>
  )
}
