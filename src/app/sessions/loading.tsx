function SessionRow() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1.5">
          <div className="h-4.5 w-40 bg-white/10 rounded-lg" style={{ height: 18 }} />
          <div className="h-3 w-28 bg-white/5 rounded-full" />
        </div>
        <div className="h-5 w-16 bg-white/8 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-white/5 border border-white/8" />
        <div className="h-6 w-16 rounded-full bg-white/5 border border-white/8" />
      </div>
    </div>
  )
}

export default function SessionsLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-5">
        <div className="h-9 w-44 bg-white/8 rounded-xl animate-pulse" />
        <div className="h-3.5 w-64 bg-white/5 rounded-full mt-1.5 animate-pulse" />
      </div>

      {/* CTAs */}
      <div className="px-4 mb-5 flex gap-2">
        <div className="flex-1 h-12 rounded-xl bg-cyan-400/15 border border-cyan-400/20 animate-pulse" />
        <div className="flex-1 h-12 rounded-xl bg-white/5 border border-white/8 animate-pulse" />
      </div>

      {/* Sessions */}
      <div className="px-4 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SessionRow key={i} />)}
      </div>
    </div>
  )
}
