import { Skeleton } from '@/components/ui/Skeleton'

function StatCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
      <Skeleton className="h-8 w-14 rounded-lg mb-1.5" />
      <Skeleton className="h-3 w-20 rounded-full" />
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
        <Skeleton className="h-4 w-36 rounded-full" />
      </div>

      {/* Collection path */}
      <Skeleton className="mx-4 mt-4 h-20 rounded-2xl" />

      {/* Avatar hero */}
      <div className="flex flex-col items-center mt-6 mb-2">
        <Skeleton className="w-[100px] h-[100px] rounded-full" style={{ boxShadow: '0 0 30px rgba(34,211,238,0.15)' }} />
        <Skeleton className="h-5 w-32 rounded-lg mt-3" />
        <Skeleton className="h-3 w-24 rounded-full mt-1.5" />
      </div>

      {/* Level bar */}
      <div className="mx-4 mt-4 rounded-2xl bg-white/5 border border-white/8 px-4 py-4">
        <Skeleton className="h-5 w-40 rounded-lg mb-3" />
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>

      {/* Stats 2×2 */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => <StatCard key={i} />)}
      </div>

      {/* Records */}
      <div className="mx-4 mt-3 rounded-2xl bg-white/5 border border-white/8 p-4">
        <Skeleton className="h-4 w-24 rounded-lg mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
