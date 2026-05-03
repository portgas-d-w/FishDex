'use client'

import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  onClose: () => void
}

export function SearchBar({ value, onChange, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="px-4 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 border border-cyan-400/30 backdrop-blur-md">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher une espèce..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
        />
        <button
          onClick={() => { onChange(''); onClose() }}
          aria-label="Fermer la recherche"
          className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
