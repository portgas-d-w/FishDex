'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, MapPin, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function SatelliteButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm text-slate-400">
        <Icon size={22} />
      </div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  )
}

export function CaptureZone({ userId }: { userId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    inputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format non supporté (JPG, PNG, WebP).')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Photo trop lourde (max 5 Mo).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `${userId}/temp/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('catches')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadError) throw uploadError

      router.push(`/aquarium/nouvelle?photo=${encodeURIComponent(path)}`)
    } catch {
      setError('Échec de l\'envoi. Vérifie ta connexion.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 px-4">
      <div className="flex items-center justify-between w-full max-w-xs">
        {/* Mes spots */}
        <SatelliteButton icon={MapPin} label="Mes spots" />

        {/* Bouton central */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {/* Halos concentriques */}
            <span className="absolute inset-[-16px] rounded-full bg-cyan-400/10 animate-pulse" />
            <span className="absolute inset-[-8px] rounded-full bg-cyan-400/15 border border-cyan-400/20" />

            <button
              onClick={handleClick}
              disabled={loading}
              aria-label="Nouvelle prise — ouvrir l'appareil photo"
              className="relative w-[110px] h-[110px] rounded-full flex flex-col items-center justify-center gap-1
                bg-gradient-to-b from-cyan-400 to-cyan-600
                border-2 border-cyan-300/50
                shadow-[0_0_60px_rgba(34,211,238,0.6),0_0_120px_rgba(34,211,238,0.25)]
                hover:shadow-[0_0_80px_rgba(34,211,238,0.8),0_0_160px_rgba(34,211,238,0.35)]
                hover:scale-[1.04] active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              {loading
                ? <Loader2 size={36} className="text-white animate-spin" />
                : <Camera size={36} className="text-white" strokeWidth={1.8} />
              }
            </button>
          </div>

          <div className="flex flex-col items-center gap-0.5 mt-2">
            <span className="text-base font-bold text-white tracking-tight">
              {loading ? 'Envoi…' : 'Nouvelle prise'}
            </span>
            {!loading && (
              <span className="text-xs text-cyan-200/70">Ajouter une capture</span>
            )}
          </div>
        </div>

        {/* Mes stats */}
        <SatelliteButton icon={BarChart3} label="Mes stats" />
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        aria-hidden="true"
        onChange={handleFileChange}
      />
    </div>
  )
}
