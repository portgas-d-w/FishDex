'use client'

import { motion } from 'framer-motion'
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

// Index global pour les délais stagger cross-groupe
let globalIndex = 0

export function SessionsList({
  sessions,
  catchCountMap,
}: {
  sessions: Session[]
  catchCountMap: Record<string, number>
}) {
  const groups = groupByMonth(sessions)
  globalIndex = 0

  return (
    <div className="px-4 space-y-6 pb-4">
      {groups.map(({ label, items }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold tracking-widest text-white/30 uppercase mb-2 capitalize">
            {label}
          </p>
          <div className="space-y-2">
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
