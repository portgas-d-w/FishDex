'use client'

import { useState, useTransition } from 'react'
import { Download } from 'lucide-react'
import { exportAiTrainingCSV } from '@/app/actions/ai-training'

export function ExportCSVButton({ adminEmail }: { adminEmail: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleExport() {
    setError(null)
    startTransition(async () => {
      const { csv, error: err } = await exportAiTrainingCSV(adminEmail)
      if (err) { setError(err); return }
      if (!csv) return

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `fishdex-ai-training-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleExport}
        disabled={pending}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400/15 border border-cyan-400/25 text-cyan-400 text-sm font-semibold disabled:opacity-40 transition-opacity"
      >
        <Download size={14} />
        {pending ? 'Préparation…' : 'Télécharger CSV'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
