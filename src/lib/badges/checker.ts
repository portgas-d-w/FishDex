import { createAdminClient } from '@/lib/supabase/admin'
import { calcLevel } from '@/lib/xp/calculator'

type CatchRow = {
  species_id: string
  poids_kg: number | null
  lieu: string | null
  created_at: string
  species: { rarete: string | null } | { rarete: string | null }[] | null
}

type XpRow = { current_streak: number; longest_streak: number } | null

function getRarity(c: CatchRow): string | null {
  const sp = Array.isArray(c.species) ? c.species[0] : c.species
  return sp?.rarete ?? null
}

function checkCondition(slug: string, catches: CatchRow[], xp: XpRow): boolean {
  switch (slug) {
    case 'premiere_prise':
      return catches.length >= 1

    case 'cartographe':
      return new Set(catches.map(c => c.lieu).filter(Boolean)).size >= 10

    case 'encyclopediste':
      return new Set(catches.map(c => c.species_id)).size >= 50

    case 'completionniste':
      return new Set(catches.map(c => c.species_id)).size >= 57

    case 'trophe':
      return catches.some(c => (c.poids_kg ?? 0) >= 5)

    case 'geant':
      return catches.some(c => (c.poids_kg ?? 0) >= 15)

    case 'premiere_shiny':
      return catches.some(c => getRarity(c) === 'shiny')

    case 'serie_7':
      return (xp?.longest_streak ?? 0) >= 7

    case 'serie_30':
      return (xp?.longest_streak ?? 0) >= 30

    case 'pecheur_matinal':
      return catches.filter(c => new Date(c.created_at).getUTCHours() < 8).length >= 10

    case 'pecheur_nocturne':
      return catches.filter(c => new Date(c.created_at).getUTCHours() >= 22).length >= 10

    case 'marathon': {
      const byDay = new Map<string, number>()
      for (const c of catches) {
        const day = c.created_at.split('T')[0]
        byDay.set(day, (byDay.get(day) ?? 0) + 1)
      }
      return [...byDay.values()].some(v => v >= 8)
    }

    case 'rarete_absolue': {
      const legendDays = new Set<string>()
      const shinyDays  = new Set<string>()
      for (const c of catches) {
        const day = c.created_at.split('T')[0]
        const r = getRarity(c)
        if (r === 'legendaire') legendDays.add(day)
        if (r === 'shiny')      shinyDays.add(day)
      }
      return [...legendDays].some(d => shinyDays.has(d))
    }

    // Badges nécessitant des données externes — jamais auto-déclenchés
    case 'pleine_lune':
    case 'sous_la_pluie':
    case 'aube_parfaite':
      return false

    default:
      return false
  }
}

export type UnlockedBadge = { slug: string; title: string; xpReward: number }

export async function checkAndUnlockBadges(userId: string): Promise<UnlockedBadge[]> {
  const admin = createAdminClient()

  const [{ data: allBadges }, { data: unlockedRows }, { data: catches }, { data: xpRow }] =
    await Promise.all([
      admin.from('badges').select('id, slug, title, xp_reward, is_hidden').order('display_order'),
      admin.from('user_badges').select('badge_id').eq('user_id', userId),
      admin.from('catches')
        .select('species_id, poids_kg, lieu, created_at, species:species_id(rarete)')
        .eq('user_id', userId),
      admin.from('user_xp').select('current_streak, longest_streak').eq('user_id', userId).single(),
    ])

  if (!allBadges) return []

  const alreadyUnlocked = new Set((unlockedRows ?? []).map(r => r.badge_id))
  const catchList = (catches ?? []) as CatchRow[]
  const newlyUnlocked: UnlockedBadge[] = []

  for (const badge of allBadges) {
    if (alreadyUnlocked.has(badge.id)) continue
    if (!checkCondition(badge.slug, catchList, xpRow)) continue

    const { error } = await admin.from('user_badges').insert({ user_id: userId, badge_id: badge.id })
    if (error) continue

    newlyUnlocked.push({ slug: badge.slug, title: badge.title, xpReward: badge.xp_reward })

    if (badge.xp_reward > 0) {
      await admin.from('xp_events').insert({
        user_id:    userId,
        event_type: 'mission_completed',
        xp_amount:  badge.xp_reward,
        metadata:   { badge_slug: badge.slug },
      })
      const { data: xp } = await admin.from('user_xp').select('total_xp').eq('user_id', userId).single()
      if (xp) {
        const newTotal = xp.total_xp + badge.xp_reward
        await admin.from('user_xp').update({
          total_xp:   newTotal,
          level:      calcLevel(newTotal),
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId)
      }
    }
  }

  return newlyUnlocked
}
