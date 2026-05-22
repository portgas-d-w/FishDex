'use client'

import { useTransition } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createPortalSession } from '@/app/actions/billing'

export function PortalButton() {
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const result = await createPortalSession()
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      window.location.href = result.url
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <ExternalLink size={15} />
      )}
      Gérer mon abonnement
    </button>
  )
}
