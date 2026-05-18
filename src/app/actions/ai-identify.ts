'use server'

import { createClient } from '@/lib/supabase/server'

// ── Types ─────────────────────────────────────────────────────────────────────

export type AIPrediction = {
  species_name: string      // nom commun (iNat ou nom_fr si match BDD)
  scientific_name: string   // nom scientifique Latin
  confidence: number        // 0–1
  matched_species_id: string | null  // id BDD si l'espèce existe dans FishDex
  matched_nom_fr: string | null      // nom_fr BDD si match
}

export type IdentificationResult = {
  source: 'inaturalist' | 'failed'
  predictions: AIPrediction[]
  rate_limit_remaining?: number | null
}

// ── Entrée publique ────────────────────────────────────────────────────────────

/**
 * Identifie l'espèce sur une photo depuis son chemin Supabase Storage.
 * Ex: "userId/original/1748000000000.webp"
 */
export async function identifySpeciesFromPhoto(
  photoPath: string
): Promise<IdentificationResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !photoPath) {
    return { source: 'failed', predictions: [] }
  }

  const photoUrl = `${supabaseUrl}/storage/v1/object/public/catches/${photoPath}`

  try {
    return await identifyWithINaturalist(photoUrl)
  } catch (e) {
    console.error('[ai-identify] iNaturalist failed:', e)
    return { source: 'failed', predictions: [] }
  }
}

// ── iNaturalist ───────────────────────────────────────────────────────────────

type INatTaxon = {
  id: number
  name: string                       // nom scientifique
  preferred_common_name?: string
  iconic_taxon_name?: string
  rank?: string
}

type INatResult = {
  combined_score: number             // 0–100
  taxon: INatTaxon
}

async function identifyWithINaturalist(photoUrl: string): Promise<IdentificationResult> {
  const body = new FormData()
  body.append('image_url', photoUrl)

  const response = await fetch(
    'https://api.inaturalist.org/v1/computervision/score_image',
    {
      method: 'POST',
      body,
      // Timeout via AbortController : 8 s max pour ne pas bloquer l'UI
      signal: AbortSignal.timeout(8000),
    }
  )

  const remaining = response.headers.get('X-RateLimit-Remaining')
  if (remaining && Number(remaining) < 10) {
    console.warn('[ai-identify] iNaturalist rate limit low:', remaining)
  }

  if (!response.ok) {
    throw new Error(`iNaturalist HTTP ${response.status}`)
  }

  const data = await response.json() as { results?: INatResult[] }
  const allResults: INatResult[] = data.results ?? []

  // Filtre : poissons uniquement (classe Actinopterygii = poissons à nageoires rayonnées)
  // + rang species seulement (pas de genres ou familles)
  const fishResults = allResults.filter(
    r => r.taxon.iconic_taxon_name === 'Actinopterygii' && r.taxon.rank === 'species'
  )

  if (fishResults.length === 0) {
    return {
      source: 'inaturalist',
      predictions: [],
      rate_limit_remaining: remaining ? Number(remaining) : null,
    }
  }

  // Match avec la BDD FishDex via nom_scientifique
  const supabase = await createClient()
  const scientificNames = fishResults.slice(0, 5).map(r => r.taxon.name)

  const { data: matches } = await supabase
    .from('species')
    .select('id, nom_fr, nom_scientifique')
    .in('nom_scientifique', scientificNames)

  const matchMap = new Map(
    (matches ?? []).map(m => [m.nom_scientifique, { id: m.id, nom_fr: m.nom_fr }])
  )

  const predictions: AIPrediction[] = fishResults.slice(0, 5).map(r => {
    const dbMatch = matchMap.get(r.taxon.name) ?? null
    return {
      species_name:        dbMatch?.nom_fr ?? r.taxon.preferred_common_name ?? r.taxon.name,
      scientific_name:     r.taxon.name,
      confidence:          Math.round(r.combined_score) / 100,
      matched_species_id:  dbMatch?.id ?? null,
      matched_nom_fr:      dbMatch?.nom_fr ?? null,
    }
  })

  return {
    source: 'inaturalist',
    predictions,
    rate_limit_remaining: remaining ? Number(remaining) : null,
  }
}
