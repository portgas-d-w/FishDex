'use client'

import { BadgeCard, type BadgeData } from './BadgeCard'

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  discovery:   { label: 'Découverte',  icon: '🔍' },
  performance: { label: 'Performance', icon: '💪' },
  regularity:  { label: 'Régularité',  icon: '📅' },
  hidden:      { label: 'Cachés',      icon: '🔮' },
}

const CATEGORY_ORDER = ['discovery', 'performance', 'regularity', 'hidden']

type Props = { badges: BadgeData[] }

export function BadgesGrid({ badges }: Props) {
  const grouped = CATEGORY_ORDER.reduce<Record<string, BadgeData[]>>((acc, cat) => {
    acc[cat] = badges.filter(b => b.category === cat)
    return acc
  }, {})

  const total     = badges.length
  const unlocked  = badges.filter(b => b.unlocked).length

  return (
    <div className="flex flex-col gap-6">
      {/* Global progress */}
      <div className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Progression globale</span>
          <span className="text-sm font-black text-white">{unlocked}<span className="text-slate-500">/{total}</span></span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-500"
            style={{ width: total > 0 ? `${Math.round((unlocked / total) * 100)}%` : '0%' }}
          />
        </div>
      </div>

      {/* Categories */}
      {CATEGORY_ORDER.map(cat => {
        const items = grouped[cat] ?? []
        const catUnlocked = items.filter(b => b.unlocked).length
        const meta = CATEGORY_LABELS[cat]

        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{meta.icon}</span>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{meta.label}</h3>
              </div>
              <span className="text-xs text-slate-500">{catUnlocked}/{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
