'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateSession } from '@/app/actions/sessions'

type Props = {
  sessionId: string
  userId: string
  onUploaded?: (url: string) => void
}

export function PolaroidPlaceholder({ sessionId, userId, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Format non supporté.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('Image trop lourde (max 10 Mo).'); return }

    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/${sessionId}/ambiance.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('sessions')
        .upload(path, file, { upsert: true })

      if (uploadErr) {
        setError('Erreur upload. Vérifie le bucket "sessions".')
        return
      }

      const { data } = supabase.storage.from('sessions').getPublicUrl(path)
      const publicUrl = data.publicUrl

      await updateSession(sessionId, { photo_ambiance_url: publicUrl })
      setPreviewUrl(publicUrl)
      onUploaded?.(publicUrl)
    })
  }

  function handleRemove() {
    setPreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ''
    startTransition(async () => {
      await updateSession(sessionId, { photo_ambiance_url: undefined })
    })
  }

  if (previewUrl) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
        <Image src={previewUrl} alt="Photo d'ambiance" fill className="object-cover" sizes="100vw" />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white"
        >
          <X size={13} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="relative w-full aspect-[4/3] bg-white/5 border-2 border-dashed border-white/20
                   rounded-lg flex flex-col items-center justify-center gap-2
                   hover:border-cyan-400/50 hover:bg-white/8 transition-all disabled:opacity-50"
      >
        <div className="absolute inset-4 border border-white/10 rounded-sm pointer-events-none" />
        {isPending
          ? <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
          : <Camera className="h-8 w-8 text-white/30" />
        }
        <p className="text-xs text-white/40">Ajoute une photo de ton spot</p>
        <p className="text-xs text-white/25">Appuie pour prendre ou importer</p>
      </button>

      {error && <p className="text-[11px] text-red-400 mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}
