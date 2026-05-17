import type { Rarete } from './fishdex'

export type CatchSpecies = {
  id: string
  slug: string
  nom_fr: string
  nom_scientifique: string
  image_url: string | null
  rarete: Rarete | null
  description: string | null
}

export type CatchWithSpecies = {
  id: string
  user_id: string
  species_id: string
  date_capture: string
  created_at: string
  lieu: string | null
  poids_kg: number | null
  taille_cm: number | null
  notes: string | null
  photo_url: string | null
  capture_source: 'camera' | 'gallery' | null
  released: boolean | null
  session_id: string | null
  species: CatchSpecies
}

export type AquariumStats = {
  total: number
  uniqueSpecies: number
  rareSpecies: number
  personalRecords: number
}

// Map species_id → max poids parmi les prises de l'user
export type RecordsMap = Record<string, number>
