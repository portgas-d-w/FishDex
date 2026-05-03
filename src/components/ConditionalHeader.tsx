'use client'

import { usePathname } from 'next/navigation'

type Props = {
  header: React.ReactNode
}

export function ConditionalHeader({ header }: Props) {
  const pathname = usePathname()
  if (pathname === '/') return null
  return <>{header}</>
}
