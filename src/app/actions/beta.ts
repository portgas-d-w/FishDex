'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Types ─────────────────────────────────────────────────────────────────────

export type BetaSignupState = {
  success?: boolean
  error?: string
} | null

// ── submitBetaSignup ──────────────────────────────────────────────────────────

export async function submitBetaSignup(
  _prev: BetaSignupState,
  formData: FormData
): Promise<BetaSignupState> {
  const email     = String(formData.get('email') ?? '').trim().toLowerCase()
  const type_eau  = String(formData.get('type_eau') ?? '').trim() || null
  const frequence = String(formData.get('frequence') ?? '').trim() || null
  const message   = String(formData.get('message') ?? '').trim() || null
  const especesRaw = formData.getAll('especes') as string[]
  const especes = especesRaw.length > 0 ? especesRaw : null

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Adresse email invalide.' }
  }

  // Utiliser le client service_role pour contourner RLS sur beta_signups
  const supabase = await createClient()

  // Vérifier doublon
  const { data: existing } = await supabase
    .from('beta_signups')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return { success: true } // On ne révèle pas qu'ils sont déjà inscrits
  }

  const { error } = await supabase.from('beta_signups').insert({
    email, type_eau, especes, frequence, message,
  })

  if (error) return { error: 'Une erreur est survenue. Réessaie.' }

  return { success: true }
}

// ── validateInviteCode ────────────────────────────────────────────────────────

export async function validateInviteCode(code: string): Promise<{
  valid: boolean
  inviteId?: string
  error?: string
}> {
  if (!code?.trim()) return { valid: false, error: 'Code manquant' }

  const supabase = await createClient()
  const { data } = await supabase
    .from('beta_invites')
    .select('id, used_at')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle()

  if (!data) return { valid: false, error: 'Code invalide' }
  if (data.used_at) return { valid: false, error: 'Code déjà utilisé' }

  return { valid: true, inviteId: data.id }
}

// ── consumeInviteCode ─────────────────────────────────────────────────────────

export async function consumeInviteCode(inviteId: string, userId: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('beta_invites')
    .update({ used_at: new Date().toISOString(), used_by_user_id: userId })
    .eq('id', inviteId)

  await supabase
    .from('profiles')
    .update({ is_beta_user: true })
    .eq('id', userId)
}

// ── generateBetaInvites (admin only) ─────────────────────────────────────────

export async function generateBetaInvites(count: number, adminEmail: string): Promise<{
  codes?: string[]
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== adminEmail) return { error: 'Non autorisé' }

  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const codes: string[] = []

  for (let i = 0; i < Math.min(count, 50); i++) {
    let suffix = ''
    for (let j = 0; j < 6; j++) {
      suffix += CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    codes.push(`FISH-${suffix}`)
  }

  const { error } = await supabase
    .from('beta_invites')
    .insert(codes.map(code => ({ code })))

  if (error) return { error: error.message }

  revalidatePath('/beta/admin')
  return { codes }
}

// ── getBetaSignups (admin only) ───────────────────────────────────────────────

export async function getBetaSignups(adminEmail: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== adminEmail) return []

  const { data } = await supabase
    .from('beta_signups')
    .select('*')
    .order('created_at', { ascending: false })

  return data ?? []
}

// ── getBetaInvites (admin only) ───────────────────────────────────────────────

export async function getBetaInvites(adminEmail: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== adminEmail) return []

  const { data } = await supabase
    .from('beta_invites')
    .select('*')
    .order('created_at', { ascending: false })

  return data ?? []
}
