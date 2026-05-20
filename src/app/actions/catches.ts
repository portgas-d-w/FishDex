'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { awardXpForCatch } from '@/lib/xp/award'
import { ensureMissions, updateMissionProgress } from '@/lib/missions/assigner'
import { isAbsurdCatchValue } from '@/lib/catches/validation'

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

  const species_id       = String(formData.get('species_id') ?? '').trim()
  const date_capture     = String(formData.get('date_capture') ?? '').trim()
  const lieu             = String(formData.get('lieu') ?? '').trim() || null
  const poids_kg_raw     = String(formData.get('poids_kg') ?? '').trim()
  const taille_cm_raw    = String(formData.get('taille_cm') ?? '').trim()
  const notes            = String(formData.get('notes') ?? '').trim() || null
  const photo_url_raw    = String(formData.get('photo_url') ?? '').trim()
  const photo_url        = photo_url_raw.startsWith(`${user.id}/`) ? photo_url_raw : null
  const capture_src_raw  = formData.get('capture_source')
  const capture_source   = (capture_src_raw === 'camera' || capture_src_raw === 'gallery')
    ? capture_src_raw : null
  const released         = formData.get('released') === 'true' ? true : null

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

  // ── Validation biologique côté serveur ────────────────────────────────────
  if (species_id) {
    const { data: speciesRow } = await supabase
      .from('species')
      .select('slug')
      .eq('id', species_id)
      .single()
    if (speciesRow?.slug && isAbsurdCatchValue(speciesRow.slug, taille_cm, poids_kg)) {
      return { error: 'Les valeurs de taille ou poids sont biologiquement impossibles pour cette espèce.' }
    }
  }

  // ── Session active : auto-attachement ──────────────────────────────────────
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle()
  const session_id = activeSession?.id ?? null

  // ── Préférences profil ─────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('suggest_session_on_capture, ai_data_consent')
    .eq('id', user.id)
    .single()
  const shouldSuggest = !session_id && (profile?.suggest_session_on_capture !== false)

  const { data: newCatch, error } = await supabase.from('catches').insert({
    user_id: user.id,
    species_id,
    date_capture,
    lieu,
    poids_kg,
    taille_cm,
    notes,
    photo_url,
    session_id,
    capture_source,
    released,
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

  // ── Data flywheel IA (silencieux, consentement requis, photo requise) ────────
  if (photo_url && profile?.ai_data_consent !== false) {
    void supabase.from('ai_training_data').insert({
      user_id:              user.id,
      catch_id:             newCatch.id,
      photo_url,
      species_id_validated: species_id,
      user_corrected:       false,
    })
  }

  revalidatePath('/aquarium')
  revalidatePath('/fishdex')
  revalidatePath('/')
  if (session_id) {
    revalidatePath('/sessions')
    revalidatePath(`/sessions/${session_id}`)
    revalidatePath('/sessions/active')
  }

  if (session_id)       redirect('/sessions/active')
  if (shouldSuggest)    redirect('/aquarium?suggest=1')
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
