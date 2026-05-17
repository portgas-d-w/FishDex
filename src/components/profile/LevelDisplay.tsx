import type { MasteryInfo } from '@/lib/levels/masteries'

type Props = {
  title: string
  level: number
  progress: number // 0-100
  mastery?: MasteryInfo | null
}

export function LevelDisplay({ title, level, progress, mastery }: Props) {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-semibold tracking-tight text-white">{title}</p>
      <p className="text-sm text-slate-400">Niveau {level}</p>
      {mastery && (
        <p className="text-xs text-cyan-400 font-medium">
          Maîtrise {mastery.tier} {mastery.rank}
        </p>
      )}
      <div className="mt-2 h-1 w-full rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-cyan-500/60"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}
