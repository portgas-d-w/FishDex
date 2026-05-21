# ✨ FishDex — Axe 1 : Polish UX visuel & Micro-interactions

> Transformer ton app de "très belle" à "**premium Apple-like**" via animations, transitions, et détails subtils.
>
> **Estimation** : 1-2 semaines de travail effectif.
>
> **⚠️ Règle d'or** : aucune animation ne doit ralentir l'app ou distraire l'user. Le polish doit se sentir, pas se voir.

---

## 📐 Philosophie du polish FishDex

**Ce qu'on cherche** :
- Animations **lentes et organiques** (durées 300-600ms, easing doux)
- Micro-feedback **systématique** sur chaque interaction tactile
- Transitions **fluides entre pages**, jamais brutales
- Skeleton loaders **élégants** pendant les chargements
- États de **focus, hover, press** travaillés

**Ce qu'on évite** :
- Animations TikTok (bounce, spring agressif)
- Confettis, particles, explosions
- Délais > 800ms (l'user se demande si c'est cassé)
- Animations qui se déclenchent au scroll de manière intrusive

---

# 🎯 PROMPT P1.1 — Système d'animations cohérent

**Format détaillé. Fondation pour tout le polish.**

---PROMPT---

CONTEXTE — Système d'animations FishDex (P1.1)

Avant de polir l'app, on installe un système cohérent d'animations réutilisables.

═══════════════════════════════════════════
ÉTAPE 1 — INSTALL DÉPENDANCES
═══════════════════════════════════════════

npm install framer-motion@latest

Framer Motion est la lib de référence pour React/Next.js. Plus puissante que les keyframes CSS, plus simple que GSAP.

═══════════════════════════════════════════
ÉTAPE 2 — CRÉER LES VARIANTS PARTAGÉS
═══════════════════════════════════════════

Crée src/lib/animations/variants.ts :

import { Variants } from 'framer-motion';

// Fade in subtil (cards qui apparaissent)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

// Fade in pur (textes, headers)
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// Stagger pour listes (chaque item apparaît en cascade)
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  },
};

// Tap feedback (scale down léger)
export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15 }
};

// Hover lift (card qui se soulève subtilement)
export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
};

// Slide-in latéral (modales, drawers)
export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// Pulse subtil (FAB Capture, éléments importants)
export const pulseSubtle: Variants = {
  animate: {
    scale: [1, 1.03, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
  },
};

═══════════════════════════════════════════
ÉTAPE 3 — HOOK USEPAGEFADE (transitions page)
═══════════════════════════════════════════

Crée src/lib/animations/page-transition.tsx :

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

Wrap toutes les pages principales avec <PageWrapper>.

═══════════════════════════════════════════
ÉTAPE 4 — APPLIQUER AUX COMPOSANTS EXISTANTS
═══════════════════════════════════════════

Modifie les composants suivants pour utiliser les variants :

1. CARDS (CatchCard, SpeciesCard, SessionCard, SpotCard) :
   Wrap chacun avec motion.div + variants={fadeInUp}

2. LISTES (FishDex grid, Aquarium grid, Sessions list) :
   Wrap le container avec motion.div + variants={staggerContainer}
   Les children utilisent fadeInUp

3. BOUTONS interactifs :
   Replace <button> par <motion.button {...tapScale}>

4. FAB Capture :
   <motion.button {...pulseSubtle}> pour effet pulse cyan permanent subtil

5. Modals / Drawers :
   Variants={slideInRight} avec AnimatePresence

═══════════════════════════════════════════
ÉTAPE 5 — RESPECT DE PREFER-REDUCED-MOTION
═══════════════════════════════════════════

Crée src/lib/animations/useReducedMotion.ts :

import { useReducedMotion } from 'framer-motion';

export function useAnimations() {
  const shouldReduceMotion = useReducedMotion();
  return {
    fadeInUp: shouldReduceMotion ? { initial: {}, animate: {} } : fadeInUp,
    // ... autres variants désactivés si user préfère
  };
}

═══════════════════════════════════════════
ÉTAPE 6 — TESTS
═══════════════════════════════════════════

- Navigate entre Le Spot / FishDex / Aquarium → transitions douces, pas de saute
- Scroll dans la grille FishDex → les cards apparaissent en cascade subtile
- Tap sur une card → feedback scale 0.97 visible mais pas exagéré
- FAB Capture pulse subtilement, jamais distrayant
- Sur device avec "Reduce Motion" iOS → animations désactivées proprement

═══════════════════════════════════════════
ÉTAPE 7 — COMMIT
═══════════════════════════════════════════

npx tsc --noEmit
"feat(animations): unified motion system with framer-motion"

⚠️ Pas plus de 1 animation simultanée à l'écran (sinon ça devient chargé)
⚠️ Toujours tester sur mobile RÉEL, pas juste DevTools
⚠️ Si une animation se sent "lourde", la durée doit être réduite

---PROMPT---

---

# 🎯 PROMPT P1.2 — Skeleton loaders élégants

**Format compact. États de chargement premium.**

---PROMPT---

CONTEXTE — Skeleton loaders premium (P1.2)

Au lieu de spinners génériques, on affiche des "fantômes" de l'UI finale.

ÉTAPE 1 — Crée src/components/ui/Skeleton.tsx :

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/5',
        'relative overflow-hidden',
        className
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}

