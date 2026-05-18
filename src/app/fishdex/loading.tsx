function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/8" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-3 bg-white/10 rounded-full w-4/5" />
        <div className="h-2.5 bg-white/5 rounded-full w-2/3" />
      </div>
    </div>
  )
}

export default function FishDexLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-36 bg-white/8 rounded-xl animate-pulse" />
          <div className="h-3.5 w-52 bg-white/5 rounded-full animate-pulse" />
        </div>
        <div className="w-9 h-9 rounded-full bg-white/8 animate-pulse" />
      </div>

      {/* Onglets collection */}
      <div className="px-4 mb-4 flex gap-2">
        {[80, 72, 68].map((w, i) => (
          <div key={i} className={`h-8 w-${w === 80 ? '20' : w === 72 ? '18' : '16'} rounded-full bg-white/8 animate-pulse`}
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="px-4 mb-5">
        <div className="h-11 bg-white/5 border border-white/8 rounded-xl animate-pulse" />
      </div>

      {/* Grille espèces */}
      <div className="px-4 grid grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}
