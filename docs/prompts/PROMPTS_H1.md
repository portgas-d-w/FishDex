# 🟡 FishDex — Prompts Claude Code · Phase H1 PIVOT VISION SOFT

> Prompts opérationnels pour la phase de pivot DA contemplative.
>
> **⚠️ PRÉREQUIS H0** : tous les items de PROMPTS_H0.md doivent être ✅ avant de commencer.
>
> Estimation : 4-5 semaines de travail effectif.

---

## 📋 Ordre d'exécution recommandé

1. **S1.1** Renommage Shiny → Mirage (préparatoire BDD)
2. **S1.2** BottomNav 5 onglets (UI globale)
3. **S1.3** Niveau & Maîtrises (système gamification subtile)
4. **S1.4** Home immersif (LA grosse pièce H1)
5. **S1.5** FishDex détail enrichi (préparation H2.5)
6. **S1.6** Icônes & assets H1 (finitions visuelles)

**Ne pas paralléliser.** 1 S à la fois, commit entre chaque, test visuel obligatoire.

---

# 🟡 PROMPT S1.1 — Renommage Shiny → Mirage

**Format compact. Refactor simple mais touche à la BDD.**

---PROMPT---

CONTEXTE — Renommage de la rareté "shiny" en "mirage"

Décision stratégique : on abandonne "shiny" (trop gaming Pokémon) au profit de "mirage" (poétique, ADN contemplatif FishDex).

ÉTAPE 1 — AUDIT
grep -r "shiny" src/ → liste tous les fichiers concernés
grep -r "shiny" supabase/ → migrations existantes

Présente-moi la liste avant d'agir.

ÉTAPE 2 — MIGRATION SQL
Crée une migration `supabase/migrations/[timestamp]_rename_shiny_to_mirage.sql` :

ALTER TABLE public.species
DROP CONSTRAINT IF EXISTS species_rarete_check;

UPDATE public.species
SET rarete = 'mirage'
WHERE rarete = 'shiny';

ALTER TABLE public.species
ADD CONSTRAINT species_rarete_check
CHECK (rarete IN ('commun', 'peu commun', 'rare', 'epique', 'legendaire', 'mirage'));

ÉTAPE 3 — REFACTOR TYPESCRIPT
Pour chaque fichier identifié à l'étape 1 :
- Remplace 'shiny' par 'mirage' dans les types
- Remplace dans les composants UI
- Remplace dans les utils/helpers
- Mets à jour les labels d'affichage : "Shiny" → "Mirage"

ÉTAPE 4 — EFFET VISUEL PREMIUM
Vérifie que l'effet visuel actuel (gradient amber→pink→purple animé shimmer) est CONSERVÉ pour la rareté "mirage". On change juste le nom, pas le visuel.

ÉTAPE 5 — TESTS
- `npx tsc --noEmit` doit passer
- `npm run dev` puis ouvre une page qui affiche des espèces mirage
- L'effet visuel doit toujours être présent
- L'affichage doit dire "Mirage" pas "Shiny"

ÉTAPE 6 — COMMIT
"refactor(species): rename rarity shiny to mirage"

---PROMPT---

---

# 🟡 PROMPT S1.2 — BottomNav 5 onglets

**Format compact. UI seulement.**

---PROMPT---

CONTEXTE — Refonte BottomNav vers 5 onglets

Nouvelle structure : Le Spot / FishDex / Capture (FAB central) / Aquarium / Sessions

Le profil n'est PLUS dans la BottomNav (accessible via avatar header déjà en place).

ÉTAPE 1 — AUDIT
Lis le composant actuel : src/components/layout/BottomNav.tsx (ou nom équivalent).

Vérifie aussi :
- Comment l'app gère le routing actuel
- Si Sessions n'existe pas encore comme route → on créera une page placeholder

ÉTAPE 2 — STRUCTURE CIBLE

Onglets dans l'ordre, gauche à droite :

| Onglet | Route | Icône Lucide | État |
|---|---|---|---|
| Le Spot | / | MapPin | Active |
| FishDex | /fishdex | Book | Active |
| Capture | /capture | Camera (dans FAB) | FAB central cyan glow |
| Aquarium | /aquarium | Fish | Active |
| Sessions | /sessions | Calendar | Placeholder H1 |

