'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import type { ReactNode } from 'react'

type Props = {
  bgUrl: string
  overlay?: string   // classe Tailwind pour le gradient overlay
  children: ReactNode
  className?: string
}

// Même système de parallax que HeroWithParallax.
// Background fixed étendu vers le bas pour absorber la translation
// sans bords blancs quelle que soit la longueur de la page.
export function PageBackground({ bgUrl, overlay, children, className }: Props) {
  const shouldReduce = useReducedMotion()
  const { scrollY }  = useScroll()

  // Image remonte à 20% de la vitesse de scroll → effet de profondeur
  const y = useTransform(scrollY, [0, 1500], [0, shouldReduce ? 0 : -300])

  return (
    <div className={`relative min-h-screen ${className ?? ''}`}>
      {/* Background parallax — fixed, étendu 300px sous le viewport */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: '-300px',
          zIndex: -10,
          y,
          willChange: 'transform',
        }}
      >
        <Image
          src={bgUrl}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Overlay de lisibilité */}
        <div className={`absolute inset-0 ${overlay ?? 'bg-[#0a0f14]/65'}`} />
      </motion.div>

      {children}
    </div>
  )
}
