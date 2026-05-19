import type { Rarete } from '@/types/fishdex'

export const rareteOrder: Rarete[] = ['commun', 'peu commun', 'rare', 'epique', 'legendaire', 'mirage']

export const RARETE_COUNTS: Record<Rarete, number> = {
  commun:       12,
  'peu commun': 10,
  rare:         15,
  epique:        3,
  legendaire:    5,
  mirage:       30,
}

export const rareteLabels: Record<Rarete, string> = {
  commun:       'Commun',
  'peu commun': 'Peu commun',
  rare:         'Rare',
  epique:       'Épique',
  legendaire:   'Légendaire',
  mirage:       'Mirage ✨',
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
    dot:         'bg-emerald-400',
    text:        'text-emerald-400',
    border:      'border-emerald-500/40',
    badge:       'bg-emerald-900/60 text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    glow:        'hover:border-emerald-400/60 hover:shadow-[0_0_16px_rgba(52,211,153,0.2)]',
  },
  'peu commun': {
    label:       'Peu commun',
    dot:         'bg-teal-400',
    text:        'text-teal-400',
    border:      'border-teal-500/40',
    badge:       'bg-teal-900/60 text-teal-300',
    badgeBorder: 'border-teal-500/40',
    glow:        'hover:border-teal-400/60 hover:shadow-[0_0_16px_rgba(45,212,191,0.2)]',
  },
  rare: {
    label:       'Rare',
    dot:         'bg-blue-400',
    text:        'text-blue-400',
    border:      'border-blue-500/40',
    badge:       'bg-blue-900/60 text-blue-300',
    badgeBorder: 'border-blue-500/40',
    glow:        'hover:border-blue-400/70 hover:shadow-[0_0_16px_rgba(96,165,250,0.25)]',
  },
  epique: {
    label:       'Épique',
    dot:         'bg-purple-500',
    text:        'text-purple-400',
    border:      'border-purple-500/40',
    badge:       'bg-purple-900/60 text-purple-300',
    badgeBorder: 'border-purple-500/40',
    glow:        'hover:border-purple-400/70 hover:shadow-[0_0_16px_rgba(168,85,247,0.25)]',
  },
  legendaire: {
    label:       'Légendaire',
    dot:         'bg-amber-400',
    text:        'text-amber-400',
    border:      'border-amber-500/40',
    badge:       'bg-amber-900/60 text-amber-300',
    badgeBorder: 'border-amber-500/40',
    glow:        'hover:border-amber-400/70 hover:shadow-[0_0_16px_rgba(251,191,36,0.25)]',
  },
  mirage: {
    label:       'Mirage ✨',
    dot:         'bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500',
    text:        'bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 bg-clip-text text-transparent',
    border:      'border-pink-400/50',
    badge:       'bg-gradient-to-r from-amber-400/20 via-pink-400/20 to-purple-500/20 text-pink-200',
    badgeBorder: 'border-pink-400/40',
    glow:        'hover:border-pink-400/70 hover:shadow-[0_0_20px_rgba(244,114,182,0.3)]',
  },
}

export function getRareteConfig(rarete: string | null | undefined): RareteStyle {
  return rareteConfig[(rarete as Rarete) ?? 'commun'] ?? rareteConfig.commun
}
