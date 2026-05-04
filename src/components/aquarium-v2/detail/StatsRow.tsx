import { MapPin, Calendar, Clock, Cloud } from 'lucide-react'

type StatItem = {
  icon: React.ElementType
  label: string
  value: string
}

function StatBox({ icon: Icon, label, value }: StatItem) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm px-2 py-3">
      <Icon size={16} className="text-cyan-400 shrink-0" />
      <span className="text-[10px] text-slate-400 leading-none">{label}</span>
      <span className="text-xs font-bold text-white text-center leading-tight">{value}</span>
    </div>
  )
}

type Props = {
  lieu: string | null
  dateCapture: string
  createdAt: string
}

function formatDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function StatsRow({ lieu, dateCapture, createdAt }: Props) {
  const stats: StatItem[] = [
    { icon: MapPin,   label: 'Lieu',   value: lieu || 'Non renseigné' },
    { icon: Calendar, label: 'Date',   value: formatDate(dateCapture) },
    { icon: Clock,    label: 'Heure',  value: formatTime(createdAt) },
    { icon: Cloud,    label: 'Météo',  value: '—' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 px-5 mt-5">
      {stats.map(s => <StatBox key={s.label} {...s} />)}
    </div>
  )
}
