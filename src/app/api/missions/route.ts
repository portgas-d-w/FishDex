import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureMissions, getUserMissions } from '@/lib/missions/assigner'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureMissions(user.id).catch(() => null)

  const [daily, weekly, special] = await Promise.all([
    getUserMissions(user.id, 'daily'),
    getUserMissions(user.id, 'weekly'),
    getUserMissions(user.id, 'special'),
  ])

  return NextResponse.json({ daily, weekly, special })
}
