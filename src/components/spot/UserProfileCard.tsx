import { Bell, Fish } from 'lucide-react'
import { MOCK_LEVEL } from '@/lib/spot/mocks'

type Props = {
  username: string
  avatarUrl: string | null
}

export function UserProfileCard({ username, avatarUrl }: Props) {
  const initials = username.slice(0, 2).toUpperCase()
  const xpPercent = MOCK_LEVEL.xpNext > 0
    ? Math.round((MOCK_LEVEL.xp / MOCK_LEVEL.xpNext) * 100)
    : 0

  return (
    <div className="flex flex-col gap-3">
      {/* ── Header "Le Spot" ── */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
        </button>

        <h1
          className="text-xl font-bold text-slate-100 tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Le Spot
        </h1>

        <div
          className="w-10 h-10 rounded-full bg-teal-800 border border-teal-600/50 text-teal-200 text-sm font-bold flex items-center justify-center overflow-hidden opacity-70 cursor-not-allowed"
          title="Profil — bientôt disponible"
          aria-label="Profil (bientôt disponible)"
        >
          <AvatarContent avatarUrl={avatarUrl} initials={initials} username={username} />
        </div>
      </div>

      {/* ── Hero card profil ── */}
      <div className="mx-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-4 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Grand avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-700 to-teal-900 border-2 border-teal-500/50 text-teal-200 text-xl font-bold flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-teal-900/40">
            <AvatarContent avatarUrl={avatarUrl} initials={initials} username={username} size="lg" />
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-bold text-slate-100 truncate leading-tight">{username}</p>
              <Fish size={13} className="text-teal-400 shrink-0" />
            </div>
            <p className="text-xs font-semibold text-teal-400 mb-2.5">
              Niveau {MOCK_LEVEL.level} — {MOCK_LEVEL.title}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full"
                  style={{ width: `${Math.max(xpPercent, 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 tabular-nums">
                {MOCK_LEVEL.xp} / {MOCK_LEVEL.xpNext} XP
              </span>
            </div>
          </div>

          {/* Badge hexagonal Journal */}
          <HexBadge letter="J" label="Journal" />
        </div>
      </div>
    </div>
  )
}

/* ── Sous-composants ── */

function AvatarContent({
  avatarUrl,
  initials,
  username,
  size = 'sm',
}: {
  avatarUrl: string | null
  initials: string
  username: string
  size?: 'sm' | 'lg'
}) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
  }
  return (
    <span className={size === 'lg' ? 'text-xl' : 'text-sm'}>
      {initials}
    </span>
  )
}

function HexBadge({ letter, label }: { letter: string; label: string }) {
  return (
    <div className="shrink-0 flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        {/* Laurier gauche */}
        <div className="absolute -left-2.5 flex flex-col items-end gap-[3px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-[3px] bg-teal-500/50 rounded-full"
              style={{ transform: `rotate(${-25 + i * 12}deg)` }}
            />
          ))}
        </div>

        {/* Hexagone */}
        <div className="relative w-10 h-11 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gradient-to-b from-teal-500 to-teal-700"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          />
          <div
            className="absolute inset-[2px] bg-slate-850"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(to bottom, #0f2a27, #0d1f1c)',
            }}
          />
          <span className="relative text-teal-300 text-sm font-bold z-10 leading-none">
            {letter}
          </span>
        </div>

        {/* Laurier droit */}
        <div className="absolute -right-2.5 flex flex-col items-start gap-[3px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-[3px] bg-teal-500/50 rounded-full"
              style={{ transform: `rotate(${25 - i * 12}deg)` }}
            />
          ))}
        </div>
      </div>

      <span className="text-[9px] text-slate-500 font-medium tracking-widest uppercase">
        {label}
      </span>
    </div>
  )
}
