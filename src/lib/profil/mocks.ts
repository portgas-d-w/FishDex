export const MOCK_LEVEL = 1
export const MOCK_LEVEL_TITLE = 'Débutant'
export const MOCK_XP_CURRENT = 0
export const MOCK_XP_NEXT = 100
export const MOCK_COUNTRY = 'France'

export type BadgeDef = {
  id: string
  label: string
  icon: string
  color: string
  borderColor: string
  glowColor: string
  unlockCondition: string
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first_catch',
    label: 'Première prise',
    icon: '🎣',
    color: 'bg-emerald-500/20',
    borderColor: 'border-emerald-400/60',
    glowColor: '0 0 16px rgba(52,211,153,0.35)',
    unlockCondition: 'total >= 1',
  },
  {
    id: 'collector',
    label: 'Collectionneur',
    icon: '📚',
    color: 'bg-cyan-500/20',
    borderColor: 'border-cyan-400/60',
    glowColor: '0 0 16px rgba(34,211,238,0.35)',
    unlockCondition: 'uniqueSpecies >= 10',
  },
  {
    id: 'big_fish',
    label: 'Gros poisson',
    icon: '🐟',
    color: 'bg-purple-500/20',
    borderColor: 'border-purple-400/60',
    glowColor: '0 0 16px rgba(168,85,247,0.35)',
    unlockCondition: 'maxPoids >= 5',
  },
  {
    id: 'regular',
    label: 'Pêcheur assidu',
    icon: '⭐',
    color: 'bg-amber-500/20',
    borderColor: 'border-amber-400/60',
    glowColor: '0 0 16px rgba(251,191,36,0.35)',
    unlockCondition: 'joursPeche >= 10',
  },
  {
    id: 'night_fisher',
    label: 'Pêche de nuit',
    icon: '🌙',
    color: 'bg-indigo-500/20',
    borderColor: 'border-indigo-400/60',
    glowColor: '0 0 16px rgba(99,102,241,0.35)',
    unlockCondition: 'placeholder',
  },
]
