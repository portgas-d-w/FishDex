import type { Season, LightPhase, Context } from './context'

/**
 * Mapping saison × phase lumineuse → background.
 * Clé : "season-light" ou "any-light" ou "season-any"
 * Ordre de priorité : clé exacte > wildcard light > wildcard season > default
 *
 * Backgrounds disponibles :
 *   home-default.webp         → lever de soleil sur lac calme (printemps matin)
 *   home-aube-grise.webp      → bateau sur lac par ciel couvert (aube automnale)
 *   home-aube-canne.webp      → canne à pêche au lever de soleil brumeux (aube printemps)
 *   home-automne-riviere.webp → rivière en automne avec rayons de soleil
 *   home-coucher-brume.webp   → coucher de soleil brumeux sur lac
 *   home-ete-riviere.webp     → rivière en été sous le soleil
 *   home-hiver.webp           → lac sous la neige en hiver
 *   home-nuit-lune.webp       → nuit claire avec lune sur lac
 *   home-nuit-etoiles.webp    → nuit étoilée (voie lactée) sur lac
 *   home-orage.webp           → lac sous orage et pluie
 *   home-peche-coucher.webp   → pêcheur silhouette au coucher de soleil (mer/roche)
 *   home-pluie-automne.webp   → pêcheur sous la pluie en automne
 *   home-bateau-nuages.webp   → lac nuageux avec bateau (temps couvert)
 */
const BG_MAP: Partial<Record<`${Season | 'any'}-${LightPhase | 'any'}`, string>> = {
  // ── PRINTEMPS ──────────────────────────────────────────────────────────────
  'spring-dawn':      '/backgrounds/home-aube-canne.webp',
  'spring-morning':   '/backgrounds/home-default.webp',
  'spring-midday':    '/backgrounds/home-default.webp',
  'spring-afternoon': '/backgrounds/home-default.webp',
  'spring-dusk':      '/backgrounds/home-coucher-brume.webp',
  'spring-night':     '/backgrounds/home-nuit-lune.webp',

  // ── ÉTÉ ───────────────────────────────────────────────────────────────────
  'summer-dawn':      '/backgrounds/home-aube-canne.webp',
  'summer-morning':   '/backgrounds/home-ete-riviere.webp',
  'summer-midday':    '/backgrounds/home-ete-riviere.webp',
  'summer-afternoon': '/backgrounds/home-ete-riviere.webp',
  'summer-dusk':      '/backgrounds/home-peche-coucher.webp',
  'summer-night':     '/backgrounds/home-nuit-etoiles.webp',

  // ── AUTOMNE ────────────────────────────────────────────────────────────────
  'autumn-dawn':      '/backgrounds/home-aube-grise.webp',
  'autumn-morning':   '/backgrounds/home-automne-riviere.webp',
  'autumn-midday':    '/backgrounds/home-automne-riviere.webp',
  'autumn-afternoon': '/backgrounds/home-automne-riviere.webp',
  'autumn-dusk':      '/backgrounds/home-coucher-brume.webp',
  'autumn-night':     '/backgrounds/home-nuit-lune.webp',

  // ── HIVER ─────────────────────────────────────────────────────────────────
  'winter-dawn':      '/backgrounds/home-bateau-nuages.webp',
  'winter-morning':   '/backgrounds/home-hiver.webp',
  'winter-midday':    '/backgrounds/home-hiver.webp',
  'winter-afternoon': '/backgrounds/home-hiver.webp',
  'winter-dusk':      '/backgrounds/home-coucher-brume.webp',
  'winter-night':     '/backgrounds/home-nuit-lune.webp',

  // ── WILDCARDS (météo pluvieux/orageux) ────────────────────────────────────
  // Utilisées manuellement si weather !== 'clear' (fonctionnalité H3 météo)
  'any-any':          '/backgrounds/home-orage.webp',       // fallback pluie
}

const DEFAULT_BG = '/backgrounds/home-default.webp'

export function getHomeBackground(context: Pick<Context, 'season' | 'light' | 'weather'>): string {
  // En H3 avec API météo réelle, on pourra activer les backgrounds orage/pluie.
  // Pour l'instant weather='clear' toujours → on ignore ce critère.
  const exact = BG_MAP[`${context.season}-${context.light}`]
  if (exact) return exact
  return DEFAULT_BG
}

/** Toutes les URLs pour le préchargement (link rel="preload") */
export const ALL_HOME_BACKGROUNDS = [
  ...new Set(Object.values(BG_MAP).filter(Boolean) as string[]),
  DEFAULT_BG,
]
