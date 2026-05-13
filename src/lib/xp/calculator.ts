// Cumulative XP required to reach level N = 100 × (N-1)²
export function xpForLevel(level: number): number {
  return 100 * Math.pow(Math.max(1, level) - 1, 2)
}

export function calcLevel(totalXp: number): number {
  return Math.max(1, Math.floor(1 + Math.sqrt(Math.max(0, totalXp) / 100)))
}

export function xpNeededForNextLevel(level: number): number {
  return xpForLevel(level + 1) - xpForLevel(level)
}

export function xpCurrentInLevel(totalXp: number): number {
  const level = calcLevel(totalXp)
  return totalXp - xpForLevel(level)
}

export function getLevelTitle(level: number): string {
  if (level < 5)  return 'Débutant'
  if (level < 10) return 'Apprenti'
  if (level < 15) return 'Amateur'
  if (level < 20) return 'Confirmé'
  if (level < 30) return 'Expert'
  if (level < 40) return 'Maître'
  if (level < 50) return 'Vétéran'
  return 'Légende'
}

export const XP_REWARDS = {
  commun:      10,
  peu_commun:  15,
  rare:        25,
  epique:      60,
  legendaire:  150,
  mirage:      500,
  first_discovery: 50,
  personal_record: 30,
  new_spot:    20,
  photo_added: 5,
} as const

export const RARITY_ORDER = ['commun', 'peu_commun', 'rare', 'epique', 'legendaire', 'mirage'] as const
export type Rarete = typeof RARITY_ORDER[number]

export function rarityIndex(r: string | null): number {
  return r ? RARITY_ORDER.indexOf(r as Rarete) : -1
}
