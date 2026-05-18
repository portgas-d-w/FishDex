export default function CatchDetailLoading() {
  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-safe-top py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/8 animate-pulse" />
        <div className="h-5 w-32 bg-white/10 rounded-lg animate-pulse" />
      </div>

      {/* Hero photo */}
      <div className="mx-4 aspect-square rounded-3xl bg-white/5 border border-white/8 animate-pulse overflow-hidden">
        <div className="w-full h-full bg-white/8" />
      </div>

      {/* Rareté badge + nom espèce */}
      <div className="px-4 mt-4 flex items-center gap-2">
        <div className="h-6 w-16 rounded-full bg-white/8 animate-pulse" />
        <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse" />
      </div>

      {/* Stats row */}
      <div className="px-4 mt-3 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/8 p-3 animate-pulse">
            <div className="h-6 w-12 bg-white/10 rounded-lg mx-auto mb-1" />
            <div className="h-2.5 w-full bg-white/5 rounded-full" />
          </div>
        ))}
      </div>

      {/* Infos espèce */}
      <div className="mx-4 mt-3 rounded-2xl bg-white/5 border border-white/8 p-4 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded-lg mb-3" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/5 rounded-full" />
          <div className="h-3 w-5/6 bg-white/5 rounded-full" />
          <div className="h-3 w-4/6 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Actions bar */}
      <div className="mx-4 mt-3 flex gap-2">
        <div className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
      </div>
    </div>
  )
}