ÉTAPE 2 — Dans tailwind.config.ts, ajoute :

keyframes: {
  shimmer: {
    '100%': { transform: 'translateX(100%)' },
  },
}

ÉTAPE 3 — Crée des skeletons spécifiques :

- SkeletonCatchCard (silhouette de card capture)
- SkeletonSessionCard (silhouette de card session)
- SkeletonSpeciesCard (silhouette de card espèce avec gradient rareté)
- SkeletonHero (silhouette du hero Home)

ÉTAPE 4 — Utilise dans Suspense :

<Suspense fallback={<SkeletonCatchCard />}>
  <CatchCard catchId={id} />
</Suspense>

Ou avec loading.tsx Next.js dans chaque route.

ÉTAPE 5 — COMMIT
"feat(ui): elegant skeleton loaders for all card types"

---PROMPT---

---

# 🎯 PROMPT P1.3 — Haptic feedback (vibrations)

**Format compact. Premium feel sur mobile.**

---PROMPT---

CONTEXTE — Vibrations haptic sur mobile (P1.3)

Sur iPhone, les vibrations subtiles ajoutent énormément de "premium feel".

ÉTAPE 1 — Crée src/lib/haptics/index.ts :

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function haptic(type: HapticType = 'light') {
  if (typeof window === 'undefined') return;
  if (!('vibrate' in navigator)) return;

  // Vibrations courtes selon type
  const patterns: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 25,
    heavy: 50,
    success: [10, 50, 10], // double tap
    warning: [25, 100, 25],
    error: [50, 100, 50, 100, 50], // triple
  };

  navigator.vibrate(patterns[type]);
}

ÉTAPE 2 — Applique haptic feedback aux actions clés :

- onClick capture FAB → haptic('medium')
- Validation formulaire session → haptic('success')
- Erreur (form invalide, capture échouée) → haptic('error')
- Toggle bookmark session → haptic('light')
- Pull-to-refresh → haptic('light')
- Swipe sur action destructive → haptic('warning')

ÉTAPE 3 — Toggle dans paramètres :

Ajoute dans profiles : haptics_enabled BOOLEAN DEFAULT TRUE
Toggle dans /settings : "Vibrations" (default ON)
Si false → haptic() ne fait rien.

ÉTAPE 4 — COMMIT
"feat(haptics): subtle vibrations on key interactions"

⚠️ Web Vibration API ne marche que sur Android et iPhone via Safari/PWA
⚠️ Désactivable dans settings (RGPD + accessibilité)

---PROMPT---

---

# 🎯 PROMPT P1.4 — Hero parallax & effets de profondeur

**Format compact. Effet premium sur Home.**

---PROMPT---

CONTEXTE — Parallax subtil sur Hero Home (P1.4)

Quand on scroll, le background hero doit "rester" plus longtemps que le contenu (effet parallax) pour créer de la profondeur.

