import { Bell } from 'lucide-react'
import { UserMenu } from '@/components/shared/UserMenu'

type Props = {
  avatarUrl: string | null
  username: string
  email: string
}

export function SpotHeader({ avatarUrl, username, email }: Props) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      {/* Cloche notif */}
      <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <Bell size={18} className="text-slate-300" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-slate-950" />
      </div>

      {/* Titre */}
      <h1 className="text-xl font-bold tracking-tight text-white">Le Spot</h1>

      {/* UserMenu */}
      <UserMenu username={username} email={email} avatarUrl={avatarUrl} />
    </header>
  )
}
