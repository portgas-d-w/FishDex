# ⚡ FishDex — Axe 4 : Performance, Perfs perçues & Robustesse

> Faire passer l'app de "ça tourne" à "**ça vole**" et "ça ne plante jamais".
>
> **Estimation** : 1-2 semaines de travail effectif.
>
> **⚠️ Règle d'or** : la perf est un investissement. Plus tu tardes à la traiter, plus c'est cher à fixer après.

---

## 📐 Pourquoi maintenant

À ton stade (V1 proche du lancement), les users vont :
- Tester en 4G/5G fluctuant
- Sur des téléphones plus ou moins puissants
- Avec des connexions instables (en bord d'eau, ironique mais réel)
- Sur des sessions longues (plusieurs heures app ouverte)

**Si l'app rame ou plante**, ils quittent. Pas de seconde chance.

---

# 🎯 PROMPT P4.1 — Audit performance de base

**Format détaillé. Toujours auditer AVANT d'optimiser.**

---PROMPT---

CONTEXTE — Audit performance initial (P4.1)

Avant d'optimiser, on mesure. Sinon on tape à l'aveugle.

═══════════════════════════════════════════
ÉTAPE 1 — LIGHTHOUSE AUDIT
═══════════════════════════════════════════

1. Ouvre l'app en prod (https://fish-dex-six.vercel.app)
2. Mode incognito Chrome
3. F12 → onglet Lighthouse
4. Configure :
   - Mode : Navigation
   - Device : Mobile
   - Categories : Performance, Accessibility, Best Practices, SEO, PWA
5. Lance l'audit sur ces pages :
   - / (Home)
   - /fishdex
   - /aquarium
   - /sessions
   - /capture
   - /fishdex/brochet (détail espèce)

Présente-moi les scores + les 5 principales recommandations par page.

═══════════════════════════════════════════
ÉTAPE 2 — CORE WEB VITALS
═══════════════════════════════════════════

Identifie :
- LCP (Largest Contentful Paint) : < 2.5s idéal
- FID (First Input Delay) : < 100ms
- CLS (Cumulative Layout Shift) : < 0.1
- INP (Interaction to Next Paint) : < 200ms

Pour chaque métrique qui est dans le rouge, identifie la cause racine :
- LCP lent ? → image hero trop lourde, ou Server Action lente
- CLS élevé ? → images sans width/height, fonts qui décalent
- INP lent ? → JavaScript bloquant, hydration lourde

═══════════════════════════════════════════
ÉTAPE 3 — BUNDLE ANALYSIS
═══════════════════════════════════════════

Install : npm install --save-dev @next/bundle-analyzer

Dans next.config.js :
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config existante
});

Lance : ANALYZE=true npm run build

Présente-moi :
- Taille totale du bundle JS
- Top 5 packages les plus lourds
- Pages avec bundle > 200 KB

═══════════════════════════════════════════
ÉTAPE 4 — NETWORK ANALYSIS
═══════════════════════════════════════════

Sur la prod, F12 → Network, throttling Slow 4G :
1. Charger la home
2. Compter le nombre de requêtes
3. Identifier les plus lentes
4. Identifier les requêtes redondantes

═══════════════════════════════════════════
ÉTAPE 5 — RAPPORT FINAL
═══════════════════════════════════════════

Présente-moi un rapport structuré :

PERFORMANCE ACTUELLE :
- Lighthouse mobile : XX/100
- LCP : X.Xs
- CLS : X.XX
- Bundle total : XX MB
- Requêtes home : XX

TOP 3 PROBLÈMES IDENTIFIÉS :
1. [Problème + cause + impact estimé en ms]
2. ...
3. ...

PLAN D'ACTION PRIORITISÉ :
1. Quick wins (< 1h chacun)
2. Medium wins (quelques heures)
3. Big wins (1+ jour)

ATTENDS ma validation avant de fix.

═══════════════════════════════════════════
ÉTAPE 6 — COMMIT
═══════════════════════════════════════════

"docs(perf): initial performance audit baseline"
+ création d'un fichier docs/PERFORMANCE_BASELINE.md avec les chiffres

---PROMPT---

---

# 🎯 PROMPT P4.2 — Optimisation images (au-delà de S3.2)

**Format compact. Les images sont 60% du poids d'une app.**

---PROMPT---

CONTEXTE — Optimisation images avancée (P4.2)

S3.2 a posé les bases. Maintenant on pousse plus loin.

