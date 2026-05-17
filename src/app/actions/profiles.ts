'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type BoolPreference = 'suggest_session_on_capture' | 'default_release'

export async function updateProfilePreference(
  field: BoolPreference,
  value: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  const { error } = await supabase
    .from('profiles')
    .update({ [field]: value })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/parametres')
  return { success: true }
}