ÉTAPE 3 — IMPLÉMENTATION

1. Refactor BottomNav.tsx :
   - 5 items, layout flex justify-around
   - Capture = bouton flottant CENTRAL :
     • Position absolute, légèrement surélevé (-top-4 par ex)
     • Cercle cyan #22d3ee avec glow effect (shadow-[0_0_20px_rgba(34,211,238,0.5)])
     • Icône Camera blanche au centre
   - 4 autres items = boutons normaux avec icône + label en dessous
   - État actif : couleur cyan #22d3ee + label cyan, label-only sinon

2. Pour Sessions (placeholder H1) :
   - Crée /src/app/(app)/sessions/page.tsx
   - Contenu : page propre avec illustration + texte "Bientôt disponible — Le carnet vivant de tes sorties"
   - Pas de 404, pas de stub vide
   - Style contemplatif (background sombre, texte gris doux)

ÉTAPE 4 — RESPONSIVE
- Mobile : BottomNav fixed bottom, h-16 ou h-20
- Desktop : à voir selon ton layout actuel (sidebar ou bottom ?)
- Garde la cohérence avec le reste de l'app

ÉTAPE 5 — TESTS
- `npx tsc --noEmit`
- Test visuel sur mobile + desktop
- Cliquer sur chaque onglet → bonne page
- Sessions placeholder s'affiche proprement
- FAB Capture clique bien et navigue

ÉTAPE 6 — COMMIT
"feat(nav): refactor BottomNav with 5 tabs + Capture FAB"

⚠️ Le FAB Capture doit être visuellement DOMINANT mais pas écrasant
⚠️ Ne pas casser les routes existantes
⚠️ Garder l'UserMenu avatar dans le header (pas dans BottomNav)

---PROMPT---

---

# 🟡 PROMPT S1.3 — Système Niveau & Maîtrises

**Format détaillé. Touche aux mécaniques de gamification subtile.**

**⚠️ Préalable** : S0.1 (fix XP) doit être validé. Ce système se construit dessus.

---PROMPT---

CONTEXTE — Système Niveau & Maîtrises

Le système XP est fixé en H0. Maintenant on construit dessus :
- Niveaux 1-50 avec 8 titres émotionnels
- Système Maîtrises infini après niveau 50
- Rendements décroissants invisibles (anti-farm)
- IMPORTANT : le niveau reste SECONDAIRE dans l'UI (ADN contemplatif, pas gaming)

═══════════════════════════════════════════
ÉTAPE 1 — TITRES PAR NIVEAU
═══════════════════════════════════════════

Crée `src/lib/levels/titles.ts` :

export type LevelTier = {
  range: [number, number]; // [min, max]
  title: string;
};

export const LEVEL_TITLES: LevelTier[] = [
  { range: [1, 5],   title: 'Débutant' },
  { range: [6, 10],  title: 'Pêcheur' },
  { range: [11, 15], title: 'Amateur' },
  { range: [16, 20], title: 'Explorateur' },
  { range: [21, 30], title: 'Traqueur' },
  { range: [31, 40], title: 'Spécialiste' },
  { range: [41, 49], title: 'Expert' },
  { range: [50, 50], title: 'Légende' },
];

export function getTitleForLevel(level: number): string {
  if (level > 50) return 'Légende'; // après 50, toujours Légende + Maîtrises
  const tier = LEVEL_TITLES.find(t => level >= t.range[0] && level <= t.range[1]);
  return tier?.title ?? 'Débutant';
}

═══════════════════════════════════════════
ÉTAPE 2 — FONCTION SQL : RENDEMENTS DÉCROISSANTS
═══════════════════════════════════════════

Crée migration `supabase/migrations/[timestamp]_diminishing_returns.sql` :

CREATE OR REPLACE FUNCTION public.apply_diminishing_returns(
  base_xp INTEGER,
  user_id_param UUID,
  capture_date DATE
) RETURNS INTEGER AS $$
DECLARE
  captures_today INTEGER;
  multiplier NUMERIC;
