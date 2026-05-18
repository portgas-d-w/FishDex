import { Skeleton } from './Skeleton'

// ── CatchCard — aspect 4/5, photo + badges + nom + poids ────────────────────
export function SkeletonCatchCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-white/5">
      {/* Zone photo */}
      <div className="relative aspect-[4/5] bg-white/5 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        {/* Badge haut-gauche */}
        <div className="absolute top-2 left-2 h-4 w-14 rounded-full bg-white/8" />
        {/* Gradient bas */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent" />
        {/* Nom en bas de la photo */}
        <div className="absolute bottom-2 left-2 right-2 space-y-1.5">
          <div className="h-3 w-3/4 rounded-full bg-white/15" />
          <div className="h-2.5 w-1/2 rounded-full bg-white/8" />
        </div>
      </div>
      {/* Pied de card */}
      <div className="px-2.5 pb-2.5 pt-2 flex items-center justify-between gap-2">
        <div className="h-2.5 w-16 rounded-full bg-white/8" />
        <div className="h-5 w-12 rounded-full bg-white/6 border border-white/8" />
      </div>
    </div>
  )
}

// ── SpeciesCard — aspect carré, background collection + badges + nom ─────────
export function SkeletonSpeciesCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-white/5">
      {/* Zone photo carrée */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <Skeleton className="absolute inset-0 rounded-none" />
        {/* Badge dex # haut gauche */}
        <div className="absolute top-1.5 left-1.5 h-4 w-8 rounded bg-slate-900/70 border border-slate-800/60" />
        {/* Badge rareté haut droit */}
        <div className="absolute top-1.5 right-1.5 h-4 w-12 rounded bg-white/8 border border-white/10" />
      </div>
      {/* Infos */}
      <div className="px-2.5 pb-2.5 pt-2 space-y-1">
        <div className="h-3 w-3/4 rounded-full bg-white/12" />
        <div className="h-2.5 w-1/2 rounded-full bg-white/6" />
      </div>
    </div>
  )
}

// ── SessionCard — row horizontal avec dot saison + infos + badge ─────────────
export function SkeletonSessionCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 px-4 py-3.5">
      {/* Dot saison */}
      <div className="w-9 h-9 rounded-xl bg-white/8 shrink-0" />
      {/* Texte */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="h-3.5 w-40 rounded-full bg-white/12" />
        <div className="h-2.5 w-24 rounded-full bg-white/6" />
        <div className="flex gap-1.5 pt-0.5">
          <div className="h-5 w-16 rounded-full bg-white/5 border border-white/8" />
          <div className="h-5 w-12 rounded-full bg-white/5 border border-white/8" />
        </div>
      </div>
      {/* Badge capture count */}
      <div className="h-6 w-10 rounded-full bg-white/6 border border-white/8 shrink-0" />
    </div>
  )
}

// ── Grilles prêtes à l'emploi ─────────────────────────────────────────────────

export function SkeletonCatchGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCatchCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonSpeciesGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonSpeciesCard key={i} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonSessionList({ count = 4 }: { count?: number }) {
  return (
    <div className="px-4 flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonSessionCard key={i} />
      ))}
    </div>
  )
}
