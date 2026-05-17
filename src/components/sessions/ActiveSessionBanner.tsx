'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MapPin, ArrowRight } from 'lucide-react'

type Props = {
  session: {
    id: string
    started_at: string
    spot: { nom: string } | null
    intention: string | null
  }
}

function useDuration(startedAt: string) {
  const [dur, setDur] = useState('')
  useEffect(() => {
    function tick() {
      const diff = Date.now() - new Date(startedAt).getTime()
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setDur(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  return dur
}

export function ActiveSessionBanner({ session }: Props) {
  const duration = useDuration(session.started_at)

  return (
    <div className="mx-4 mb-5">
      <Link href="/sessions/active" className="block">
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 p-5 hover:border-cyan-400/35 transition-colors">
          {/* Pill */}
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Session active
            </span>
            <span className="text-xs font-mono tabular-nums text-cyan-400 font-semibold">
              {duration}
            </span>
          </div>

          {/* Infos */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              {session.spot?.nom ? (
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={12} className="text-white/40 shrink-0" />
                  <p className="text-sm font-semibold text-white truncate">{session.spot.nom}</p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-white mb-1">Session en cours</p>
              )}
              {session.intention && (
                <p className="text-xs text-white/35 capitalize">{session.intention}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-cyan-400 shrink-0">
              <span className="text-xs font-medium">Ouvrir</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
