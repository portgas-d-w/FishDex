---
name: fishdex-conventions
description: >
  Charge ce skill avant toute création ou modification de composant UI,
  de hook, de type TypeScript ou de fichier de style dans FishDex.
  Il encode la direction artistique, les règles code et les anti-patterns
  du projet. Ne jamais déroger sans validation explicite.
---

# FishDex — Conventions & Direction Artistique

## 1. Palette couleurs (source de vérité unique)

```ts
// Toujours importer depuis @/lib/theme — jamais hardcoder en composant
export const colors = {
  // Accents
  cyan:        '#22d3ee', // accent principal, CTAs, icônes actives
  cyanDim:     '#0e7490', // hover states, bordures actives
  cyanGlow:    'rgba(34,211,238,0.15)', // glow subtil sur cartes

  // Fond
  navy:        '#0a0f14', // fond global de l'app
  navyCard:    'rgba(255,255,255,0.05)', // fond des cartes (glassmorphism)
  navyDeep:    '#060a0e', // fond hero, modales

  // Raretés (badge + glow de carte)
  rarityCommon:    { bg: '#374151', text: '#9ca3af', glow: 'rgba(156,163,175,0.1)' },
  rarityUncommon:  { bg: '#14532d', text: '#4ade80', glow: 'rgba(74,222,128,0.12)' },
  rarityRare:      { bg: '#1e3a5f', text: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
  rarityEpic:      { bg: '#3b0764', text: '#c084fc', glow: 'rgba(192,132,252,0.18)' },
  rarityLegendary: { bg: '#78350f', text: '#fbbf24', glow: 'rgba(251,191,36,0.2)'  },

  // Textes
  textPrimary:   '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted:     '#475569',

  // États
  success: '#22c55e',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#38bdf8',
} as const;
```

---

## 2. Glassmorphism — système obligatoire

Toutes les cartes, modales, bottom sheets et overlays utilisent ce système.
**Jamais de fond opaque sombre** sur les éléments flottants.

### Classes Tailwind à utiliser

```
// Carte standard
bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl

// Carte hover / interactive
bg-white/5 hover:bg-white/8 backdrop-blur-md border border-white/10
hover:border-white/20 rounded-2xl transition-all duration-200

// Carte active / selected
bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 rounded-2xl

// Modal / bottom sheet
bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl

// Header / navbar
bg-navy/80 backdrop-blur-lg border-b border-white/8
```

### Règles glassmorphism
- `backdrop-blur-md` minimum sur toute carte — jamais `backdrop-blur-sm`
- `rounded-2xl` pour cartes — `rounded-3xl` pour modales/sheets
- Bordure toujours `border-white/10` au repos — jamais de bordure colorée
  sauf état actif/selected (alors `border-cyan-500/30`)
- Pas de `shadow-*` Tailwind — remplacer par glow CSS custom si nécessaire

---

## 3. Typographie

```
Font family : Inter (déjà chargé via @/styles/globals.css)
Jamais : system-ui, sans-serif seuls, Roboto, SF Pro

Titres principaux  : font-semibold tracking-tight text-white
  Ex: nom espèce   → text-3xl font-semibold tracking-tight
Titres secondaires : font-medium tracking-tight text-white/90
  Ex: section label → text-xs font-medium tracking-widest uppercase text-cyan-400
Corps de texte     : font-normal text-slate-300 leading-relaxed
Texte muted        : text-slate-500 text-sm
Données chiffrées  : font-semibold tabular-nums text-white
  (toujours tabular-nums pour les stats qui changent)
Nom latin          : italic text-slate-400 text-sm
```

---

## 4. Système d'espacement 8pt

Tous les paddings, margins et gaps sont des multiples de 8px.
Tailwind équivalents autorisés : p-2(8) p-3(12) p-4(16) p-6(24) p-8(32) p-10(40) p-12(48)

```
Interespacement cartes en liste : gap-3 (12px)
Padding interne carte standard  : p-4 (16px)
Padding interne carte large     : p-5 ou p-6 (20-24px)
Margin sections                 : mb-6 (24px)
Padding page                    : px-4 (16px) — jamais px-3 ou px-5
```

---

