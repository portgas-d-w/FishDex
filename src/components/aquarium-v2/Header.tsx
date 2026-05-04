import { Fish, SlidersHorizontal } from 'lucide-react'
import { UserMenu } from '@/components/shared/UserMenu'

type Props = {
  username: string
  email: string
  avatarUrl: string | null
  totalCatches: number
  onFilterOpen?: () => void
}

export function AquariumHeader({ username, email, avatarUrl, totalCatches }: Props) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      {/* Avatar + UserMenu */}
      <UserMenu username={username} email={email} avatarUrl={avatarUrl} />

      {/* Titre centré */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <Fish size={18} className="text-cyan-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">Aquarium</h1>
        </div>
        <p className="text-[11px] text-slate-400 leading-none mt-0.5">
          {totalCatches} prise{totalCatches !== 1 ? 's' : ''} enregistrée{totalCatches !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Icône filtres (cosmétique, la logique est dans CatchesGrid) */}
      <button
        aria-label="Filtres"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors"
      >
        <SlidersHorizontal size={18} />
      </button>
    </header>
  )
}
