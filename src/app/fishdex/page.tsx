import { createClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'
import { FishDexClient } from '@/components/fishdex/FishDexClient'
import { rareteOrder, rareteConfig, RARETE_COUNTS } from '@/lib/fishdex/rarete'
import type { SpeciesRow, Rarete } from '@/types/fishdex'

export const metadata = {
  title: 'FishDex — Encyclopédie des espèces',
  description: 'Découvre les 57 espèces de ton FishDex et complète ta collection.',
}

export default async function FishDexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: speciesData, error } = await supabase
    .from('species')
    .select('*')
    .order('numero_dex', { ascending: true })

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-400 font-semibold">Erreur de chargement : {error.message}</p>
      </div>
    )
  }

  const species: SpeciesRow[] = speciesData ?? []

  // Espèces découvertes par l'user
  let discoveredSlugs: string[] = []
  if (user) {
    const { data: catches } = await supabase
      .from('catches')
      .select('species:species_id ( slug )')
      .eq('user_id', user.id)

    if (catches) {
      const slugSet = new Set<string>()
      for (const c of catches) {
        const s = c.species as unknown as { slug: string } | null
        if (s?.slug) slugSet.add(s.slug)
      }
      discoveredSlugs = [...slugSet]
    }
  }

  const discoveredSet = new Set(discoveredSlugs)
  const totalCount = species.length
  const discoveredCount = discoveredSlugs.length
  const pct = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0

  // Stats par rareté
  const statsByRarete = rareteOrder.map((r: Rarete) => ({
    rarete: r,
    discovered: species.filter((s) => s.rarete === r && discoveredSet.has(s.slug)).length,
    total: RARETE_COUNTS[r],
  }))

  return (
    <div className="flex flex-col gap-5 px-4 py-5 max-w-4xl mx-auto">

      {/* ── Carte progression ── */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm p-4 flex flex-col sm:flex-row gap-4">

        {/* Gauche : badge + % + barre */}
        <div className="flex items-center gap-4 sm:flex-1">
          {/* Badge hexagonal */}
          <div className="relative w-14 h-16 flex items-center justify-center shrink-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-teal-500 to-teal-700"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />
            <div
              className="absolute inset-[2px] bg-slate-900"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />
            <BookOpen size={20} className="relative text-teal-400 z-10" />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-teal-400 tabular-nums leading-none">
                {pct}%
              </span>
              <span className="text-sm text-slate-400">complété</span>
            </div>
            <p className="text-xs text-slate-500">
              <span className="text-slate-300 font-semibold tabular-nums">{discoveredCount}</span>
              {' '}/ {totalCount} espèces découvertes
            </p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="hidden sm:block w-px bg-slate-800" />
        <div className="block sm:hidden h-px bg-slate-800" />

        {/* Droite : tableau par rareté */}
        <div className="flex flex-col gap-1.5 sm:min-w-[180px]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
            Rareté découverte
          </p>
          {statsByRarete.map(({ rarete, discovered, total }) => {
            const cfg = rareteConfig[rarete]
            return (
              <div key={rarete} className="flex items-center gap-2">
                {rarete === 'shiny' ? (
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 shrink-0" />
                ) : (
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                )}
                <span className="text-xs text-slate-400 flex-1">{cfg.label}</span>
                <span className="text-xs font-semibold tabular-nums text-slate-300">
                  {discovered}
                  <span className="text-slate-600 font-normal"> / {total}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── FishDexClient : header, filtres, grilles ── */}
      <FishDexClient species={species} discoveredSlugs={discoveredSlugs} />

    </div>
  )
}
