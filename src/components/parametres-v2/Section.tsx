import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  children: ReactNode
}

export function Section({ icon, title, children }: Props) {
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center gap-1.5 mb-3">
        {icon}
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}
