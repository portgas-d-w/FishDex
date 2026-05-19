'use client'

import { motion } from 'framer-motion'
import { SessionCard, type SessionCardData } from './SessionCard'

function groupByMonth(sessions: SessionCardData[]): { label: string; items: SessionCardData[] }[] {
  const groups: Record<string, SessionCardData[]> = {}
  for (const s of sessions) {
    const key = new Date(s.started_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }))
}

let globalIndex = 0

export function SessionsList({
  sessions,
  catchCountMap,
}: {
  sessions: SessionCardData[]
  catchCountMap: Record<string, number>
}) {
  const groups = groupByMonth(sessions)
  globalIndex  = 0

  return (
    <div className="px-4 space-y-6 pb-8">
      {groups.map(({ label, items }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Label mois — style carnet */}
          <p
            className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3 px-1"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {label}
          </p>

          <div className="space-y-3">
            {items.map(s => {
              const delay = Math.min(globalIndex++ * 0.07, 0.42)
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SessionCard
                    session={s}
                    catchCount={catchCountMap[s.id] ?? 0}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
