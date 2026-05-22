'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { hasProAccess } from '@/lib/stripe/access'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type SizeEstimationResult = {
  estimated_length_cm: number | null
  confidence: 'high' | 'medium' | 'low'
  reference_detected: string | null
  reasoning: string
  disclaimer: string
}

export async function estimateSizeFromPhoto(
  photoPath: string,
  speciesName?: string
): Promise<SizeEstimationResult | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const isPro = await hasProAccess(user.id)
  if (!isPro) return null

  // Fetch depuis Supabase Storage
  const { data, error } = await supabase.storage
    .from('catches')
    .download(photoPath)
  if (error || !data) return null

  const arrayBuffer = await data.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mimeType = data.type?.startsWith('image/') ? data.type : 'image/jpeg'
  const mediaType = (
    mimeType === 'image/png' ? 'image/png' :
    mimeType === 'image/webp' ? 'image/webp' :
    'image/jpeg'
  ) as 'image/jpeg' | 'image/png' | 'image/webp'

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: `Tu es expert en ichtyologie et analyse de photos.
${speciesName ? `L'espèce est : ${speciesName}.` : ''}

Analyse cette photo de poisson et estime sa taille en cm.
Cherche une référence de taille visible dans l'image : main humaine (~18-22cm),
règle, paume, corps du pêcheur, objet connu.

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "estimated_length_cm": number ou null si impossible,
  "confidence": "high" | "medium" | "low",
  "reference_detected": "description de la référence utilisée" ou null,
  "reasoning": "explication courte de 1 phrase"
}

Si aucune référence n'est visible → estimated_length_cm: null, confidence: "low".
Ne jamais inventer une taille sans référence fiable.`,
        },
      ],
    }],
  })

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? text)
    return {
      ...parsed,
      disclaimer: 'Estimation approximative ±20%. Mesure au mètre ruban pour la précision.',
    }
  } catch {
    return null
  }
}
