# 🐟 FishDex — Features Pro & Légende

> Document de référence pour Claude Code.
> Lis ce document EN ENTIER avant de commencer.
> Applique les features dans l'ordre indiqué.
> Un commit par feature. Jamais 2 features dans le même commit.
>
> **Prompt d'initialisation à coller dans Claude Code :**
> "Lis le fichier FISHDEX_PRO_FEATURES.md à la racine du projet.
>  Applique toutes les features dans l'ordre indiqué.
>  Un commit par feature avec le message exact indiqué.
>  Lance npx tsc --noEmit avant chaque commit."

---

## 🎯 Vision produit

**GRATUIT** — Excellent pour tout le monde, donne envie de revenir.
**PRO (3,99€/mois)** — Pour le pêcheur passionné régulier.
**LÉGENDE (6,99€/mois)** — Pour le spécialiste intensif.

Règle absolue : jamais de paywall frustrant. Le gratuit doit rester complet.
Ce qu'on met derrière le payant doit être **désirable**, pas **bloquant**.

---

## 📋 Ordre d'exécution

| # | Feature | Tier | Complexité | Priorité |
|---|---|---|---|---|
| F1 | Système d'abonnement Stripe | Infrastructure | ⚡⚡⚡ | Critique |
| F2 | Calculateur taille/poids | Pro | ⚡ | Haute |
| F3 | Estimation IA par photo | Pro | ⚡⚡⚡ | Haute |
| F4 | Statistiques avancées | Pro | ⚡⚡ | Haute |
| F5 | Export sessions PDF/image | Pro | ⚡⚡ | Haute |
| F6 | Spots illimités + carte | Pro | ⚡⚡ | Moyenne |
| F7 | Notifications météo intelligentes | Pro | ⚡⚡⚡ | Moyenne |
| F8 | Wrapped annuel permanent | Pro | ⚡⚡ | Basse |
| F9 | Carte interactive des spots | Légende | ⚡⚡⚡ | Haute |
| F10 | IA reconnaissance espèces complète | Légende | ⚡⚡ | Haute |
| F11 | Analyse prédictive conditions | Légende | ⚡⚡⚡ | Moyenne |
| F12 | Journal vocal transcrit | Légende | ⚡⚡ | Basse |

---

# F1 — Système d'abonnement Stripe

**Tier** : Infrastructure (requis pour tout le reste)
**Commit** : `feat(billing): Stripe subscription system with Pro and Légende tiers`

## Contexte

Stripe est le standard pour les paiements en ligne. Intégration via `stripe` npm + webhooks Supabase.

## Migration BDD

```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT
    CHECK (subscription_tier IN ('free', 'pro', 'legende'))
    NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT
    CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing'))
    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT NULL;

-- Les comptes développeur ont accès Légende permanent
UPDATE public.profiles
SET subscription_tier = 'legende'
WHERE is_developer = TRUE;
```

## Setup Stripe

1. Créer un compte sur https://stripe.com
2. Créer 2 produits dans le dashboard Stripe :
   - **FishDex Pro** : 3,99€/mois + 29,99€/an
   - **FishDex Légende** : 6,99€/mois + 49,99€/an
3. Récupérer les Price IDs et les mettre dans `.env.local` :

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_LEGENDE_MONTHLY=price_...
STRIPE_PRICE_LEGENDE_YEARLY=price_...
```

4. `npm install stripe @stripe/stripe-js`

## Fichiers à créer

### `src/lib/stripe/client.ts`

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const PRICES = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
  legende: {
    monthly: process.env.STRIPE_PRICE_LEGENDE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_LEGENDE_YEARLY!,
  },
} as const;
```

### `src/lib/stripe/access.ts`

