'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import {
  PRICES,
  stripe,
  type BillingInterval,
  type PaidTier,
} from '@/lib/stripe/client'

async function getAppUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

export async function createCheckoutSession(
  tier: PaidTier,
  interval: BillingInterval
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const priceId = PRICES[tier][interval]
  if (!priceId) {
    return { error: 'Prix Stripe non configuré pour ce tier.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, is_developer')
    .eq('id', user.id)
    .single()

  if (profile?.is_developer) {
    return { error: 'Les comptes développeur ont déjà accès Légende.' }
  }

  const appUrl = await getAppUrl()
  const customerId = profile?.stripe_customer_id ?? undefined

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : user.email ?? undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl}/parametres/abonnement?success=1`,
    cancel_url: `${appUrl}/parametres/abonnement?canceled=1`,
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId: user.id, tier },
    },
    metadata: { userId: user.id, tier },
    client_reference_id: user.id,
  })

  if (!session.url) {
    return { error: 'Stripe n’a pas renvoyé d’URL de paiement.' }
  }

  return { url: session.url }
}

export async function createPortalSession(): Promise<
  { url: string } | { error: string }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return { error: 'Aucun abonnement actif à gérer.' }
  }

  const appUrl = await getAppUrl()
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/parametres/abonnement`,
  })

  return { url: session.url }
}
