import { createClient } from '@/lib/supabase/server'
import type { SubscriptionTier } from './client'

type ProfileSubscription = {
  subscription_tier: SubscriptionTier | null
  subscription_status: string | null
  is_developer: boolean | null
  subscription_current_period_end: string | null
}

function resolveTier(profile: ProfileSubscription | null): SubscriptionTier {
  if (!profile) return 'free'

  // Développeur = accès Légende permanent
  if (profile.is_developer) return 'legende'

  const tier = (profile.subscription_tier ?? 'free') as SubscriptionTier

  // Abonnement actif ou période d'essai
  if (
    profile.subscription_status === 'active' ||
    profile.subscription_status === 'trialing'
  ) {
    return tier
  }

  // Annulation programmée mais période en cours encore valide
  if (
    profile.subscription_current_period_end &&
    new Date(profile.subscription_current_period_end) > new Date()
  ) {
    return tier
  }

  return 'free'
}

export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select(
      'subscription_tier, subscription_status, is_developer, subscription_current_period_end'
    )
    .eq('id', userId)
    .single()

  return resolveTier(data as ProfileSubscription | null)
}

export async function hasProAccess(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId)
  return tier === 'pro' || tier === 'legende'
}

export async function hasLegendeAccess(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId)
  return tier === 'legende'
}

export async function getCurrentUserTier(): Promise<SubscriptionTier> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return 'free'
  return getUserTier(user.id)
}