```typescript
import { createClient } from '@/lib/supabase/server';

type Tier = 'free' | 'pro' | 'legende';

export async function getUserTier(userId: string): Promise<Tier> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, is_developer, subscription_current_period_end')
    .eq('id', userId)
    .single();

  if (!data) return 'free';

  // Développeur = accès Légende permanent
  if (data.is_developer) return 'legende';

  // Abonnement actif ou en période d'essai
  if (
    data.subscription_status === 'active' ||
    data.subscription_status === 'trialing'
  ) {
    return (data.subscription_tier as Tier) || 'free';
  }

  // Abonnement expiré mais période encore valide
  if (
    data.subscription_current_period_end &&
    new Date(data.subscription_current_period_end) > new Date()
  ) {
    return (data.subscription_tier as Tier) || 'free';
  }

  return 'free';
}

export async function hasProAccess(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier === 'pro' || tier === 'legende';
}

export async function hasLegendeAccess(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier === 'legende';
}
```

### `src/app/actions/billing.ts`

```typescript
'use server';

import { stripe, PRICES } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';

type BillingInterval = 'monthly' | 'yearly';
type SubscriptionTier = 'pro' | 'legende';

export async function createCheckoutSession(
  tier: SubscriptionTier,
  interval: BillingInterval
): Promise<{ url: string } | { error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, username')
    .eq('id', user.id)
    .single();

  const priceId = PRICES[tier][interval];

  const session = await stripe.checkout.sessions.create({
    customer: profile?.stripe_customer_id || undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
    subscription_data: {
      trial_period_days: 7, // 7 jours d'essai gratuit
      metadata: { userId: user.id, tier },
    },
    metadata: { userId: user.id, tier },
  });

  return { url: session.url! };
}

export async function createPortalSession(): Promise<{ url: string } | { error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) return { error: 'Aucun abonnement actif' };

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return { url: session.url };
}
```

### `src/app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;
      if (!userId || !tier) break;

      await adminClient.from('profiles').update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        subscription_tier: tier,
        subscription_status: 'active',
      }).eq('id', userId);
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await adminClient.from('profiles').update({
        subscription_status: sub.status,
        subscription_current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }).eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

## Page billing `/settings/billing`

Crée `src/app/(app)/settings/billing/page.tsx` :

Structure :
1. **Tier actuel** affiché en haut (badge Free/Pro/Légende)
2. **Cards des 3 tiers** côte à côte avec liste des features
3. **Toggle Mensuel/Annuel** (annuel = 2 mois offerts)
4. **CTA "Commencer l'essai gratuit 7 jours"** sur Pro et Légende
5. **Si abonnement actif** : bouton "Gérer mon abonnement" → portail Stripe

## Composant `<ProGate>`

Crée `src/components/billing/ProGate.tsx` — wrapper pour protéger les features payantes :

```tsx
type Props = {
  requiredTier: 'pro' | 'legende';
  children: React.ReactNode;
  fallback?: React.ReactNode; // ce qu'on affiche si pas accès
};

// Si l'user a l'accès → affiche children
// Sinon → affiche fallback (ou une card "Passer à Pro" par défaut)
```

---

# F2 — Calculateur taille/poids

**Tier** : Pro
**Commit** : `feat(pro): biological size/weight calculator per species`

## Contexte

L'user entre la taille OU le poids de son poisson, l'app calcule l'autre valeur automatiquement en utilisant les ratios biologiques de chaque espèce (basés sur les données FishBase).

Formula de Le Cren (standard ichtyologique) :
`Poids = a × Taille^b` (où a et b sont des constantes par espèce)

## Migration BDD

```sql
ALTER TABLE public.species
  ADD COLUMN IF NOT EXISTS weight_formula_a FLOAT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS weight_formula_b FLOAT DEFAULT NULL;

-- Seed des constantes pour les espèces principales
-- (valeurs basées sur FishBase, formule W = a × L^b, L en cm, W en grammes)
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99
  WHERE slug = 'carpe-commune';
UPDATE public.species SET weight_formula_a = 0.0084, weight_formula_b = 3.04
  WHERE slug = 'brochet';
UPDATE public.species SET weight_formula_a = 0.0115, weight_formula_b = 3.02
  WHERE slug = 'sandre';
UPDATE public.species SET weight_formula_a = 0.0221, weight_formula_b = 2.86
  WHERE slug = 'perche-commune';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10
  WHERE slug = 'truite-fario';
UPDATE public.species SET weight_formula_a = 0.0082, weight_formula_b = 3.08
  WHERE slug = 'truite-arc-en-ciel';
UPDATE public.species SET weight_formula_a = 0.0196, weight_formula_b = 2.91
  WHERE slug = 'gardon';
UPDATE public.species SET weight_formula_a = 0.0180, weight_formula_b = 2.94
  WHERE slug = 'breme-commune';
UPDATE public.species SET weight_formula_a = 0.0210, weight_formula_b = 2.89
  WHERE slug = 'tanche';
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73
  WHERE slug = 'silure-glane';
-- Pour les espèces sans constantes : utiliser a=0.0150, b=3.00 (générique)
```

