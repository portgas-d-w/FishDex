export const MOCK_LEVEL = {
  level: 1,
  title: 'Débutant',
  xp: 0,
  xpNext: 100,
} as const

export const MOCK_DAILY_MISSIONS = [
  { id: 1, label: 'Attraper 2 poissons', progress: 0, target: 2, icon: 'fish' },
  { id: 2, label: 'Capturer une nouvelle espèce', progress: 0, target: 1, icon: 'fish' },
] as const

export const MOCK_DAILY_REWARD_XP = 30

export const MOCK_WEATHER = {
  temp: '18°C',
  condition: 'Ensoleillé',
  wind: 'Vent léger',
} as const

export const MOCK_ACTIVITY = {
  activeFishers: 0,
  distanceKm: null,
} as const
