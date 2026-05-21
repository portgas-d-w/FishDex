'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Claude Haiku 4.5 — tarifs au 2025-05 (USD/M tokens → EUR à 0.92)
const EUR_PER_INPUT_TOKEN  = (0.80 / 1_000_000) * 0.92
const EUR_PER_OUTPUT_TOKEN = (4.00 / 1_000_000) * 0.92

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
  source: 'claude' | 'inaturalist' | 'failed'
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

  const supabase = await createClient()

  // Vérification kill switch (app_settings lisible par tous)
  const { data: killRow } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'claude_vision_enabled')
    .single()

  if (killRow?.value === 'false') {
    return { source: 'failed', predictions: [], error: 'Claude Vision désactivé par l\'admin' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  const photoUrl = `${supabaseUrl}/storage/v1/object/public/catches/${photoPath}`
  console.log('[ai-identify] URL image :', photoUrl)

  try {
    return await identifyWithClaude(photoUrl, user?.id)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const cause = e instanceof Error ? (e as Error & { cause?: unknown }).cause : undefined
    console.error('[ai-identify] Échec :', msg, cause ? `| cause: ${String(cause)}` : '')
    return { source: 'failed', predictions: [], error: msg }
  }
}

// ── Claude Vision ──────────────────────────────────────────────────────────────
// Modèle : claude-haiku-4-5 (rapide, économique, supporte les images via URL)
// Stratégie : prompt avec la liste des espèces BDD → retourne JSON structuré

const CLAUDE_PROMPT = (speciesList: string) => `Tu es un expert en ichtyologie (science des poissons).
Identifie le poisson dans cette photo de pêche.

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas d'explication) :
{"predictions":[{"scientific_name":"Esox lucius","confidence":0.92},{"scientific_name":"Perca fluviatilis","confidence":0.05}]}

Règles :
- Liste au maximum 3 espèces, de la plus probable à la moins probable
- Utilise UNIQUEMENT des noms de cette liste (genre + espèce, 2 mots) :
${speciesList}
- confidence entre 0.0 et 1.0, la somme peut dépasser 1 si plusieurs espèces sont possibles
- Si aucun poisson visible : {"predictions":[]}
- Si le poisson n'est pas dans la liste, prends le genre le plus proche`

async function identifyWithClaude(imageUrl: string, userId?: string): Promise<IdentificationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY manquant dans .env.local')
  }

  const supabase = createAdminClient()

  const { data: species, error: dbErr } = await supabase
    .from('species')
    .select('id, nom_fr, nom_scientifique')

  if (dbErr || !species?.length) {
    throw new Error('Impossible de charger les espèces depuis la BDD')
  }

  // Déduplique par base "Genus species" (Cyprinus carpio = carpe commune + carpe miroir)
  const variantsByBase = new Map<string, Array<{ id: string; nom_fr: string }>>()
  for (const s of species) {
    const base = s.nom_scientifique.split(' ').slice(0, 2).join(' ')
    const arr = variantsByBase.get(base) ?? []
    arr.push({ id: s.id, nom_fr: s.nom_fr })
    variantsByBase.set(base, arr)
  }

  const speciesList = [...variantsByBase.keys()].join(', ')
  console.log('[ai-identify] Claude Vision — espèces candidates :', variantsByBase.size)

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: imageUrl },
          },
          {
            type: 'text',
            text: CLAUDE_PROMPT(speciesList),
          },
        ],
      },
    ],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
  console.log('[ai-identify] Claude réponse brute :', rawText)

  // Claude entoure parfois le JSON de ```json ... ``` malgré le prompt
  const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  let parsed: { predictions: Array<{ scientific_name: string; confidence: number }> }
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error(`Claude a retourné une réponse non-JSON : ${rawText.slice(0, 100)}`)
  }

  if (!parsed.predictions?.length) {
    return { source: 'claude', predictions: [], error: 'Aucune espèce reconnue sur cette photo' }
  }

  const predictions: AIPrediction[] = parsed.predictions.map(p => {
    const base = p.scientific_name.split(' ').slice(0, 2).join(' ')
    const variants = variantsByBase.get(base) ?? []
    return {
      species_name: variants[0]?.nom_fr ?? p.scientific_name,
      scientific_name: p.scientific_name,
      confidence: Math.min(1, Math.max(0, p.confidence)),
      variants,
    }
  })

  console.log('[ai-identify] Claude top :', predictions.map(p => `${p.species_name} (${(p.confidence * 100).toFixed(0)}%)`))

  // Log du coût (fire-and-forget, non bloquant)
  const inputTokens  = message.usage.input_tokens
  const outputTokens = message.usage.output_tokens
  const costEur      = inputTokens * EUR_PER_INPUT_TOKEN + outputTokens * EUR_PER_OUTPUT_TOKEN
  void createAdminClient().from('ai_scan_logs').insert({
    user_id:       userId ?? null,
    model_used:    'claude',
    input_tokens:  inputTokens,
    output_tokens: outputTokens,
    cost_eur:      costEur,
  })

  return { source: 'claude', predictions }
}

// ── iNaturalist (désactivé — OAuth bloqué, token statique expiré) ──────────────
// Prérequis : compte 2 mois + 10 identifications pour créer une app OAuth.
// Endpoint : POST https://api.inaturalist.org/v1/computervision/score_image
// Auth : Authorization: <token_jwt_brut>  (sans préfixe Bearer)

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
      headers: { Authorization: token },
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