BEGIN
  SELECT COUNT(*) INTO captures_today
  FROM public.catches
  WHERE user_id = user_id_param
    AND DATE(date_capture) = capture_date;

  multiplier := CASE
    WHEN captures_today = 0 THEN 1.0  -- première du jour
    WHEN captures_today = 1 THEN 0.8
    WHEN captures_today = 2 THEN 0.6
    ELSE 0.4
  END;

  RETURN FLOOR(base_xp * multiplier);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

═══════════════════════════════════════════
ÉTAPE 3 — INTÉGRATION DANS LE FLOW CAPTURE
═══════════════════════════════════════════

Trouve la Server Action qui crée une capture (probablement src/app/actions/catches.ts).

Avant d'écrire xp_events, appelle la nouvelle fonction :

const { data: adjustedXp } = await supabase.rpc('apply_diminishing_returns', {
  base_xp: calculateBaseXp(species, hasPhoto, isNewSpecies),
  user_id_param: userId,
  capture_date: new Date().toISOString().split('T')[0],
});

// adjustedXp est le XP à inscrire dans xp_events (et qui sera ensuite ajouté à user_xp via le trigger fixé en H0)

═══════════════════════════════════════════
ÉTAPE 4 — MAÎTRISES (niveau 50+)
═══════════════════════════════════════════

Crée `src/lib/levels/masteries.ts` :

export type MasteryTier = 'Initié' | 'Rare' | 'Épique' | 'Légendaire' | 'Mirage';
export type MasteryRank = 'I' | 'II' | 'III' | 'IV' | 'V';

const MASTERY_XP_THRESHOLD = 1000; // 1 point Maîtrise par 1000 XP après level 50

const TIER_THRESHOLDS = {
  'Initié': { min: 1, max: 25 },        // 1-25 points
  'Rare': { min: 26, max: 75 },          // 26-75
  'Épique': { min: 76, max: 200 },       // 76-200
  'Légendaire': { min: 201, max: 500 },  // 201-500
  'Mirage': { min: 501, max: Infinity },
};

export function getMasteriesAfterLevel50(totalXp: number, xpForLevel50: number) {
  if (totalXp < xpForLevel50) return null;

  const xpAfter50 = totalXp - xpForLevel50;
  const masteryPoints = Math.floor(xpAfter50 / MASTERY_XP_THRESHOLD);

  if (masteryPoints === 0) return null;

  // Détermine le tier actuel
  const tier = Object.entries(TIER_THRESHOLDS).find(
    ([_, range]) => masteryPoints >= range.min && masteryPoints <= range.max
  )?.[0] as MasteryTier | undefined;

  if (!tier) return null;

  // Détermine le rang dans le tier (I, II, III, IV, V)
  const tierRange = TIER_THRESHOLDS[tier];
  const tierProgress = masteryPoints - tierRange.min;
  const tierSize = tierRange.max - tierRange.min + 1;
  const rankIndex = Math.min(4, Math.floor((tierProgress / tierSize) * 5));
  const rank: MasteryRank = ['I', 'II', 'III', 'IV', 'V'][rankIndex];

  return { tier, rank, totalPoints: masteryPoints };
}

═══════════════════════════════════════════
ÉTAPE 5 — UI PROFIL (DISCRET, PAS GAMING)
═══════════════════════════════════════════

Dans la page Profil (src/app/(app)/profil/page.tsx), refonte la section "Progression" :

PRINCIPE DESIGN :
- Le titre ("Traqueur") en grand
- Le niveau en chiffre PLUS PETIT en dessous
- Pas d'animations spectaculaires
- Pas de barre XP voyante (juste une fine barre subtile cyan)
- Si niveau 50+ : afficher en plus la Maîtrise (ex: "Maîtrise Rare III")

Composant à créer : src/components/profile/LevelDisplay.tsx

<div className="space-y-1">
  <p className="text-2xl font-semibold tracking-tight">{title}</p>
  <p className="text-sm text-muted-foreground">Niveau {level}</p>
  {mastery && (
    <p className="text-xs text-cyan-400 font-medium">
      Maîtrise {mastery.tier} {mastery.rank}
    </p>
  )}
  <div className="mt-2 h-1 w-full rounded-full bg-white/5">
    <div
      className="h-full rounded-full bg-cyan-500/60"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>

═══════════════════════════════════════════
ÉTAPE 6 — RÈGLES STRICTES UI
═══════════════════════════════════════════