## Lib de calcul

Crée `src/lib/catches/size-weight-calculator.ts` :

```typescript
type SpeciesFormula = {
  a: number;
  b: number;
};

// Formule Le Cren : W(g) = a × L(cm)^b
export function estimateWeight(lengthCm: number, formula: SpeciesFormula): number {
  const weightGrams = formula.a * Math.pow(lengthCm, formula.b);
  return Math.round(weightGrams) / 1000; // retourne en kg, arrondi au gramme
}

export function estimateLength(weightKg: number, formula: SpeciesFormula): number {
  const weightGrams = weightKg * 1000;
  // Inverse : L = (W/a)^(1/b)
  const lengthCm = Math.pow(weightGrams / formula.a, 1 / formula.b);
  return Math.round(lengthCm * 10) / 10; // arrondi au mm
}

export function getGenericFormula(): SpeciesFormula {
  return { a: 0.015, b: 3.0 };
}

// Intervalle de confiance : ±15%
export function getConfidenceInterval(value: number): { min: number; max: number } {
  return {
    min: Math.round(value * 0.85 * 100) / 100,
    max: Math.round(value * 1.15 * 100) / 100,
  };
}
```

## UI dans le formulaire de capture

Dans le formulaire de capture, ajoute un bouton "Estimer" à côté des champs taille/poids :

```tsx
// Quand l'user entre la taille et que le poids est vide → bouton "Estimer le poids"
// Quand l'user entre le poids et que la taille est vide → bouton "Estimer la taille"

{taille && !poids && speciesFormula && (
  <button
    type="button"
    onClick={() => {
      const estimated = estimateWeight(taille, speciesFormula);
      const interval = getConfidenceInterval(estimated);
      setPoids(estimated);
      setEstimationInfo(`Estimation ±15% : ${interval.min} – ${interval.max} kg`);
    }}
    className="text-xs text-cyan-400 flex items-center gap-1"
  >
    <Wand2 className="h-3 w-3" />
    Estimer le poids
  </button>
)}

// Afficher l'info d'estimation sous le champ
{estimationInfo && (
  <p className="text-xs text-white/40 italic">{estimationInfo}</p>
)}
```

## Protection Pro

Entourer la feature avec `<ProGate requiredTier="pro">`.

---

# F3 — Estimation IA par photo

**Tier** : Pro
**Commit** : `feat(pro): AI-based size estimation from photo`

## Contexte

L'user prend une photo de son poisson AVEC une référence visible (sa main, un objet connu). L'IA (Claude Vision) analyse l'image et estime la taille du poisson en comparant avec la référence.

**Important** : toujours afficher un disclaimer "Estimation approximative ±20%. Mesure au mètre ruban pour la précision."

## Server Action

Crée `src/app/actions/ai-size-estimation.ts` :

```typescript
'use server';

import Anthropic from '@anthropic-ai/sdk';
import { hasProAccess } from '@/lib/stripe/access';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type SizeEstimationResult = {
  estimated_length_cm: number | null;
  confidence: 'high' | 'medium' | 'low';
  reference_detected: string | null; // ex: "main humaine", "règle"
  reasoning: string;
  disclaimer: string;
};

export async function estimateSizeFromPhoto(
  photoBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp',
  speciesName?: string
): Promise<SizeEstimationResult | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const isPro = await hasProAccess(user.id);
  if (!isPro) return null;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: photoBase64 },
        },
        {
          type: 'text',
          text: `Tu es expert en ichtyologie et analyse de photos.
