function StatPill() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 p-3 flex flex-col items-center gap-1.5 animate-pulse">
      <div className="h-6 w-10 bg-white/10 rounded-lg" />
      <div className="h-2.5 w-14 bg-white/5 rounded-full" />
    </div>
  )
}

function CatchCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/8" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/10 rounded-lg w-3/4" />
        <div className="h-3 bg-white/5 rounded-full w-1/2" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 w-14 rounded-full bg-white/5" />
          <div className="h-5 w-12 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  )
}

export default function AquariumLoading() {
  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-28 bg-white/8 rounded-xl animate-pulse" />
          <div className="h-3.5 w-44 bg-white/5 rounded-full animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/8 animate-pulse" />
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-4 gap-2 mb-5">
        {Array.from({ length: 4 }).map((_, i) => <StatPill key={i} />)}
      </div>

      {/* Filtres */}
      <div className="px-4 mb-4 flex gap-2 overflow-hidden">
        {[60, 72, 56, 68].map((w, i) => (
          <div key={i} className="h-8 shrink-0 rounded-full bg-white/5 border border-white/8 animate-pulse" style={{ width: w }} />
        ))}
      </div>

      {/* Grille prises */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <CatchCard key={i} />)}
      </div>
    </div>
  )
}