⚠️ NE PAS afficher le niveau en gros chiffre sur l'avatar
⚠️ NE PAS afficher "+10 XP" en gros sur les écrans de capture/session
⚠️ Toast subtil OK ("+10 XP" en discret en haut), pas d'animation confetti
⚠️ Sessions et Aquarium : pas d'XP visible (sinon ça devient gaming)
⚠️ Profil = SEUL endroit où le niveau est affiché clairement

═══════════════════════════════════════════
ÉTAPE 7 — TESTS
═══════════════════════════════════════════

TEST 1 : Capture 1 = XP plein (1.0x)
TEST 2 : Capture 2 même jour = 80% XP (0.8x)
TEST 3 : Capture 4+ même jour = 40% XP (0.4x)
TEST 4 : Reset minuit = retour à 1.0x le lendemain
TEST 5 : Niveau 50 atteint → affichage Maîtrise commence

═══════════════════════════════════════════
ÉTAPE 8 — COMMIT
═══════════════════════════════════════════

`npx tsc --noEmit`
Commit : "feat(levels): titles, masteries and diminishing returns"

---PROMPT---

---

# 🟡 PROMPT S1.4 — Home immersif (gros chantier)

**Format détaillé. C'est LA grosse pièce de H1.**

**Préalable** : avoir le fichier `HOME_POETIC_PHRASES.md` à portée de main. Le contenu sera intégré.

---PROMPT---

CONTEXTE — Refonte Home immersive 75% hero + UI minimal

Vision validée : le Home est désormais 75% photo hero cinématique + UI minimal superposé.
Référence : Apple Weather, Apple Health. Pas de dashboard de modules empilés.

═══════════════════════════════════════════
ÉTAPE 1 — STRUCTURE GÉNÉRALE
═══════════════════════════════════════════

Refonte de la route racine du Home. Probablement src/app/(app)/page.tsx (le Spot V2 actuel devient le Home).

Structure cible :

┌─────────────────────────────┐
│  Status bar (iOS)           │
├─────────────────────────────┤
│  [bell]              [avatar]│  ← header transparent
│                              │
│                              │
│      HERO PHOTO (75%)        │
│                              │
│                              │
│                              │
│  JEUDI 14 AVRIL · AUBE       │  ← caption cyan
│  Bonjour Alexandre.          │  ← grand titre serif
│  Le lac s'éveille...         │  ← phrase poétique italique
│  12° · brume · vent NE       │  ← météo inline
│           ↓                  │  ← chevron scroll
├─────────────────────────────┤
│  Section "AUJOURD'HUI"       │  ← début scrollable
│  Card session active...      │
│  ...                         │
└─────────────────────────────┘

═══════════════════════════════════════════
ÉTAPE 2 — PHRASES POÉTIQUES CONTEXTUELLES
═══════════════════════════════════════════

Crée `src/lib/home/poetic-phrases.ts`.

Tu vas avoir besoin du document HOME_POETIC_PHRASES.md (situé dans docs/).

Structure du fichier :

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type LightPhase = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night';
export type Weather = 'clear' | 'cloudy' | 'rainy' | 'foggy' | 'snowy';

export type Context = {
  season: Season;
  light: LightPhase;
  weather: Weather;
};

// IMPORTANT : copie les 60 phrases du fichier HOME_POETIC_PHRASES.md
// dans la structure ci-dessous, organisées par clé "season-light-weather"
const PHRASES_LIBRARY: Record<string, string[]> = {
  'spring-dawn-foggy': [
    "Le lac s'éveille. La brume hésite encore.",
    "Premier souffle du jour. L'eau respire.",
    "La rivière sort doucement de la nuit.",
    "Tout est encore tu. Même les oiseaux.",
  ],
  // ... etc, pour toutes les combinaisons listées dans HOME_POETIC_PHRASES.md

  // Fallback
  default: [
    "L'eau t'attend.",
    "Belle journée pour une session.",
    "Le monde vivant respire.",
    "Chaque sortie est un souvenir à venir.",
    "L'instant présent, c'est déjà beaucoup.",
  ],
};

