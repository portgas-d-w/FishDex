import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { AccountSection } from '@/components/parametres-v2/AccountSection'
import { NotificationsSection } from '@/components/parametres-v2/NotificationsSection'
import { PreferencesSection } from '@/components/parametres-v2/PreferencesSection'
import { FishingPreferencesSection } from '@/components/parametres-v2/FishingPreferencesSection'
import { PrivacySection } from '@/components/parametres-v2/PrivacySection'
import { OtherSection } from '@/components/parametres-v2/OtherSection'
import { LogoutButton } from '@/components/parametres-v2/LogoutButton'

export const metadata = {
  title: 'Paramètres',
}

export default async function ParametresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  const { data: rawCatches } = await supabase
    .from('catches')
    .select('lieu')
    .eq('user_id', user.id)

  const spotsCount = new Set(
    (rawCatches ?? []).map((c: { lieu: string | null }) => c.lieu).filter(Boolean)
  ).size

  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      <PageHeader
        leftAction={
          <Link
            href="/profil"
            aria-label="Retour au profil"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
        }
        icon={<Settings size={16} className="text-cyan-400" />}
        title="Paramètres"
        rightAction={<div className="w-10" />}
      />

      <AccountSection
        username={profile?.username ?? 'Pêcheur'}
        email={user.email ?? ''}
        avatarUrl={profile?.avatar_url ?? null}
      />

      <NotificationsSection />

      <PreferencesSection />

      <FishingPreferencesSection spotsCount={spotsCount} />

      <PrivacySection />

      <OtherSection />

      <LogoutButton />
    </div>
  )
}
