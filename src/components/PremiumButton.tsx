'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export default function PremiumButton({ children, href, onClick, className }: Props) {
  const Tag = href ? 'a' : 'button'

  return (
    <motion.div
      className={`border-beam inline-block p-[2px] rounded-[14px] relative cursor-pointer ${className ?? ''}`}
      whileHover={{ y: -2, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Tag
        href={href}
        onClick={onClick}
        className="group relative block overflow-hidden rounded-[12px] px-8 py-[13px] select-none"
        style={{
          background: 'linear-gradient(145deg, #0d1520 0%, #080e1a 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.9)',
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: '0.025em',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Lumière qui monte depuis le bas au hover */}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 origin-bottom scale-y-50 group-hover:scale-y-100 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 120%, rgba(56,189,248,0.13) 0%, rgba(167,139,250,0.07) 45%, transparent 70%)',
          }}
        />
        {/* Shimmer qui traverse */}
        <span
          className="absolute top-0 -left-[70%] w-[45%] h-full group-hover:left-[130%] transition-[left] duration-[650ms] ease-in-out pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            transform: 'skewX(-18deg)',
          }}
        />
        <span className="relative">{children}</span>
      </Tag>
    </motion.div>
  )
}
