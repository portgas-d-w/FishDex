'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Info, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ScanFrame } from './ScanFrame'
import { ScanAnimation } from './ScanAnimation'
import { CaptureFeedback } from './CaptureFeedback'
import { CaptureFooter } from './CaptureFooter'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const SCAN_DURATION = 2000

type Phase = 'idle' | 'scanning' | 'done'

type Props = {
  userId: string
}

export function CaptureOverlay({ userId }: Props) {
  const router = useRouter()
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const [phase, setPhase] = useState<Phase>('idle')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploadPath, setUploadPath] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [flashOn, setFlashOn] = useState(false)

  // Libère l'object URL à l'unmount
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  async function handleFile(file: File) {
    if (!ALLOWED.includes(file.type)) {
      setUploadError('Format non supporté (JPG, PNG, WebP).')
      setPhase('done')
      return
    }
    if (file.size > MAX_SIZE) {
      setUploadError('Photo trop lourde (max 5 Mo).')
      setPhase('done')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPhotoUrl(objectUrl)
    setUploadError(null)
    setUploadPath(null)
    setPhase('scanning')
    setUploading(true)

    // Upload pendant le scan
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${userId}/temp/${Date.now()}.${ext}`
    const supabase = createClient()

    const [uploadResult] = await Promise.all([
      supabase.storage.from('catches').upload(path, file, { contentType: file.type, upsert: false }),
      new Promise(r => setTimeout(r, SCAN_DURATION)),
    ])

    setUploading(false)

    if (uploadResult.error) {
      setUploadError("Échec de l'envoi. Vérifie ta connexion.")
    } else {
      setUploadPath(path)
    }

    setPhase('done')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) handleFile(file)
  }

  function handleContinue() {
    if (uploadPath) {
      router.push(`/aquarium/nouvelle?photo=${encodeURIComponent(uploadPath)}`)
    }
  }

  function handleClose() {
    router.back()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* ── Photo de fond ── */}
      <AnimatePresence>
        {photoUrl && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Photo capturée"
              className="w-full h-full object-cover"
            />
            {/* Vignette sombre sur les bords */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fond idle (pas de photo) ── */}
      {!photoUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(6,182,212,0.08) 0%, transparent 60%), #050d17',
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div
              className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center"
              style={{ boxShadow: '0 0 30px rgba(34,211,238,0.15)' }}
            >
              <Loader2 size={28} className="text-cyan-400/50" />
            </div>
            <p className="text-sm text-slate-400">Sélectionne une photo</p>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="w-10 h-10 rounded-full bg-black/40 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <X size={20} />
        </button>

        <AnimatePresence>
          {phase === 'scanning' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-cyan-400/30 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400">Analyse en cours…</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          aria-label="Aide"
          className="w-10 h-10 rounded-full bg-black/40 border border-white/15 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <Info size={18} />
        </button>
      </div>

      {/* ── Zone de cadre central ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-2">
        <div className="relative w-full aspect-[3/4] max-h-full">
          <ScanFrame scanning={phase === 'scanning'} />
          <ScanAnimation scanning={phase === 'scanning'} />
          {phase === 'done' && (
            <CaptureFeedback
              visible
              onContinue={handleContinue}
              uploading={uploading}
              error={uploadError}
            />
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 pb-12 pt-4 px-4">
        <CaptureFooter
          onCapture={() => cameraRef.current?.click()}
          onGallery={() => galleryRef.current?.click()}
          flashOn={flashOn}
          onFlashToggle={() => setFlashOn(v => !v)}
          disabled={phase === 'scanning'}
        />
      </div>

      {/* Inputs fichier cachés */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
    </div>
  )
}
