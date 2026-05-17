'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteSession } from '@/app/actions/sessions'

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSession(sessionId)
      if (result.success) router.push('/sessions')
    })
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400 transition-colors"
      >
        <Trash2 size={12} />
        Supprimer
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40">Confirmer ?</span>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Suppression…' : 'Oui, supprimer'}
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="text-xs text-white/30 hover:text-white/60 transition-colors"
      >
        Annuler
      </button>
    </div>
  )
}
