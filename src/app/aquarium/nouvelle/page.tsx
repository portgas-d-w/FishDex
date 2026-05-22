import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasProAccess } from '@/lib/stripe/access'
import { CatchForm } from './CatchForm'

export const metadata = {
  title: 'Nouvelle prise — Aquarium',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NouvellePrisePage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [speciesRes, profileRes, isProUser] = await Promise.all([
    supabase.from('species').select('id, nom_fr, categorie, slug, weight_formula_a, weight_formula_b').order('categorie').order('nom_fr'),
    supabase.from('profiles').select('default_release, suggest_session_on_capture').eq('id', user.id).single(),
    hasProAccess(user.id),
  ])

  const today = new Date().toISOString().split('T')[0]
  const params = await searchParams

  const rawPhoto = params.photo
  const photoPath = typeof rawPhoto === 'string' && rawPhoto.startsWith(`${user.id}/`)
    ? rawPhoto
    : null

  const rawSource = params.source
  const captureSource: 'camera' | 'gallery' | null =
    rawSource === 'camera' || rawSource === 'gallery' ? rawSource : null

  const profile = profileRes.data as { default_release: boolean | null; suggest_session_on_capture: boolean | null } | null
  const defaultRelease = profile?.default_release ?? false

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">Nouvelle prise</h1>
          <p className="text-slate-400 mt-2">Enregistre ta capture dans l&apos;aquarium</p>
        </div>
        <CatchForm
          species={speciesRes.data ?? []}
          today={today}
          photoPath={photoPath}
          captureSource={captureSource}
          defaultRelease={defaultRelease}
          isProUser={isProUser}
        />
      </div>
    </div>
  )
}
