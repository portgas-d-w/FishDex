import { Fish, Star, Play, Square } from 'lucide-react'

export type TimelineEvent = {
  time: string
  label: string
  sublabel?: string
  type: 'start' | 'catch' | 'new_species' | 'note' | 'end'
}

function EventIcon({ type }: { type: TimelineEvent['type'] }) {
  const base = 'w-7 h-7 rounded-full border flex items-center justify-center shrink-0'
  switch (type) {
    case 'start':       return <div className={`${base} bg-emerald-400/15 border-emerald-400/30`}><Play size={12} className="text-emerald-400" /></div>
    case 'end':         return <div className={`${base} bg-red-400/15 border-red-400/30`}><Square size={12} className="text-red-400" fill="currentColor" /></div>
    case 'new_species': return <div className={`${base} bg-amber-400/15 border-amber-400/30`}><Star size={12} className="text-amber-400 fill-amber-400" /></div>
    default:            return <div className={`${base} bg-cyan-400/10 border-cyan-400/20`}><Fish size={12} className="text-cyan-400/80" /></div>
  }
}

// ── Vertical (used in active session) ────────────────────────────────────────
export function SessionTimelineVertical({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((ev, i) => {
        const isLast = i === events.length - 1
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <EventIcon type={ev.type} />
              {!isLast && <div className="w-px flex-1 bg-white/8 my-1" style={{ minHeight: 16 }} />}
            </div>
            <div className={`pb-3 min-w-0 flex-1 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/30 tabular-nums shrink-0">{ev.time}</span>
                <span className={`text-xs font-medium truncate ${
                  ev.type === 'new_species' ? 'text-amber-300' :
                  ev.type === 'end'   ? 'text-red-400/80' :
                  ev.type === 'start' ? 'text-emerald-400' :
                  'text-white/80'
                }`}>{ev.label}</span>
                {ev.type === 'new_species' && (
                  <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    NOUVEAU
                  </span>
                )}
              </div>
              {ev.sublabel && (
                <p className="text-[10px] text-white/30 mt-0.5 ml-0">{ev.sublabel}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Horizontal scroll (used in end/detail) ───────────────────────────────────
export function SessionTimelineHorizontal({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="overflow-x-auto scrollbar-none -mx-5 px-5">
      <div className="flex items-start gap-0 min-w-max pb-2">
        {events.map((ev, i) => {
          const isLast = i === events.length - 1
          return (
            <div key={i} className="flex items-start">
              <div className="flex flex-col items-center w-24">
                <div className="flex items-center w-full">
                  {i > 0 && <div className="flex-1 h-px bg-white/10 mt-3.5" />}
                  <EventIcon type={ev.type} />
                  {!isLast && <div className="flex-1 h-px bg-white/10 mt-3.5" />}
                  {isLast && <div className="flex-1" />}
                </div>
                <div className="text-center mt-1.5 px-1">
                  <p className="text-[9px] text-white/30 tabular-nums">{ev.time}</p>
                  <p className={`text-[10px] font-medium leading-tight mt-0.5 ${
                    ev.type === 'new_species' ? 'text-amber-300' :
                    ev.type === 'end'   ? 'text-red-400/80' :
                    ev.type === 'start' ? 'text-emerald-400' :
                    'text-white/70'
                  }`}>{ev.label}</p>
                  {ev.sublabel && (
                    <p className="text-[9px] text-white/30 leading-tight mt-0.5">{ev.sublabel}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
