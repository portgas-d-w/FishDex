import { Bell } from 'lucide-react'
import Image from 'next/image'

type Props = {
  avatarUrl: string | null
  username: string
}

export function SpotHeader({ avatarUrl, username }: Props) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      {/* Cloche notif */}
      <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <Bell size={18} className="text-slate-300" />
        {/* Point rouge visuel */}
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-slate-950" />
      </div>

      {/* Titre */}
      <h1 className="text-xl font-bold tracking-tight text-white">Le Spot</h1>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full border-2 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] overflow-hidden bg-slate-800 flex items-center justify-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-sm font-bold text-cyan-400">
            {username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </header>
  )
}
