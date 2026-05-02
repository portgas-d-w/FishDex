import Link from 'next/link'
import { Fish, BookOpen } from 'lucide-react'
import { QuickCaptureButton } from './QuickCaptureButton'
import { RecentCatchCard } from './RecentCatchCard'

type RecentCatch = {
  id: string
  date_capture: string
  created_at: string
  photo_url: string | null
  species: { nom_fr: string; image_url: string | null } | null
}

type Props = {
  userId: string
  username: string
  recentCatches: RecentCatch[]
  totalCatches: number
  discoveredSpecies: number
}

const TOTAL_SPECIES = 29

export function DashboardHome({
  userId,
  username,
  recentCatches,
  totalCatches,
  discoveredSpecies,
}: Props) {
  return (
    <div className="flex flex-col gap-8 px-4 py-6 max-w-2xl mx-auto">

      {/* Salutation */}
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-100">
          🐟 Bienvenue, <span className="text-teal-400">{username}</span> !
        </h1>
        <p className="text-slate-400 text-sm">Ton journal de pêche personnel</p>
      </section>

      {/* Bouton capture */}
      <section>
        <QuickCaptureButton userId={userId} />
      </section>

      {/* Dernières prises */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200">Mes dernières prises</h2>
          {totalCatches >= 4 && (
            <Link
              href="/aquarium"
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              Voir tout →
            </Link>
          )}
        </div>

        {recentCatches.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 border border-dashed border-slate-700 rounded-xl text-center px-4">
            <span className="text-3xl">🎣</span>
            <p className="text-sm text-slate-400">
              Pas encore de prise. Capture-en une pour démarrer ton aventure !
            </p>
          </div>
        ) : (
          /* Scroll horizontal mobile, grille desktop */
          <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible scrollbar-none">
            {recentCatches.map((c) => (
              <RecentCatchCard key={c.id} catch={c} />
            ))}
          </div>
        )}
      </section>

      {/* Stats rapides */}
      <section className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-teal-400 leading-none">
              {discoveredSpecies}
              <span className="text-slate-500 font-normal text-sm"> / {TOTAL_SPECIES}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Espèces découvertes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
            <Fish size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-teal-400 leading-none">{totalCatches}</p>
            <p className="text-xs text-slate-400 mt-0.5">Prise{totalCatches !== 1 ? 's' : ''} totale{totalCatches !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </section>

    </div>
  )
}
