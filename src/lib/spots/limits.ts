import { hasProAccess } from '@/lib/stripe/access'
import { createClient } from '@/lib/supabase/server'

export const SPOTS_FREE_LIMIT = 5

export async function canAddSpot(userId: string): Promise<boolean> {
  const isPro = await hasProAccess(userId)
  if (isPro) return true

  const supabase = await createClient()
  const { count } = await supabase
    .from('spots')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  return (count ?? 0) < SPOTS_FREE_LIMIT
}

export async function getSpotsCount(userId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('spots')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  return count ?? 0
}
