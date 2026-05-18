'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Camera, MapPin, Bell, Check } from 'lucide-react'

type PermState = 'idle' | 'granted' | 'denied'

type Permission = {
  key: 'camera' | 'location' | 'notifications'
  icon: React.ElementType
  label: string
  why: string
}

const PERMISSIONS: Permission[] = [
  {
    key: 'camera',
    icon: Camera,
    label: 'Appareil photo',
    why: 'Photographier tes prises',
  },
  {
    key: 'location',
    icon: MapPin,
    label: 'Localisation',
    why: 'Mémoriser tes spots de pêche',
  },
  {
    key: 'notifications',
    icon: Bell,
    label: 'Notifications',
    why: 'Conditions idéales, nouvelles espèces',
  },
]

async function requestPermission(key: Permission['key']): Promise<PermState> {
  try {
    if (key === 'camera') {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      stream.getTracks().forEach(t => t.stop())
      return 'granted'
    }
    if (key === 'location') {
      return await new Promise<PermState>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve('granted'),
          () => resolve('denied'),
          { timeout: 8000 }
        )
      })
    }
    if (key === 'notifications') {
      const result = await Notification.requestPermission()
      return result === 'granted' ? 'granted' : 'denied'
    }
    return 'idle'
  } catch {
    return 'denied'
  }
}

export function Screen4() {
  const [states, setStates] = useState<Record<Permission['key'], PermState>>({
    camera:        'idle',
    location:      'idle',
    notifications: 'idle',
  })
  const [loading, setLoading] = useState<Permission['key'] | null>(null)

  async function handleToggle(key: Permission['key']) {
    if (states[key] !== 'idle' || loading) return
    setLoading(key)
    const result = await requestPermission(key)
    setStates(prev => ({ ...prev, [key]: result }))
    setLoading(null)
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Background nuit calme */}
      <Image
        src="/backgrounds/onboarding-permissions.webp"
        alt="Lac nocturne calme"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90" />

      {/* Contenu centré */}
      <div className="relative h-full flex flex-col px-7 pt-20 pb-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/80 mb-3">
            Quelques permissions
          </p>
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight mb-2">
            Pour bien commencer.
          </h1>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            Tout est optionnel. Tu peux les activer<br />
            dans les réglages iOS/Android à tout moment.
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {PERMISSIONS.map(({ key, icon: Icon, label, why }) => {
            const state  = states[key]
            const active = state === 'granted'
            const denied = state === 'denied'
            const busy   = loading === key

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleToggle(key)}
                disabled={!!loading || state !== 'idle'}
                className={`w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all ${
                  active
                    ? 'bg-cyan-400/10 border border-cyan-400/30'
                    : denied
                    ? 'bg-white/4 border border-white/8 opacity-50'
                    : 'bg-white/6 border border-white/12 hover:bg-white/10 active:scale-[0.98]'
                }`}
              >
                {/* Icône */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  active ? 'bg-cyan-400/20' : 'bg-white/8'
                }`}>
                  <Icon size={18} className={active ? 'text-cyan-400' : 'text-white/50'} />
                </div>

                {/* Texte */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-white/80'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{why}</p>
                </div>

                {/* État */}
                <div className="shrink-0">
                  {busy ? (
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-400/40 border-t-cyan-400 animate-spin" />
                  ) : active ? (
                    <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                      <Check size={11} className="text-[#0a0f14]" strokeWidth={3} />
                    </div>
                  ) : denied ? (
                    <span className="text-[10px] text-white/25">Refusé</span>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Note discrète */}
        <p className="text-[11px] text-white/25 text-center mt-auto pt-6 leading-relaxed">
          Le choix de ta voie de pêche sera proposé<br />
          à la prochaine étape.
        </p>
      </div>
    </div>
  )
}
