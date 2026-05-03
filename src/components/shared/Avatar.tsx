import Image from 'next/image'

type Props = {
  username: string
  avatarUrl: string | null
  size?: 'sm' | 'lg'
}

const sizes = {
  sm: { px: 40, text: 'text-sm', ring: 'border-2', glow: 'shadow-[0_0_8px_rgba(34,211,238,0.35)]' },
  lg: { px: 60, text: 'text-xl', ring: 'border-2', glow: 'shadow-[0_0_14px_rgba(34,211,238,0.4)]' },
}

export function Avatar({ username, avatarUrl, size = 'sm' }: Props) {
  const cfg = sizes[size]
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div
      className={`rounded-full ${cfg.ring} border-cyan-400 ${cfg.glow} bg-cyan-500/15 overflow-hidden flex items-center justify-center shrink-0`}
      style={{ width: cfg.px, height: cfg.px }}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={username}
          width={cfg.px}
          height={cfg.px}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className={`${cfg.text} font-bold text-cyan-400 select-none`}>
          {initials}
        </span>
      )}
    </div>
  )
}