${speciesName ? `L'espèce est : ${speciesName}.` : ''}

Analyse cette photo de poisson et estime sa taille en cm.
Cherche une référence de taille visible dans l'image : main humaine (~18-22cm),
règle, paume, corps du pêcheur, objet connu.

Réponds UNIQUEMENT en JSON :
{
  "estimated_length_cm": number ou null si impossible,
  "confidence": "high" | "medium" | "low",
  "reference_detected": "description de la référence utilisée" ou null,
  "reasoning": "explication courte de 1 phrase"
}

Si aucune référence n'est visible → estimated_length_cm: null, confidence: "low".
Ne jamais inventer une taille sans référence fiable.`,
        },
      ],
    }],
  });

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      disclaimer: 'Estimation approximative ±20%. Mesure au mètre ruban pour la précision.',
    };
  } catch {
    return null;
  }
}
```

## UI dans le formulaire de capture

Après l'upload de la photo, si l'user est Pro :

```tsx
{photoUrl && isPro && (
  <button
    type="button"
    onClick={handleEstimateSize}
    className="flex items-center gap-2 text-sm text-cyan-400"
  >
    <Ruler className="h-4 w-4" />
    Estimer la taille depuis la photo
  </button>
)}

{sizeEstimation && (
  <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="h-4 w-4 text-cyan-400" />
      <p className="text-sm font-medium text-cyan-400">Estimation IA</p>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        sizeEstimation.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
        sizeEstimation.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {sizeEstimation.confidence === 'high' ? 'Fiable' :
         sizeEstimation.confidence === 'medium' ? 'Approximatif' : 'Peu fiable'}
      </span>
    </div>

    {sizeEstimation.estimated_length_cm ? (
      <>
        <p className="text-2xl font-bold text-white">
          ~{sizeEstimation.estimated_length_cm} cm
        </p>
        {sizeEstimation.reference_detected && (
          <p className="text-xs text-white/50 mt-1">
            Référence : {sizeEstimation.reference_detected}
          </p>
        )}
        <button
          onClick={() => setTaille(sizeEstimation.estimated_length_cm)}
          className="mt-3 text-xs text-cyan-400 underline"
        >
          Utiliser cette valeur
        </button>
      </>
    ) : (
      <p className="text-sm text-white/60">
        Impossible d'estimer : aucune référence de taille visible dans la photo.
        Ajoute une règle ou montre ta main à côté du poisson.
      </p>
    )}

    <p className="text-xs text-white/30 mt-3 italic">
      {sizeEstimation.disclaimer}
    </p>
  </div>
)}
```

---

# F4 — Statistiques avancées

**Tier** : Pro
**Commit** : `feat(pro): advanced statistics dashboard`

## Route

`src/app/(app)/stats/page.tsx` — accessible via Profil → "Mes statistiques"

## Données à afficher

### Section 1 — Vue d'ensemble
- Total captures (tous les temps)
- Total espèces découvertes / 92
- Total sessions
- Durée totale pêchée (heures cumulées)
- Plus grosse prise (espèce + poids + date)

### Section 2 — Graphiques (recharts)

**Captures par mois** (12 derniers mois) — BarChart
**Espèces par collection** — PieChart (Paisibles/Prédateurs/Eaux vives)
**Répartition par rareté** — PieChart
**Évolution du niveau** (si feature niveau active) — LineChart

### Section 3 — Par espèce
Top 5 espèces les plus pêchées avec nombre de captures et record perso

### Section 4 — Par spot
Top 5 spots les plus visités avec nb captures et espèce dominante

### Section 5 — Par saison
Tableau récapitulatif : printemps/été/automne/hiver × captures/espèces/durée

### Section 6 — Streaks
Record de jours consécutifs actifs
Mois le plus actif

## Queries SQL

