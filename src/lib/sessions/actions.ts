'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function startSession(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const spotName   = (formData.get('spot_name') as string | null)?.trim() || null
  const stylePeche = (formData.get('style_peche') as string | null) || null

  let spotId: string | null = null

  if (spotName) {
    const { data: existing } = await supabase
      .from('spots')
      .select('id, nb_visites')
      .eq('user_id', user.id)
      .ilike('nom', spotName)
      .maybeSingle()

    if (existing) {
      spotId = existing.id
      await supabase.from('spots')
        .update({ nb_visites: existing.nb_visites + 1 })
        .eq('id', existing.id)
    } else {
      const { data: newSpot } = await supabase
        .from('spots')
        .insert({ user_id: user.id, nom: spotName, nb_visites: 1 })
        .select('id')
        .single()
      spotId = newSpot?.id ?? null
    }
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({ user_id: user.id, spot_id: spotId, style_peche: stylePeche })
    .select('id')
    .single()

  if (error || !session) redirect('/sessions')

  redirect(`/sessions/${session.id}`)
}

export async function endSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('user_id', user.id)

  revalidatePath('/sessions')
  revalidatePath(`/sessions/${sessionId}`)
}

export async function updateSessionNotes(sessionId: string, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('sessions')
    .update({ notes })
    .eq('id', sessionId)
    .eq('user_id', user.id)

  revalidatePath(`/sessions/${sessionId}`)
}

export async function toggleBookmark(sessionId: string, current: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('sessions')
    .update({ is_bookmarked: !current })
    .eq('id', sessionId)
    .eq('user_id', user.id)

  revalidatePath('/sessions')
  revalidatePath(`/sessions/${sessionId}`)
}
