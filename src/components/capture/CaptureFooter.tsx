'use client'

import { Images, Zap, ZapOff } from 'lucide-react'

type Props = {
  onCapture: () => void
  onGallery: () => void
  flashOn: boolean
  onFlashToggle: () => void
  disabled: boolean
}

export function CaptureFooter({ onCapture, onGallery, flashOn, onFlashToggle, disabled }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full px-8">
        {/* Galerie */}
        <button
          onClick={onGallery}
          disabled={disabled}
          aria-label="Ouvrir la galerie"
          className="flex flex-col items-center gap-1.5 disabled:opacity-40"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm flex items-center justify-center">
            <Images size={22} className="text-slate-300" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Galerie</span>
        </button>

        {/* Bouton capture central */}
        <button
          onClick={onCapture}
          disabled={disabled}
          aria-label="Capturer une photo"
          className="relative flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform duration-150"
        >
          {/* Halos */}
          <span
            className="absolute rounded-full animate-pulse"
            style={{
              inset: -14,
              background: 'rgba(34,211,238,0.08)',
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              inset: -7,
              border: '1px solid rgba(34,211,238,0.25)',
            }}
          />

          {/* Cercle blanc avec bordure cyan */}
          <span
            className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(34,211,238,0.2)' }}
          >
            <span
              className="w-[60px] h-[60px] rounded-full bg-white"
              style={{ border: '3px solid rgba(34,211,238,0.4)' }}
            />
          </span>
        </button>

        {/* Flash */}
        <button
          onClick={onFlashToggle}
          disabled={disabled}
          aria-label={flashOn ? 'Désactiver le flash' : 'Activer le flash'}
          className="flex flex-col items-center gap-1.5 disabled:opacity-40"
        >
          <div className={`w-12 h-12 rounded-2xl border backdrop-blur-sm flex items-center justify-center transition-colors
            ${flashOn
              ? 'bg-amber-400/15 border-amber-400/40'
              : 'bg-white/8 border-white/12'
            }`}
          >
            {flashOn
              ? <Zap size={22} className="text-amber-400" />
              : <ZapOff size={22} className="text-slate-300" />
            }
          </div>
          <span className={`text-[11px] font-medium ${flashOn ? 'text-amber-400' : 'text-slate-400'}`}>
            Flash
          </span>
        </button>
      </div>

      <p className="text-sm text-slate-400 text-center">
        Place le poisson dans le cadre
      </p>
    </div>
  )
}
