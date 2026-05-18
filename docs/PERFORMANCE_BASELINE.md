# Performance Baseline — FishDex
> Audit initial · 2026-05-18 · Avant toute optimisation

---

## Méthode

- **Prod** : https://fish-dex-six.vercel.app
- **Playwright** : mesures réelles sur la prod (desktop, connexion normale)
- **Build local** : analyse des chunks `.next/static/chunks/`
- **Static analysis** : revue manuelle du code source (205 fichiers TSX/TS)

---

## 1. Métriques Core Web Vitals — Page `/` (Home)

| Métrique | Valeur | Seuil Vert | Seuil Rouge | Statut |
|---|---|---|---|---|
| **TTFB** | 83 ms | < 800ms | > 1800ms | ✅ Excellent |
| **FCP** (First Contentful Paint) | 2 508 ms | < 1 800ms | > 3 000ms | 🟡 À améliorer |
| **LCP** (Largest Contentful Paint) | 2 508 ms | < 2 500ms | > 4 000ms | 🟡 Limite rouge |
| **CLS** (Cumulative Layout Shift) | 0.000 | < 0.1 | > 0.25 | ✅ Parfait |
| **INP** (Interaction to Next Paint) | n/a (pas d'interaction) | < 200ms | > 500ms | — |
| **DOM Content Loaded** | 2 365 ms | — | — | 🟡 Lent |

### Page `/fishdex` (navigation client-side depuis `/`)

| Métrique | Valeur | Statut |
|---|---|---|
| TTFB | 56 ms | ✅ |
| FCP | 1 432 ms | ✅ Bon |
| JS téléchargé | 12 KB (cache chaud) | ✅ |
| Requêtes | 26 | ✅ |

> Les pages suivantes (`/aquarium`, `/sessions`, `/profil`) nécessitent une
> authentification — non mesurables sans session active. Les métriques ci-dessus
> sont donc représentatives du premier chargement côté public.

---

## 2. Analyse du bundle JS

### Tailles des chunks principaux (non-gzip)

| Chunk | Taille | Contient | Impact |
|---|---|---|---|
| `0fou96plexfnc.js` | **237 KB** | @supabase/supabase-js + @supabase/ssr | Chargé page 1 |
| `10~x95jhs6ns3.js` | **227 KB** | Shared vendor chunk (React, routing…) | Chargé page 1 |
| `107vq_b-3xprk.js` | **198 KB** | App shell + composants partagés | Chargé page 1 |
| `16a4-qunxlyde.js` | **191 KB** | **posthog-js** | Chargé page 1 🔴 |
| `106e28ra4mk1o.js` | **123 KB** | **framer-motion** | Chargé à la demande ✅ |
| `0.wiw-_135pal.js` | **109 KB** | Composants UI / Lucide | Partagé |
| `0d3shmwh5_nmn.js` | **55 KB** | Page-level code | — |

**Total JS non-gzip : ~1.94 MB (49 chunks)**
**Total JS transféré gzip (home) : 237 KB** — raisonnable pour une SPA complète

### Ce qui est bien

- `html2canvas` (250 KB) : dynamic import au clic ✅
- `browser-image-compression` : chargé uniquement à l'upload ✅
- `framer-motion` : isolé dans son propre chunk ✅
- Fonts via `next/font/google` (self-hosted) ✅

---

## 3. Network — Page `/` (40 requêtes, 464 KB total)

| Ressource | Taille (gzip) | Durée | Type | Problème |
|---|---|---|---|---|
| `favicon.svg` | **95 KB** | 336 ms | SVG | 🔴 CRITIQUE |
| Chunk supabase | 71 KB | 435 ms | JS | Normal |
| Chunk app shell | 63 KB | 277 ms | JS | Normal |
| Font Outfit woff2 | 48 KB | 353 ms | Font | Normal |
| Font Inter woff2 | 32 KB | 328 ms | Font | Normal |
| Chunk vendor | 29 KB | 415 ms | JS | Normal |
| CSS global | 18 KB | 170 ms | CSS | Normal |
| PWA icon-192.png | 13 KB | 241 ms | PNG | Normal |

**Problème n°1 identifié ici : le favicon `favicon.svg` pèse 256 KB (95 KB gzip).**
C'est un SVG exporté depuis Illustrator avec des milliers de points de contrôle.
Il est chargé sur **chaque page, pour chaque visiteur, avant même le rendu.**

---

## 4. Problèmes identifiés — Analyse statique du code

### 🔴 Critiques

#### P1 — favicon.svg = 256 KB (non-gzip)
- **Fichier** : `public/logo/favicon.svg`
- **Référencé** : `src/app/layout.tsx:24` → `{ url: "/logo/favicon.svg", type: "image/svg+xml" }`
- **Impact** : +95 KB sur chaque page load, bloque le rendu initial
- **Fix** : Simplifier le SVG (5–10 KB max) ou utiliser un PNG/ICO optimisé

#### P2 — FCP/LCP = 2 508 ms (cible : < 1 800 ms)
- **Cause principale** : le LCP coïncide exactement avec le FCP → la page n'affiche rien
  avant que tout le JS soit chargé + hydraté (home est une page dynamique SSR)
- **Cause secondaire** : PostHog (191 KB) chargé statiquement au premier render
- **Impact** : mauvais score CWV, expérience dégradée sur mobile/connexion lente

#### P3 — PostHog chargé statiquement et globalement (191 KB)
- **Fichier** : `src/components/providers/PostHogProvider.tsx`
- **Problème** : `import posthog from 'posthog-js'` statique dans le layout root
- **Impact** : 191 KB chargés pour **chaque visiteur** y compris les non-authentifiés
- **Fix** : lazy-load via dynamic import dans `useEffect`

#### P4 — 0 `loading.tsx` / Suspense boundaries
- **Pages concernées** : toutes les pages dynamiques (aquarium, fishdex, sessions, profil…)
- **Impact** : écran blanc pendant toute la durée des requêtes Supabase (1–3 s estimé)
- **Fix** : ajouter `loading.tsx` + skeleton loaders pour chaque route majeure

### 🟡 Importants

#### P5 — 14 appels `.select('*')` — over-fetching DB
- **Fichiers** :
  - `src/app/actions/sessions.ts` : lignes 77, 121, 142, 160, 185, 212, 328 (7 fois)
  - `src/app/actions/spots.ts` : lignes 17, 34, 55, 65 (4 fois)
  - `src/app/actions/beta.ts` : lignes 130, 145 (2 fois)
  - `src/app/actions/collections.ts` : ligne 13 (1 fois)
- **Impact** : données inutiles transférées de Supabase → latence +20–40 ms par requête
- **Fix** : remplacer par des sélections explicites (`.select('id, user_id, title, …')`)

#### P6 — Requêtes séquentielles dans `fishdex/page.tsx`
- **Fichier** : `src/app/fishdex/page.tsx`
- **Pattern** :
  ```
  await getUser()           // 1
  await profiles query      // 2 (dépend de 1)
  await catches query       // 3 (dépend de 1)
  await getSpeciesForCollection()  // 4 (indépendant mais séquentiel)
  await getAllCollectionProgress() // 5 (indépendant mais séquentiel)
  ```
- **Impact** : 4 et 5 pourraient tourner en parallèle de 2 et 3 → gain ~200–400 ms
- **Fix** : `Promise.all([query2, query3, query4, query5])` après avoir le user

#### P7 — 3 balises `<img>` natifs sans `next/image`
- `src/components/capture/CaptureOverlay.tsx:134`
- `src/components/profil-v2/ProfileHero.tsx:27`
- `src/components/fishfeed/CreatePostButton.tsx:124`
- **Impact** : pas d'optimisation format (WebP/AVIF), pas de lazy-load natif, CLS potentiel

#### P8 — Images `fill={true}` sans attribut `sizes`
- `src/app/aquarium/nouvelle/CatchForm.tsx:~95`
- `src/app/fishdex/[slug]/page.tsx:~152`
- **Impact** : navigateur charge des images surdimensionnées → +50–100 KB inutiles

### 🟢 Pas de problème (déjà bien fait)

| Élément | Statut |
|---|---|
| TTFB : 83 ms | ✅ Excellent — Vercel edge fast |
| CLS : 0.000 | ✅ Parfait — aucun layout shift |
| `html2canvas` (250 KB) | ✅ Dynamic import au clic |
| Fonts : `next/font/google` | ✅ Self-hosted, pas de réseau externe |
| PostHog : `usePathname` dans provider | ✅ Pattern correct |
| N+1 queries dans FishFeed | ✅ Évitées via `.in()` |
| 90% des `use client` | ✅ Justifiés (hooks, events) |
| Images WebP pour backgrounds | ✅ Optimisées |

---

## 5. Rapport synthétique

```
═══════════════════════════════════════════════════
PERFORMANCE ACTUELLE — FishDex (2026-05-18)
═══════════════════════════════════════════════════

Lighthouse mobile estimé : ~55–65/100
  (FCP et LCP dans la zone orange tirent le score)

LCP    : 2 508 ms  🟡 Limite (cible < 2 500ms)
FCP    : 2 508 ms  🟡 Needs improvement
CLS    : 0.000     ✅ Parfait
INP    : n/a
TTFB   : 83 ms     ✅ Excellent

Bundle JS total    : ~1.94 MB (non-gzip)
  → 237 KB gzip sur la home (acceptable)
Requêtes home      : 40
Transfert total    : 464 KB
```

---

## 6. Plan d'action prioritisé

### Phase A — Quick wins (< 1h chacun, gain immédiat mesurable)

| # | Action | Fichier | Gain estimé |
|---|---|---|---|
| A1 | **Remplacer favicon.svg par un PNG optimisé** | `public/logo/favicon.svg` + `layout.tsx:24` | −95 KB/page, −200 ms LCP |
| A2 | **Lazy-load PostHog** via dynamic import dans useEffect | `PostHogProvider.tsx` | −191 KB du bundle initial |
| A3 | **Remplacer les 3 `<img>` par `<Image>`** | CaptureOverlay, ProfileHero, CreatePostButton | CLS + formats modernes |

### Phase B — Medium wins (quelques heures chacun)

| # | Action | Fichier | Gain estimé |
|---|---|---|---|
| B1 | **Ajouter `loading.tsx`** pour `/aquarium`, `/fishdex`, `/sessions`, `/profil` | `app/*/loading.tsx` | UX : supprime écrans blancs |
| B2 | **Paralléliser requêtes** dans `fishdex/page.tsx` | `fishdex/page.tsx` | −200–400 ms TTFB authentifié |
| B3 | **Remplacer `.select('*')`** dans sessions.ts (7 cas) | `actions/sessions.ts` | −20–40 ms/requête |
| B4 | **Ajouter `sizes` aux `<Image fill>`** | CatchForm, fishdex/[slug] | Moins de données images |

### Phase C — Big wins (1+ jour chacun)

| # | Action | Description | Gain estimé |
|---|---|---|---|
| C1 | **Skeleton loaders** complets | Composants skeleton pour CatchCard, FishCard, SessionCard | UX majeure |
| C2 | **`next/dynamic` pour onboarding + wrapped** | Lazy-load les composants lourds non-critiques | −100–200 KB initial |
| C3 | **Remplacer tous les `.select('*')`** | Sessions, spots, beta, collections | DB perf globale |
| C4 | **Audit complet page `/` Home** | Identifier pourquoi LCP = FCP (hydration lente ?) | Potentiel −500 ms LCP |

---

## 7. Ordre de livraison recommandé

```
Semaine 1 : A1 + A2 + A3  →  mesurer le gain LCP
Semaine 2 : B1 + B2        →  UX pages authentifiées
Semaine 3 : B3 + B4 + C2   →  perf DB + bundle
Mois 2    : C1 + C4        →  polish final
```

---

> **Note :** Relancer cet audit après chaque phase pour mesurer les gains réels.
> Sauvegarder les métriques dans ce fichier comme historique.
