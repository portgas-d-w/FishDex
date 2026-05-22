'use client'

import { useState, useTransition } from 'react'
import { Check, Crown, Fish, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { createCheckoutSession } from '@/app/actions/billing'
import {
  TIER_PRICES,
  type BillingInterval,
  type PaidTier,
  type SubscriptionTier,
} from '@/lib/stripe/client'

type Props = {
  tier: SubscriptionTier
  interval: BillingInterval
  features: string[]
  currentTier: SubscriptionTier
  highlight?: boolean
  isDeveloper?: boolean
}

const meta: Record<
  SubscriptionTier,
  { label: string; tagline: string; Icon: typeof Crown; accent: string }
> = {
  free: {
    label: 'Gratuit',
    tagline: 'Tout pour bien démarrer',
    Icon: Fish,
    accent: 'text-slate-300',
  },
  pro: {
    label: 'Pro',
    tagline: 'Pour le pêcheur régulier',
    Icon: Sparkles,
    accent: 'text-cyan-300',
  },
  legende: {
    label: 'Légende',
    tagline: 'Pour le spécialiste intensif',
    Icon: Crown,
    accent: 'text-amber-300',
  },
}

function formatEuro(value: number): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function TierCard({
  tier,
  interval,
  features,
  currentTier,
  highlight,
  isDeveloper,
}: Props) {
  const [pending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const m = meta[tier]
  const isFree = tier === 'free'
  const isCurrent = currentTier === tier
  const priceData = !isFree ? TIER_PRICES[tier as PaidTier] : null
  const monthlyEquivalent =
    priceData && interval === 'yearly'
      ? Math.round((priceData.yearly / 12) * 100) / 100
      : null

  const handleSubscribe = () => {
    if (isFree || isCurrent || isDeveloper) return
    setErrorMsg(null)
    startTransition(async () => {
      const result = await createCheckoutSession(tier as PaidTier, interval)
      if ('error' in result) {
        setErrorMsg(result.error)
        toast.error(result.error)
        return
      }
      window.location.href = result.url
    })
  }

  const borderClass = highlight
    ? 'border-cyan-500/40 ring-1 ring-cyan-500/20'
    : 'border-white/10'

  return (
    <div
      className={`relative rounded-2xl bg-white/5 border ${borderClass} backdrop-blur-sm p-5 flex flex-col gap-4`}
    >
      {highlight && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider">
          Populaire
        </span>
      )}

      <div className="flex items-center gap-2">
        <m.Icon size={18} className={m.accent} />
        <h3 className={`text-lg font-bold ${m.accent}`}>{m.label}</h3>
      </div>

      <p className="text-xs text-slate-400 -mt-3">{m.tagline}</p>

      <div className="flex items-baseline gap-1">
        {isFree ? (
          <span className="text-3xl font-bold text-white">0 €</span>
        ) : priceData ? (
          <>
            <span className="text-3xl font-bold text-white">
              {formatEuro(
                interval === 'monthly' ? priceData.monthly : monthlyEquivalent ?? 0
              )}
              <span className="text-base font-normal text-slate-400"> €/mois</span>
            </span>
          </>
        ) : null}
      </div>

      {!isFree && interval === 'yearly' && priceData && (
        <p className="text-xs text-emerald-300 -mt-3">
          Facturé {formatEuro(priceData.yearly)} € par an (2 mois offerts)
        </p>
      )}

      <ul className="space-y-2 text-sm text-white/80 flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check size={15} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {isDeveloper && tier === 'legende' ? (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-300">
          Accès permanent inclus (compte développeur)
        </div>
      ) : isCurrent ? (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-300 text-center font-medium">
          Tier actuel
        </div>
      ) : isFree ? (
        <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400 text-center">
          Tier par défaut
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={pending}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            tier === 'legende'
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'bg-cyan-500 text-white hover:bg-cyan-400'
          }`}
        >
          {pending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>Commencer l’essai 7 jours</>
          )}
        </button>
      )}

      {errorMsg && (
        <p className="text-xs text-red-400 text-center -mt-2">{errorMsg}</p>
      )}
    </div>
  )
}
