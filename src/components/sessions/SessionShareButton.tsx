'use client'

import { useState } from 'react'
import { Share2, X, Download, FileText } from 'lucide-react'

type ShareData = {
  sessionId: string
  date: string
  duration: string
  spotNom: string | null
  catchCount: number
  uniqueSpecies: number
  bestPoids: number
  season: string | null
  ressenti: { emoji: string; label: string } | null
}

export function SessionShareButton({ data }: { data: ShareData }) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleImage = async () => {
    setExporting(true)
    try {
      const el = document.getElementById('session-share-card')
      if (!el) return
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(el, { backgroundColor: '#0a0f14', scale: 2 })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `session-fishdex-${data.sessionId.slice(0, 8)}.png`
      a.click()
    } finally {
      setExporting(false)
    }
  }

  const handlePdf = async () => {
    setExporting(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const W = 210
      doc.setFillColor(10, 15, 20)
      doc.rect(0, 0, W, 297, 'F')

      // Header
      doc.setTextColor(34, 211, 238)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('FISHDEX', 20, 20)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.text(data.spotNom ?? 'Session de pêche', 20, 32)
      doc.setFontSize(10)
      doc.setTextColor(150, 160, 180)
      doc.setFont('helvetica', 'normal')
      doc.text(`${data.date}  ·  ${data.duration}`, 20, 40)

      // Separator
      doc.setDrawColor(255, 255, 255, 15)
      doc.line(20, 46, W - 20, 46)

      // Stats grid
      const stats = [
        ['Prises', String(data.catchCount)],
        ['Espèces', String(data.uniqueSpecies)],
        ['Poids max', data.bestPoids > 0 ? `${data.bestPoids} kg` : '—'],
        ['Saison', data.season ?? '—'],
      ]
      let y = 56
      doc.setFontSize(8)
      doc.setTextColor(100, 120, 140)
      doc.setFont('helvetica', 'bold')
      stats.forEach(([label], i) => doc.text(label.toUpperCase(), 20 + i * 45, y))
      y += 6
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      stats.forEach(([, value], i) => doc.text(value, 20 + i * 45, y))

      if (data.ressenti) {
        y += 16
        doc.setFontSize(10)
        doc.setTextColor(150, 160, 180)
        doc.setFont('helvetica', 'normal')
        doc.text(`Ressenti : ${data.ressenti.emoji}  ${data.ressenti.label}`, 20, y)
      }

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(60, 80, 100)
      doc.text('fishdex.fr', 20, 285)
      doc.text(new Date().toLocaleDateString('fr-FR'), W - 20, 285, { align: 'right' })

      doc.save(`session-fishdex-${data.sessionId.slice(0, 8)}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/8 transition-colors"
      >
        <Share2 size={14} />
        Partager
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#111820] border border-white/10 p-6 flex flex-col items-center gap-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Partager la session</p>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Share card */}
            <div
              id="session-share-card"
              className="w-full rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: 'linear-gradient(135deg, #0a1628 0%, #091a30 100%)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-widest text-cyan-400 uppercase">FishDex</p>
                {data.ressenti && (
                  <span className="text-base">{data.ressenti.emoji}</span>
                )}
              </div>

              <div>
                <p className="text-white font-bold text-base">{data.spotNom ?? 'Session de pêche'}</p>
                <p className="text-white/40 text-xs mt-0.5">{data.date} · {data.duration}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { label: 'Prises', value: data.catchCount },
                  { label: 'Espèces', value: data.uniqueSpecies },
                  { label: 'kg max', value: data.bestPoids > 0 ? data.bestPoids : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-white/8 p-2 text-center">
                    <p className="text-lg font-black text-white">{value}</p>
                    <p className="text-[9px] text-white/30 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {data.season && (
                <p className="text-[9px] text-white/20 capitalize">{data.season}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={handleImage}
                disabled={exporting}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 text-sm font-semibold disabled:opacity-50 transition-opacity"
              >
                <Download size={14} />
                {exporting ? 'Export…' : 'Image (Instagram)'}
              </button>
              <button
                onClick={handlePdf}
                disabled={exporting}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/8 disabled:opacity-50 transition-colors"
              >
                <FileText size={14} />
                {exporting ? 'Export…' : 'Exporter en PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
