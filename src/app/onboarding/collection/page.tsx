import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CollectionChoice } from '@/components/onboarding/CollectionChoice'

export const metadata = {
  title: 'Ta voie de pêche — FishDex',
}

export default async function CollectionOnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('collection_choice_completed, onboarding_completed')
    .eq('id', user.id)
    .single()

  // Si l'onboarding principal n'est pas fait, y retourner d'abord
  if (!profile?.onboarding_completed) redirect('/onboarding')

  // Si le choix est déjà fait, aller directement à la home
  if (profile?.collection_choice_completed) redirect('/')

  return (
    <div
      className="min-h-screen flex flex-col pb-12"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.10) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 50%, #0d1117)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-16 pb-8 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/60 mb-3">
          FishDex — Étape finale
        </p>
        <h1 className="text-3xl font-black text-white leading-tight mb-3">
          Quelle est ta voie ?
        </h1>
        <p className="text-sm text-white/50 leading-relaxed max-w-[280px] mx-auto">
          Chaque pêcheur a sa spécialité. Choisis la tienne pour un FishDex taillé sur mesure.
        </p>
      </div>

      {/* Choices */}
      <div className="flex-1 px-4 max-w-md mx-auto w-full">
        <CollectionChoice />
      </div>

      {/* Note de bas de page */}
      <p className="text-[11px] text-white/20 text-center px-6 mt-6">
        Tu pourras changer ta voie à tout moment depuis ton profil.
      </p>
    </div>
  )
}
