import { createClient } from '@/lib/supabase/server'
import { XP_REWARDS, calcLevel } from './calculator'

export type CatchAwardInput = {
  catchId: string
  userId: string
  speciesId: string
  poidsKg: number | null
  tailleCm: number | null
  photoUrl: string | null
  lieu: string | null
}

export type AwardResult = {
  totalXpGained: number
  newLevel: number
  prevLevel: number
  levelUp: boolean
  isFirstDiscovery: boolean
  isPersonalRecord: boolean
  isNewSpot: boolean
  rarete: string
}

function isoWeekKey(d: Date): string {
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export async function awardXpForCatch(input: CatchAwardInput): Promise<AwardResult> {
  const { catchId, userId, speciesId, poidsKg, tailleCm, photoUrl, lieu } = input
  const supabase = await createClient()

  // Idempotency: already processed?
  const { data: existing } = await supabase
    .from('xp_events')
    .select('id')
    .eq('catch_id', catchId)
    .eq('event_type', 'capture')
    .limit(1)

  if (existing && existing.length > 0) {
    const { data: xp } = await supabase
      .from('user_xp').select('total_xp, level').eq('user_id', userId).single()
    return {
      totalXpGained: 0,
      newLevel: xp?.level ?? 1,
      prevLevel: xp?.level ?? 1,
      levelUp: false,
      isFirstDiscovery: false,
      isPersonalRecord: false,
      isNewSpot: false,
      rarete: 'commun',
    }
  }

  // Fetch species rarity
  const { data: species } = await supabase
    .from('species').select('rarete').eq('id', speciesId).single()
  const rarete = species?.rarete ?? 'commun'

  // Run bonus checks in parallel
  const [speciesCountRes, prevBestRes, spotCountRes] = await Promise.all([
    supabase.from('catches')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('species_id', speciesId).neq('id', catchId),

    supabase.from('catches')
      .select('poids_kg, taille_cm')
      .eq('user_id', userId).eq('species_id', speciesId).neq('id', catchId),

    lieu
      ? supabase.from('catches')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId).eq('lieu', lieu).neq('id', catchId)
      : Promise.resolve({ count: 1, error: null }),
  ])

  const isFirstDiscovery = (speciesCountRes.count ?? 0) === 0

  const prevCatches = prevBestRes.data ?? []
  const prevMaxPoids  = prevCatches.length > 0 ? Math.max(...prevCatches.map(c => c.poids_kg  ?? 0)) : null
  const prevMaxTaille = prevCatches.length > 0 ? Math.max(...prevCatches.map(c => c.taille_cm ?? 0)) : null
  const isPersonalRecord =
    prevCatches.length > 0 && (
      (poidsKg  != null && (prevMaxPoids  == null || poidsKg  > prevMaxPoids))  ||
      (tailleCm != null && (prevMaxTaille == null || tailleCm > prevMaxTaille))
    )

  const isNewSpot = lieu != null && (spotCountRes.count ?? 1) === 0

  // Build XP events
  type Event = { event_type: string; xp_amount: number; metadata?: Record<string, unknown> }
  const events: Event[] = []

  const baseXp = (XP_REWARDS as Record<string, number>)[rarete] ?? XP_REWARDS.commun
  events.push({ event_type: 'capture', xp_amount: baseXp, metadata: { rarete } })

  if (isFirstDiscovery)  events.push({ event_type: 'first_discovery', xp_amount: XP_REWARDS.first_discovery })
  if (isPersonalRecord)  events.push({ event_type: 'personal_record', xp_amount: XP_REWARDS.personal_record })
  if (isNewSpot)         events.push({ event_type: 'new_spot',         xp_amount: XP_REWARDS.new_spot })
  if (photoUrl)          events.push({ event_type: 'photo_added',      xp_amount: XP_REWARDS.photo_added })

  const totalXpGained = events.reduce((s, e) => s + e.xp_amount, 0)

  await supabase.from('xp_events').insert(
    events.map(e => ({ user_id: userId, catch_id: catchId, ...e, metadata: e.metadata ?? null }))
  )

  // Get current user_xp
  const { data: currentXp } = await supabase
    .from('user_xp')
    .select('total_xp, level, current_streak, longest_streak, last_capture_date, joker_used_week')
    .eq('user_id', userId).single()

  const prevTotalXp   = currentXp?.total_xp      ?? 0
  const prevLevel     = currentXp?.level          ?? 1
  const newTotalXp    = prevTotalXp + totalXpGained
  const newLevel      = calcLevel(newTotalXp)
  const prevStreak    = currentXp?.current_streak ?? 0
  const longestStreak = currentXp?.longest_streak ?? 0
  const lastDate      = currentXp?.last_capture_date ?? null

  const today = new Date().toISOString().split('T')[0]
  const yesterday = (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().split('T')[0] })()
  const twoDaysAgo = (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() - 2); return d.toISOString().split('T')[0] })()

  const thisWeek = isoWeekKey(new Date())
  const jokerAvailable = !currentXp?.joker_used_week || currentXp.joker_used_week !== thisWeek
  let jokerConsumed = false
  let newStreak = prevStreak

  if (!lastDate) {
    newStreak = 1
  } else if (lastDate === today) {
    newStreak = prevStreak
  } else if (lastDate === yesterday) {
    newStreak = prevStreak + 1
  } else if (lastDate === twoDaysAgo && jokerAvailable) {
    newStreak = prevStreak + 1
    jokerConsumed = true
  } else {
    newStreak = 1
  }

  const newLongestStreak = Math.max(longestStreak, newStreak)

  const { error: xpUpsertError } = await supabase.rpc('upsert_user_xp', {
    p_user_id:           userId,
    p_total_xp:          newTotalXp,
    p_level:             newLevel,
    p_current_streak:    newStreak,
    p_longest_streak:    newLongestStreak,
    p_last_capture_date: today,
    p_joker_used_week:   jokerConsumed ? thisWeek : (currentXp?.joker_used_week ?? null),
  })
  if (xpUpsertError) throw xpUpsertError

  return {
    totalXpGained,
    newLevel,
    prevLevel,
    levelUp: newLevel > prevLevel,
    isFirstDiscovery,
    isPersonalRecord,
    isNewSpot,
    rarete,
  }
}
