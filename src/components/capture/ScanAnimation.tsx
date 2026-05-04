'use client'

import { motion } from 'framer-motion'

type Props = {
  scanning: boolean
}

export function ScanAnimation({ scanning }: Props) {
  if (!scanning) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ligne de scan principale */}
      <motion.div
        className="absolute left-0 right-0"
        style={{ height: 2 }}
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 2, ease: 'linear' }}
      >
        {/* Ligne lumineuse */}
        <div
          className="w-full h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 15%, rgba(34,211,238,1) 50%, rgba(34,211,238,0.3) 85%, transparent 100%)',
            boxShadow: '0 0 12px 4px rgba(34,211,238,0.6), 0 0 30px 8px rgba(34,211,238,0.2)',
          }}
        />
        {/* Traînée lumineuse sous la ligne */}
        <div
          className="w-full"
          style={{
            height: 60,
            background: 'linear-gradient(to bottom, rgba(34,211,238,0.12) 0%, transparent 100%)',
            marginTop: -2,
          }}
        />
      </motion.div>

      {/* Reflet lumineux au-dessus de la ligne (traînée inverse) */}
      <motion.div
        className="absolute left-0 right-0"
        style={{ height: 40 }}
        initial={{ top: '-5%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 2, ease: 'linear' }}
      >
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(34,211,238,0.04) 100%)',
          }}
        />
      </motion.div>
    </div>
  )
}
