import { Bell, MapPin } from 'lucide-react'
import { UserMenu } from '@/components/shared/UserMenu'
import { PageHeader } from '@/components/shared/PageHeader'

type Props = {
  avatarUrl: string | null
  username: string
  email: string
}

export function SpotHeader({ avatarUrl, username, email }: Props) {
  return (
    <PageHeader
      leftAction={
        <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <Bell size={18} className="text-slate-300" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-slate-950" />
        </div>
      }
      icon={<MapPin size={16} className="text-cyan-400" />}
      title="Le Spot"
      subtitle={`Bonjour, ${username} !`}
      rightAction={
        <UserMenu username={username} email={email} avatarUrl={avatarUrl} />
      }
    />
  )
}
