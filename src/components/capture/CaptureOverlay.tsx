'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Info, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ScanFrame } from './ScanFrame'
import { ScanAnimation } from './ScanAnimation'
import { CaptureFeedback } from './CaptureFeedback'
import { CaptureFooter } from './CaptureFooter'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const SCAN_DURATION = 2000
const FEEDBACK_DISPLAY = 1200

type Phase = 'idle' | 'scanning' | 'done'

type Props = {
  userId: string
}

// FileReader → data URL : plus fiable que createObjectURL sur iOS Safari
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function CaptureOverlay({ userId }: Props) {
  const router = useRouter()
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const [phase, setPhase] = useState<Phase>('idle')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploadPath, setUploadPath] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [flashOn, setFlashOn] = useState(false)
  const [captureSource, setCaptureSource] = useState<'camera' | 'gallery' | null>(null)

  // Auto-redirect après succès
  useEffect(() => {
    if (phase !== 'done' || !uploadPath) return
    const t = setTimeout(() => {
      const params = new URLSearchParams({ photo: uploadPath })
      if (captureSource) params.set('source', captureSource)
      router.push(`/aquarium/nouvelle?${params.toString()}`)
    }, FEEDBACK_DISPLAY)
    return () => clearTimeout(t)
  }, [phase, uploadPath, captureSource, router])

  async function handleFile(file: File, source: 'camera' | 'gallery') {
    setCaptureSource(source)
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

    setUploadError(null)
    setUploadPath(null)

    // Lecture de la photo + démarrage du scan en parallèle
    const [dataUrl] = await Promise.all([
      readAsDataUrl(file),
      Promise.resolve(), // lecture rapide, pas besoin d'attendre
    ])

    setPhotoUrl(dataUrl)
    setPhase('scanning')

    // Upload + timer 2s en parallèle
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${userId}/temp/${Date.now()}.${ext}`
    const supabase = createClient()

    const [uploadResult] = await Promise.all([
      supabase.storage.from('catches').upload(path, file, { contentType: file.type, upsert: false }),
      new Promise(r => setTimeout(r, SCAN_DURATION)),
    ])

    if (uploadResult.error) {
      setUploadError("Échec de l'envoi. Vérifie ta connexion.")
    } else {
      setUploadPath(path)
    }

    setPhase('done')
  }

  function handleFileChange(source: 'camera' | 'gallery') {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (file) handleFile(file, source)
    }
  }

  function handleClose() {
    router.back()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: '#050d17' }}
    >
      {/* ── Photo plein écran floutée (hors cadre) ── */}
      <AnimatePresence>
        {photoUrl && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
              style={{ filter: 'blur(20px) brightness(0.3)', transform: 'scale(1.1)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4 shrink-0">
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="w-10 h-10 rounded-full bg-black/50 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>

        <AnimatePresence>
          {phase === 'scanning' && (
            <motion.div
              key="badge"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-cyan-400/40 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400">Analyse en cours…</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          aria-label="Aide"
          className="w-10 h-10 rounded-full bg-black/50 border border-white/15 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <Info size={18} />
        </button>
      </div>

      {/* ── Cadre central ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-2 min-h-0">
        <div className="relative w-full aspect-[3/4] max-h-full overflow-hidden">

          {/* Photo DANS le cadre */}
          <AnimatePresence>
            {photoUrl ? (
              <motion.img
                key="photo"
                src={photoUrl}
                alt="Photo capturée"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.div
                key="idle"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'radial-gradient(ellipse at 50% 40%, rgba(6,182,212,0.07) 0%, transparent 70%), rgba(5,13,23,0.9)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center"
                  style={{ boxShadow: '0 0 24px rgba(34,211,238,0.12)' }}
                >
                  <Camera size={24} className="text-cyan-400/60" />
                </div>
                <p className="text-sm text-slate-400">Sélectionne une photo</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cadre + animation de scan par-dessus la photo */}
          <div className="absolute inset-0">
            <ScanFrame scanning={phase === 'scanning'} />
            <ScanAnimation scanning={phase === 'scanning'} />
          </div>

          {/* Feedback */}
          <CaptureFeedback
            visible={phase === 'done'}
            uploading={phase === 'scanning'}
            error={uploadError}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 pb-12 pt-4 px-4 shrink-0">
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
        onChange={handleFileChange('camera')}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-hidden
        onChange={handleFileChange('gallery')}
      />
    </div>
  )
}
