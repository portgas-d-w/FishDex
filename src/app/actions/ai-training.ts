'use server'

import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = 'alexy101099@gmail.com'

export async function exportAiTrainingCSV(adminEmail: string): Promise<{
  csv?: string
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== adminEmail) return { error: 'Non autorisé' }

  const { data, error } = await supabase
    .from('ai_training_data')
    .select(`
      id,
      catch_id,
      photo_url,
      species_id_validated,
      species:species_id_validated(nom_fr),
      user_corrected,
      quality_score,
      is_usable_for_training,
      created_at
    `)
    .eq('is_usable_for_training', true)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }

  const header = 'id,catch_id,photo_url,species_id,species_nom,user_corrected,quality_score,created_at'
  const rows = (data ?? []).map(r => {
    const sp = Array.isArray(r.species) ? r.species[0] : r.species
    const nom = (sp as { nom_fr: string } | null)?.nom_fr ?? ''
    return [
      r.id,
      r.catch_id,
      `"${r.photo_url}"`,
      r.species_id_validated,
      `"${nom}"`,
      r.user_corrected,
      r.quality_score ?? '',
      r.created_at,
    ].join(',')
  })

  return { csv: [header, ...rows].join('\n') }
}
