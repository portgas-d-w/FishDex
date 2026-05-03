import Image from 'next/image'
import { MOCK_LEVEL } from '@/lib/spot/mocks'

type Props = {
  username: string
  avatarUrl: string | null
}

function HexBadge({ niveau }: { niveau: number }) {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
        <polygon
          points="28,2 52,15 52,41 28,54 4,41 4,15"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
        />
        <polygon
          points="28,2 52,15 52,41 28,54 4,41 4,15"
          fill="rgba(34,211,238,0.12)"
        />
      </svg>
      <span className="relative text-lg font-black text-cyan-400 tabular-nums">{niveau}</span>
    </div>
  )
}

export function UserProfileCard({ username, avatarUrl }: Props) {
  const { niveau, titre, xp_actuel, xp_suivant } = MOCK_LEVEL
  const pct = Math.round((xp_actuel / xp_suivant) * 100)

  return (
    <div className="mx-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex items-center gap-4">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full border-2 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.4)] overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-2xl font-black text-cyan-400">
            {username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="text-xl font-bold text-white truncate leading-tight">{username}</p>
        <p className="text-sm font-medium leading-tight">
          <span className="text-white">Niveau {niveau}</span>
          {' — '}
          <span className="text-cyan-400">{titre}</span>
        </p>

        {/* Barre XP */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-700"
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 tabular-nums">
          {xp_actuel} / {xp_suivant} XP
        </p>
      </div>

      {/* Badge niveau */}
      <HexBadge niveau={niveau} />
    </div>
  )
}
