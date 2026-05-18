import type { Variants } from 'framer-motion'

// Entrée depuis le bas — cards, items de liste
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

// Fade pur — headers, textes, overlays
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

// Container stagger — wrapper d'une liste de cards
// Les children héritent automatiquement initial/animate
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

// Slide depuis la droite — modales, drawers
export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.28, ease: 'easeIn' },
  },
}

// Pulse FAB — animation infinie très subtile
export const pulseGlow = {
  animate: {
    scale: [1, 1.04, 1],
    boxShadow: [
      '0 0 28px rgba(34,211,238,0.55)',
      '0 0 38px rgba(34,211,238,0.80)',
      '0 0 28px rgba(34,211,238,0.55)',
    ],
  },
  transition: {
    duration: 2.8,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}
