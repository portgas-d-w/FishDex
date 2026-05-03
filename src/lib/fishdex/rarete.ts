import type { Rarete } from '@/types/fishdex'

export const rareteOrder: Rarete[] = ['commun', 'rare', 'epique', 'legendaire', 'shiny']

export const RARETE_COUNTS: Record<Rarete, number> = {
  commun:     13,
  rare:       14,
  epique:     15,
  legendaire: 10,
  shiny:       5,
}

export const rareteLabels: Record<Rarete, string> = {
  commun:     'Commun',
  rare:       'Rare',
  epique:     'Épique',
  legendaire: 'Légendaire',
  shiny:      'Shiny ✨',
}

type RareteStyle = {
  label:      string
  dot:        string   // bg-* pour le petit point coloré
  text:       string   // couleur du texte
  border:     string   // bordure de carte
  badge:      string   // classes complètes pour le badge inline
  badgeBorder:string   // bordure du badge
  glow:       string   // glow hover sur carte
}

export const rareteConfig: Record<Rarete, RareteStyle> = {
  commun: {
    label:       'Commun',
    dot:         'bg-slate-400',
    text:        'text-slate-400',
    border:      'border-slate-600/50',
    badge:       'bg-slate-700/70 text-slate-200',
    badgeBorder: 'border-slate-500/40',
    glow:        'hover:border-slate-500/70',
  },
  rare: {
    label:       'Rare',
    dot:         'bg-blue-400',
    text:        'text-blue-400',
    border:      'border-blue-500/40',
    badge:       'bg-blue-900/70 text-blue-200',
    badgeBorder: 'border-blue-500/40',
    glow:        'hover:border-blue-400/60 hover:shadow-blue-500/10',
  },
  epique: {
    label:       'Épique',
    dot:         'bg-purple-500',
    text:        'text-purple-400',
    border:      'border-purple-500/40',
    badge:       'bg-purple-900/70 text-purple-200',
    badgeBorder: 'border-purple-500/40',
    glow:        'hover:border-purple-400/60 hover:shadow-purple-500/10',
  },
  legendaire: {
    label:       'Légendaire',
    dot:         'bg-amber-500',
    text:        'text-amber-400',
    border:      'border-amber-500/40',
    badge:       'bg-amber-900/70 text-amber-200',
    badgeBorder: 'border-amber-500/40',
    glow:        'hover:border-amber-400/60 hover:shadow-amber-500/10',
  },
  shiny: {
    label:       'Shiny ✨',
    dot:         'bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500',
    text:        'bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 bg-clip-text text-transparent',
    border:      'border-pink-400/40',
    badge:       'bg-gradient-to-r from-amber-400/30 via-pink-400/30 to-purple-500/30 text-white',
    badgeBorder: 'border-purple-300/40',
    glow:        'hover:border-pink-400/60 hover:shadow-pink-500/10',
  },
}

export function getRareteConfig(rarete: string | null | undefined): RareteStyle {
  return rareteConfig[(rarete as Rarete) ?? 'commun'] ?? rareteConfig.commun
}
