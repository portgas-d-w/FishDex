'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function CaptureButton({ userId }: { userId: string }) {
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
      setError('Format non supporté. Utilise une photo JPG, PNG ou WebP.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('La photo dépasse 5 Mo. Réduis sa taille avant de l\'envoyer.')
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
      setError('Échec de l\'envoi de la photo. Vérifie ta connexion et réessaie.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-4 flex flex-col items-center gap-3">
      {/* Bouton principal */}
      <div className="relative flex flex-col items-center">
        {/* Halo externe (animation pulse) */}
        {!loading && (
          <span className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping" />
        )}
        {/* Halo intermédiaire */}
        <span className="absolute inset-[-6px] rounded-full bg-teal-500/10 border border-teal-500/20" />

        <button
          onClick={handleClick}
          disabled={loading}
          aria-label="Capturer une prise — ouvrir l'appareil photo"
          className="relative w-28 h-28 rounded-full flex items-center justify-center
            bg-gradient-to-br from-teal-400 to-teal-600
            border-4 border-teal-300/30
            shadow-[0_0_40px_rgba(45,212,191,0.5)]
            hover:shadow-[0_0_55px_rgba(45,212,191,0.7)]
            hover:scale-105 active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all duration-300"
        >
          {loading
            ? <Loader2 size={40} className="text-white animate-spin" />
            : <Camera size={40} className="text-white" strokeWidth={1.8} />
          }
        </button>
      </div>

      {/* Texte sous le bouton */}
      <div className="flex flex-col items-center gap-0.5 mt-1">
        <span
          className="text-xl font-black tracking-widest text-white uppercase"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {loading ? 'Envoi…' : 'Capturer'}
        </span>
        {!loading && (
          <span className="text-xs text-slate-400">
            Ta prochaine prise t&apos;attend !
          </span>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-xs text-red-400 text-center px-4">{error}</p>
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
