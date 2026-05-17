import type { CollectionSlug, CollectionProgress } from './types'

// ── Titres progressifs ────────────────────────────────────────────────────────
// Basés sur le pourcentage de complétion (espèces visibles uniquement)
export const TITRES = [
  { label: 'Initié',    minPercent: 0   },
  { label: 'Apprenti',  minPercent: 25  },
  { label: 'Confirmé',  minPercent: 50  },
  { label: 'Expert',    minPercent: 75  },
  { label: 'Maître',    minPercent: 100 },
] as const

export type TitreLabel = typeof TITRES[number]['label']

export function getTitre(percent: number): TitreLabel {
  let titre: TitreLabel = 'Initié'
  for (const t of TITRES) {
    if (percent >= t.minPercent) titre = t.label
  }
  return titre
}

export function getNextTitreThreshold(percent: number): number | null {
  for (const t of TITRES) {
    if (t.minPercent > percent) return t.minPercent
  }
  return null // déjà Maître
}

// ── Métadonnées visuelles par collection ──────────────────────────────────────
export const COLLECTION_META: Record<CollectionSlug, {
  nom: string
  emoji: string
  color: string           // couleur Tailwind principale
  bgGradient: string      // gradient de fond glassmorphism
  description: string
  exemples: string        // 3 espèces emblématiques
}> = {
  paisibles: {
    nom: 'Paisibles',
    emoji: '🐟',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-900/30 to-blue-900/20',
    description: 'Cyprinidés, carpes et espèces de fond',
    exemples: 'Carpe, Brème, Esturgeon',
  },
  predateurs: {
    nom: 'Prédateurs',
    emoji: '🦈',
    color: 'text-red-400',
    bgGradient: 'from-red-900/30 to-orange-900/20',
    description: 'Carnassiers et espèces de chasse',
    exemples: 'Brochet, Sandre, Silure',
  },
  'eaux-vives': {
    nom: 'Eaux vives',
    emoji: '🌊',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-900/30 to-teal-900/20',
    description: 'Salmonidés et espèces de rivière',
    exemples: 'Truite fario, Saumon, Ombre',
  },
}

// ── Helper de construction du progress complet ────────────────────────────────
export function buildCollectionProgress(
  slug: CollectionSlug,
  totalVisible: number,
  capturedVisible: number,
  capturedMirages: number,
): CollectionProgress {
  const meta   = COLLECTION_META[slug]
  const percent = totalVisible > 0
    ? Math.round((capturedVisible / totalVisible) * 100)
    : 0
  const nextAt = getNextTitreThreshold(percent)

  return {
    slug,
    nom:   meta.nom,
    emoji: meta.emoji,
    totalVisible,
    capturedVisible,
    capturedMirages,
    percent,
    titre: getTitre(percent),
    nextTitreAt: nextAt !== null
      ? Math.ceil((nextAt / 100) * totalVisible) - capturedVisible
      : null,
  }
}
