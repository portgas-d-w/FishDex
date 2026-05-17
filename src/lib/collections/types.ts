export type CollectionSlug = 'paisibles' | 'predateurs' | 'eaux-vives'

export type Collection = {
  id: string
  slug: CollectionSlug
  nom: string
  description: string | null
  emoji: string
  ordre: number
}

export type CollectionProgress = {
  slug: CollectionSlug
  nom: string
  emoji: string
  totalVisible: number    // espèces visibles (hors Mirages)
  capturedVisible: number // captures visibles de l'user
  capturedMirages: number // Mirages capturés (bonus)
  percent: number         // capturedVisible / totalVisible * 100
  titre: string           // Initié / Apprenti / Expert / Maître
  nextTitreAt: number | null // nb espèces restantes pour prochain titre
}
