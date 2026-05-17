'use client'

import { Lock } from 'lucide-react'

export type BadgeData = {
  id: string
  slug: string
  category: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  is_hidden: boolean
  xp_reward: number
  unlocked: boolean
  unlocked_at: string | null
}

type StyleSet = { bg: string; border: string; glow: string; text: string }

const COLOR_MAP: Record<string, StyleSet> = {
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-400/50', glow: '0 0 20px rgba(52,211,153,0.35)',   text: 'text-emerald-400' },
  cyan:    { bg: 'bg-cyan-500/20',    border: 'border-cyan-400/50',    glow: '0 0 20px rgba(34,211,238,0.35)',   text: 'text-cyan-400'    },
  blue:    { bg: 'bg-blue-500/20',    border: 'border-blue-400/50',    glow: '0 0 20px rgba(96,165,250,0.35)',   text: 'text-blue-400'    },
  amber:   { bg: 'bg-amber-500/20',   border: 'border-amber-400/50',   glow: '0 0 20px rgba(251,191,36,0.35)',   text: 'text-amber-400'   },
  red:     { bg: 'bg-red-500/20',     border: 'border-red-400/50',     glow: '0 0 20px rgba(248,113,113,0.35)',  text: 'text-red-400'     },
  fuchsia: { bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-400/50', glow: '0 0 20px rgba(232,121,249,0.35)', text: 'text-fuchsia-400' },
  orange:  { bg: 'bg-orange-500/20',  border: 'border-orange-400/50',  glow: '0 0 20px rgba(251,146,60,0.35)',   text: 'text-orange-400'  },
  yellow:  { bg: 'bg-yellow-500/20',  border: 'border-yellow-400/50',  glow: '0 0 20px rgba(250,204,21,0.35)',   text: 'text-yellow-400'  },
  indigo:  { bg: 'bg-indigo-500/20',  border: 'border-indigo-400/50',  glow: '0 0 20px rgba(129,140,248,0.35)', text: 'text-indigo-400'  },
  purple:  { bg: 'bg-purple-500/20',  border: 'border-purple-400/50',  glow: '0 0 20px rgba(192,132,252,0.35)', text: 'text-purple-400'  },
}

const FALLBACK: StyleSet = { bg: 'bg-white/5', border: 'border-white/10', glow: 'none', text: 'text-slate-400' }

function getStyle(color: string | null): StyleSet {
  return color ? (COLOR_MAP[color] ?? FALLBACK) : FALLBACK
}

// ── Version hex (profil) ──────────────────────────────────────
export function HexBadge({ badge }: { badge: BadgeData }) {
  const style   = getStyle(badge.color)
  const locked  = !badge.unlocked
  const hidden  = badge.is_hidden && locked

  if (hidden) return null

  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <div
        className={`w-14 h-14 flex items-center justify-center text-2xl transition-all duration-300
          ${locked ? 'bg-white/5' : style.bg}
          border ${locked ? 'border-white/8' : style.border}`}
        style={{
          clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          boxShadow: locked ? 'none' : style.glow,
          filter: locked ? 'grayscale(1) brightness(0.4)' : 'none',
        }}
      >
        {locked ? <Lock size={18} className="text-slate-600" /> : <span>{badge.icon}</span>}
      </div>
      <span className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${locked ? 'text-slate-600' : 'text-slate-300'}`}>
        {badge.title}
      </span>
    </div>
  )
}

// ── Version carte (missions) ──────────────────────────────────
export function BadgeCard({ badge }: { badge: BadgeData }) {
  const style  = getStyle(badge.color)
  const locked = !badge.unlocked
  const hidden = badge.is_hidden && locked

  if (hidden) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-white/3 border border-white/6 px-4 py-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
          <Lock size={18} className="text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-500">Badge mystère</p>
          <p className="text-xs text-slate-600 truncate">Continue à pêcher pour le découvrir…</p>
        </div>
        <span className="text-xs text-slate-600 bg-white/5 rounded-full px-2 py-0.5 flex-shrink-0">???</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200
      ${locked
        ? 'bg-white/3 border-white/6 opacity-50'
        : `bg-white/5 ${style.border}`
      }`}
      style={{ boxShadow: locked ? 'none' : `inset 0 0 30px ${style.glow.replace('0 0 20px', '').trim()}` }}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg
          ${locked ? 'bg-white/5 border border-white/8' : `${style.bg} border ${style.border}`}`}
        style={{ boxShadow: locked ? 'none' : style.glow }}
      >
        {locked ? <Lock size={16} className="text-slate-600" /> : <span>{badge.icon}</span>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${locked ? 'text-slate-500' : 'text-white'}`}>
          {badge.title}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {badge.unlocked_at
            ? `Débloqué le ${new Date(badge.unlocked_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : badge.description ?? 'Condition inconnue'
          }
        </p>
      </div>

      {/* XP reward */}
      <span className={`text-xs font-bold flex-shrink-0 rounded-full px-2 py-0.5
        ${badge.unlocked ? `${style.text} bg-white/5` : 'text-slate-600 bg-white/5'}`}>
        +{badge.xp_reward} XP
      </span>
    </div>
  )
}
