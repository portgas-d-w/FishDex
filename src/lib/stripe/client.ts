import 'server-only'
import Stripe from 'stripe'
import type { PaidTier, BillingInterval } from './shared'

export type { SubscriptionTier, PaidTier, BillingInterval } from './shared'
export { TIER_PRICES, TIER_LABELS } from './shared'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-04-22.dahlia',
})

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
