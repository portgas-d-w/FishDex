import { Skeleton } from '@/components/ui/Skeleton'
import { SkeletonCatchGrid } from '@/components/ui/SkeletonCards'

function StatPill() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 p-3 flex flex-col items-center gap-1.5">
      <Skeleton className="h-6 w-10 rounded-lg" />
      <Skeleton className="h-2.5 w-14 rounded-full" />
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
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-3.5 w-44 rounded-full" />
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-4 gap-2 mb-5">
        {Array.from({ length: 4 }).map((_, i) => <StatPill key={i} />)}
      </div>

      {/* Filtres */}
      <div className="px-4 mb-4 flex gap-2 overflow-hidden">
        {[60, 72, 56, 68].map((w, i) => (
          <Skeleton key={i} className="h-8 shrink-0 rounded-full" style={{ width: w }} />
        ))}
      </div>

      <SkeletonCatchGrid count={6} />
    </div>
  )
}