## 5. Icônes — Lucide React uniquement

```tsx
// ✅ Correct
import { Fish, MapPin, Trophy, Camera } from 'lucide-react'
<Fish size={20} className="text-cyan-400" />

// ❌ Interdit
<span>🐟</span>                    // emoji en UI
import { SomeIcon } from '@heroicons/react' // autre lib
<svg>...</svg>                     // SVG inline custom (sauf exception validée)
```

Tailles standard :
- Icône inline texte : `size={14}` ou `size={16}`
- Icône dans bouton : `size={18}`
- Icône décorative carte : `size={20}` ou `size={24}`
- Icône hero / illustration : `size={32}` max

---

## 6. Anti-patterns FishDex (ADN du projet)

Ces patterns sont **interdits** — ils cassent l'identité visuelle.

| Interdit | Pourquoi | Alternative |
|---|---|---|
| Confettis / particules animées | Trop gaming | Glow subtil au déblocage |
| XP bar / barre de progression colorée | Trop gamification voyante | Counter discret `+1` |
| Badges avec dégradés arc-en-ciel | Criard | Badge monochrome par rareté |
| Animations > 300ms | Lourd, lent | `duration-200` max |
| Couleurs vives > 2 par écran | Surcharge | Cyan seul + blanc |
| Fond blanc ou gris clair | Casse le dark mode | Navy + glassmorphism |
| Texte en majuscules sur corps | Illisible | Majuscules sur labels courts seulement |
| `console.log` en prod | Sécurité | Retirer avant commit |
| Emojis dans l'UI | Incohérent | Lucide React |
| Couleurs hardcodées en composant | Non maintenable | `@/lib/theme` ou Tailwind |

---

## 7. Conventions de nommage

```
Fichiers composants  : PascalCase           → FishCard.tsx, SpeciesHeader.tsx
Fichiers utilitaires : kebab-case           → fish-utils.ts, format-date.ts
Fichiers hooks       : camelCase avec use   → useFishDex.ts, useCaptureForm.ts
Slugs URL            : kebab-case           → /species/ombre-commun
Colonnes BDD         : snake_case           → common_name, latin_name, max_weight
Variables / fonctions: camelCase TypeScript → fishData, createCatch, formatWeight
Constantes globales  : SCREAMING_SNAKE      → MAX_FISH_SIZE, DEFAULT_REGION
```

---

## 8. Imports — chemins absolus stricts

```tsx
// ✅ Correct — toujours des chemins absolus @/
import { FishCard } from '@/components/fish/FishCard'
import { createCatch } from '@/app/actions/catches'
import { colors } from '@/lib/theme'
import type { Species } from '@/types/fishdex'

// ❌ Interdit — chemins relatifs
import { FishCard } from '../../../components/fish/FishCard'
import { createCatch } from '../../actions/catches'
```

Structure des dossiers à respecter :
```
src/
├── app/
│   ├── actions/        ← Server Actions uniquement
│   ├── (routes)/       ← Pages Next.js
│   └── api/            ← Route handlers si besoin
├── components/
│   ├── fish/           ← Composants liés aux espèces
│   ├── capture/        ← Composants liés aux captures
│   ├── session/        ← Composants liés aux sessions
│   └── ui/             ← Composants génériques réutilisables
├── lib/
│   ├── supabase/       ← Clients Supabase (server + client)
│   ├── theme.ts        ← Palette couleurs source de vérité
│   └── utils.ts        ← Fonctions utilitaires
└── types/
    └── fishdex.ts      ← Tous les types TypeScript du projet
```

---

## 9. Checklist avant tout commit composant UI

Avant de finaliser un composant, vérifier :
- [ ] Glassmorphism appliqué (`bg-white/5 backdrop-blur-md border-white/10`)
- [ ] Aucune couleur hardcodée dans le JSX
- [ ] Icônes via Lucide React uniquement
- [ ] Aucun emoji dans l'UI
- [ ] Espacements multiples de 8px
- [ ] Typographie Inter avec les bons weights
- [ ] Chemin d'import absolu (`@/...`)
- [ ] Aucun `console.log` restant
- [ ] Aucun anti-pattern de la liste ci-dessus
