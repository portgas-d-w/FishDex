import Link from 'next/link'
import { ChevronRight, CreditCard, Sparkles } from 'lucide-react'
import { TierBadge } from '@/components/abonnement/TierBadge'
import type { SubscriptionTier } from '@/lib/stripe/client'
import { Section } from './Section'
import { SettingItem } from './SettingItem'

type Props = {
  tier: SubscriptionTier
}

export function AbonnementSection({ tier }: Props) {
  const subtitle =
    tier === 'free'
      ? 'Passe à Pro pour les outils avancés'
      : tier === 'pro'
        ? 'Tu profites de l’offre Pro'
        : 'Tu profites de l’offre Légende'

  return (
    <Section
      icon={<CreditCard size={13} className="text-cyan-400" />}
      title="Abonnement"
    >
      <Link href="/parametres/abonnement">
        <SettingItem
          icon={<Sparkles size={15} className="text-cyan-400" />}
          label="Mon abonnement"
          subtitle={subtitle}
          control={
            <div className="flex items-center gap-2">
              <TierBadge tier={tier} size="sm" />
              <ChevronRight size={16} className="text-slate-600" />
            </div>
          }
          last
        />
      </Link>
    </Section>
  )
}