```sql
-- Vue des stats calculées (créer une vue pour optimiser)
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  c.user_id,
  COUNT(*) AS total_captures,
  COUNT(DISTINCT c.species_id) AS species_discovered,
  MAX(c.poids_kg) AS heaviest_catch_kg,
  MAX(c.taille_cm) AS longest_catch_cm,
  COUNT(DISTINCT c.session_id) AS sessions_with_catches,
  MIN(c.date_capture) AS first_capture_at,
  MAX(c.date_capture) AS last_capture_at
FROM public.catches c
GROUP BY c.user_id;
```

## Protection Pro

Page complète enveloppée dans `<ProGate requiredTier="pro">` avec aperçu flou du dashboard en fallback.

---

# F5 — Export sessions PDF/image

**Tier** : Pro
**Commit** : `feat(pro): session export as PDF and shareable image`

## Librairies

```bash
npm install html2canvas jspdf
```

## Fonctionnalité

Sur la page détail d'une session, bouton "Partager" → modal avec 2 options :

### Export image (carte partageable)

Format 9:16 (Instagram Story) avec :
- Photo d'ambiance en fond
- Logo FishDex en haut
- Nom du spot + date
- Stats clés (captures, espèces, plus lourd)
- Captures en grille mini
- Ressenti emoji
- Watermark "fishdex.fr"

### Export PDF

Format A4 avec :
- En-tête FishDex
- Toutes les infos de la session
- Photos des captures
- Timeline
- Notes
- Conditions météo

## Server Action

```typescript
// src/app/actions/export.ts
'use server';

import { hasProAccess } from '@/lib/stripe/access';

export async function canExportSession(userId: string): Promise<boolean> {
  return hasProAccess(userId);
}
```

## Composant export

```tsx
// src/components/sessions/SessionExport.tsx
// Composant rendu "hors écran" (position absolute, visibility hidden)
// html2canvas le capture et génère l'image/PDF
```

---

# F6 — Spots illimités

**Tier** : Pro (gratuit limité à 5 spots)
**Commit** : `feat(pro): unlimited spots for Pro users`

## Logique

```typescript
// src/lib/spots/limits.ts

export const SPOTS_FREE_LIMIT = 5;

export async function canAddSpot(userId: string): Promise<boolean> {
  const isPro = await hasProAccess(userId);
  if (isPro) return true;

  const supabase = createClient();
  const { count } = await supabase
    .from('spots')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  return (count || 0) < SPOTS_FREE_LIMIT;
}
```

Dans le formulaire de création de session, si l'user tente d'ajouter un 6e spot :

```tsx
{!canAddSpot && (
  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
    <p className="text-sm text-amber-400">
      Tu as atteint la limite de {SPOTS_FREE_LIMIT} spots en version gratuite.
    </p>
    <button onClick={() => router.push('/settings/billing')}
      className="text-xs text-cyan-400 mt-2 underline">
      Passer à Pro pour des spots illimités →
    </button>
  </div>
)}
```

---

# F7 — Notifications météo intelligentes

**Tier** : Pro
**Commit** : `feat(pro): smart weather notifications for ideal fishing conditions`

## Contexte

L'app analyse la météo des 7 prochains jours et notifie l'user quand les conditions sont idéales pour ses espèces favorites (basé sur ses captures passées et les `conditions_ideales` de chaque espèce en BDD).

## Migration BDD

```sql
CREATE TABLE public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weather_notifications BOOLEAN DEFAULT TRUE,
  preferred_species_ids UUID[] DEFAULT '{}',
  preferred_spot_ids UUID[] DEFAULT '{}',
  notification_days TEXT[] DEFAULT ARRAY['saturday', 'sunday'],
  last_notified_at TIMESTAMPTZ DEFAULT NULL
);
```

## Logique de scoring

```typescript
// src/lib/weather/fishing-score.ts

type FishingScore = {
  score: number; // 0-100
  reason: string;
  best_species: string[];
  best_time: string;
};

export function calculateFishingScore(
  weather: WeatherData,
  userCatches: Catch[],
  species: Species[]
): FishingScore {
  // Croise météo actuelle avec conditions_ideales des espèces de l'user
  // Score basé sur : température eau, vent, pression, couverture nuageuse
  // Retourne les espèces les plus susceptibles de mordre
}
```

