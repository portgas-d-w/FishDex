import type { ReactNode } from 'react'

// Plein écran sans BottomNav — l'overlay fixed couvre tout
export default function CaptureLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
