import { createClient } from '@/lib/supabase/server'

export type CyclicMemory = {
  years_ago: number
  type: 'catch' | 'session'
  data: {
    id: string
    species_nom?: string
    taille_cm?: number
    poids_kg?: number
    lieu?: string
    spot_nom?: string
    catch_count?: number
  }
}

export async function getCyclicMemory(userId: string): Promise<CyclicMemory | null> {
  const supabase = await createClient()
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  for (let yearsAgo = 1; yearsAgo <= 5; yearsAgo++) {
    const year = now.getFullYear() - yearsAgo
    const dateStr = `${year}-${month}-${day}`

    const { data: catches } = await supabase
      .from('catches')
      .select('id, poids_kg, taille_cm, lieu, species:species_id(nom_fr)')
      .eq('user_id', userId)
      .gte('created_at', `${dateStr}T00:00:00`)
      .lte('created_at', `${dateStr}T23:59:59`)
      .limit(1)
      .maybeSingle()

    if (catches) {
      const sp = Array.isArray((catches as unknown as { species: unknown }).species)
        ? ((catches as unknown as { species: unknown[] }).species[0] as { nom_fr: string } | undefined)
        : ((catches as unknown as { species: { nom_fr: string } | null }).species)
      return {
        years_ago: yearsAgo,
        type: 'catch',
        data: {
          id: catches.id,
          species_nom: sp?.nom_fr,
          taille_cm: catches.taille_cm ?? undefined,
          poids_kg: catches.poids_kg ?? undefined,
          lieu: catches.lieu ?? undefined,
        },
      }
    }

    const { data: session } = await supabase
      .from('sessions')
      .select('id, spot_id')
      .eq('user_id', userId)
      .gte('started_at', `${dateStr}T00:00:00`)
      .lte('started_at', `${dateStr}T23:59:59`)
      .not('ended_at', 'is', null)
      .limit(1)
      .maybeSingle()

    if (session) {
      let spotNom: string | undefined
      if (session.spot_id) {
        const { data: spot } = await supabase
          .from('spots').select('nom').eq('id', session.spot_id).single()
        spotNom = (spot as { nom: string } | null)?.nom ?? undefined
      }
      const { count } = await supabase
        .from('catches')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', session.id)
      return {
        years_ago: yearsAgo,
        type: 'session',
        data: { id: session.id, spot_nom: spotNom, catch_count: count ?? 0 },
      }
    }
  }

  return null
}
