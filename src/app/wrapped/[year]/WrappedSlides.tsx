'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Fish, Calendar, Layers, MapPin, Leaf, Share2 } from 'lucide-react'
import type { WrappedStats } from './page'

const SEASON_EMOJI: Record<string, string> = {
  printemps: '🌿', été: '☀️', automne: '🍂', hiver: '❄️',
}
const SEASON_BG: Record<string, string> = {
  printemps: 'from-emerald-900/80', été: 'from-amber-900/80',
  automne: 'from-orange-900/80',   hiver: 'from-blue-900/80',
}

export function WrappedSlides({ stats }: { stats: WrappedStats }) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex(i => Math.min(i + 1, TOTAL_SLIDES - 1))
  }, [])

  const slides = buildSlides(stats)
  const TOTAL_SLIDES = slides.length
  const current = slides[index]

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-[#0a0f14] select-none"
      onClick={next}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-safe-top pt-3">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-300 ${i < index ? 'w-full' : i === index ? 'w-full' : 'w-0'}`}
              style={i === index ? { transition: 'none' } : undefined}
            />
          </div>
        ))}
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {current}
        </motion.div>
      </AnimatePresence>

      {/* Tap hint (slide 0 only) */}
      {index === 0 && (
        <p className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-[11px] text-white/30 animate-pulse pointer-events-none">
          Appuie pour continuer
        </p>
      )}
    </div>
  )
}

// ── Slides factory ──────────────────────────────────────────────────────────

