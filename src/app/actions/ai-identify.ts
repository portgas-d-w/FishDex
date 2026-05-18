'use server'

import { createClient } from '@/lib/supabase/server'

// ── Types ─────────────────────────────────────────────────────────────────────

export type AIPrediction = {
  species_name: string
  scientific_name: string
  confidence: number           // 0–1
  // Variétés FishDex correspondant au nom scientifique
  // 0 = absent BDD  |  1 = match direct  |  >1 = disambiguation requise (ex: carpes)
  variants: Array<{ id: string; nom_fr: string }>
}

export type IdentificationResult = {
  source: 'inaturalist' | 'failed'
  predictions: AIPrediction[]
  error?: string
}

// ── Entrée publique ────────────────────────────────────────────────────────────

export async function identifySpeciesFromPhoto(
  photoPath: string
): Promise<IdentificationResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !photoPath) {
    return { source: 'failed', predictions: [], error: 'Chemin photo manquant' }
  }

  const photoUrl = `${supabaseUrl}/storage/v1/object/public/catches/${photoPath}`
  console.log('[ai-identify] Téléchargement image :', photoUrl)

  try {
    // Télécharger l'image côté serveur — iNaturalist n'a pas besoin d'accéder à Supabase
    const imgRes = await fetch(photoUrl, { signal: AbortSignal.timeout(10_000) })
    if (!imgRes.ok) {
      throw new Error(`Impossible de télécharger l'image (HTTP ${imgRes.status})`)
    }
    const imgBlob = await imgRes.blob()
    console.log('[ai-identify] Image téléchargée :', imgBlob.type, Math.round(imgBlob.size / 1024), 'KB')

    return await identifyWithINaturalist(imgBlob)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[ai-identify] Échec :', msg)
    return { source: 'failed', predictions: [], error: msg }
  }
}

// ── iNaturalist ───────────────────────────────────────────────────────────────

type INatTaxon = {
  id: number
  name: string
  preferred_common_name?: string
  iconic_taxon_name?: string
  rank?: string
}

type INatResult = {
  combined_score: number   // 0–100
  taxon: INatTaxon
}

const FISH_ICONIC = new Set(['Actinopterygii', 'Fish', 'Fishes'])

async function identifyWithINaturalist(imgBlob: Blob): Promise<IdentificationResult> {
  const token = process.env.INATURALIST_API_TOKEN?.trim()
  console.log('[ai-identify] Token présent :', !!token, '| longueur :', token?.length ?? 0)

  // Envoi en multipart/form-data avec le fichier binaire — format officiel de l'API
  const body = new FormData()
  body.append('image', imgBlob, 'photo.jpg')

  const headers: Record<string, string> = {}
  if (token) {
    // iNaturalist accepte "JWT <token>" (scheme historique de leur API)
    headers['Authorization'] = `JWT ${token}`
  }

  const response = await fetch(
    'https://api.inaturalist.org/v1/computervision/score_image',
    {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(12_000),
    }
  )

  const remaining = response.headers.get('X-RateLimit-Remaining')
  if (remaining !== null && Number(remaining) < 10) {
    console.warn('[ai-identify] Rate limit bas :', remaining)
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`iNaturalist HTTP ${response.status} — ${text.slice(0, 300)}`)
  }

  const data = await response.json() as { results?: INatResult[] }
  const allResults: INatResult[] = data.results ?? []

  console.log(
    '[ai-identify] Réponse iNat — résultats :',
    allResults.length,
    '| top 3 :',
    allResults.slice(0, 3).map(r => ({
      name:   r.taxon.name,
      iconic: r.taxon.iconic_taxon_name,
      rank:   r.taxon.rank,
      score:  r.combined_score,
    }))
  )

  // Filtre poissons — accepte plusieurs valeurs possibles de iconic_taxon_name
  const fishResults = allResults.filter(r =>
    FISH_ICONIC.has(r.taxon.iconic_taxon_name ?? '') &&
    (!r.taxon.rank || r.taxon.rank === 'species' || r.taxon.rank === 'subspecies')
  )

  console.log('[ai-identify] Poissons filtrés :', fishResults.length)

  // Fallback si aucun poisson détecté : afficher les top 5 tous taxons
  const candidates = fishResults.length > 0 ? fishResults.slice(0, 5) : allResults.slice(0, 5)

  if (candidates.length === 0) {
    return { source: 'inaturalist', predictions: [], error: 'Aucune espèce reconnue sur cette photo' }
  }

  // Match avec la BDD FishDex via nom_scientifique
  const supabase = await createClient()
  const scientificNames = candidates.map(r => r.taxon.name)

  const { data: matches } = await supabase
    .from('species')
    .select('id, nom_fr, nom_scientifique')
    .in('nom_scientifique', scientificNames)

  // Grouper par nom_scientifique — plusieurs espèces BDD peuvent partager le même
  // (ex: Cyprinus carpio → carpe commune, carpe miroir, carpe cuir…)
  const matchMap = new Map<string, Array<{ id: string; nom_fr: string }>>()
  for (const m of matches ?? []) {
    const arr = matchMap.get(m.nom_scientifique) ?? []
    arr.push({ id: m.id, nom_fr: m.nom_fr })
    matchMap.set(m.nom_scientifique, arr)
  }

  console.log('[ai-identify] Matches BDD :', (matches ?? []).map(m => m.nom_fr))

  const predictions: AIPrediction[] = candidates.map(r => {
    const variants = matchMap.get(r.taxon.name) ?? []
    return {
      species_name:    variants[0]?.nom_fr ?? r.taxon.preferred_common_name ?? r.taxon.name,
      scientific_name: r.taxon.name,
      confidence:      Math.round(r.combined_score) / 100,
      variants,
    }
  })

  return { source: 'inaturalist', predictions }
}