ÉTAPE 1 — VÉRIFICATION SETUP ACTUEL
- Compression client à l'upload ? ✓
- Multi-tailles côté serveur ? ✓
- Lazy loading natif ? ✓
- Blur placeholders ? ✓

Si oui à tout → passer à étape 2.
Si non → revenir à PROMPTS_H3.md S3.2 d'abord.

ÉTAPE 2 — NEXT.JS IMAGE COMPONENT
Remplace TOUS les <img> par <Image> de next/image :

import Image from 'next/image';

<Image
  src="/path/to/image"
  alt="..."
  width={400}
  height={400}
  loading="lazy"           // sauf pour hero (priority instead)
  placeholder="blur"        // si tu as un blurDataURL
  blurDataURL={blurData}
  sizes="(max-width: 768px) 100vw, 50vw"  // responsive
/>

Pour le hero (au-dessus du fold) :
<Image src="..." priority />

Pour les images en bas de page (carrousel scrollable) :
<Image src="..." loading="lazy" />

ÉTAPE 3 — RESPONSIVE IMAGES
Le prop sizes est crucial. Mauvais sizes = mauvaise image servie.

Exemples corrects :
- Image hero full-width : sizes="100vw"
- Image dans grid 2 col sur mobile, 4 col sur desktop : sizes="(max-width: 768px) 50vw, 25vw"
- Image dans card detail : sizes="(max-width: 768px) 100vw, 50vw"

ÉTAPE 4 — REMOTE PATTERNS
Dans next.config.js :

images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}

ÉTAPE 5 — PRELOAD HERO
Dans le head de la home :

<link
  rel="preload"
  as="image"
  href="/backgrounds/home-default.webp"
  fetchPriority="high"
/>

Pour que le hero charge en priorité absolue.

ÉTAPE 6 — TESTS
- Lighthouse mobile après changements
- LCP devrait baisser de 30-50%
- CLS devrait être < 0.05

ÉTAPE 7 — COMMIT
"perf(images): comprehensive next/image migration with responsive sizes"

---PROMPT---

---

# 🎯 PROMPT P4.3 — Code splitting et lazy loading

**Format compact. Charger moins de JS au démarrage.**

---PROMPT---

CONTEXTE — Code splitting agressif (P4.3)

Charger uniquement le JS nécessaire à chaque page.

ÉTAPE 1 — DYNAMIC IMPORTS
Identifie les composants lourds qui ne sont pas critiques au premier paint :
- Carte interactive (si tu en as une)
- Charts (recharts si présent)
- Lecteur vidéo (si présent)
- Modales rares
- Tab non-actif par défaut

Replace par :

import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // si pas besoin de SSR
});

ÉTAPE 2 — ROUTES STREAMING
Avec App Router, utilise loading.tsx dans chaque route :

src/app/(app)/aquarium/loading.tsx :

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCatchCard key={i} />
      ))}
    </div>
  );
}

Pareil pour /sessions, /fishdex, /profile.

ÉTAPE 3 — SUSPENSE BOUNDARIES
Dans les pages avec multiple data fetches :

<Suspense fallback={<SkeletonSection />}>
  <SectionAvecDataFetch />
</Suspense>

<Suspense fallback={<SkeletonSection />}>
  <AutreSection />
</Suspense>

Chaque section charge indépendamment, l'user voit du contenu plus tôt.

ÉTAPE 4 — TREE SHAKING
Vérifie les imports lodash, date-fns, etc. :

❌ import _ from 'lodash'                  → tout lodash importé
✅ import debounce from 'lodash/debounce'  → juste debounce

❌ import { format } from 'date-fns'      → 50KB+
✅ import { format } from 'date-fns/format' → ~2KB

ÉTAPE 5 — TESTS
- Bundle analyzer après changements
- Pages doivent passer sous 150 KB JS
- First Load JS sous 100 KB sur Home

ÉTAPE 6 — COMMIT
"perf(bundle): dynamic imports and proper code splitting"

---PROMPT---

---

# 🎯 PROMPT P4.4 — Error handling et resilience

**Format détaillé. L'app doit jamais "casser visiblement".**

---PROMPT---

CONTEXTE — Error boundaries et résilience (P4.4)

Chaque page doit gérer ses erreurs gracieusement.

═══════════════════════════════════════════
ÉTAPE 1 — ERROR BOUNDARIES GLOBALES
═══════════════════════════════════════════

Crée src/app/error.tsx (global) :