ÉTAPE 1 — Crée src/components/home/HeroWithParallax.tsx :

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function HeroWithParallax({ children, bgUrl }: { children: React.ReactNode; bgUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Background descend moins vite que le scroll (parallax)
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgUrl})`,
          y,
          scale,
          opacity,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

ÉTAPE 2 — Remplace ton bloc hero actuel par <HeroWithParallax>.

ÉTAPE 3 — Performance :
- Use will-change: transform sur le motion.div
- Tester sur device bas de gamme (iPhone SE) → fluide ?

ÉTAPE 4 — COMMIT
"feat(home): parallax depth effect on hero background"

⚠️ Désactiver si useReducedMotion = true
⚠️ Pas plus de 20% de translation sinon ça fait mal de tête

---PROMPT---

---

# 🎯 PROMPT P1.5 — Détails de polish ciblés

**Format compact mais riche. Plein de petits détails à corriger.**

---PROMPT---

CONTEXTE — Polish ciblé sur les détails identifiés (P1.5)

Liste de petites améliorations qui font la différence cumulée.

ÉTAPE 1 — TOAST SYSTEM ÉLÉGANT
Si pas déjà fait, installe sonner :
npm install sonner

Dans src/app/layout.tsx, ajoute <Toaster /> avec config FishDex :

<Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: 'rgba(10, 15, 20, 0.9)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: 'white',
    },
    duration: 3000,
  }}
/>

Replace tous les alert() et notifications custom par toast() :
- toast.success("Capture enregistrée")
- toast.error("Échec upload, réessaie")
- toast("Belle prise !", { icon: '🎣' })

ÉTAPE 2 — TAP FEEDBACK GLOBAL
Sur mobile, les boutons doivent visuellement "répondre" au tap.
Ajoute partout :

className="active:scale-[0.98] active:opacity-90 transition-transform"

ÉTAPE 3 — FOCUS RINGS COHÉRENTS
Pour accessibilité + premium :

focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0a0f14]

À mettre sur tous les inputs, buttons, links interactifs.

ÉTAPE 4 — TRANSITION ENTRE PAGES (Next.js App Router)
Crée src/app/template.tsx :

'use client';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

template.tsx (≠ layout.tsx) se réinitialise à chaque navigation.

ÉTAPE 5 — PULL TO REFRESH SUR LISTES
Sur la liste Aquarium et Sessions, ajoute un pull-to-refresh natif :
- Sur scroll up dépassant le top, déclencher refresh
- Lib : react-pull-to-refresh ou implémentation custom avec framer-motion

ÉTAPE 6 — SCROLL BEHAVIOR GLOBAL
Dans globals.css :

html { scroll-behavior: smooth; }

* { -webkit-tap-highlight-color: transparent; }

Le tap-highlight enlève le flash bleu moche sur iOS.

ÉTAPE 7 — SAFE AREA INSETS (iPhone notch)
Dans tailwind.config.ts, étends spacing :

spacing: {
  'safe-top': 'env(safe-area-inset-top)',
  'safe-bottom': 'env(safe-area-inset-bottom)',
  'safe-left': 'env(safe-area-inset-left)',
  'safe-right': 'env(safe-area-inset-right)',
}

Use partout où nécessaire :
- BottomNav : pb-safe-bottom
- Header : pt-safe-top

ÉTAPE 8 — STATUS BAR THEME
Dans src/app/layout.tsx :

export const metadata = {
  themeColor: '#0a0f14',
  // ...
};

Et dans le manifest :
"theme_color": "#0a0f14",
"background_color": "#0a0f14"

Pour que la status bar iOS prenne la couleur de l'app en PWA.

ÉTAPE 9 — PRESS DURATION FEEDBACK
Pour les actions critiques (delete, end session), ajoute long-press :

import { useLongPress } from 'use-long-press';

const bind = useLongPress(() => {
  // action
}, { threshold: 600 });

L'user doit maintenir 600ms → feedback visuel pendant ce temps.

ÉTAPE 10 — COMMIT
"feat(polish): cohesive micro-interactions and details across the app"

---PROMPT---

---

# ✅ CHECKLIST FINALE POLISH UX

- [ ] **P1.1** — Framer-motion installé, variants partagés créés
- [ ] **P1.2** — Skeleton loaders sur toutes les listes principales
- [ ] **P1.3** — Haptics sur capture FAB, validations, erreurs
- [ ] **P1.4** — Parallax hero Home avec scale + opacity
- [ ] **P1.5** — Toasts sonner, focus rings, tap feedback, safe areas, status bar

**Tests obligatoires** :
- [ ] Sur iPhone réel : tout est fluide, jamais saccadé
- [ ] Sur Android réel : pareil
- [ ] Mode "Reduce Motion" iOS activé → animations désactivées
- [ ] PWA installée : status bar bonne couleur, safe areas respectées
- [ ] Scroll dans listes longues : pas de jank

**Quand c'est fini, ton app passe de "très belle" à "premium Apple-like".**

Polish UX livré. ✨
