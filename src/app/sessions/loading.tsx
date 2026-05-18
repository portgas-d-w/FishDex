import { Skeleton } from '@/components/ui/Skeleton'
import { SkeletonSessionList } from '@/components/ui/SkeletonCards'

export default function SessionsLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-5">
        <Skeleton className="h-9 w-44 rounded-xl" />
        <Skeleton className="h-3.5 w-64 rounded-full mt-1.5" />
      </div>

      {/* CTAs */}
      <div className="px-4 mb-5 flex gap-2">
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="flex-1 h-12 rounded-xl" />
      </div>

      {/* Label mois */}
      <div className="px-4 mb-2">
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>

      <SkeletonSessionList count={4} />
    </div>
  )
}
