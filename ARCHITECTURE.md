# FishDex — Architecture technique

Journal de pêche gamifié : capture de poissons, encyclopédie, XP, missions, badges.

---

## Stack

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI | React | 19.2.4 |
| Langage | TypeScript (strict) | 5 |
| Styling | Tailwind CSS v4 + PostCSS | 4 |
| Base de données | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth | — |
| Storage | Supabase Storage | — |
| ORM | Aucun (requêtes Supabase client directes) | — |
| Forms | React Hook Form + Zod | 7.74 / 4.4.1 |
| Animations | Framer Motion | 12.38 |
| Icônes | Lucide React | 1.14 |
| Composants UI | shadcn/ui (CVA + clsx + tailwind-merge) | — |
| Déploiement | Vercel | — |

---

## Structure des dossiers

```
src/
├── app/                          # Routeur Next.js App Router
│   ├── (auth)/                   # Groupe de routes auth (pas de segment URL)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── mot-de-passe-oublie/
│   │   └── nouveau-mot-de-passe/
│   ├── api/                      # Route Handlers (GET/POST)
│   │   ├── badges/route.ts
│   │   └── missions/route.ts
│   ├── actions/                  # Server Actions ('use server')
│   │   ├── auth.ts
│   │   ├── catches.ts
│   │   └── onboarding.ts
│   ├── aquarium/                 # Mes prises
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── nouvelle/page.tsx
│   ├── auth/callback/route.ts    # OAuth callback Supabase
│   ├── capture/page.tsx          # Scanner caméra
│   ├── fishdex/                  # Encyclopédie des espèces
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── missions/page.tsx         # Missions daily/weekly/special
│   ├── onboarding/page.tsx       # Carousel 5 écrans (first-time user)
│   ├── parametres/page.tsx       # Paramètres compte
│   ├── profil/page.tsx           # Profil utilisateur
│   ├── layout.tsx                # Layout racine (fonts, BottomNav)
│   ├── page.tsx                  # Dashboard (home)
│   └── globals.css
├── components/
│   ├── aquarium-v2/              # Composants page aquarium (actifs)
│   │   └── detail/               # Sous-composants page détail d'une capture
│   ├── badges/                   # BadgeCard, BadgesGrid
│   ├── capture/                  # Composants interface caméra
│   ├── fishdex-v2/               # Composants encyclopédie (actifs)
│   ├── missions/                 # MissionCard
│   ├── onboarding/               # Carousel + écrans Screen1…Screen5
│   ├── parametres-v2/            # Sections paramètres (actives)
│   ├── profil-v2/                # Sections profil (actives)
│   ├── shared/                   # Avatar, PageHeader, UserMenu partagés
│   ├── ui/                       # Composants shadcn/ui (button, etc.)
│   ├── BottomNavV2.tsx           # Navigation bas d'écran
│   ├── DashboardHome.tsx         # Contenu page d'accueil
│   └── LandingPage.tsx           # Page marketing (non authentifié)
├── lib/
│   ├── badges/checker.ts         # Logique déverrouillage badges
│   ├── fishdex/rarete.ts         # Ordre et config des raretés
│   ├── missions/
│   │   ├── assigner.ts           # Assignation lazy + progression missions
│   │   └── types.ts              # Types TypeScript missions
│   ├── supabase/
│   │   ├── server.ts             # Client Supabase côté serveur (cookies)
│   │   ├── client.ts             # Client Supabase côté client
│   │   └── admin.ts              # Client admin (service role key)
│   ├── xp/
│   │   ├── award.ts              # Attribution XP lors d'une capture
│   │   └── calculator.ts         # Formule niveau + titres
│   ├── proxy.ts                  # Proxy auth (middleware Next.js)
│   └── utils.ts                  # cn(), utilitaires généraux
├── types/
│   ├── aquarium.ts               # CatchWithSpecies, AquariumStats, RecordsMap
│   └── fishdex.ts                # SpeciesRow, Rarete, Eau, Regime, etc.
└── scripts/
    └── seed-tony.ts              # Peuplement BDD de test
```

---

## Routes principales