'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log à Sentry si configuré
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="h-16 w-16 text-amber-400 mb-6" />
      <h2 className="text-2xl font-semibold text-white mb-3">
        Quelque chose ne s'est pas passé comme prévu
      </h2>
      <p className="text-sm text-white/60 mb-8 max-w-md">
        L'eau ne se précipite jamais. Réessaie dans un instant.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400
                   text-black font-medium transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}

ÉTAPE 2 — ERROR PAR ROUTE
Dans chaque route critique, crée un error.tsx local :

src/app/(app)/aquarium/error.tsx
src/app/(app)/sessions/error.tsx
src/app/(app)/fishdex/error.tsx

Avec contenu adapté ("Aquarium temporairement inaccessible", etc.)

═══════════════════════════════════════════
ÉTAPE 3 — NOT-FOUND PAGE
═══════════════════════════════════════════

src/app/not-found.tsx :

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <p className="text-6xl mb-4">🐟</p>
      <h2 className="text-2xl font-semibold mb-3">
        Cette page nage ailleurs
      </h2>
      <p className="text-sm text-white/60 mb-8">
        La rivière a peut-être changé de cours.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400
                   text-black font-medium"
      >
        Retour au Spot
      </Link>
    </div>
  );
}

═══════════════════════════════════════════
ÉTAPE 4 — RETRY AUTO SUR SERVER ACTIONS
═══════════════════════════════════════════

Crée src/lib/utils/retry.ts :

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delayMs?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, delayMs * attempt));
      }
    }
  }

  throw lastError;
}

Usage dans Server Actions critiques :

const result = await withRetry(() =>
  supabase.from('catches').insert(...)
);

═══════════════════════════════════════════
ÉTAPE 5 — TIMEOUT SUR API EXTERNES
═══════════════════════════════════════════

Pour iNaturalist, Claude Vision, OpenWeather :

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

═══════════════════════════════════════════
ÉTAPE 6 — OFFLINE STATE
═══════════════════════════════════════════

Crée un hook useOnlineStatus :

import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

Dans le layout, banner discret si offline :

{!isOnline && (
  <div className="fixed top-0 left-0 right-0 bg-amber-500/20 backdrop-blur p-2 text-center text-xs">
    Hors ligne — Tes captures seront synchronisées dès le retour
  </div>
)}

═══════════════════════════════════════════
ÉTAPE 7 — COMMIT
═══════════════════════════════════════════

Plusieurs commits :
1. "feat(errors): global and per-route error boundaries"
2. "feat(errors): poetic not-found page"
3. "feat(resilience): retry logic and timeouts on external APIs"
4. "feat(offline): online status banner and graceful degradation"

⚠️ Tester les error boundaries en simulant des erreurs (throw new Error dans un composant)
⚠️ Tester offline mode en désactivant la connexion

---PROMPT---

---

# 🎯 PROMPT P4.5 — Monitoring et observabilité

**Format compact. Savoir ce qui se passe en prod.**

---PROMPT---

CONTEXTE — Monitoring de prod (P4.5)

Sans monitoring, tu pilotes à l'aveugle. Avec, tu vois les bugs avant tes users.

ÉTAPE 1 — SENTRY (errors + performance)
1. Crée un compte sur https://sentry.io (free tier 5000 errors/mois)
2. npm install @sentry/nextjs
3. npx @sentry/wizard@latest -i nextjs
4. Configure DSN dans .env.local et Vercel

Sentry capture automatiquement :
- Erreurs serveur (Server Actions)
- Erreurs client
- Performance (Web Vitals)
- Replays sessions (sur opt-in)

ÉTAPE 2 — POSTHOG (analytics produit)
1. Crée un compte sur https://posthog.com (free tier 1M events/mois)
2. npm install posthog-js
3. Configure dans src/app/layout.tsx :

useEffect(() => {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://eu.posthog.com',
    person_profiles: 'identified_only',
  });
}, []);

Track les events clés :
- 'capture_created'
- 'session_started'
- 'session_ended'
- 'ai_suggestion_accepted'
- 'ai_suggestion_corrected'
- 'onboarding_completed'

ÉTAPE 3 — DASHBOARDS POSTHOG
Crée des dashboards pour suivre :
- DAU / WAU / MAU (Daily/Weekly/Monthly Active Users)
- Funnel signup → onboarding → première capture
- Rétention 7/30 jours
- Conversion bêta → user actif

