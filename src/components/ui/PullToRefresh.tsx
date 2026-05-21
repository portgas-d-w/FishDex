'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

const THRESHOLD = 64

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startYRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = containerRef.current?.parentElement?.scrollTop ?? 0
    if (scrollTop > 2) return
    startYRef.current = e.touches[0].clientY
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startYRef.current === null || refreshing) return
    const delta = e.touches[0].clientY - startYRef.current
    if (delta > 0) setPullY(Math.min(delta * 0.45, THRESHOLD + 20))
  }, [refreshing])

  const onTouchEnd = useCallback(async () => {
    if (pullY >= THRESHOLD && !refreshing) {
      setRefreshing(true)
      setPullY(THRESHOLD)
      await new Promise(r => setTimeout(r, 600))
      router.refresh()
      setRefreshing(false)
    }
    setPullY(0)
    startYRef.current = null
  }, [pullY, refreshing, router])

  const progress = Math.min(pullY / THRESHOLD, 1)

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative"
    >
      <AnimatePresence>
        {(pullY > 4 || refreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center pt-2 pb-3"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : progress * 180 }}
              transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
              className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center"
            >
              <RefreshCw size={14} className="text-cyan-400" style={{ opacity: 0.4 + progress * 0.6 }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div style={{ y: refreshing ? THRESHOLD * 0.5 : pullY * 0.5 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {children}
      </motion.div>
    </div>
  )
}
