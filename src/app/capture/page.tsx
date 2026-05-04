import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CaptureOverlay } from '@/components/capture/CaptureOverlay'

export const metadata = {
  title: 'Nouvelle prise',
}

export default async function CapturePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <CaptureOverlay userId={user.id} />
}
