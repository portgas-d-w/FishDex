import { Skeleton } from '@/components/ui/Skeleton'
import { SkeletonSpeciesGrid } from '@/components/ui/SkeletonCards'

export default function FishDexLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] pb-28">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36 rounded-xl" />
          <Skeleton className="h-3.5 w-52 rounded-full" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>

      {/* Onglets collection */}
      <div className="px-4 mb-4 flex gap-2">
        {[80, 72, 68].map((w, i) => (
          <Skeleton key={i} className="h-8 rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="px-4 mb-5">
        <Skeleton className="h-11 rounded-xl" />
      </div>

      <SkeletonSpeciesGrid count={12} />
    </div>
  )
}
