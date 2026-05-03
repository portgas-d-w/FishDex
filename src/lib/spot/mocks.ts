// src/lib/spot/mocks.ts
// Placeholders Phase 3 — à remplacer par des vraies données en Phase 4

// ── V2 (spot-v2/*) ──────────────────────────────────────────

export const MOCK_LEVEL = {
  // V2
  niveau: 1,
  titre: 'Débutant',
  xp_actuel: 0,
  xp_suivant: 100,
  // V1 compat
  level: 1,
  title: 'Débutant',
  xp: 0,
  xpNext: 100,
} as const

export const MOCK_MISSIONS = [
  {
    id: 'mission-1',
    icon: 'fish' as const,
    titre: 'Capturer 2 carpes',
    description: 'Capture 2 carpes de plus de 5kg',
    progression: 1,
    objectif: 2,
    xp: 500,
  },
  {
    id: 'mission-2',
    icon: 'camera' as const,
    titre: 'Partager une prise',
    description: 'Partage une photo de ta prise',
    progression: 0,
    objectif: 1,
    xp: 200,
  },
  {
    id: 'mission-3',
    icon: 'map-pin' as const,
    titre: 'Pêcher à 3 spots différents',
    description: 'Visite 3 lieux de pêche différents',
    progression: 2,
    objectif: 3,
    xp: 300,
  },
]

export const MOCK_WEATHER = {
  // V2
  temperature: 18,
  condition: 'Ensoleillé',
  vent_kmh: 12,
  // V1 compat
  temp: '18°C',
  wind: 'Vent 12 km/h',
} as const

export const MOCK_FISH_ACTIVITY = {
  label: 'Élevée',
  niveau: 4,
} as const

// ── V1 compat (spot/*) ───────────────────────────────────────

export const MOCK_DAILY_MISSIONS = [
  { id: 'mission-1', label: 'Capturer 2 carpes', progress: 1, target: 2 },
  { id: 'mission-2', label: 'Partager une prise', progress: 0, target: 1 },
  { id: 'mission-3', label: 'Pêcher à 3 spots différents', progress: 2, target: 3 },
]

export const MOCK_DAILY_REWARD_XP = 1000

export const MOCK_ACTIVITY = {
  activeFishers: 0,
  distanceKm: null as number | null,
}

// ── Types ────────────────────────────────────────────────────

export type MockMissionIcon = 'fish' | 'camera' | 'map-pin'
export type MockMission = typeof MOCK_MISSIONS[number]
