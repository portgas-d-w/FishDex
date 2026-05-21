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
  source: 'huggingface' | 'inaturalist' | 'failed'
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
    const imgRes = await fetch(photoUrl, { signal: AbortSignal.timeout(10_000) })
    if (!imgRes.ok) {
      throw new Error(`Impossible de télécharger l'image (HTTP ${imgRes.status})`)
    }
    const imgBlob = await imgRes.blob()
    console.log('[ai-identify] Image téléchargée :', imgBlob.type, Math.round(imgBlob.size / 1024), 'KB')

    return await identifyWithHuggingFace(imgBlob)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[ai-identify] Échec :', msg)
    return { source: 'failed', predictions: [], error: msg }
  }
}

// ── Hugging Face CLIP zero-shot ────────────────────────────────────────────────
// Modèle : openai/clip-vit-large-patch14
// Stratégie : on utilise les noms scientifiques de notre BDD comme labels candidats
// → les résultats mappent directement vers nos espèces sans étape de lookup supplémentaire

async function identifyWithHuggingFace(imgBlob: Blob): Promise<IdentificationResult> {
  const hfKey = process.env.HUGGINGFACE_API_KEY?.trim()
  if (!hfKey) {
    throw new Error('HUGGINGFACE_API_KEY manquant dans .env.local')
  }

  const supabase = await createClient()

  // Récupère toutes les espèces pour construire les labels candidats
  const { data: species, error: dbErr } = await supabase
    .from('species')
    .select('id, nom_fr, nom_scientifique')

  if (dbErr || !species?.length) {
    throw new Error('Impossible de charger les espèces depuis la BDD')
  }

  // Déduplique par base "Genus species" pour éviter des labels trop proches (ex: Cyprinus carpio vs Cyprinus carpio var.)
  const variantsByBase = new Map<string, Array<{ id: string; nom_fr: string }>>()
  for (const s of species) {
    const base = s.nom_scientifique.split(' ').slice(0, 2).join(' ')
    const arr = variantsByBase.get(base) ?? []
    arr.push({ id: s.id, nom_fr: s.nom_fr })
    variantsByBase.set(base, arr)
  }

  const candidateLabels = [...variantsByBase.keys()]
  console.log('[ai-identify] CLIP candidates :', candidateLabels.length, 'espèces')

  // Encode l'image en base64 pour l'API JSON
  const arrayBuffer = await imgBlob.arrayBuffer()
  const base64Image = Buffer.from(arrayBuffer).toString('base64')

  // Classic Inference API (pas le router) — clip-vit-base-patch32 est hosted par défaut
  // Format CLIP : inputs.image (base64) + inputs.text (labels candidats)
  const response = await fetch(
    'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: base64Image,
          text: candidateLabels,
        },
      }),
      signal: AbortSignal.timeout(30_000),
    }
  )

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`HuggingFace HTTP ${response.status} — ${errorText.slice(0, 300)}`)
  }

  const results = await response.json() as Array<{ label: string; score: number }>

  console.log(
    '[ai-identify] CLIP top 5 :',
    results.slice(0, 5).map(r => ({ label: r.label, score: r.score.toFixed(4) }))
  )

  // Avec beaucoup de labels, les scores CLIP sont naturellement faibles (somme = 1 répartie sur N labels)
  // On prend les 5 meilleurs sans seuil absolu
  const top5 = results.slice(0, 5).filter(r => r.score > 0)

  if (top5.length === 0) {
    return { source: 'huggingface', predictions: [], error: 'Aucune espèce reconnue sur cette photo' }
  }

  const predictions: AIPrediction[] = top5.map(r => {
    const variants = variantsByBase.get(r.label) ?? []
    return {
      species_name: variants[0]?.nom_fr ?? r.label,
      scientific_name: r.label,
      confidence: r.score,
      variants,
    }
  })

  return { source: 'huggingface', predictions }
}

// ── iNaturalist (désactivé — OAuth bloqué, token statique expiré) ──────────────
// Conserver ce code pour réactivation dès qu'on obtient les credentials OAuth.
// Prérequis iNaturalist : compte 2 mois + 10 identifications pour créer une app OAuth.
// Endpoint : POST https://api.inaturalist.org/v1/computervision/score_image
// Auth : Authorization: JWT <token>  (sans préfixe "Bearer")

/*
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
  // TODO: remplacer par getInatJWT() depuis @/lib/inaturalist/auth
  // quand les variables INAT_APP_ID / INAT_APP_SECRET / INAT_USERNAME / INAT_PASSWORD sont disponibles
  const token = process.env.INATURALIST_API_TOKEN?.trim()
  if (!token) throw new Error('INATURALIST_API_TOKEN absent')

  const body = new FormData()
  body.append('image', imgBlob, 'photo.jpg')

  const response = await fetch(
    'https://api.inaturalist.org/v1/computervision/score_image',
    {
      method: 'POST',
      headers: { Authorization: token },   // iNaturalist attend le JWT brut, sans préfixe
      body,
      signal: AbortSignal.timeout(12_000),
    }
  )

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`iNaturalist HTTP ${response.status} — ${text.slice(0, 300)}`)
  }

  const data = await response.json() as { results?: INatResult[] }
  const allResults: INatResult[] = data.results ?? []

  const fishResults = allResults.filter(r =>
    FISH_ICONIC.has(r.taxon.iconic_taxon_name ?? '') &&
    (!r.taxon.rank || r.taxon.rank === 'species' || r.taxon.rank === 'subspecies')
  )

  const candidates = fishResults.length > 0 ? fishResults.slice(0, 5) : allResults.slice(0, 5)
  if (candidates.length === 0) {
    return { source: 'inaturalist', predictions: [], error: 'Aucune espèce reconnue sur cette photo' }
  }

  const supabase = await createClient()
  const baseMap = new Map<string, string>()
  const uniqueBases: string[] = []
  for (const r of candidates) {
    const base = r.taxon.name.split(' ').slice(0, 2).join(' ')
    baseMap.set(r.taxon.name, base)
    if (!uniqueBases.includes(base)) uniqueBases.push(base)
  }

  const orFilter = uniqueBases.map(b => `nom_scientifique.ilike.${b}%`).join(',')
  const { data: matches } = await supabase
    .from('species')
    .select('id, nom_fr, nom_scientifique')
    .or(orFilter)

  const variantsByBase = new Map<string, Array<{ id: string; nom_fr: string }>>()
  for (const m of matches ?? []) {
    for (const base of uniqueBases) {
      if (m.nom_scientifique.startsWith(base)) {
        const arr = variantsByBase.get(base) ?? []
        arr.push({ id: m.id, nom_fr: m.nom_fr })
        variantsByBase.set(base, arr)
        break
      }
    }
  }

  const predictions: AIPrediction[] = candidates.map(r => {
    const base     = baseMap.get(r.taxon.name) ?? r.taxon.name
    const variants = variantsByBase.get(base) ?? []
    return {
      species_name:    variants[0]?.nom_fr ?? r.taxon.preferred_common_name ?? r.taxon.name,
      scientific_name: r.taxon.name,
      confidence:      Math.round(r.combined_score) / 100,
      variants,
    }
  })

  return { source: 'inaturalist', predictions }
}
*/
