'use client'

import dynamic from 'next/dynamic'
import type { SpotWithStats } from './SpotsMap'

const SpotsMap = dynamic(() => import('./SpotsMap').then(m => m.SpotsMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-2xl bg-white/5 flex items-center justify-center">
      <p className="text-sm text-white/40">Chargement de la carte…</p>
    </div>
  ),
})

export function SpotsMapLoader({ spots }: { spots: SpotWithStats[] }) {
  return <SpotsMap spots={spots} />
}
