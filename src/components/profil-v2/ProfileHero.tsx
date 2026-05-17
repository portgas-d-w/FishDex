import { Camera, Fish, MapPin } from 'lucide-react'

type Props = {
  username: string
  avatarUrl: string | null
  memberSince: string
  country: string
}

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function ProfileHero({ username, avatarUrl, memberSince, country }: Props) {
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-2 relative">
      {/* Avatar */}
      <div className="relative mt-2">
        <div
          className="w-[100px] h-[100px] rounded-full border-2 border-cyan-400 bg-cyan-500/15 flex items-center justify-center overflow-hidden
            shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black text-cyan-400 select-none">{initials}</span>
          )}
        </div>

        {/* Bouton photo (placeholder visuel) */}
        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-700 transition-colors">
          <Camera size={14} className="text-slate-300" />
        </div>
      </div>

      {/* Nom */}
      <div className="flex items-center gap-2 mt-3">
        <h2 className="text-2xl font-bold text-white">{username}</h2>
        <Fish size={16} className="text-cyan-400" />
      </div>

      {/* Membre depuis */}
      <p className="text-sm text-slate-400 mt-0.5">
        Pêcheur depuis {formatMemberSince(memberSince)}
      </p>

      {/* Localisation */}
      <div className="flex items-center gap-1 mt-1">
        <MapPin size={12} className="text-slate-500" />
        <span className="text-sm text-slate-400">{country}</span>
      </div>
    </div>
  )
}
