'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  sessionId: string
  userId: string
  value: string | null          // URL publique
  onChange: (url: string | null) => void
}

export function PhotoAmbianceUpload({ sessionId, userId, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return setError('Format non supporté.')
    if (file.size > 10 * 1024 * 1024) return setError('Image trop lourde (max 10 Mo).')

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/${sessionId}/ambiance.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('sessions')
      .upload(path, file, { upsert: true })

    if (uploadErr) {
      setError('Erreur upload. Crée le bucket "sessions" dans le Dashboard Supabase.')
      setLoading(false)
      return
    }

    const { data } = supabase.storage.from('sessions').getPublicUrl(path)
    onChange(data.publicUrl)
    setLoading(false)
  }

  function handleRemove() {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10">
          <Image src={value} alt="Photo d'ambiance" fill className="object-cover" sizes="100vw" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full rounded-2xl border border-dashed border-white/15 bg-white/3 hover:bg-white/6 transition-colors py-10 flex flex-col items-center gap-2.5"
        >
          {loading
            ? <Loader2 size={22} className="text-white/30 animate-spin" />
            : <ImagePlus size={22} className="text-white/25" />
          }
          <span className="text-xs text-white/30">
            {loading ? 'Envoi en cours…' : '+ Ajoute une photo de ce moment'}
          </span>
        </button>
      )}

      {error && <p className="text-[11px] text-red-400 mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}
