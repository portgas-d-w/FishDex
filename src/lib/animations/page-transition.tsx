'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Wrapper page — à utiliser dans les composants client principaux de chaque page
export function PageWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
