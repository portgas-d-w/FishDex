'use server'

import { createClient } from '@/lib/supabase/server'
import { hasLegendeAccess } from '@/lib/stripe/access'

export async function transcribeVoiceNote(
  audioBase64: string,
  mimeType: string
): Promise<{ text: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const isLegende = await hasLegendeAccess(user.id)
  if (!isLegende) return { error: 'Réservé aux abonnés Légende' }

  if (!process.env.OPENAI_API_KEY) return { error: 'Transcription non configurée' }

  const buffer = Buffer.from(audioBase64, 'base64')
  const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'mp4' : 'webm'

  const formData = new FormData()
  formData.append('file', new Blob([buffer], { type: mimeType }), `note.${ext}`)
  formData.append('model', 'whisper-1')
  formData.append('language', 'fr')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.text()
    return { error: `Whisper: ${err}` }
  }

  const data = await res.json()
  return { text: data.text ?? '' }
}
