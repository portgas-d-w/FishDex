'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { awardXpForCatch } from '@/lib/xp/award'
import { ensureMissions, updateMissionProgress } from '@/lib/missions/assigner'

export type CatchState = {
  error?: string
  fieldErrors?: {
    species_id?: string
    date_capture?: string
    poids_kg?: string
    taille_cm?: string
  }
} | null

export async function createCatch(
  _prev: CatchState,
  formData: FormData
): Promise<CatchState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const species_id = String(formData.get('species_id') ?? '').trim()
  const date_capture = String(formData.get('date_capture') ?? '').trim()
  const lieu = String(formData.get('lieu') ?? '').trim() || null
  const poids_kg_raw = String(formData.get('poids_kg') ?? '').trim()
  const taille_cm_raw = String(formData.get('taille_cm') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim() || null
  const photo_url_raw = String(formData.get('photo_url') ?? '').trim()
  const photo_url = photo_url_raw.startsWith(`${user.id}/`) ? photo_url_raw : null

  const fieldErrors: NonNullable<CatchState>['fieldErrors'] = {}

  if (!species_id) fieldErrors.species_id = 'Choisis une espèce.'
  if (!date_capture) fieldErrors.date_capture = 'La date est requise.'

  let poids_kg: number | null = null
  if (poids_kg_raw) {
    poids_kg = parseFloat(poids_kg_raw)
    if (isNaN(poids_kg) || poids_kg <= 0) fieldErrors.poids_kg = 'Poids invalide.'
  }

  let taille_cm: number | null = null
  if (taille_cm_raw) {
    taille_cm = parseFloat(taille_cm_raw)
    if (isNaN(taille_cm) || taille_cm <= 0) fieldErrors.taille_cm = 'Taille invalide.'
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const { data: newCatch, error } = await supabase.from('catches').insert({
    user_id: user.id,
    species_id,
    date_capture,
    lieu,
    poids_kg,
    taille_cm,
    notes,
    photo_url,
  }).select('id').single()

  if (error || !newCatch) return { error: "Une erreur est survenue lors de l'enregistrement. Réessaie." }

  // Award XP + update missions (non-bloquant pour l'UX, mais exécuté avant redirect)
  try {
    const award = await awardXpForCatch({
      catchId: newCatch.id,
      userId: user.id,
      speciesId: species_id,
      poidsKg: poids_kg,
      tailleCm: taille_cm,
      photoUrl: photo_url,
      lieu,
    })

    await ensureMissions(user.id)
    await updateMissionProgress({
      userId: user.id,
      speciesId: species_id,
      rarete: award.rarete,
      poidsKg: poids_kg,
      photoUrl: photo_url,
      lieu,
      isFirstDiscovery: award.isFirstDiscovery,
      isPersonalRecord: award.isPersonalRecord,
      isNewSpot: award.isNewSpot,
    })
  } catch (xpErr) {
    const msg = xpErr instanceof Error ? xpErr.message : String(xpErr)
    const stack = xpErr instanceof Error ? xpErr.stack : ''
    console.error('[XP] pipeline failed:', msg, '\n', stack)
  }

  revalidatePath('/aquarium')
  revalidatePath('/fishdex')
  revalidatePath('/')
  redirect('/aquarium')
}

export async function deleteCatch(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const id = String(formData.get('id') ?? '')

  await supabase.from('catches').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/aquarium')
  revalidatePath('/fishdex')
}