export function getPoetricPhrase(context: Context, userId: string): string {
  const key = `${context.season}-${context.light}-${context.weather}`;
  const phrases = PHRASES_LIBRARY[key] || PHRASES_LIBRARY.default;

  // Phrase stable pour la journée (pas de changement à chaque refresh)
  const today = new Date().toISOString().split('T')[0];
  const seed = `${userId}-${today}-${key}`;
  const hash = hashString(seed);
  const index = hash % phrases.length;

  return phrases[index];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

═══════════════════════════════════════════
ÉTAPE 3 — HELPER CONTEXT (saison + lumière + météo)
═══════════════════════════════════════════

Crée `src/lib/home/context.ts` :

import { Season, LightPhase, Weather, Context } from './poetic-phrases';

export function getCurrentContext(): Context {
  const now = new Date();
  return {
    season: getSeason(now),
    light: getLightPhase(now),
    weather: 'clear', // placeholder H1, remplacé par API météo en H3
  };
}

function getSeason(date: Date): Season {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getLightPhase(date: Date): LightPhase {
  const hour = date.getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'dusk';
  return 'night';
}

export function getReadableLightPhase(phase: LightPhase): string {
  const map = {
    dawn: 'AUBE',
    morning: 'MATIN',
    midday: 'MIDI',
    afternoon: 'APRÈS-MIDI',
    dusk: 'CRÉPUSCULE',
    night: 'NUIT',
  };
  return map[phase];
}

export function getReadableDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).toUpperCase();
}

═══════════════════════════════════════════
ÉTAPE 4 — COMPOSANT HOME
═══════════════════════════════════════════

Refonte de src/app/(app)/page.tsx (ou src/app/page.tsx selon ton routing) :

import { getPoetricPhrase, type Context } from '@/lib/home/poetic-phrases';
import { getCurrentContext, getReadableLightPhase, getReadableDate } from '@/lib/home/context';
// imports session, captures, spots actions...

