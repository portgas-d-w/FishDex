function StatCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 p-4 animate-pulse">
      <div className="h-8 w-14 bg-white/10 rounded-lg mb-1.5" />
      <div className="h-3 w-20 bg-white/5 rounded-full" />
    </div>
  )
}

export default function ProfilLoading() {
  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-14 pb-2">
        <div className="h-4 w-36 bg-white/5 rounded-full animate-pulse" />
      </div>

      {/* Collection path */}
      <div className="mx-4 mt-4 h-20 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />

      {/* Avatar hero */}
      <div className="flex flex-col items-center mt-6 mb-2">
        <div className="w-[100px] h-[100px] rounded-full bg-white/8 border-2 border-white/10 animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.15)]" />
        <div className="h-5 w-32 bg-white/10 rounded-lg mt-3 animate-pulse" />
        <div className="h-3 w-24 bg-white/5 rounded-full mt-1.5 animate-pulse" />
      </div>

      {/* Level bar */}
      <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-4 py-4 animate-pulse">
        <div className="h-5 w-40 bg-white/10 rounded-lg mb-3" />
        <div className="h-2.5 w-full bg-white/8 rounded-full">
          <div className="h-full w-1/3 bg-cyan-400/20 rounded-full" />
        </div>
      </div>

      {/* Stats globales */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => <StatCard key={i} />)}
      </div>

      {/* Records */}
      <div className="mx-4 mt-3 rounded-2xl bg-white/5 border border-white/8 p-4 animate-pulse">
        <div className="h-5 w-24 bg-white/10 rounded-lg mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 h-20 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}