## Notification Push (Web Push API)

```typescript
// src/app/api/notifications/send/route.ts
// Cron Vercel qui tourne le vendredi soir
// Analyse météo week-end pour chaque user Pro avec notifications activées
// Envoie une notification push personnalisée
```

Texte de notification type :
> "🎣 Ce samedi matin, conditions idéales pour le brochet à l'Étang blanc. Vent SO 12km/h, ciel couvert, température favorable."

---

# F8 — Wrapped annuel permanent

**Tier** : Pro
**Commit** : `feat(pro): permanent annual wrapped accessible year-round`

## Contexte

En version gratuite, le Wrapped est accessible uniquement en décembre et janvier.
En Pro, accessible toute l'année via Profil → "Mon Wrapped [année]".

## Route

`src/app/(app)/wrapped/[year]/page.tsx`

## Logique d'accès

```typescript
// Gratuit : accessible uniquement en décembre (12) et janvier (1)
// Pro : accessible toute l'année

const currentMonth = new Date().getMonth() + 1;
const isFreeAccessPeriod = currentMonth === 12 || currentMonth === 1;

if (!isFreeAccessPeriod && !isPro) {
  // Afficher un aperçu avec CTA "Voir ton Wrapped toute l'année avec Pro"
}
```

---

# F9 — Carte interactive des spots

**Tier** : Légende
**Commit** : `feat(legende): interactive spots map with catch history`

## Librairie

```bash
npm install leaflet react-leaflet @types/leaflet
```

Leaflet est open-source et gratuit (pas Google Maps).

## Route

`src/app/(app)/map/page.tsx` — accessible via BottomNav (6e onglet) ou Aquarium

## Features de la carte

- Tous les spots de l'user marqués sur la carte
- Au tap sur un spot : popup avec nb captures, espèces, dernière visite, record
- Clusters de marqueurs si zoom dézoomé
- Filtre par espèce / saison
- Heatmap optionnelle (zones de concentration de captures)

## Composant

```tsx
// src/components/map/SpotsMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Tiles OpenStreetMap (gratuit, pas de clé API)
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
```

## Protection Légende

Page enveloppée dans `<ProGate requiredTier="legende">`.

---

# F10 — IA reconnaissance espèces complète

**Tier** : Légende (dans le tier le moins cher = Pro selon décision)

> ⚠️ DÉCISION : l'IA reconnaissance est dans le tier **Pro** (pas Légende).
> C'est la feature "wow" qui pousse à l'abonnement Pro.
> Mettre à jour la table des tiers en conséquence.

**Commit** : `feat(pro): AI species recognition integrated in capture flow`

## Contexte

Intégration complète de l'IA iNaturalist + Claude Vision fallback dans le flow de capture.
Voir document `AMELIORATION_3_IA_RECONNAISSANCE.md` pour les détails techniques complets.

## Ce qui est différent en Pro vs gratuit

- **Gratuit** : sélection manuelle uniquement
- **Pro** : suggestions IA automatiques à chaque capture + possibilité de valider ou corriger

## Data flywheel

Chaque validation/correction en Pro alimente `ai_training_data` pour le futur modèle DIY (voir PROMPTS_H4.md, S4.2).

---

# F11 — Analyse prédictive conditions

**Tier** : Légende
**Commit** : `feat(legende): predictive fishing analysis based on history and weather`

## Contexte

Combine l'historique de captures de l'user + météo prévue + données biologiques pour prédire les meilleures fenêtres de pêche.

## Logique

```typescript
// src/lib/predictions/fishing-predictor.ts

type Prediction = {
  date: string;
  score: number; // 0-100
  best_species: Array<{
    species: string;
    probability: number;
    conditions_match: string;
  }>;
  best_window: string; // ex: "Matin, 6h-9h"
  reasoning: string;
};

export async function predictFishingWindows(
  userId: string,
  spotId: string,
  forecastDays: number = 7
): Promise<Prediction[]> {
  // 1. Récupère l'historique de captures sur ce spot
  // 2. Récupère la prévision météo 7 jours
  // 3. Croise avec les conditions_ideales des espèces historiquement capturées
  // 4. Score chaque jour/créneau
  // 5. Génère un texte explicatif via Claude Haiku (coût ~0.001€/prédiction)
}
```

