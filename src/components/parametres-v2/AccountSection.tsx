import { Mail, Lock, ChevronRight, User } from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'
import { Section } from './Section'
import { SettingItem } from './SettingItem'

type Props = {
  username: string
  email: string
  avatarUrl: string | null
}

const chevron = <ChevronRight size={16} className="text-slate-600" />

export function AccountSection({ username, email, avatarUrl }: Props) {
  return (
    <Section icon={<User size={13} className="text-cyan-400" />} title="Compte">
      <SettingItem
        icon={<Avatar username={username} avatarUrl={avatarUrl} size="sm" />}
        label="Éditer le profil"
        subtitle="Change ton avatar et tes informations"
        control={chevron}
      />
      <SettingItem
        icon={<Mail size={15} className="text-slate-400" />}
        label="Email"
        subtitle={email}
        control={chevron}
      />
      <SettingItem
        icon={<Lock size={15} className="text-slate-400" />}
        label="Mot de passe"
        subtitle="••••••••"
        control={chevron}
        last
      />
    </Section>
  )
}