| Route | Fichier | Description | État |
|-------|---------|-------------|------|
| `/` | `app/page.tsx` | Dashboard : XP, missions, dernières prises | Done |
| `/login` | `app/(auth)/login/page.tsx` | Connexion email/password | Done |
| `/signup` | `app/(auth)/signup/page.tsx` | Création compte | Done |
| `/mot-de-passe-oublie` | `app/(auth)/mot-de-passe-oublie/page.tsx` | Reset password (envoi email) | Done |
| `/nouveau-mot-de-passe` | `app/(auth)/nouveau-mot-de-passe/page.tsx` | Saisie nouveau mot de passe | Done |
| `/onboarding` | `app/onboarding/page.tsx` | Carousel 5 écrans (first-time user) | Done |
| `/aquarium` | `app/aquarium/page.tsx` | Liste toutes les captures + stats | Done |
| `/aquarium/[id]` | `app/aquarium/[id]/page.tsx` | Détail d'une capture | Done |
| `/aquarium/nouvelle` | `app/aquarium/nouvelle/page.tsx` | Formulaire nouvelle capture | Done |
| `/fishdex` | `app/fishdex/page.tsx` | Encyclopédie 57 espèces | Done |
| `/fishdex/[slug]` | `app/fishdex/[slug]/page.tsx` | Détail d'une espèce | Done |
| `/capture` | `app/capture/page.tsx` | Scanner caméra (identification IA) | En cours |
| `/missions` | `app/missions/page.tsx` | Missions daily/weekly/special | Done |
| `/profil` | `app/profil/page.tsx` | Profil : stats, records, badges | Done |
| `/parametres` | `app/parametres/page.tsx` | Paramètres compte | Done |
| `/api/missions` | `app/api/missions/route.ts` | GET missions + progression user | Done |
| `/api/badges` | `app/api/badges/route.ts` | GET badges + état déverrouillage | Done |
| `/auth/callback` | `app/auth/callback/route.ts` | Callback OAuth Supabase | Done |

---

## Composants par page

### Home (`/`)

**Composants utilisés**
- `LandingPage` — si non authentifié
- `DashboardHome` — wrapper principal (authentifié)
- `SpotHeader` — avatar + username
- `UserProfileCard` — XP, niveau, titre
- `DailyMissionsCard` — 3 missions du jour
- `CaptureZone` / `QuickCaptureButton` — bouton action principale
- `RecentCatchCard` — carrousel 4 dernières prises

**Server Actions appelées** — aucune directement (tout fetch serveur dans `page.tsx`)

**Tables BDD consommées**
- `profiles` — username, avatar_url, onboarding_completed
- `catches` + `species` (join) — 4 dernières captures
- `user_xp` — total_xp, level, current_streak
- `user_missions` + `missions` — missions daily actives

---

### FishDex (`/fishdex`)

**Composants utilisés**
- `FishDexShell` — layout + gestion recherche/filtres côté client
- `ProgressionCard` — X/57 espèces découvertes, breakdown par rareté
- `SpeciesGrid` — grille toutes espèces
- `SpeciesCard` — espèce déjà capturée
- `SpeciesCardLocked` — espèce non découverte (silhouette `?`)
- `RarityFilters`, `SearchBar`

**Server Actions appelées** — aucune

**Tables BDD consommées**
- `species` — toutes les 57 espèces, ordonnées par `numero_dex`
- `catches` + `species` (join) — slugs découverts par l'utilisateur

---

### Aquarium (`/aquarium`)

**Composants utilisés**
- `AquariumHeader` — username, total captures
- `StatsCards` — total, espèces uniques, rares, records personnels
- `CatchesGrid` — grille avec filtres intégrés
- `CatchCard` — photo, espèce, date, poids, rareté
- `Filters` — filtre rareté + tri date
- `EmptyState` — si aucune capture

**Server Actions appelées** — aucune côté page (formulaire création : `createCatch`)

**Tables BDD consommées**
- `catches` + `species` (join) — toutes les captures de l'utilisateur
- `profiles` — username, avatar_url

---

### Profil (`/profil`)

**Composants utilisés**
- `ProfileHero` — avatar, username, pays, date inscription, niveau
- `XPCard` — barre progression XP niveau courant
- `GlobalStats` — total captures, espèces uniques, poids max, rares
- `RecordsSection` — plus lourd, plus long, plus rare
- `BadgesSection` — badges déverrouillés
- `DetailedStats` — jours pêche, spots, streak actuel/max
- `ActionsSection` — boutons actions

**Server Actions appelées** — aucune

**Tables BDD consommées**
- `profiles` — username, avatar_url, created_at
- `catches` + `species` (join) — toutes les captures (pour records + stats)
- `user_xp` — level, streaks, total_xp
- `user_badges` + `badges` (join) — badges déverrouillés

