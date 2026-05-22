'use client'

import { useState } from 'react'
import { BillingIntervalToggle } from './BillingIntervalToggle'
import { TierCard } from './TierCard'
import type { BillingInterval, SubscriptionTier } from '@/lib/stripe/client'

type Props = {
  currentTier: SubscriptionTier
  isDeveloper: boolean
}

const FREE_FEATURES = [
  '92 espèces à découvrir',
  'Capture illimitée de poissons',
  'Sessions de pêche complètes',
  'Jusqu’à 5 spots',
  'Wrapped annuel en décembre',
  'Badges et niveaux',
]

const PRO_FEATURES = [
  'Tout ce qui est inclus dans Gratuit',
  'Calculateur taille / poids automatique',
  'Estimation IA de la taille par photo',
  'Reconnaissance d’espèce par IA',
  'Statistiques avancées et graphiques',
  'Export PDF et image de tes sessions',
  'Spots illimités',
  'Notifications météo intelligentes',
  'Wrapped accessible toute l’année',
]

const LEGENDE_FEATURES = [
  'Tout ce qui est inclus dans Pro',
  'Carte interactive de tous tes spots',
  'Analyse prédictive des conditions',
  'Journal vocal transcrit (Whisper)',
  'Support prioritaire',
]

export function TiersGrid({ currentTier, isDeveloper }: Props) {
  const [interval, setInterval] = useState<BillingInterval>('monthly')

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <BillingIntervalToggle value={interval} onChange={setInterval} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TierCard
          tier="free"
          interval={interval}
          features={FREE_FEATURES}
          currentTier={currentTier}
          isDeveloper={isDeveloper}
        />
        <TierCard
          tier="pro"
          interval={interval}
          features={PRO_FEATURES}
          currentTier={currentTier}
          highlight
          isDeveloper={isDeveloper}
        />
        <TierCard
          tier="legende"
          interval={interval}
          features={LEGENDE_FEATURES}
          currentTier={currentTier}
          isDeveloper={isDeveloper}
        />
      </div>
    </div>
  )
}
