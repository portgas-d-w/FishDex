import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { deleteCatch } from '@/app/actions/catches'

export const metadata = {
  title: 'Aquarium — Mes prises',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function AquariumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: catches } = await supabase
    .from('catches')
    .select(`
      id, date_capture, lieu, poids_kg, taille_cm, notes, species_id,
      species:species_id ( nom_fr, image_url )
    `)
    .eq('user_id', user.id)
    .order('date_capture', { ascending: false })
    .order('created_at', { ascending: false })

  const totalCatches = catches?.length ?? 0
  const uniqueSpecies = new Set(catches?.map(c => c.species_id)).size

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-teal-400 mb-1">Aquarium</h1>
          <p className="text-slate-400">
            <span className="text-teal-400 font-semibold">{totalCatches}</span>{' '}
            prise{totalCatches !== 1 ? 's' : ''} ·{' '}
            <span className="text-teal-400 font-semibold">{uniqueSpecies}</span>{' '}
            espèce{uniqueSpecies !== 1 ? 's' : ''} différente{uniqueSpecies !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/aquarium/nouvelle"
          className="px-4 py-2 text-sm font-medium text-slate-900 bg-teal-500 hover:bg-teal-400 rounded-lg transition-colors"
        >
          + Ajouter une prise
        </Link>
      </div>

      {/* Liste */}
      {catches && catches.length > 0 ? (
        <div className="flex flex-col gap-3">
          {catches.map((c) => {
            const species = c.species as unknown as { nom_fr: string; image_url: string | null } | null
            return (
              <div
                key={c.id}
                className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
              >
                {/* Image espèce */}
                <div className="w-14 h-14 shrink-0 relative bg-slate-900 rounded-lg overflow-hidden">
                  <Image
                    src={species?.image_url || '/fishes/placeholder.svg'}
                    alt={species?.nom_fr ?? 'Poisson'}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-100">{species?.nom_fr}</h3>
                    <span className="text-xs text-slate-500">{formatDate(c.date_capture)}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                    {c.lieu && <span>{c.lieu}</span>}
                    {c.poids_kg != null && <span>{c.poids_kg} kg</span>}
                    {c.taille_cm != null && <span>{c.taille_cm} cm</span>}
                  </div>
                  {c.notes && (
                    <p className="text-xs text-slate-500 mt-1 truncate">{c.notes}</p>
                  )}
                </div>

                {/* Supprimer */}
                <form action={deleteCatch}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-400 mb-4">Ton aquarium est vide pour l&apos;instant.</p>
          <Link
            href="/aquarium/nouvelle"
            className="px-4 py-2 text-sm font-medium text-teal-400 border border-teal-500/50 hover:bg-teal-500/10 rounded-lg transition-colors"
          >
            Enregistrer ta première prise
          </Link>
        </div>
      )}
    </div>
  )
}
