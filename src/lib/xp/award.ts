import { createClient } from '@/lib/supabase/server'
import { XP_REWARDS } from './calculator'

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

type RpcResult = {
  already_processed: boolean
  xp_gained: number
  total_xp: number
  level: number
}

export async function awardXpForCatch(input: CatchAwardInput): Promise<AwardResult> {
  const { catchId, userId, speciesId, poidsKg, tailleCm, photoUrl, lieu } = input
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Toutes les lectures en parallèle (espèce + bonus checks + streak courant)
  const [speciesRes, speciesCountRes, prevBestRes, spotCountRes, userXpRes] = await Promise.all([
    supabase.from('species').select('rarete').eq('id', speciesId).single(),

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

    supabase.from('user_xp')
      .select('total_xp, level, current_streak, longest_streak, last_capture_date, joker_used_week')
      .eq('user_id', userId).single(),
  ])

  const rarete           = speciesRes.data?.rarete ?? 'commun'
  const isFirstDiscovery = (speciesCountRes.count ?? 0) === 0

  const prevCatches   = prevBestRes.data ?? []
  const prevMaxPoids  = prevCatches.length > 0 ? Math.max(...prevCatches.map(c => c.poids_kg  ?? 0)) : null
  const prevMaxTaille = prevCatches.length > 0 ? Math.max(...prevCatches.map(c => c.taille_cm ?? 0)) : null
  const isPersonalRecord =
    prevCatches.length > 0 && (
      (poidsKg  != null && (prevMaxPoids  == null || poidsKg  > prevMaxPoids))  ||
      (tailleCm != null && (prevMaxTaille == null || tailleCm > prevMaxTaille))
    )

  const isNewSpot = lieu != null && (spotCountRes.count ?? 1) === 0

  // Rendements décroissants : le XP de base est réduit à partir de la 2e capture du jour
  const rawBaseXp = (XP_REWARDS as Record<string, number>)[rarete] ?? XP_REWARDS.commun
  const { data: adjustedBaseXp } = await supabase.rpc('apply_diminishing_returns', {
    base_xp: rawBaseXp,
    user_id_param: userId,
    capture_date: today,
  })
  const baseXp = (typeof adjustedBaseXp === 'number') ? adjustedBaseXp : rawBaseXp

  // Construction de la liste d'events XP
  type Event = { event_type: string; xp_amount: number; metadata?: Record<string, unknown> }
  const events: Event[] = []

  events.push({ event_type: 'capture', xp_amount: baseXp, metadata: { rarete } })

  if (isFirstDiscovery)  events.push({ event_type: 'first_discovery', xp_amount: XP_REWARDS.first_discovery })
  if (isPersonalRecord)  events.push({ event_type: 'personal_record', xp_amount: XP_REWARDS.personal_record })
  if (isNewSpot)         events.push({ event_type: 'new_spot',         xp_amount: XP_REWARDS.new_spot })
  if (photoUrl)          events.push({ event_type: 'photo_added',      xp_amount: XP_REWARDS.photo_added })

  const totalXpGained = events.reduce((s, e) => s + e.xp_amount, 0)

  // Calcul du streak (logique conservée côté TS)
  const currentXp    = userXpRes.data
  const prevLevel    = currentXp?.level          ?? 1
  const prevStreak   = currentXp?.current_streak ?? 0
  const longestStreak = currentXp?.longest_streak ?? 0
  const lastDate     = currentXp?.last_capture_date ?? null

  const yesterday  = (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().split('T')[0] })()
  const twoDaysAgo = (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() - 2); return d.toISOString().split('T')[0] })()

  const thisWeek       = isoWeekKey(new Date())
  const jokerAvailable = !currentXp?.joker_used_week || currentXp.joker_used_week !== thisWeek
  let jokerConsumed    = false
  let newStreak        = prevStreak

  if (!lastDate)                                      newStreak = 1
  else if (lastDate === today)                        newStreak = prevStreak
  else if (lastDate === yesterday)                    newStreak = prevStreak + 1
  else if (lastDate === twoDaysAgo && jokerAvailable) { newStreak = prevStreak + 1; jokerConsumed = true }
  else                                                newStreak = 1

  const newLongestStreak = Math.max(longestStreak, newStreak)

  // RPC atomique : INSERT xp_events + UPSERT user_xp en une seule transaction SQL.
  // SECURITY DEFINER bypass RLS — plus de mise à jour silencieuse à 0 lignes.
  const { data: rpcData, error: rpcError } = await supabase.rpc('award_xp_for_catch', {
    p_user_id:           userId,
    p_catch_id:          catchId,
    p_events:            events,
    p_current_streak:    newStreak,
    p_longest_streak:    newLongestStreak,
    p_last_capture_date: today,
    p_joker_used_week:   jokerConsumed ? thisWeek : (currentXp?.joker_used_week ?? null),
  })

  if (rpcError) throw new Error(`[XP] award_xp_for_catch RPC failed: ${rpcError.message}`)

  const result = rpcData as RpcResult

  return {
    totalXpGained:    result.already_processed ? 0 : totalXpGained,
    newLevel:         result.level,
    prevLevel,
    levelUp:          result.level > prevLevel,
    isFirstDiscovery,
    isPersonalRecord,
    isNewSpot,
    rarete,
  }
}
