'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// ─── Types ────────────────────────────────────────────────────

export type AuthState = {
  error?: string
  fieldErrors?: {
    email?: string
    password?: string
    confirmPassword?: string
    username?: string
  }
} | null

export type ResetState = {
  success?: boolean
  error?: string
  fieldErrors?: { email?: string }
} | null

export type UpdatePasswordState = {
  error?: string
  fieldErrors?: {
    password?: string
    confirmPassword?: string
  }
} | null

// ─── Sign Up ──────────────────────────────────────────────────

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')
  const username = String(formData.get('username') ?? '').trim()

  const fieldErrors: NonNullable<AuthState>['fieldErrors'] = {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Adresse email invalide.'
  }
  if (password.length < 8) {
    fieldErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = 'Les mots de passe ne correspondent pas.'
  }
  if (username.length < 3 || username.length > 20) {
    fieldErrors.username = 'Le pseudo doit contenir entre 3 et 20 caractères.'
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    fieldErrors.username = 'Le pseudo ne peut contenir que des lettres, chiffres et underscores.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  const supabase = await createClient()

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existingProfile) {
    return { fieldErrors: { username: 'Ce pseudo est déjà utilisé.' } }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

  if (error) {
    if (error.code === 'user_already_exists') {
      return { fieldErrors: { email: 'Un compte existe déjà avec cette adresse.' } }
    }
    return { error: 'Une erreur est survenue lors de la création du compte. Réessaie.' }
  }

  redirect('/')
}

// ─── Sign In ──────────────────────────────────────────────────

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const fieldErrors: NonNullable<AuthState>['fieldErrors'] = {}

  if (!email) fieldErrors.email = 'Adresse email requise.'
  if (!password) fieldErrors.password = 'Mot de passe requis.'

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.code === 'invalid_credentials') {
      return { error: 'Email ou mot de passe incorrect.' }
    }
    if (error.code === 'email_not_confirmed') {
      return { error: 'Confirme ton adresse email avant de te connecter.' }
    }
    return { error: 'Une erreur est survenue. Réessaie.' }
  }

  redirect('/')
}

// ─── Sign Out ─────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ─── Request Password Reset ───────────────────────────────────

export async function requestPasswordReset(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { fieldErrors: { email: 'Adresse email invalide.' } }
  }

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const origin = `${protocol}://${host}`

  const supabase = await createClient()

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/nouveau-mot-de-passe`,
  })

  // Toujours retourner success pour ne pas exposer si l'email existe
  return { success: true }
}

// ─── Update Password ──────────────────────────────────────────

export async function updatePassword(
  _prev: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  const fieldErrors: NonNullable<UpdatePasswordState>['fieldErrors'] = {}

  if (password.length < 8) {
    fieldErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = 'Les mots de passe ne correspondent pas.'
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'Une erreur est survenue. Le lien de réinitialisation a peut-être expiré.' }
  }

  redirect('/')
}
