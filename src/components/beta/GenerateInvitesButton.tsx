'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { generateBetaInvites } from '@/app/actions/beta'

export function GenerateInvitesButton({ adminEmail }: { adminEmail: string }) {
  const [count, setCount] = useState(5)
  const [result, setResult] = useState<string[] | null>(null)
  const [pending, startTransition] = useTransition()

  function generate() {
    startTransition(async () => {
      const { codes, error } = await generateBetaInvites(count, adminEmail)
      if (error) toast.error(error)
      else setResult(codes ?? [])
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-20 rounded-xl bg-white/8 border border-white/10 px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-cyan-400/50 [appearance:textfield]"
        />
        <button
          onClick={generate}
          disabled={pending}
          className="flex-1 py-2.5 rounded-xl bg-cyan-400/15 border border-cyan-400/25 text-cyan-400 text-sm font-semibold disabled:opacity-40 transition-opacity"
        >
          {pending ? 'Génération…' : `Générer ${count} code${count > 1 ? 's' : ''}`}
        </button>
      </div>
      {result && (
        <div className="rounded-xl bg-emerald-400/8 border border-emerald-400/20 p-3">
          <p className="text-xs text-emerald-400 font-semibold mb-2">Codes générés :</p>
          <div className="space-y-1">
            {result.map(c => (
              <code key={c} className="block text-sm font-mono text-white">{c}</code>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