## UI

Sur la page détail d'un spot, section "Prochaines fenêtres" :

```
📅 Samedi 24 mai — Score 87/100
   🌥️ Couvert · 14°C · Vent SO 12km/h
   → Brochet (85%), Sandre (70%)
   → Meilleure fenêtre : 6h-9h
   "Conditions idéales : pression stable et ciel couvert favorisent l'activité des carnassiers."
```

---

# F12 — Journal vocal transcrit

**Tier** : Légende
**Commit** : `feat(legende): voice notes with AI transcription for sessions`

## Contexte

Pendant une session, l'user peut enregistrer des notes vocales. L'app les transcrit automatiquement via l'API Whisper d'OpenAI et les ajoute aux notes de la session.

## Librairie

L'API Web MediaRecorder est native dans les navigateurs modernes. Pas de lib nécessaire.

## Server Action

```typescript
// src/app/actions/transcription.ts
'use server';

import OpenAI from 'openai';
import { hasLegendeAccess } from '@/lib/stripe/access';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeVoiceNote(
  audioBase64: string,
  mimeType: string
): Promise<{ text: string } | { error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié' };

  const isLegende = await hasLegendeAccess(user.id);
  if (!isLegende) return { error: 'Feature Légende' };

  const buffer = Buffer.from(audioBase64, 'base64');
  const file = new File([buffer], 'note.webm', { type: mimeType });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'fr',
  });

  return { text: transcription.text };
}
```

## Coût estimé

Whisper : ~0,006€/minute audio. Une note vocale de 30s = ~0,003€. Négligeable.

## UI

Dans la page session active, bouton micro à côté du champ notes :

```tsx
{isLegende && (
  <button onClick={toggleRecording} className="...">
    {isRecording
      ? <MicOff className="h-5 w-5 text-red-400 animate-pulse" />
      : <Mic className="h-5 w-5 text-cyan-400" />
    }
  </button>
)}
```

---

# VÉRIFICATIONS FINALES

Après avoir implémenté toutes les features :

```bash
npx tsc --noEmit
npm run build
```

**Checklist manuelle** :
- [ ] User gratuit : ne voit pas les features Pro/Légende (ou les voit avec ProGate)
- [ ] User Pro : accès calculateur, estimation IA, stats, export, spots illimités, météo, IA reconnaissance
- [ ] User Légende : tout le Pro + carte, prédictions, journal vocal
- [ ] Développeur : accès Légende permanent sans paiement
- [ ] Webhook Stripe : abonnement activé → tier mis à jour en BDD
- [ ] Abonnement annulé → tier repassé à free après fin période
- [ ] Essai gratuit 7 jours fonctionnel

**Tests de paiement Stripe** :
- Utiliser la carte test `4242 4242 4242 4242` (toujours acceptée)
- Vérifier les webhooks dans le dashboard Stripe (Events)

---

## Ordre des commits attendus

1. `feat(billing): Stripe subscription system with Pro and Légende tiers`
2. `feat(pro): biological size/weight calculator per species`
3. `feat(pro): AI-based size estimation from photo`
4. `feat(pro): advanced statistics dashboard`
5. `feat(pro): session export as PDF and shareable image`
6. `feat(pro): unlimited spots for Pro users`
7. `feat(pro): smart weather notifications for ideal fishing conditions`
8. `feat(pro): permanent annual wrapped accessible year-round`
9. `feat(legende): interactive spots map with catch history`
10. `feat(pro): AI species recognition integrated in capture flow`
11. `feat(legende): predictive fishing analysis based on history and weather`
12. `feat(legende): voice notes with AI transcription for sessions`

---

*FishDex Pro & Légende — Chaque feature doit justifier son prix par sa valeur réelle, jamais par la frustration du gratuit.*
