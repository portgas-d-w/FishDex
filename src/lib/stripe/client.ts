import 'server-only'
import Stripe from 'stripe'
import type { PaidTier, BillingInterval } from './shared'

export type { SubscriptionTier, PaidTier, BillingInterval } from './shared'
export { TIER_PRICES, TIER_LABELS } from './shared'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured.')
  }

  stripeClient ??= new Stripe(apiKey, {
    apiVersion: '2026-04-22.dahlia',
  })

  return stripeClient
}

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
