import { Skeleton } from '@/components/ui/Skeleton'

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
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-5 w-32 rounded-lg" />
      </div>

      {/* Hero photo */}
      <Skeleton className="mx-4 aspect-square rounded-3xl" />

      {/* Badge + nom */}
      <div className="px-4 mt-4 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-lg" />
      </div>

      {/* Stats row */}
      <div className="px-4 mt-3 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/8 p-3">
            <Skeleton className="h-6 w-12 rounded-lg mx-auto mb-1" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Infos espèce */}
      <div className="mx-4 mt-3 rounded-2xl bg-white/5 border border-white/8 p-4">
        <Skeleton className="h-4 w-32 rounded-lg mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-5/6 rounded-full" />
          <Skeleton className="h-3 w-4/6 rounded-full" />
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mt-3 flex gap-2">
        <Skeleton className="flex-1 h-12 rounded-2xl" />
        <Skeleton className="w-12 h-12 rounded-2xl" />
      </div>
    </div>
  )
}
