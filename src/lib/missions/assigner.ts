import { createAdminClient } from '@/lib/supabase/admin'
import { rarityIndex } from '@/lib/xp/calculator'
import type { MissionWithProgress } from './types'

// ── Period keys ──────────────────────────────────────────────

function dailyKey(): string {
  return `daily:${new Date().toISOString().split('T')[0]}`
}

function weeklyKey(): string {
  const d = new Date()
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `weekly:${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

function dailyExpires(): string {
  const d = new Date()
  d.setUTCHours(23, 59, 59, 999)
  return d.toISOString()
}

function weeklyExpires(): string {
  const d = new Date()
  const day = d.getUTCDay()
  const daysToSunday = day === 0 ? 0 : 7 - day
  d.setUTCDate(d.getUTCDate() + daysToSunday)
  d.setUTCHours(23, 59, 59, 999)
  return d.toISOString()
}

// ── Mission assignment (lazy) ────────────────────────────────

export async function ensureMissions(userId: string): Promise<void> {
  const supabase = createAdminClient()
  const [dKey, wKey] = [dailyKey(), weeklyKey()]

  // Check existing
  const { data: existingDaily } = await supabase
    .from('user_missions').select('id').eq('user_id', userId).like('period_key', 'daily:%').limit(3)
    .gte('expires_at', new Date().toISOString())

  const { data: existingWeekly } = await supabase
    .from('user_missions').select('id').eq('user_id', userId).like('period_key', 'weekly:%').limit(3)
    .gte('expires_at', new Date().toISOString())

  const tasks: Promise<unknown>[] = []

  if (!existingDaily || existingDaily.length === 0) {
    tasks.push(assignMissions(userId, 'daily', dKey, dailyExpires(), 3))
  }
  if (!existingWeekly || existingWeekly.length === 0) {
    tasks.push(assignMissions(userId, 'weekly', wKey, weeklyExpires(), 3))
  }

  // Special missions: ensure one row per special mission
  tasks.push(ensureSpecialMissions(userId))

  await Promise.all(tasks)
}

async function assignMissions(
  userId: string,
  type: 'daily' | 'weekly',
  periodKey: string,
  expiresAt: string,
  count: number
): Promise<void> {
  const supabase = createAdminClient()
  const { data: pool } = await supabase
    .from('missions').select('id').eq('type', type).eq('is_active', true)

  if (!pool || pool.length === 0) return

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count)

  const rows = shuffled.map(m => ({
    user_id: userId,
    mission_id: m.id,
    period_key: periodKey,
    expires_at: expiresAt,
    progress: 0,
  }))

  await supabase.from('user_missions').upsert(rows, { onConflict: 'user_id,mission_id,period_key', ignoreDuplicates: true })
}

async function ensureSpecialMissions(userId: string): Promise<void> {
  const supabase = createAdminClient()
  const { data: specials } = await supabase
    .from('missions').select('id').eq('type', 'special').eq('is_active', true)

  if (!specials || specials.length === 0) return

  const { data: existing } = await supabase
    .from('user_missions').select('mission_id').eq('user_id', userId).eq('period_key', 'special')

  const existingIds = new Set((existing ?? []).map(r => r.mission_id))
  const toCreate = specials.filter(m => !existingIds.has(m.id))
  if (toCreate.length === 0) return

  await supabase.from('user_missions').insert(
    toCreate.map(m => ({ user_id: userId, mission_id: m.id, period_key: 'special', progress: 0 }))
  )
}

// ── Mission progress update ──────────────────────────────────

export type CatchContext = {
  userId: string
  speciesId: string
  rarete: string | null
  poidsKg: number | null
  photoUrl: string | null
  lieu: string | null
  isFirstDiscovery: boolean
  isPersonalRecord: boolean
  isNewSpot: boolean
}

export async function updateMissionProgress(ctx: CatchContext): Promise<void> {
  const supabase = createAdminClient()
  const now = new Date().toISOString()

  // Fetch active non-completed missions for this user
  const { data: userMissions } = await supabase
    .from('user_missions')
    .select('id, mission_id, progress, period_key, expires_at, mission:mission_id(id, slug, type, target, xp_reward, conditions)')
    .eq('user_id', ctx.userId)
    .is('completed_at', null)
    .or(`expires_at.is.null,expires_at.gte.${now}`)

  if (!userMissions || userMissions.length === 0) return

  const today = new Date().toISOString().split('T')[0]

  for (const um of userMissions) {
    const mission = Array.isArray(um.mission) ? um.mission[0] : um.mission
    if (!mission) continue
    const cond = mission.conditions as { action: string; rarity?: string; weight_kg?: number } | null
    if (!cond) continue

    let newProgress: number | null = null

    switch (cond.action) {
      case 'any_catch':
        newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        break

      case 'first_discovery':
        if (ctx.isFirstDiscovery) newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        break

      case 'catch_min_rarity':
        if (cond.rarity && rarityIndex(ctx.rarete) >= rarityIndex(cond.rarity)) {
          newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        }
        break

      case 'catch_with_photo':
        if (ctx.photoUrl) newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        break

      case 'new_spot':
        if (ctx.isNewSpot) newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        break

      case 'catch_min_weight':
        if (ctx.poidsKg != null && cond.weight_kg != null && ctx.poidsKg >= cond.weight_kg) {
          newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        }
        break

      case 'personal_record':
        if (ctx.isPersonalRecord) newProgress = Math.min((um.progress ?? 0) + 1, mission.target)
        break

      case 'different_species_today': {
        const { data } = await supabase.from('catches')
          .select('species_id').eq('user_id', ctx.userId).eq('date_capture', today)
        const unique = new Set((data ?? []).map(c => c.species_id)).size
        newProgress = Math.min(unique, mission.target)
        break
      }

      case 'unique_days': {
        const periodStart = um.period_key.startsWith('weekly:')
          ? getMondayOfWeek(new Date()).toISOString().split('T')[0]
          : today
        const { data } = await supabase.from('catches')
          .select('date_capture').eq('user_id', ctx.userId).gte('date_capture', periodStart)
        const unique = new Set((data ?? []).map(c => c.date_capture)).size
        newProgress = Math.min(unique, mission.target)
        break
      }

      case 'different_rarities': {
        const periodStart = um.period_key.startsWith('weekly:')
          ? getMondayOfWeek(new Date()).toISOString().split('T')[0]
          : today
        const { data } = await supabase.from('catches')
          .select('species:species_id(rarete)').eq('user_id', ctx.userId).gte('date_capture', periodStart)
        const rarities = new Set((data ?? []).map((c: { species?: { rarete?: string } | { rarete?: string }[] }) => {
          const sp = Array.isArray(c.species) ? c.species[0] : c.species
          return sp?.rarete
        }).filter(Boolean))
        newProgress = Math.min(rarities.size, mission.target)
        break
      }

      case 'unique_species_by_rarity': {
        const { data } = await supabase.from('catches')
          .select('species_id, species:species_id(rarete)')
          .eq('user_id', ctx.userId)
        const unique = new Set((data ?? []).filter((c: { species_id: unknown; species: { rarete?: string }[] | { rarete?: string } }) => {
          const sp = Array.isArray(c.species) ? c.species[0] : c.species
          return sp?.rarete === cond.rarity
        }).map(c => c.species_id)).size
        newProgress = Math.min(unique, mission.target)
        break
      }

      case 'all_rarity_types': {
        const { data } = await supabase.from('catches')
          .select('species:species_id(rarete)').eq('user_id', ctx.userId)
        const rarities = new Set((data ?? []).map((c: { species?: { rarete?: string } | { rarete?: string }[] }) => {
          const sp = Array.isArray(c.species) ? c.species[0] : c.species
          return sp?.rarete
        }).filter(Boolean))
        newProgress = Math.min(rarities.size, mission.target)
        break
      }

      case 'unique_species_total': {
        const { data } = await supabase.from('catches')
          .select('species_id').eq('user_id', ctx.userId)
        const unique = new Set((data ?? []).map(c => c.species_id)).size
        newProgress = Math.min(unique, mission.target)
        break
      }
    }

    if (newProgress === null || newProgress === um.progress) continue

    const isCompleted = newProgress >= mission.target
    await supabase.from('user_missions').update({
      progress: newProgress,
      completed_at: isCompleted ? now : null,
    }).eq('id', um.id)

    // Award XP for mission completion (RPC atomique, bypass RLS)
    if (isCompleted && (um.progress ?? 0) < mission.target) {
      const { error: evErr } = await supabase.from('xp_events').insert({
        user_id: ctx.userId,
        event_type: 'mission_completed',
        xp_amount: mission.xp_reward,
        metadata: { mission_id: mission.id, slug: mission.slug },
      })
      if (evErr) throw new Error(`[XP] mission xp_event insert failed: ${evErr.message}`)
      const { error: xpErr } = await supabase.rpc('increment_user_xp', {
        p_user_id: ctx.userId,
        p_amount:  mission.xp_reward,
      })
      if (xpErr) throw new Error(`[XP] increment_user_xp failed: ${xpErr.message}`)
    }
  }
}

function getMondayOfWeek(d: Date): Date {
  const day = d.getUTCDay() || 7
  const monday = new Date(d)
  monday.setUTCDate(d.getUTCDate() - day + 1)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

// ── Fetch missions for display ───────────────────────────────

export async function getUserMissions(userId: string, type: 'daily' | 'weekly' | 'special'): Promise<MissionWithProgress[]> {
  const supabase = createAdminClient()
  const now = new Date().toISOString()

  const query = supabase
    .from('user_missions')
    .select('id, progress, completed_at, mission:mission_id(id, slug, type, title, description, xp_reward, target, conditions)')
    .eq('user_id', userId)

  const { data } = type === 'special'
    ? await query.eq('period_key', 'special')
    : await query.like('period_key', `${type}:%`).gte('expires_at', now)

  return (data ?? []).map(um => {
    const mission = Array.isArray(um.mission) ? um.mission[0] : um.mission
    return {
      ...mission,
      userMissionId: um.id,
      progress: um.progress ?? 0,
      completed: um.completed_at != null,
    } as MissionWithProgress
  })
}
