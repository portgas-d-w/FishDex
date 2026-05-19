'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  bgUrl: string
}

export function HeroWithParallax({ children, bgUrl }: Props) {
  const shouldReduce = useReducedMotion()
  const { scrollY }  = useScroll()

  // Le fond descend de 100px max pendant que le user scrolle 600px
  // → image bouge à 17% de la vitesse de scroll (profondeur sans écœurement)
  // Le container est étendu de ±100px au-delà de la section pour éviter
  // les bords blancs quelle que soit la translation
  const y = useTransform(
    scrollY,
    [0, 600],
    [0, shouldReduce ? 0 : 100]
  )
  const opacity = useTransform(
    scrollY,
    [0, 400],
    [1, shouldReduce ? 1 : 0.45]
  )

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Zone image étendue pour absorber la translation sans bords blancs */}
      <motion.div
        style={{
          position: 'absolute',
          top:   '-100px',
          left:  0,
          right: 0,
          bottom: '-100px',
          y,
          opacity,
          willChange: 'transform',
        }}
      >
        <Image
          key={bgUrl}
          src={bgUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={85}
        />
      </motion.div>

      {/* Contenu par-dessus */}
      <div className="relative z-10 h-full">{children}</div>
    </section>
  )
}
