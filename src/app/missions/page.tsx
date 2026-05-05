'use client'

import { useState, useEffect, useTransition } from 'react'
import { Trophy, Flame, Star } from 'lucide-react'
import { MissionCard } from '@/components/missions/MissionCard'
import type { MissionWithProgress } from '@/lib/missions/types'

type Tab = 'daily' | 'weekly' | 'special'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'daily',   label: 'Quotidien',   icon: Flame  },
  { id: 'weekly',  label: 'Hebdo',       icon: Trophy },
  { id: 'special', label: 'Spéciales',   icon: Star   },
]

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('daily')
  const [missions, setMissions] = useState<Record<Tab, MissionWithProgress[]>>({
    daily: [], weekly: [], special: [],
  })
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setLoading(true)
    fetch('/api/missions')
      .then(r => r.json())
      .then(data => {
        setMissions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const current = missions[activeTab]
  const completed = current.filter(m => m.completed).length
  const total = current.length

  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-black text-white">Missions</h1>
        <p className="text-sm text-slate-400 mt-1">Accomplis des défis pour gagner de l&apos;XP</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-2 flex gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => startTransition(() => setActiveTab(id))}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === id
                ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                : 'bg-white/5 text-slate-400 border border-white/8 hover:text-slate-200'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Progress summary */}
      {!loading && total > 0 && (
        <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/8 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">Progression</span>
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                style={{ width: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%' }}
              />
            </div>
            <span className="text-sm font-bold text-cyan-400 tabular-nums">{completed}/{total}</span>
          </div>
        </div>
      )}

      {/* Missions list */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/8 h-20 animate-pulse" />
          ))
        ) : current.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Trophy size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune mission disponible pour l&apos;instant</p>
          </div>
        ) : (
          current.map(m => <MissionCard key={m.userMissionId} mission={m} />)
        )}
      </div>
    </div>
  )
}
