import { Skeleton } from '@/components/ui/Skeleton'

export default function SessionDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-safe-top py-4 flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-5 w-40 rounded-lg" />
      </div>

      {/* Photo ambiance */}
      <Skeleton className="mx-4 mt-2 h-48 rounded-2xl" />

      {/* Titre + date */}
      <div className="px-4 mt-4 space-y-2">
        <Skeleton className="h-7 w-56 rounded-xl" />
        <Skeleton className="h-4 w-44 rounded-full" />
      </div>

      {/* Stats pills */}
      <div className="px-4 mt-4 flex gap-2">
        {[72, 80, 64].map((w, i) => (
          <Skeleton key={i} className="h-8 rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* Sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mx-4 mt-3 rounded-2xl bg-white/5 border border-white/8 p-4">
          <Skeleton className="h-4 w-28 rounded-lg mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
          </div>
        </div>
      ))}

      {/* Captures grille */}
      <div className="mx-4 mt-3 rounded-2xl bg-white/5 border border-white/8 p-4">
        <Skeleton className="h-4 w-36 rounded-lg mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
