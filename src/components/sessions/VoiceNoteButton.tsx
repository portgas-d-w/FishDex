'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Loader2, Crown } from 'lucide-react'
import { transcribeVoiceNote } from '@/app/actions/transcription'

type Props = {
  isLegende: boolean
  onTranscription: (text: string) => void
}

export function VoiceNoteButton({ isLegende, onTranscription }: Props) {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  if (!isLegende) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/15">
        <Crown size={12} className="text-amber-400" />
        <span className="text-xs text-amber-400/70">Journal vocal — Légende</span>
      </div>
    )
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4'
      const recorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: mimeType })
        if (blob.size < 1000) return  // trop court, ignorer
        setLoading(true)
        try {
          const arrayBuffer = await blob.arrayBuffer()
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
          const result = await transcribeVoiceNote(base64, mimeType)
          if ('text' in result && result.text) {
            onTranscription(result.text)
          }
        } finally {
          setLoading(false)
        }
      }
      recorder.start()
      mediaRef.current = recorder
      setRecording(true)
    } catch {
      // Permission refusée ou MediaRecorder non supporté
    }
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    mediaRef.current = null
    setRecording(false)
  }

  if (loading) {
    return (
      <button disabled className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs">
        <Loader2 size={12} className="animate-spin" />
        Transcription…
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
        recording
          ? 'bg-red-500/15 border-red-500/25 text-red-400 animate-pulse'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8'
      }`}
    >
      {recording ? (
        <>
          <MicOff size={12} />
          Arrêter
        </>
      ) : (
        <>
          <Mic size={12} />
          Note vocale
        </>
      )}
    </button>
  )
}
