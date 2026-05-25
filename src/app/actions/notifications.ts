'use server'

import { createClient } from '@/lib/supabase/server'
import { hasProAccess } from '@/lib/stripe/access'
import { revalidatePath } from 'next/cache'

export type NotificationPrefs = {
  weather_notifications: boolean
  preferred_lat: number | null
  preferred_lon: number | null
  notification_days: string[]
}

export async function getNotificationPrefs(): Promise<NotificationPrefs | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('notification_preferences')
    .select('weather_notifications, preferred_lat, preferred_lon, notification_days')
    .eq('user_id', user.id)
    .maybeSingle()

  return data as NotificationPrefs | null
}

export async function upsertNotificationPrefs(
  prefs: Partial<NotificationPrefs>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const isPro = await hasProAccess(user.id)
  if (!isPro) return { success: false, error: 'Feature Pro requise' }

  const { error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: user.id,
      ...prefs,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/parametres')
  return { success: true }
}
