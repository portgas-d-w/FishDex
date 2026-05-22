import Link from 'next/link'
import { Crown, Sparkles } from 'lucide-react'
import { getCurrentUserTier } from '@/lib/stripe/access'
import type { SubscriptionTier } from '@/lib/stripe/client'

type Props = {
  requiredTier: 'pro' | 'legende'
  children: React.ReactNode
  fallback?: React.ReactNode
}

function tierMeetsRequirement(
  current: SubscriptionTier,
  required: 'pro' | 'legende'
): boolean {
  if (required === 'pro') return current === 'pro' || current === 'legende'
  return current === 'legende'
}

function DefaultFallback({ requiredTier }: { requiredTier: 'pro' | 'legende' }) {
  const isLegende = requiredTier === 'legende'
  const tierLabel = isLegende ? 'Légende' : 'Pro'
  const Icon = isLegende ? Crown : Sparkles
  const color = isLegende ? 'amber' : 'cyan'

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isLegende
          ? 'bg-amber-500/10 border-amber-500/20'
          : 'bg-cyan-500/10 border-cyan-500/20'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          size={18}
          className={isLegende ? 'text-amber-400' : 'text-cyan-400'}
        />
        <p
          className={`text-sm font-semibold ${
            isLegende ? 'text-amber-400' : 'text-cyan-400'
          }`}
        >
          Réservé aux abonnés {tierLabel}
        </p>
      </div>
      <p className="text-sm text-white/70 mb-3">
        Cette fonctionnalité fait partie de l’offre {tierLabel}. Essai gratuit de
        7 jours, sans engagement.
      </p>
      <Link
        href="/parametres/abonnement"
        className={`inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-2 ${
          color === 'amber' ? 'text-amber-300' : 'text-cyan-300'
        }`}
      >
        Découvrir {tierLabel} →
      </Link>
    </div>
  )
}

export async function ProGate({ requiredTier, children, fallback }: Props) {
  const tier = await getCurrentUserTier()
  if (tierMeetsRequirement(tier, requiredTier)) {
    return <>{children}</>
  }
  return <>{fallback ?? <DefaultFallback requiredTier={requiredTier} />}</>
}
