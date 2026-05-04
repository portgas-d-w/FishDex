'use client'

import { useRouter } from 'next/navigation'
import { Camera, MapPin, BarChart3 } from 'lucide-react'

function SatelliteButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm text-slate-400">
        <Icon size={22} />
      </div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  )
}

export function CaptureZone({ userId: _userId }: { userId: string }) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-2 px-4">
      <div className="flex items-center justify-between w-full max-w-xs">
        <SatelliteButton icon={MapPin} label="Mes spots" />

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <span className="absolute inset-[-16px] rounded-full bg-cyan-400/10 animate-pulse" />
            <span className="absolute inset-[-8px] rounded-full bg-cyan-400/15 border border-cyan-400/20" />

            <button
              onClick={() => router.push('/capture')}
              aria-label="Nouvelle prise — ouvrir le scanner"
              className="relative w-[110px] h-[110px] rounded-full flex flex-col items-center justify-center gap-1
                bg-gradient-to-b from-cyan-400 to-cyan-600
                border-2 border-cyan-300/50
                shadow-[0_0_60px_rgba(34,211,238,0.6),0_0_120px_rgba(34,211,238,0.25)]
                hover:shadow-[0_0_80px_rgba(34,211,238,0.8),0_0_160px_rgba(34,211,238,0.35)]
                hover:scale-[1.04] active:scale-95
                transition-all duration-300"
            >
              <Camera size={36} className="text-white" strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-0.5 mt-2">
            <span className="text-base font-bold text-white tracking-tight">Nouvelle prise</span>
            <span className="text-xs text-cyan-200/70">Ajouter une capture</span>
          </div>
        </div>

        <SatelliteButton icon={BarChart3} label="Mes stats" />
      </div>
    </div>
  )
}
