'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'alexy101099@gmail.com'

export async function toggleClaudeVision(enabled: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const admin = createAdminClient()
  await admin
    .from('app_settings')
    .update({ value: enabled ? 'true' : 'false', updated_at: new Date().toISOString() })
    .eq('key', 'claude_vision_enabled')

  revalidatePath('/admin/ai-dashboard')
}
