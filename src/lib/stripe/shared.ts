export type SubscriptionTier = 'free' | 'pro' | 'legende'
export type PaidTier = Exclude<SubscriptionTier, 'free'>
export type BillingInterval = 'monthly' | 'yearly'

export const TIER_PRICES = {
  pro: { monthly: 3.99, yearly: 29.99 },
  legende: { monthly: 6.99, yearly: 49.99 },
} as const

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Gratuit',
  pro: 'Pro',
  legende: 'Légende',
}
