import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: allBadges }, { data: userBadges }] = await Promise.all([
    supabase.from('badges').select('id, slug, category, title, description, icon, color, is_hidden, xp_reward, display_order').order('display_order'),
    supabase.from('user_badges').select('badge_id, unlocked_at').eq('user_id', user.id),
  ])

  const unlockedMap = new Map((userBadges ?? []).map(ub => [ub.badge_id, ub.unlocked_at]))

  const result = (allBadges ?? []).map(b => ({
    ...b,
    unlocked:    unlockedMap.has(b.id),
    unlocked_at: unlockedMap.get(b.id) ?? null,
  }))

  return NextResponse.json(result)
}