---

### Missions (`/missions`)

**Composants utilisés**
- Tabs : daily / weekly / special
- `MissionCard` — titre, description, barre progression, XP reward

**Server Actions appelées** — aucune (fetch via `/api/missions`)

**Tables BDD consommées** (via Route Handler)
- `user_missions` + `missions` (join) — par période active

---

## Server Actions disponibles

Tous les fichiers utilisent `'use server'` en tête.

### `src/app/actions/auth.ts`

```typescript
signUp(_prev: AuthState, formData: FormData): Promise<AuthState>
// Crée compte (email, password, username) + valide unicité username + insère profile

signIn(_prev: AuthState, formData: FormData): Promise<AuthState>
// Connecte l'utilisateur + redirige /onboarding si !onboarding_completed, sinon /

signOut(): Promise<void>
// Déconnecte et redirige /

requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState>
// Envoie email reset (répond toujours succès pour éviter l'énumération)

updatePassword(_prev: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState>
// Met à jour le mot de passe depuis le lien de reset
```

### `src/app/actions/catches.ts`

```typescript
createCatch(_prev: CatchState, formData: FormData): Promise<CatchState>
// Insert capture → award XP (RPC) → ensure missions → update mission progress
// Revalidate : /aquarium, /fishdex, /   →  redirect /aquarium

deleteCatch(formData: FormData): Promise<void>
// Supprime la capture (RLS garantit que seul l'owner peut)
```

### `src/app/actions/onboarding.ts`

```typescript
completeOnboarding(): Promise<void>
// SET profiles.onboarding_completed = true → redirect /
```

---

## Tables BDD avec relations

```
auth.users (Supabase Auth — géré par Supabase)
    │
    ├── profiles (1:1)
    │       id          FK → auth.users (cascade delete)
    │       username    unique, 3–20 chars
    │       avatar_url
    │       bio
    │       created_at, updated_at
    │       onboarding_completed  boolean default false
    │
    ├── catches (1:N)
    │       id            uuid PK
    │       user_id       FK → auth.users (cascade delete)
    │       species_id    FK → species (restrict delete)
    │       date_capture  date
    │       lieu          text nullable
    │       poids_kg      numeric(6,3) nullable
    │       taille_cm     numeric(6,1) nullable
    │       notes         text nullable
    │       photo_url     text nullable
    │       is_public     boolean default false
    │       created_at, updated_at
    │       variety_id    FK → varieties nullable  [À VÉRIFIER — non utilisé]
    │       mutation_id   FK → mutations nullable  [À VÉRIFIER — non utilisé]
    │
    ├── user_xp (1:1)
    │       user_id           PK FK → auth.users
    │       total_xp          integer default 0
    │       level             integer default 1
    │       current_streak    integer default 0
    │       longest_streak    integer default 0
    │       last_capture_date date nullable
    │       joker_used_week   text nullable (clé semaine ISO)
    │       vacation_mode_until date nullable
    │       vacation_days_used, vacation_year
    │
    ├── xp_events (1:N)
    │       id          uuid PK
    │       user_id     FK → auth.users
    │       catch_id    FK → catches nullable
    │       event_type  check in (capture, first_discovery, personal_record,
    │                   new_spot, photo_added, mission_completed, streak_bonus)
    │       xp_amount   integer
    │       metadata    jsonb nullable
    │       created_at
    │
    ├── user_missions (1:N)
    │       id          uuid PK
    │       user_id     FK → auth.users
    │       mission_id  FK → missions
    │       period_key  text  e.g. "daily:2025-05-13", "weekly:2025-W20"
    │       progress    integer default 0
    │       completed_at timestamptz nullable
    │       assigned_at, expires_at
    │       UNIQUE (user_id, mission_id, period_key)
    │
    └── user_badges (1:N)
            id          uuid PK
            user_id     FK → auth.users
            badge_id    FK → badges
            unlocked_at timestamptz
            UNIQUE (user_id, badge_id)

species (référentiel — 57 entrées)
    id            uuid PK
    slug          text unique
    nom_fr        text
    nom_scientifique text
    famille       text nullable
    description   text nullable
    image_url     text nullable
    eau           enum (douce, salee, saumatre)
    rarete        enum (commun, rare, epique, legendaire, shiny)
    numero_dex    integer nullable
    taille_min_cm, taille_max_cm, poids_max_kg  numeric nullable
    habitat, techniques, saison  text[] nullable
    regime        enum (carnivore, omnivore, herbivore) nullable
    profondeur    enum (surface, moyenne, fond) nullable
    created_at, updated_at

missions (référentiel — pré-peuplé)
    id          uuid PK
    slug        text unique
    type        check in (daily, weekly, special)
    title, description text
    xp_reward   integer
    target      integer default 1
    conditions  jsonb  { action, rarity?, weight_kg?, ... }
    is_active   boolean default true

badges (référentiel — 16 badges pré-peuplés)
    id            uuid PK
    slug          text unique
    category      check in (discovery, performance, regularity, hidden)
    title, description, icon, color  text
    is_hidden     boolean
    conditions    jsonb
    xp_reward     integer default 0
    display_order integer
```

