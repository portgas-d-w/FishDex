import Link from 'next/link'
import Image from 'next/image'
import { Scale, Ruler, Gem } from 'lucide-react'
import { getRareteConfig } from '@/lib/fishdex/rarete'
import type { Rarete } from '@/types/fishdex'

type RecordItem = {
  label: string
  icon: React.ElementType
  value: string
  speciesName: string | null
  imageUrl: string | null
  rarete: Rarete | null
  catchId: string | null
}

type Props = {
  heaviest: { value: number; speciesName: string; imageUrl: string | null; rarete: Rarete | null; catchId: string } | null
  longest:  { value: number; speciesName: string; imageUrl: string | null; rarete: Rarete | null; catchId: string } | null
  rarest:   { speciesName: string; imageUrl: string | null; rarete: Rarete | null; catchId: string } | null
}

function RecordCard({ label, icon: Icon, value, speciesName, imageUrl, rarete, catchId }: RecordItem) {
  const cfg = getRareteConfig(rarete)

  const inner = (
    <div className={`relative rounded-2xl overflow-hidden border bg-white/5 backdrop-blur-sm ${cfg.border} ${cfg.glow} transition-all duration-300`}>
      {/* Image fond */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image src={imageUrl} alt={speciesName ?? ''} fill sizes="33vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-slate-950/40" />
        </div>
      )}

      <div className="relative p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-cyan-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-xl font-black text-cyan-400 leading-none">{value}</p>
        {speciesName && (
          <p className="text-xs text-slate-300 font-medium truncate">{speciesName}</p>
        )}
        <span className={`self-start text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${cfg.badge} ${cfg.badgeBorder}`}>
          {cfg.label}
        </span>
      </div>
    </div>
  )

  if (catchId) {
    return <Link href={`/aquarium/${catchId}`}>{inner}</Link>
  }
  return inner
}

export function RecordsSection({ heaviest, longest, rarest }: Props) {
  if (!heaviest && !longest && !rarest) {
    return (
      <div className="px-4 mt-6">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Mes records personnels</h2>
        <div className="rounded-2xl bg-white/5 border border-white/8 px-4 py-8 text-center">
          <p className="text-sm text-slate-500">Capture ta première prise pour voir tes records !</p>
        </div>
      </div>
    )
  }

  const records: RecordItem[] = [
    {
      label: 'Plus lourd',
      icon: Scale,
      value: heaviest ? `${heaviest.value} kg` : '—',
      speciesName: heaviest?.speciesName ?? null,
      imageUrl: heaviest?.imageUrl ?? null,
      rarete: heaviest?.rarete ?? null,
      catchId: heaviest?.catchId ?? null,
    },
    {
      label: 'Plus long',
      icon: Ruler,
      value: longest ? `${longest.value} cm` : '—',
      speciesName: longest?.speciesName ?? null,
      imageUrl: longest?.imageUrl ?? null,
      rarete: longest?.rarete ?? null,
      catchId: longest?.catchId ?? null,
    },
    {
      label: 'Plus rare',
      icon: Gem,
      value: rarest ? getRareteConfig(rarest.rarete).label : '—',
      speciesName: rarest?.speciesName ?? null,
      imageUrl: rarest?.imageUrl ?? null,
      rarete: rarest?.rarete ?? null,
      catchId: rarest?.catchId ?? null,
    },
  ]

  return (
    <div className="px-4 mt-6">
      <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Mes records personnels</h2>
      <div className="grid grid-cols-3 gap-2">
        {records.map(r => <RecordCard key={r.label} {...r} />)}
      </div>
    </div>
  )
}
