import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  typescript: true,
})

export type SubscriptionTier = 'free' | 'pro' | 'legende'
export type PaidTier = Exclude<SubscriptionTier, 'free'>
export type BillingInterval = 'monthly' | 'yearly'

export const PRICES: Record<PaidTier, Record<BillingInterval, string>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? '',
  },
  legende: {
    monthly: process.env.STRIPE_PRICE_LEGENDE_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_LEGENDE_YEARLY ?? '',
  },
}

// Montants TTC en euros (affichage UI — la source de vérité reste Stripe)
export const TIER_PRICES = {
  pro: { monthly: 3.99, yearly: 29.99 },
  legende: { monthly: 6.99, yearly: 49.99 },
} as const

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Gratuit',
  pro: 'Pro',
  legende: 'Légende',
}
