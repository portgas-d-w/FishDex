type Props = {
  caughtCount: number
  totalCount: number
  miragesCaptured?: number
}

function DonutChart({ percent }: { percent: number }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <svg width="84" height="84" viewBox="0 0 84 84" aria-label={`${percent}%`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
      <circle
        cx="42" cy="42" r={r}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 42 42)"
      />
      <text
        x="42" y="42"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="600"
        fontFamily="inherit"
      >
        {percent}%
      </text>
    </svg>
  )
}

export function FishdexObjectivesWidget({ caughtCount, totalCount, miragesCaptured = 0 }: Props) {
  const percent = totalCount > 0 ? Math.round((caughtCount / totalCount) * 100) : 0

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex flex-col">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
        Objectifs FishDex
      </p>

      <div className="flex items-center gap-4 flex-1">
        <DonutChart percent={percent} />
        <div>
          <p className="text-2xl font-semibold text-white">{caughtCount} / {totalCount}</p>
          <p className="text-xs text-white/60 mt-0.5">
            {caughtCount} espèce{caughtCount > 1 ? 's' : ''} capturée{caughtCount > 1 ? 's' : ''}
            {miragesCaptured > 0 && ` · ${miragesCaptured} Mirage${miragesCaptured > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
    </div>
  )
}
