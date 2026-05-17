import { SessionCard } from './SessionCard'

type Session = {
  id: string
  title: string | null
  started_at: string
  ended_at: string | null
  season: string | null
  is_bookmarked: boolean
  spot: { nom: string } | null
}

function groupByMonth(sessions: Session[]): { label: string; items: Session[] }[] {
  const groups: Record<string, Session[]> = {}
  for (const s of sessions) {
    const key = new Date(s.started_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }))
}

export function SessionsList({
  sessions,
  catchCountMap,
}: {
  sessions: Session[]
  catchCountMap: Record<string, number>
}) {
  const groups = groupByMonth(sessions)

  return (
    <div className="px-4 space-y-6 pb-4">
      {groups.map(({ label, items }) => (
        <div key={label}>
          <p className="text-[11px] font-semibold tracking-widest text-white/30 uppercase mb-2 capitalize">
            {label}
          </p>
          <div className="space-y-2">
            {items.map(s => (
              <SessionCard
                key={s.id}
                session={s}
                catchCount={catchCountMap[s.id] ?? 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
