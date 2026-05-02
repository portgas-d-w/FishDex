'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function QuickCaptureButton({ userId }: { userId: string }) {
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

    // Réinitialise pour permettre re-sélection du même fichier
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
    <div className="flex flex-col items-stretch gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label="Nouvelle prise — ouvrir l'appareil photo"
        className="flex flex-col items-center justify-center gap-3 w-full py-8 px-6
          bg-teal-500 hover:bg-teal-600 active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
          text-slate-900 rounded-2xl shadow-lg shadow-teal-500/25
          transition-all duration-150"
      >
        {loading ? (
          <>
            <Loader2 size={36} className="animate-spin" />
            <span className="text-lg font-bold">Envoi en cours…</span>
          </>
        ) : (
          <>
            <Camera size={36} strokeWidth={2} />
            <span className="text-lg font-bold">📸 Nouvelle prise</span>
            <span className="text-sm font-normal opacity-75">
              Capture ton poisson en un clic
            </span>
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400 text-center px-2">{error}</p>
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