ÉTAPE 4 — UPTIME ROBOT (disponibilité)
1. Crée un compte sur https://uptimerobot.com (free tier 50 monitors)
2. Configure check 5 min sur https://fish-dex-six.vercel.app
3. Notifications mail si down

ÉTAPE 5 — COMMIT
"feat(monitoring): Sentry, PostHog, and uptime monitoring setup"

⚠️ Respect RGPD : informer user de PostHog dans privacy policy
⚠️ Sentry replays : opt-in uniquement, pas par défaut

---PROMPT---

---

# 🎯 PROMPT P4.6 — Service Worker offline-first

**Format compact. PWA installable et offline.**

---PROMPT---

CONTEXTE — PWA offline-first (P4.6)

Permettre à l'app de fonctionner même hors-ligne, et d'être installée comme une vraie app.

ÉTAPE 1 — INSTALL NEXT-PWA
npm install @ducanh2912/next-pwa

(Version moderne et maintenue, mieux que next-pwa classique en 2026)

ÉTAPE 2 — CONFIG
Dans next.config.js :

const withPWA = require('@ducanh2912/next-pwa').default;

module.exports = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
  },
})({
  // ta config existante
});

ÉTAPE 3 — MANIFEST.JSON COMPLET
public/manifest.json :

{
  "name": "FishDex",
  "short_name": "FishDex",
  "description": "Ton journal de pêche premium",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0f14",
  "theme_color": "#0a0f14",
  "orientation": "portrait",
  "icons": [
    { "src": "/logo/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/logo/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/logo/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/home.png", "sizes": "390x844", "type": "image/png" },
    { "src": "/screenshots/fishdex.png", "sizes": "390x844", "type": "image/png" }
  ],
  "categories": ["lifestyle", "sports"],
  "lang": "fr-FR"
}

ÉTAPE 4 — STRATÉGIES DE CACHE
Configure les routes avec strategies :
- /, /fishdex, /aquarium → StaleWhileRevalidate (rapide + mis à jour)
- API routes → NetworkFirst (toujours frais si possible, sinon cache)
- /backgrounds/* → CacheFirst (assets statiques)

ÉTAPE 5 — INSTALL PROMPT
Crée un composant qui affiche "Ajouter à l'écran d'accueil" :

const handleInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      // tracker l'install
    }
  }
};

Affiche le prompt après 30 secondes d'usage + 3 visits min.

ÉTAPE 6 — TESTS
- Installer la PWA sur iPhone (Safari → Partager → Ajouter à l'écran d'accueil)
- Désactiver la connexion → l'app doit toujours fonctionner pour la navigation
- Captures faites offline → synchronisées au retour online

ÉTAPE 7 — COMMIT
"feat(pwa): offline-first service worker with installable manifest"

---PROMPT---

---

# ✅ CHECKLIST FINALE PERFORMANCE

- [ ] **P4.1** — Audit baseline mesuré et documenté
- [ ] **P4.2** — Images optimisées avec next/image partout
- [ ] **P4.3** — Code splitting agressif, bundle < 150 KB
- [ ] **P4.4** — Error boundaries, retry, offline handling
- [ ] **P4.5** — Sentry + PostHog + UptimeRobot configurés
- [ ] **P4.6** — PWA installable et offline

**Objectifs chiffrés** :
- [ ] Lighthouse mobile > 85
- [ ] LCP < 2.5s en 4G
- [ ] CLS < 0.1
- [ ] Bundle home < 150 KB
- [ ] Sentry capte 100% des erreurs
- [ ] App fonctionne offline (navigation au moins)

**Tests réels** :
- [ ] Tester sur iPhone SE (low-end) → fluide
- [ ] Tester en 3G simulé → utilisable
- [ ] Tester offline → pas de crash
- [ ] Tester en mode avion en pleine session → tout marche au retour

---

# 📊 BUDGET PERFORMANCE

| Métrique | Avant (estimation) | Cible | Stratégie |
|---|---|---|---|
| Lighthouse mobile | 60-70 | 85+ | next/image, code splitting |
| LCP | 3-4s | < 2.5s | hero preload, optimisations |
| CLS | 0.2+ | < 0.1 | width/height sur images |
| Bundle home | 250 KB | < 150 KB | dynamic imports |
| Erreurs/jour | inconnu | trackés et < 5 | Sentry |

**Quand c'est fini, ton app est rapide, robuste, observable, et installable.**

Performance livrée. ⚡
