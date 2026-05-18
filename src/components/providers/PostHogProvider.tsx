'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import type { PostHog } from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const phRef        = useRef<PostHog | null>(null)

  useEffect(() => {
    const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'
    if (!key || phRef.current) return

    // Chargement différé : posthog-js (~191 KB) ne bloque plus le rendu initial
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host:          host,
        capture_pageview:  false,
        capture_pageleave: true,
        persistence:       'localStorage',
      })
      phRef.current = posthog
      // Capture la première page vue après init asynchrone
      const url = window.location.pathname + window.location.search
      posthog.capture('$pageview', { $current_url: url })
    })
  }, [])

  useEffect(() => {
    // Navigations suivantes : posthog est déjà chargé
    if (!phRef.current) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    phRef.current.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return <>{children}</>
}
