import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExportCSVButton } from '@/components/admin/ExportCSVButton'

const ADMIN_EMAIL = 'alexy101099@gmail.com'
const UNDERREPRESENTED_THRESHOLD = 10

export default async function AiDataAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  // Stats globales
  const { count: totalPhotos } = await supabase
    .from('ai_training_data')
    .select('id', { count: 'exact', head: true })
    .eq('is_usable_for_training', true)

  const { count: totalAll } = await supabase
    .from('ai_training_data')
    .select('id', { count: 'exact', head: true })

  const { count: correctedCount } = await supabase
    .from('ai_training_data')
    .select('id', { count: 'exact', head: true })
    .eq('user_corrected', true)

  // Répartition par espèce
  const { data: bySpeciesRaw } = await supabase
    .from('ai_training_data')
    .select('species_id_validated, species:species_id_validated(nom_fr)')
    .eq('is_usable_for_training', true)

  // Agréger côté JS (Supabase JS ne supporte pas group by natif)
  type SpeciesCount = { nom_fr: string; count: number; id: string }
  const speciesMap = new Map<string, SpeciesCount>()
  for (const row of bySpeciesRaw ?? []) {
    const id = row.species_id_validated
    const sp = Array.isArray(row.species) ? row.species[0] : row.species
    const nom = (sp as { nom_fr: string } | null)?.nom_fr ?? 'Inconnue'
    const existing = speciesMap.get(id)
    if (existing) {
      existing.count++
    } else {
      speciesMap.set(id, { id, nom_fr: nom, count: 1 })
    }
  }
  const bySpecies = [...speciesMap.values()].sort((a, b) => b.count - a.count)
  const underRepresented = bySpecies.filter(s => s.count < UNDERREPRESENTED_THRESHOLD)

  // Espèces avec 0 photos (toutes les espèces du catalogue)
  const { data: allSpecies } = await supabase
    .from('species')
    .select('id, nom_fr')
    .order('nom_fr')
  const speciesWithData = new Set(bySpecies.map(s => s.id))
  const zeroPhotos = (allSpecies ?? []).filter(s => !speciesWithData.has(s.id))

  return (
    <div className="min-h-screen bg-[#0a0f14] px-4 pt-12 pb-32">
      <h1 className="text-2xl font-black text-white mb-1">Data IA</h1>
      <p className="text-white/40 text-sm mb-8">Données d&apos;entraînement pour le futur modèle</p>

      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Photos utilisables', value: totalPhotos ?? 0, color: 'text-cyan-400' },
          { label: 'Total collectées',   value: totalAll ?? 0,    color: 'text-white' },
          { label: 'Corrigées par user', value: correctedCount ?? 0, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Export CSV */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Export</p>
        <ExportCSVButton adminEmail={ADMIN_EMAIL} />
      </div>

      {/* Espèces sous-représentées */}
      {underRepresented.length > 0 && (
        <div className="rounded-2xl bg-amber-400/5 border border-amber-400/15 p-5 mb-6">
          <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
            Sous-représentées (&lt; {UNDERREPRESENTED_THRESHOLD} photos)
          </p>
          <div className="space-y-1.5">
            {underRepresented.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <p className="text-sm text-white/70">{s.nom_fr}</p>
                <span className="text-xs font-bold text-amber-400">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Espèces sans photo */}
      {zeroPhotos.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">
            Sans données ({zeroPhotos.length} espèces)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {zeroPhotos.map(s => (
              <span key={s.id} className="text-[11px] text-white/30 bg-white/4 border border-white/8 px-2 py-0.5 rounded-full">
                {s.nom_fr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top espèces */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Répartition par espèce ({bySpecies.length} espèces)
        </p>
        {bySpecies.length === 0 ? (
          <p className="text-sm text-white/25 italic">Aucune donnée collectée pour l&apos;instant</p>
        ) : (
          <div className="space-y-2">
            {bySpecies.map((s, i) => {
              const pct = totalPhotos ? Math.round((s.count / totalPhotos) * 100) : 0
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/25 w-4 font-mono">{i + 1}</span>
                      <p className="text-sm text-white/80">{s.nom_fr}</p>
                    </div>
                    <span className="text-xs font-bold text-white/60">{s.count}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400/60"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
