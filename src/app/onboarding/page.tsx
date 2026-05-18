import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingCarousel } from '@/components/onboarding/OnboardingCarousel'

export const metadata = {
  title: 'Bienvenue sur FishDex',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function OnboardingPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const preview = params.preview === '1'

  if (!preview) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile?.onboarding_completed) redirect('/')
  }

  return <OnboardingCarousel />
}
