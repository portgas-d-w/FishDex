import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserSpots } from '@/app/actions/spots'
import { RetroSessionForm } from '@/components/sessions/RetroSessionForm'

export const metadata = { title: 'Souvenir passé — FishDex' }

export type OrphanCatch = {
  id: string
  created_at: string
  species_nom: string | null
  taille_cm: number | null
  poids_kg: number | null
  lieu: string | null
}

export default async function RetroSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const spots = await getUserSpots()

  // Captures orphelines (sans session_id) pour le multi-select
  const { data: rawCatches } = await supabase
    .from('catches')
    .select('id, created_at, taille_cm, poids_kg, lieu, species:species_id(nom_fr)')
    .eq('user_id', user.id)
    .is('session_id', null)
    .order('created_at', { ascending: false })
    .limit(100)

  const orphanCatches: OrphanCatch[] = (rawCatches ?? []).map(c => {
    const sp = Array.isArray(c.species) ? c.species[0] : c.species
    return {
      id: c.id,
      created_at: c.created_at,
      species_nom: (sp as { nom_fr: string } | null)?.nom_fr ?? null,
      taille_cm: c.taille_cm ?? null,
      poids_kg: c.poids_kg ?? null,
      lieu: c.lieu ?? null,
    }
  })

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Header */}
      <section className="relative h-[26vh] min-h-[150px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(/backgrounds/home-automne-riviere.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-[#0a0f14]" />

        <div className="absolute top-12 left-4 z-10">
          <Link
            href="/sessions"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <p className="text-[11px] font-semibold tracking-widest text-cyan-400 uppercase mb-1">
            Souvenir passé
          </p>
          <h1 className="text-2xl font-black text-white">Crée un souvenir</h1>
          <p className="text-sm text-white/40 mt-0.5">Pour les sorties d&apos;avant FishDex</p>
        </div>
      </section>

      <div className="px-4 pb-32 mt-4">
        <RetroSessionForm spots={spots} orphanCatches={orphanCatches} />
      </div>
    </div>
  )
}
