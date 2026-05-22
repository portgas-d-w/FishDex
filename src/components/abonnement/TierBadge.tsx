import { Crown, Fish, Sparkles } from 'lucide-react'
import type { SubscriptionTier } from '@/lib/stripe/client'

type Props = {
  tier: SubscriptionTier
  size?: 'sm' | 'md'
}

const config: Record<
  SubscriptionTier,
  { label: string; bg: string; border: string; text: string; Icon: typeof Crown }
> = {
  free: {
    label: 'Gratuit',
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-slate-300',
    Icon: Fish,
  },
  pro: {
    label: 'Pro',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-300',
    Icon: Sparkles,
  },
  legende: {
    label: 'Légende',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    Icon: Crown,
  },
}

export function TierBadge({ tier, size = 'md' }: Props) {
  const c = config[tier]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  const iconSize = size === 'sm' ? 11 : 13

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${c.bg} ${c.border} ${c.text} ${padding}`}
    >
      <c.Icon size={iconSize} />
      {c.label}
    </span>
  )
}
