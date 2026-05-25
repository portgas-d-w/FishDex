'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'

const RARITY_COLORS: Record<string, string> = {
  commun:     '#94a3b8',
  'peu commun': '#60a5fa',
  rare:       '#a855f7',
  epique:     '#f59e0b',
  legendaire: '#f59e0b',
  mirage:     '#ec4899',
}

const SEASON_COLORS: Record<string, string> = {
  printemps: '#34d399',
  été:       '#f59e0b',
  automne:   '#f97316',
  hiver:     '#60a5fa',
}

type MonthData  = { month: string; captures: number }
type RarityData = { name: string; value: number }
type SeasonData = { season: string; captures: number; sessions: number }

type Props = {
  monthlyData:  MonthData[]
  rarityData:   RarityData[]
  seasonData:   SeasonData[]
}

const CYAN = '#22d3ee'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80">
      <p className="font-semibold mb-0.5">{label}</p>
      <p>{payload[0].value} capture{payload[0].value > 1 ? 's' : ''}</p>
    </div>
  )
}

export function MonthlyCapturesChart({ data }: { data: MonthData[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="captures" fill={CYAN} radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RarityPieChart({ data }: { data: RarityData[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={44}
          outerRadius={70}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={RARITY_COLORS[entry.name] ?? '#64748b'} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload as RarityData
            return (
              <div className="bg-[#111820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80">
                <p className="capitalize font-semibold">{d.name}</p>
                <p>{d.value} capture{d.value > 1 ? 's' : ''}</p>
              </div>
            )
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function SeasonChart({ data }: { data: SeasonData[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="season" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="captures" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry) => (
            <Cell key={entry.season} fill={SEASON_COLORS[entry.season] ?? CYAN} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