export default async function HomePage() {
  const user = await getCurrentUser();
  const context = getCurrentContext();
  const phrase = getPoetricPhrase(context, user.id);
  const activeSession = await getActiveSession(user.id);
  const recentCatches = await getRecentCatches(user.id, 4);
  const favoriteSpots = await getFavoriteSpots(user.id, 2);

  return (
    <main className="relative min-h-screen">
      {/* HERO ZONE 75vh */}
      <section className="relative h-[75vh] overflow-hidden">
        {/* Background photo (statique en H1) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }}
        />
        {/* Overlay gradient sombre en bas pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

        {/* Header transparent */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <NotificationBell />
          <UserAvatar />
        </div>

        {/* Greeting positionné en bas du hero */}
        <div className="absolute bottom-12 left-6 right-6 z-10 space-y-2">
          <p className="text-xs font-medium tracking-widest text-cyan-400">
            {getReadableDate(new Date())} · {getReadableLightPhase(context.light)} · {formatTime(new Date())}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Bonjour {user.firstName}.
          </h1>
          <p className="text-base italic text-white/80">
            {phrase}
          </p>
          <p className="text-sm text-white/60">
            12° · brume légère · vent NE 6 km/h
          </p>
        </div>

        {/* Chevron scroll subtil */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/40" />
        </div>
      </section>

      {/* CONTENU SCROLLABLE SOUS LE PLI */}
      <section className="px-4 py-8 space-y-8">
        {/* AUJOURD'HUI */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest text-white/40 mb-4">
            AUJOURD'HUI
          </h2>
          {activeSession ? (
            <ActiveSessionCard session={activeSession} />
          ) : (
            <StartSessionCard />
          )}
        </div>

        {/* DERNIÈRES PRISES */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest text-white/40 mb-4">
            DERNIÈRES PRISES
          </h2>
          <RecentCatchesCarousel catches={recentCatches} />
        </div>

        {/* TES SPOTS FAVORIS */}
        <div>
          <h2 className="text-xs font-semibold tracking-widest text-white/40 mb-4">
            TES SPOTS FAVORIS
          </h2>
          <FavoriteSpotsGrid spots={favoriteSpots} />
        </div>

        {/* CONSEIL DU JOUR */}
        <DailyAdviceCard context={context} />
      </section>
    </main>
  );
}

═══════════════════════════════════════════
ÉTAPE 5 — BACKGROUND H1 (placeholder)
═══════════════════════════════════════════

Pour H1, utilise UN SEUL background statique :
- Place le fichier dans `public/backgrounds/home-default.webp`
- Photo : lac brumeux à l'aube, cinématique
- Si tu n'as pas encore d'image : utilise un placeholder Unsplash temporaire
  (par ex. https://images.unsplash.com/photo-1500382017468-9049fed747ef)

En H3, on remplacera par un système 8 photos selon contexte (séquencé plus tard).

═══════════════════════════════════════════
ÉTAPE 6 — COMPOSANTS À CRÉER
═══════════════════════════════════════════

Crée ces composants au passage (peuvent être des stubs minimalistes pour H1) :

- src/components/home/NotificationBell.tsx
- src/components/home/UserAvatar.tsx (réutilise l'UserMenu existant)
- src/components/home/ActiveSessionCard.tsx
- src/components/home/StartSessionCard.tsx
- src/components/home/RecentCatchesCarousel.tsx
- src/components/home/FavoriteSpotsGrid.tsx
- src/components/home/DailyAdviceCard.tsx

Stubs OK pour H1, on enrichira en H2/H3. Évite juste les "TODO" qui pètent l'expérience.

═══════════════════════════════════════════
ÉTAPE 7 — TESTS
═══════════════════════════════════════════

TEST 1 : Hero photo couvre 75% de l'écran
TEST 2 : Phrase change selon l'heure (relance plusieurs fois à différentes heures simulées)
TEST 3 : Phrase stable dans la même journée (refresh ne change pas la phrase)
TEST 4 : Scroll fluide sous le pli
TEST 5 : Si pas de session active → CTA "Démarrer une session" visible
TEST 6 : Si session active → carte session avec durée affichée

═══════════════════════════════════════════
ÉTAPE 8 — COMMIT
═══════════════════════════════════════════

`npx tsc --noEmit`
Commit : "feat(home): immersive 75vh hero with contextual poetic phrases"

⚠️ NE PAS afficher de XP, de gain, de badge, de notification gaming sur le Home
⚠️ Le Home doit transmettre du CALME, pas de l'agitation
⚠️ La photo hero est SACRÉE — qu'elle respire, ne la noie pas sous des cards

---PROMPT---

---

# 🟡 PROMPT S1.5 — FishDex détail enrichi (préparation H2.5)

**Format compact. UI uniquement, BDD inchangée.**

---PROMPT---

CONTEXTE — Enrichir la fiche détail espèce (préparation H2.5)

Sans changer la BDD, on enrichit visuellement la fiche détail espèce pour qu'elle ressemble au mockup batch 2 image 3 (Truite Fario).

ÉTAPE 1 — AUDIT
Lis la page actuelle de détail espèce (src/app/(app)/fishdex/[slug]/page.tsx ou équivalent).

ÉTAPE 2 — STRUCTURE CIBLE

1. Hero photo (illustration de l'espèce sur fond cinématique aquatique)
2. Badge rareté + numéro dex (placeholder #001 si pas encore par collection)
3. Nom commun + nom scientifique
4. Description courte (texte champ description de species)
5. 4 stats clés en row : Taille moyenne / Poids moyen / Longévité / Régime
6. Bloc "Habitat naturel" avec photo habitat + texte
7. Bloc "Activité" : 3 lignes (Moment / Météo / Saison) avec icônes actives
8. Bloc "Conseils de pêche" : zone éditoriale + image leurre (si présente)
9. Bloc "Vos captures" : compteur + carrousel mini-cards + record perso
10. Bloc "Variantes rares" placeholder pour H2.5 (juste un texte "Variantes à venir")

ÉTAPE 3 — UI ÉLÉMENTS

- Glassmorphism cards (bg-white/5, backdrop-blur, border-white/10, rounded-2xl)
- Icônes Lucide cohérentes (Ruler, Weight, Hourglass, Utensils...)
- Couleurs raretés respectées dans le badge
- Hero photo full-width 200-300px hauteur, gradient overlay en bas

ÉTAPE 4 — DONNÉES PLACEHOLDER

Pour les blocs qui n'ont pas encore de données BDD (variantes, conseils éditoriaux complets) :
- Ne pas inventer
- Afficher "À venir" ou cacher le bloc si vide
- Pas de Lorem Ipsum

ÉTAPE 5 — COMPOSANT SPECIESPLACEHOLDER

Pour les espèces sans illustration (image_url null) :
Crée src/components/species/SpeciesPlaceholder.tsx :

<div className={`rounded-2xl bg-gradient-to-br ${rarityGradient}`}>
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
    {/* Silhouette générique de poisson */}
    <path d="M 20 50 Q 30 30, 50 30 T 80 50 T 50 70 T 20 50 Z" fill="white" />
  </svg>
</div>

Avec rarityGradient calculé selon species.rarete :
- commun → from-emerald-900/40 to-emerald-700/20
- rare → from-blue-900/40 to-blue-700/20
- mirage → from-amber-500/30 via-pink-500/30 to-purple-700/30 + shimmer

Utiliser ce composant comme fallback partout où image_url est null.

ÉTAPE 6 — TESTS
- Visiter plusieurs fiches d'espèces (commun, rare, mirage)
- Vérifier responsive mobile + desktop
- Espèces sans image → placeholder s'affiche

ÉTAPE 7 — COMMIT
"feat(fishdex): enrich species detail page + add SpeciesPlaceholder fallback"

---PROMPT---

---

# 🟡 PROMPT S1.6 — Icônes & assets H1

**Format compact. Finitions visuelles.**

---PROMPT---

CONTEXTE — Création des assets visuels H1

Petits assets SVG à créer pour la cohérence visuelle.

ÉTAPE 1 — ICÔNE MIRAGE (étoile 8 branches avec shimmer)

Crée `public/icons/rarities/mirage.svg` :

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
  <path d="M12 5 L13 11 L19 12 L13 13 L12 19 L11 13 L5 12 L11 11 Z" opacity="0.5" />
</svg>

Et dans Tailwind config, ajoute une animation shimmer :

animation: {
  shimmer: 'shimmer 3s ease-in-out infinite',
},
keyframes: {
  shimmer: {
    '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
    '50%': { opacity: 1, transform: 'scale(1.05)' },
  },
}

À appliquer dans les badges Mirage : className="animate-shimmer"

ÉTAPE 2 — VÉRIFIE COHÉRENCE LUCIDE

Vérifie que toutes les icônes utilisées dans le projet viennent de lucide-react (pas d'emoji random pour des actions UI). Si tu trouves des emojis utilisés là où il faut des icônes (boutons, BottomNav, etc.), remplace par Lucide.

Garder les emojis OK pour :
- Ressentis emoji (futur Sessions)
- Intentions (futur Sessions)
- Réactions FishFeed (futur H4.5)

ÉTAPE 3 — GRADIENT GLOW SUR FAB CAPTURE

Vérifie que le bouton Capture du BottomNav a un effet glow cohérent. Sinon ajoute :

className="shadow-[0_0_30px_rgba(34,211,238,0.6)] ring-2 ring-cyan-400/30"

ÉTAPE 4 — COMMIT
"feat(assets): add Mirage SVG icon + shimmer animation + Lucide cleanup"

---PROMPT---

---

# ✅ CHECKLIST FINALE H1 — avant de passer à H2

- [ ] **S1.1 — Mirage rename** : Shiny → Mirage en BDD + code
- [ ] **S1.2 — BottomNav** : 5 onglets + FAB Capture central
- [ ] **S1.3 — Niveau & Maîtrises** : titres + rendements + UI discrète
- [ ] **S1.4 — Home immersif** : 75vh hero + phrases poétiques + scrollable
- [ ] **S1.5 — FishDex détail** : fiche enrichie + SpeciesPlaceholder
- [ ] **S1.6 — Assets H1** : icône Mirage + animation shimmer

**Tests obligatoires :**
- [ ] `npx tsc --noEmit` passe
- [ ] Build Vercel OK
- [ ] App tourne sur https://fish-dex-six.vercel.app
- [ ] Test visuel mobile + desktop OK
- [ ] Aucune feature gaming visible (XP en gros, badges flashs, etc.)
- [ ] Ton contemplatif respecté partout

⚠️ **Tant qu'un item est KO → ne pas passer à H2.**

Pivot vision réussi. 🌅