function buildSlides(s: WrappedStats): React.ReactNode[] {
  const seasonBg = SEASON_BG[s.favoriteSeason ?? ''] ?? 'from-cyan-900/80'

  return [
    // 1 — Bienvenue
    <SlideWrapper key="welcome" bg="from-slate-900">
      <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">FishDex Wrapped</p>
      <h1 className="text-5xl font-black text-white leading-tight mb-3">
        Ton<br />année<br />{s.year}
      </h1>
      <p className="text-white/40 text-base">Un récap de tes aventures</p>
    </SlideWrapper>,

    // 2 — Jours de pêche
    <SlideWrapper key="days" bg="from-blue-950">
      <Fish size={40} className="text-cyan-400 mb-6" />
      <p className="text-white/50 text-sm mb-2">Tu as pêché</p>
      <p className="text-8xl font-black text-white mb-2">{s.fishingDays}</p>
      <p className="text-white/60 text-xl">
        jour{s.fishingDays > 1 ? 's' : ''} sur 365
      </p>
      {s.totalSessions > 0 && (
        <p className="text-white/30 text-sm mt-4">{s.totalSessions} session{s.totalSessions > 1 ? 's' : ''} au total</p>
      )}
    </SlideWrapper>,

    // 3 — Captures
    <SlideWrapper key="catches" bg="from-teal-950">
      <Calendar size={40} className="text-cyan-400 mb-6" />
      <p className="text-white/50 text-sm mb-2">Total captures</p>
      <p className="text-8xl font-black text-white mb-2">{s.totalCatches}</p>
      <p className="text-white/60 text-xl">prise{s.totalCatches > 1 ? 's' : ''}</p>
    </SlideWrapper>,

    // 4 — Espèces
    <SlideWrapper key="species" bg="from-emerald-950">
      <Layers size={40} className="text-cyan-400 mb-6" />
      <p className="text-white/50 text-sm mb-2">Espèces différentes</p>
      <p className="text-8xl font-black text-white mb-2">{s.uniqueSpecies}</p>
      <p className="text-white/40 text-sm mt-4">Chaque espèce, une histoire</p>
    </SlideWrapper>,

    // 5 — Meilleure prise
    <SlideWrapper key="best" bg="from-amber-950">
      <p className="text-white/50 text-sm mb-2">Ton plus beau souvenir</p>
      {s.bestCatch ? (
        <>
          {s.bestCatch.photo_url && (
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-4 border border-white/20">
              <Image
                src={s.bestCatch.photo_url}
                alt={s.bestCatch.species_nom}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          )}
          <p className="text-3xl font-black text-white mb-1">{s.bestCatch.species_nom}</p>
          <div className="flex gap-3 text-white/60 text-base">
            {s.bestCatch.taille_cm && <span>{s.bestCatch.taille_cm} cm</span>}
            {s.bestCatch.poids_kg  && <span>{s.bestCatch.poids_kg} kg</span>}
          </div>
        </>
      ) : (
        <p className="text-white/40 text-lg">Aucune prise enregistrée</p>
      )}
    </SlideWrapper>,

    // 6 — Lieux favoris
    <SlideWrapper key="places" bg="from-indigo-950">
      <MapPin size={40} className="text-cyan-400 mb-6" />
      <p className="text-white/50 text-sm mb-4">Tes lieux préférés</p>
      {s.favoritePlaces.length > 0 ? (
        <div className="w-full max-w-xs space-y-3">
          {s.favoritePlaces.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-sm font-mono w-4">{i + 1}</span>
                <p className="text-white font-semibold text-sm">{p.name}</p>
              </div>
              <p className="text-white/40 text-xs">{p.count} prise{p.count > 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-base">Ajoute des lieux à tes captures</p>
      )}
    </SlideWrapper>,

    // 7 — Saison favorite
    <SlideWrapper key="season" bg={seasonBg}>
      <Leaf size={40} className="text-cyan-400 mb-6" />
      <p className="text-white/50 text-sm mb-2">Ta saison favorite</p>
      {s.favoriteSeason ? (
        <>
          <p className="text-7xl mb-3">{SEASON_EMOJI[s.favoriteSeason] ?? '🎣'}</p>
          <p className="text-4xl font-black text-white capitalize">{s.favoriteSeason}</p>
        </>
      ) : (
        <p className="text-white/40 text-lg">Pas encore de données</p>
      )}
    </SlideWrapper>,

    // 8 — Bilan émotionnel
    <SlideWrapper key="feels" bg="from-violet-950">
      <p className="text-white/50 text-sm mb-4">Ton ressenti dominant</p>
      {s.topRessenti ? (
        <>
          <p className="text-8xl mb-4">{s.topRessenti.emoji}</p>
          <p className="text-3xl font-black text-white mb-2">{s.topRessenti.label}</p>
          <p className="text-white/30 text-sm">{s.topRessenti.count} session{s.topRessenti.count > 1 ? 's' : ''}</p>
        </>
      ) : (
        <p className="text-white/40 text-base">Note ton ressenti après chaque sortie</p>
      )}
    </SlideWrapper>,

    // 9 — Partager
    <SlideWrapper key="share" bg="from-cyan-950">
      <Share2 size={40} className="text-cyan-400 mb-6" />
      <p className="text-white/50 text-sm mb-4">Partage ton année</p>
      <ShareCard stats={s} />
    </SlideWrapper>,

    // 10 — Merci
    <SlideWrapper key="end" bg="from-slate-900">
      <p className="text-6xl mb-6">🎣</p>
      <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">
        FishDex {s.year}
      </p>
      <h1 className="text-3xl font-black text-white leading-tight text-center">
        Merci d&apos;avoir<br />pêché avec FishDex
      </h1>
      <p className="text-white/30 text-sm mt-4">À l&apos;année prochaine</p>
    </SlideWrapper>,
  ]
}

// ── Share card (pour html2canvas) ────────────────────────────────────────────

function ShareCard({ stats: s }: { stats: WrappedStats }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setExporting(true)
    try {
      const el = document.getElementById('wrapped-share-card')
      if (!el) return
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(el, { backgroundColor: '#0a0f14', scale: 2 })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `fishdex-${s.year}.png`
      a.click()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Carte partageable */}
      <div
        id="wrapped-share-card"
        className="w-64 rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0a2040 100%)' }}
      >
        <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">FishDex {s.year}</p>
        <div className="grid grid-cols-2 gap-3 w-full mt-1">
          {[
            { label: 'Jours pêchés', value: s.fishingDays },
            { label: 'Captures', value: s.totalCatches },
            { label: 'Espèces', value: s.uniqueSpecies },
            { label: 'Sessions', value: s.totalSessions },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white/8 p-2.5">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        {s.bestCatch && (
          <p className="text-xs text-white/50 mt-1">
            🏆 {s.bestCatch.species_nom}
            {s.bestCatch.taille_cm ? ` · ${s.bestCatch.taille_cm} cm` : ''}
          </p>
        )}
        <p className="text-[9px] text-white/20 mt-1">fishdex.app</p>
      </div>

      {/* Bouton export */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold disabled:opacity-50 transition-opacity"
      >
        {exporting ? 'Export…' : 'Télécharger l\'image'}
      </button>
    </div>
  )
}

// ── Wrapper générique ─────────────────────────────────────────────────────────

function SlideWrapper({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div className={`h-full w-full flex flex-col items-center justify-center px-8 bg-gradient-to-b ${bg} to-[#0a0f14]`}>
      {children}
    </div>
  )
}
