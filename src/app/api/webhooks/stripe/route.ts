import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type SubscriptionTier = 'pro' | 'legende'

function tierFromSubscription(sub: Stripe.Subscription): SubscriptionTier | null {
  const metaTier = sub.metadata?.tier
  if (metaTier === 'pro' || metaTier === 'legende') return metaTier
  return null
}

function periodEndIso(sub: Stripe.Subscription): string | null {
  const ts = (sub as unknown as { current_period_end?: number }).current_period_end
  return typeof ts === 'number' ? new Date(ts * 1000).toISOString() : null
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !secret) {
    return NextResponse.json(
      { error: 'Webhook signature ou secret manquant.' },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature invalide.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const admin = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId ?? session.client_reference_id ?? null
      const tier = session.metadata?.tier as SubscriptionTier | undefined
      if (!userId || !tier) break

      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id ?? null

      const customerId =
        typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id ?? null

      await admin
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_tier: tier,
          subscription_status: 'active',
        })
        .eq('id', userId)
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const tier = tierFromSubscription(sub)
      const update: Record<string, unknown> = {
        subscription_status: sub.status,
        subscription_current_period_end: periodEndIso(sub),
        subscription_cancel_at_period_end: sub.cancel_at_period_end ?? false,
      }
      if (tier) update.subscription_tier = tier

      await admin
        .from('profiles')
        .update(update)
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await admin
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          subscription_tier: 'free',
          subscription_current_period_end: periodEndIso(sub),
          subscription_cancel_at_period_end: false,
          stripe_subscription_id: null,
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId =
        (invoice as unknown as { subscription?: string | Stripe.Subscription })
          .subscription
      const subId =
        typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id
      if (!subId) break

      await admin
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_subscription_id', subId)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
