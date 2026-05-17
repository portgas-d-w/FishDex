'use client'

import { useEffect, useState } from 'react'

export function SessionTimer({ startedAt }: { startedAt: string }) {
  const [duration, setDuration] = useState('')

  useEffect(() => {
    function update() {
      const diff = Date.now() - new Date(startedAt).getTime()
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setDuration(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  return <span className="tabular-nums font-mono">{duration || '00:00:00'}</span>
}