### Fonctions RPC Supabase (SECURITY DEFINER)

```sql
award_xp_for_catch(p_user_id, p_catch_id, p_events, p_current_streak,
                   p_longest_streak, p_last_capture_date, p_joker_used_week)
-- Idempotent. Insert xp_events + UPSERT atomique user_xp.
-- Retourne { already_processed, xp_gained, total_xp, level }

increment_user_xp(p_user_id, p_amount)
-- UPSERT user_xp pour completion de mission.

level_from_xp(xp integer) → integer
-- floor(1 + sqrt(xp / 100))

upsert_user_xp(p_user_id, p_total_xp, p_level, p_current_streak,
               p_longest_streak, p_last_capture_date, p_joker_used_week)
-- UPSERT atomique user_xp (appelé par award_xp_for_catch).
```

---

## Variables d'environnement

| Variable | Portée | Usage |
|----------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Clé JWT publique Supabase (RLS actif) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server uniquement | Clé admin — bypass RLS, migrations, admin client |
| `AI_PROVIDER` | Server | Fournisseur IA (`mock` actuellement) |
| `NODE_ENV` | Server | `production` / `development` (URLs HTTPS vs HTTP) |

---

## Conventions de code

### Nommage des fichiers

- Pages : `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` (convention Next.js)
- Composants : PascalCase (`CatchCard.tsx`, `SpeciesGrid.tsx`)
- Utilitaires / lib : camelCase (`calculator.ts`, `assigner.ts`)
- Types : camelCase (`aquarium.ts`, `fishdex.ts`)
- Dossiers versionnés : suffixe `-v2` pour les refactos actives (`fishdex-v2/`, `profil-v2/`)

### Commits conventionnels

```
feat:      Nouvelle fonctionnalité
fix:       Correction de bug
refactor:  Réécriture sans changement de comportement
docs:      Documentation
chore:     Config, dépendances, assets
security:  Correctifs sécurité (RLS, validation)
```

### Branches Git

Branche principale : `main`. Pas de convention de branche définie à ce jour.

### Tests manuels

Pas de suite de tests automatisés à ce jour. Validation manuelle en développement local (`npm run dev`) et sur Vercel preview.

---

## Décisions architecturales clés

### Server Components par défaut

Toutes les pages de données (`/aquarium`, `/fishdex`, `/profil`, `/`) sont des Server Components. Les fetches Supabase s'exécutent côté serveur avant le rendu HTML : pas d'état de chargement client, pas de waterfall réseau depuis le navigateur, et les tokens Supabase ne transitent jamais vers le client. Les composants basculent en `'use client'` uniquement quand une interaction utilisateur est nécessaire (formulaires, filtres, carousel).

### Supabase RLS au lieu de checks manuels

Les politiques Row Level Security sont définies directement dans PostgreSQL et s'appliquent à toutes les requêtes, y compris celles contournant le code applicatif (dashboard Supabase, scripts de migration). Cela garantit l'isolation des données utilisateur même en cas de bug dans le code. Les fonctions `SECURITY DEFINER` (RPC) permettent ponctuellement de bypasser RLS pour les opérations atomiques qui nécessitent d'écrire pour le compte de l'utilisateur sans lui donner un accès direct aux tables (user_xp, xp_events).

### Pas d'ORM (Drizzle/Prisma)

Le client `@supabase/supabase-js` génère des requêtes typées à partir du schéma inféré. Ajouter un ORM aurait introduit une couche de mapping supplémentaire entre les types Supabase et les types TypeScript, avec des migrations dupliquées (ORM + Supabase migrations). Le schéma est versionné dans `supabase/migrations/` et appliqué directement via la CLI Supabase.
