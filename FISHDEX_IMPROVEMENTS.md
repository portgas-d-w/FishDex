# 🐟 FishDex — Document d'améliorations UI/UX

> Document de référence pour Claude Code.
> Lis ce document EN ENTIER avant de commencer.
> Applique les corrections dans l'ordre de priorité indiqué.
> Chaque section contient le contexte, la décision exacte, et les instructions précises.

---

## ⚠️ RÈGLES GÉNÉRALES AVANT DE COMMENCER

1. `npx tsc --noEmit` doit passer avant chaque commit
2. Un commit par section (pas tout en un seul commit)
3. Ne jamais laisser un placeholder visible en prod ("— H3", "À venir", "TODO")
4. Respecter la DA FishDex : cyan #22d3ee, navy #0a0f14, glassmorphism (bg-white/5, backdrop-blur-md, border-white/10, rounded-2xl)
5. Tester sur mobile (390×844) après chaque modification
6. Si tu trouves quelque chose d'incorrect ou d'incohérent non listé ici, corrige-le mais documente-le dans le commit

---

# PRIORITÉ 1 — CORRECTIONS CRITIQUES

## P1.1 — Supprimer étoiles et losanges improvisés sur les fiches FishDex

**Problème** : Claude Code a ajouté des étoiles jaunes (⭐) et des losanges sur certaines fiches espèces. Ces éléments n'ont aucune signification définie et créent de la confusion avec le système d'étoiles de difficulté des techniques.

**Décision** : supprimer tout élément non spécifié (étoiles standalone, losanges) sur toutes les fiches. Seuls les badges officiels restent : badge rareté (Commun/Rare/Épique/Légendaire/Mirage) et numéro dex.

**Instructions** :
1. Grep tous les composants fiche espèce pour `⭐`, `★`, `◆`, `losange`, `diamond`, `star` en dehors du composant de notation des techniques
2. Supprimer tous les éléments improvisés trouvés
3. Vérifier visuellement sur 5 fiches différentes (communes, rares, légendaires)
4. Commit : `fix(fishdex): remove improvised stars and diamonds from species cards`

---

## P1.2 — Corriger le compteur Objectifs FishDex

**Problème** : le widget Home affiche "3 / 100" en titre et "3 / 102 espèces capturées" en sous-titre. Incohérent.

**Décision** :
- Le total officiel est **92 espèces** (hors Mirages)
- Les Mirages s'ajoutent au-delà : si l'user a tout capturé + 1 Mirage → affiche "93 / 92"
- Format d'affichage : `X / 92` en grand, pas de sous-titre qui contredit

**Instructions** :
1. Dans `src/app/actions/` ou `src/lib/`, trouver la query qui calcule le total d'espèces
2. Filtrer les espèces avec `rarete != 'mirage'` pour obtenir le dénominateur (doit retourner 92)
3. Les captures de Mirages s'ajoutent au numérateur normalement
4. Format dans le widget Home :
```tsx
<p className="text-3xl font-bold">{captured} / 92</p>
<p className="text-sm text-white/60">
  {captured} espèce{captured > 1 ? 's' : ''} capturée{captured > 1 ? 's' : ''}
  {miragesCaptured > 0 && ` · ${miragesCaptured} Mirage${miragesCaptured > 1 ? 's' : ''}`}
</p>
```
5. Commit : `fix(home): correct species counter to 92 non-mirage species`

---

## P1.3 — Validation des valeurs impossibles lors d'une capture

**Problème** : des données biologiquement impossibles entrent en BDD (ex: carpe 26 cm / 2.8 kg — impossible, une carpe de 26 cm pèse max 300g).

**Décision** : validation côté client avec avertissement doux (pas d'erreur bloquante), et validation côté serveur qui rejette si les valeurs sont absurdes.

**Instructions** :

1. Crée `src/lib/catches/validation.ts` avec les règles par espèce :

```typescript
type CatchValidationRule = {
  taille_min_cm: number;
  taille_max_cm: number;
  poids_min_kg: number;
  poids_max_kg: number;
  ratio_poids_taille_max: number; // poids_kg / taille_cm max raisonnable
};

// Ratios biologiques approximatifs (poids en kg par cm)
// Basés sur les données FishBase
export const CATCH_VALIDATION_RULES: Record<string, CatchValidationRule> = {
  'carpe-commune': { taille_min_cm: 10, taille_max_cm: 120, poids_min_kg: 0.1, poids_max_kg: 40, ratio_poids_taille_max: 0.08 },
  'brochet': { taille_min_cm: 20, taille_max_cm: 150, poids_min_kg: 0.2, poids_max_kg: 25, ratio_poids_taille_max: 0.06 },
  'sandre': { taille_min_cm: 15, taille_max_cm: 130, poids_min_kg: 0.2, poids_max_kg: 15, ratio_poids_taille_max: 0.04 },
  'silure-glane': { taille_min_cm: 30, taille_max_cm: 280, poids_min_kg: 1, poids_max_kg: 130, ratio_poids_taille_max: 0.25 },
  'perche-commune': { taille_min_cm: 5, taille_max_cm: 60, poids_min_kg: 0.01, poids_max_kg: 4.8, ratio_poids_taille_max: 0.03 },
  'truite-fario': { taille_min_cm: 10, taille_max_cm: 80, poids_min_kg: 0.05, poids_max_kg: 5, ratio_poids_taille_max: 0.025 },
  'gardon': { taille_min_cm: 5, taille_max_cm: 50, poids_min_kg: 0.01, poids_max_kg: 2, ratio_poids_taille_max: 0.015 },
  // Règle générique pour toutes les espèces non listées
  'default': { taille_min_cm: 1, taille_max_cm: 300, poids_min_kg: 0.001, poids_max_kg: 200, ratio_poids_taille_max: 0.5 },
};

export type ValidationWarning = {
  field: 'taille' | 'poids' | 'ratio';
  message: string;
  severity: 'warning' | 'error';
};

export function validateCatchValues(
  speciesSlug: string,
  tailleCmd?: number,
  poidsKg?: number
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const rules = CATCH_VALIDATION_RULES[speciesSlug] || CATCH_VALIDATION_RULES['default'];

  if (tailleCmd !== undefined) {
    if (tailleCmd < rules.taille_min_cm) {
      warnings.push({ field: 'taille', message: `Taille inhabituelle pour cette espèce (min: ${rules.taille_min_cm} cm)`, severity: 'warning' });
    }
    if (tailleCmd > rules.taille_max_cm) {
      warnings.push({ field: 'taille', message: `Taille dépasse le record connu pour cette espèce (max: ${rules.taille_max_cm} cm)`, severity: 'warning' });
    }
  }

  if (poidsKg !== undefined) {
    if (poidsKg < rules.poids_min_kg) {
      warnings.push({ field: 'poids', message: `Poids inhabituel pour cette espèce`, severity: 'warning' });
    }
    if (poidsKg > rules.poids_max_kg) {
      warnings.push({ field: 'poids', message: `Poids dépasse le record connu pour cette espèce (max: ${rules.poids_max_kg} kg)`, severity: 'warning' });
    }
  }

  // Vérification ratio poids/taille
  if (tailleCmd && poidsKg) {
    const ratio = poidsKg / tailleCmd;
    if (ratio > rules.ratio_poids_taille_max) {
      warnings.push({
        field: 'ratio',
        message: `Combinaison taille/poids peu probable pour cette espèce. Vérifie les valeurs.`,
        severity: 'warning'
      });
    }
  }

  return warnings;
}
```

2. Dans le formulaire de capture, affiche les warnings sous les champs concernés :

```tsx
{validationWarnings.map((w, i) => (
  <p key={i} className="text-xs text-amber-400 flex items-center gap-1 mt-1">
    <AlertTriangle className="h-3 w-3" />
    {w.message}
  </p>
))}
```

3. Le warning n'est **pas bloquant** : l'user peut quand même soumettre (il peut avoir vraiment battu un record)
4. Dans la Server Action `createCatch`, ajoute une validation côté serveur qui rejette uniquement les valeurs vraiment impossibles (ex: carpe 500 kg ou taille 0 cm)
5. Commit : `feat(capture): biological validation warnings for impossible catch values`

---

## P1.4 — Météo GPS + système de clés robuste

**Problème** : la météo est fixée sur Paris au lieu d'utiliser le GPS du téléphone. Les clés OpenWeather expirent régulièrement.

**Décision** :
- Utiliser la Geolocation API du navigateur pour obtenir les coordonnées GPS
- Système de 2 clés API OpenWeather en rotation automatique si l'une échoue
- Fallback élégant si GPS refusé ou météo indisponible

**Instructions** :

1. Dans `.env.local`, prévoir 2 variables :
```
OPENWEATHER_API_KEY_1=ta_clé_principale
OPENWEATHER_API_KEY_2=ta_clé_secondaire
```

2. Crée `src/lib/weather/client.ts` (côté client) :

```typescript
'use client';

export async function getClientCoordinates(): Promise<{ lat: number; lon: number } | null> {
  if (!navigator.geolocation) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 300000 } // cache 5 min
    );
  });
}
```

3. Crée `src/app/actions/weather.ts` (côté serveur) :

```typescript
'use server';

import { unstable_cache } from 'next/cache';

const OPENWEATHER_KEYS = [
  process.env.OPENWEATHER_API_KEY_1,
  process.env.OPENWEATHER_API_KEY_2,
].filter(Boolean);

async function fetchWeatherWithFallback(lat: number, lon: number) {
  for (const key of OPENWEATHER_KEYS) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${key}`,
        { next: { revalidate: 900 } } // cache 15 min
      );
      if (res.ok) return await res.json();
    } catch {
      continue; // essaie la clé suivante
    }
  }
  return null;
}

export const getWeather = unstable_cache(
  async (lat: number, lon: number) => {
    const data = await fetchWeatherWithFallback(lat, lon);
    if (!data) return null;

    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: Math.round(data.wind.speed * 3.6), // m/s → km/h
      wind_dir: getWindDirection(data.wind.deg),
      conditions: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      city: data.name,
    };
  },
  ['weather'],
  { revalidate: 900 }
);

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}
```

4. Dans le composant Home (côté client) :

```tsx
'use client';
import { getClientCoordinates } from '@/lib/weather/client';
import { getWeather } from '@/app/actions/weather';

// Au mount du composant :
useEffect(() => {
  getClientCoordinates().then(coords => {
    if (coords) {
      getWeather(coords.lat, coords.lon).then(setWeather);
    }
  });
}, []);
```

5. Si GPS refusé ou météo indisponible : ne pas afficher "Paris" en dur. Afficher :
```tsx
{weather ? (
  <span>{weather.city}</span>
) : (
  <span className="text-white/40 text-xs">Active la géoloc pour la météo locale</span>
)}
```

6. Commit : `feat(weather): GPS-based weather with dual API key fallback`

---

# PRIORITÉ 2 — AMÉLIORATIONS HOME

## P2.1 — Widget "Dernières captures" en scroll horizontal pleine largeur

**Problème** : les cards captures s'arrêtent à mi-écran, la section semble étriquée.

**Instructions** :
1. La section doit utiliser `overflow-x-auto` avec `-mx-4 px-4` pour déborder sur les bords de l'écran
2. Chaque card : largeur fixe `w-48` (192px) avec hauteur `h-60`
3. Scroll horizontal sans scrollbar visible (`scrollbar-hide`)
4. `snap-x snap-mandatory` pour un snap propre au scroll
5. Chaque card avec `snap-start`

```tsx
<div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
  <div className="flex gap-3 snap-x snap-mandatory w-max pb-2">
    {catches.map(catch_ => (
      <CatchCard
        key={catch_.id}
        catch_={catch_}
        className="w-48 h-60 flex-shrink-0 snap-start"
      />
    ))}
  </div>
</div>
```

6. Commit : `feat(home): full-width horizontal scroll for recent catches`

---

## P2.2 — Widget "Spots favoris" avec 1 seul spot

**Problème** : 1 spot seul affiché dans une demi-largeur laisse un vide à droite.

**Instructions** :
- Si `spots.length === 0` → masquer le widget entièrement
- Si `spots.length === 1` → card pleine largeur avec plus d'infos (nb prises, dernière visite, bouton "Ouvrir")
- Si `spots.length >= 2` → layout côte à côte existant

```tsx
{spots.length === 1 && (
  <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex items-center justify-between">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-cyan-400" />
        <p className="font-semibold text-white">{spots[0].nom}</p>
      </div>
      <p className="text-sm text-white/60">{spots[0].nb_visites} prise{spots[0].nb_visites > 1 ? 's' : ''}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-white/30" />
  </div>
)}
```

7. Commit : `fix(home): spots widget adapts to single spot with full-width card`

---

# PRIORITÉ 3 — AMÉLIORATIONS FISHDEX

## P3.1 — Section "Votre Record" vide sur les fiches espèces

**Problème** : quand aucun record n'existe, la section affiche une silhouette grisée qui fait "placeholder non rempli".

**Instructions** :

```tsx
{hasRecord ? (
  <RecordDisplay record={record} />
) : (
  <div className="flex flex-col items-center justify-center py-6 text-center">
    <Trophy className="h-8 w-8 text-white/20 mb-2" />
    <p className="text-sm text-white/40">Pas encore de record pour cette espèce</p>
    <p className="text-xs text-white/30 mt-1">Ta prochaine prise pourrait l'être</p>
  </div>
)}
```

8. Commit : `fix(fishdex): elegant empty state for personal record section`

---

## P3.2 — Nouveaux filtres Aquarium : Espèces et Spot

**Problème** : les filtres actuels sont "Toutes / Rareté / Records". Il manque "Espèces" et "Spot".

**Instructions** :

Barre de filtres mise à jour : `Toutes | Rareté | Records | Espèces | Spot`

- **Filtre "Espèces"** : groupe les captures par espèce. Affiche d'abord l'espèce en header, puis ses captures en dessous.
- **Filtre "Spot"** : groupe les captures par spot. Affiche le nom du spot en header de groupe, puis les captures réalisées sur ce spot.

Structure pour le filtre Spot :
```tsx
// Grouper par spot
const bySpot = catches.reduce((acc, catch_) => {
  const spotKey = catch_.session?.spot?.nom || 'Sans spot';
  if (!acc[spotKey]) acc[spotKey] = [];
  acc[spotKey].push(catch_);
  return acc;
}, {} as Record<string, Catch[]>);

// Afficher
{Object.entries(bySpot).map(([spotName, spotCatches]) => (
  <div key={spotName}>
    <div className="flex items-center gap-2 mb-3">
      <MapPin className="h-4 w-4 text-cyan-400" />
      <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">{spotName}</p>
      <span className="text-xs text-white/30">({spotCatches.length})</span>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-6">
      {spotCatches.map(c => <CatchCard key={c.id} catch_={c} />)}
    </div>
  </div>
))}
```

9. Commit : `feat(aquarium): add Species and Spot filter groups`

---

# PRIORITÉ 4 — AMÉLIORATIONS SESSIONS

## P4.1 — Reformuler le message de fenêtre d'édition

**Problème** : "Modifiable jusqu'au 21 mai à 00:56" est trop froid.

**Instructions** :

Remplace partout ce pattern par :

```tsx
<p className="text-xs text-white/40 italic">
  Tu peux encore modifier ce souvenir jusqu'au {formatEditableUntil(session.editable_until)}
</p>
```

Avec :
```typescript
function formatEditableUntil(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
}
// → "21 mai à 00:56"
```

10. Commit : `fix(sessions): warmer phrasing for editable window message`

---

## P4.2 — Photo d'ambiance : Polaroïd placeholder + upload multi-moment

**Problème** : quand aucune photo n'est ajoutée, pas d'indication visuelle que c'est possible. L'upload n'est possible qu'à la fin de la session.

**Décision** :
- Placeholder visuel type Polaroïd quand pas de photo
- Upload possible à 3 moments : création, fin de session, édition dans les 48h

**Instructions** :

1. Crée le composant `src/components/sessions/PolaroidPlaceholder.tsx` :

```tsx
export function PolaroidPlaceholder({ onUpload }: { onUpload: () => void }) {
  return (
    <button
      onClick={onUpload}
      className="relative w-full aspect-[4/3] bg-white/5 border-2 border-dashed border-white/20
                 rounded-lg flex flex-col items-center justify-center gap-2
                 hover:border-cyan-400/50 hover:bg-white/8 transition-all"
    >
      {/* Cadre Polaroïd */}
      <div className="absolute inset-4 border border-white/10 rounded-sm" />
      <Camera className="h-8 w-8 text-white/30" />
      <p className="text-xs text-white/40">Ajoute une photo de ton spot</p>
      <p className="text-xs text-white/25">Appuie pour prendre ou importer</p>
    </button>
  );
}
```

2. Dans la page de détail session et la page d'édition, afficher ce composant si `session.photo_ambiance_url === null`

3. Le bouton d'upload déclenche l'input file habituel (camera ou gallery)

4. L'upload est disponible :
   - Sur la page de création de session
   - Sur la page de fin de session (récap)
   - Sur la page d'édition (tant que `editable_until > NOW()`)

11. Commit : `feat(sessions): polaroid placeholder and multi-moment photo upload`

---

## P4.3 — Icône placeholder selon saison/style pour card carnet

**Problème** : quand pas de photo d'ambiance, l'icône feuille verte est toujours la même.

**Instructions** :

```typescript
function getSessionIcon(session: Session): string {
  // Priorité : style de pêche
  if (session.style_peche === 'Mouche') return '🪰';
  if (session.style_peche === 'Carpe') return '🌿';
  if (session.style_peche === 'Carnassiers') return '🎯';
  if (session.style_peche === 'Truite') return '🏔️';

  // Fallback : saison
  if (session.season === 'hiver') return '❄️';
  if (session.season === 'printemps') return '🌱';
  if (session.season === 'été') return '☀️';
  if (session.season === 'automne') return '🍂';

  return '🌿'; // défaut
}
```

Applique dans la card carnet de la liste sessions à la place de l'icône feuille fixe.

12. Commit : `feat(sessions): contextual icon in session card based on style and season`

---

## P4.4 — Cohérence visuelle : card carnet et reste de l'app

**Problème** : la card carnet beige est belle mais dissonante avec le glassmorphism du reste de l'app.

**Décision** : on garde le style carnet mais on l'intègre mieux. Le fond beige reste, mais on harmonise les typographies et les couleurs avec le design system FishDex.

**Instructions** :

1. **Titre de la session** : passer de la police cursive générique à une police serif élégante (Georgia ou une Google Font comme Playfair Display si disponible, sinon serif natif)

2. **Metadata** (date, lieu, heure) : garder en small, mais utiliser `text-stone-600` pour rester dans la tonalité chaude du carnet

3. **Badge lune croissante** : garder mais s'assurer que la lune est calculée réellement depuis `started_at` via une lib légère (ou algorithme simple)

4. **Bordure** : la bordure cyan (`border-cyan-400/50`) quand la card est "active" ou récente (< 24h) — ajoute une touche de liaison avec le design system

5. **Ombre** : ajouter `shadow-lg shadow-black/20` pour que la card "flotte" davantage sur le fond sombre

```tsx
// Card carnet enrichie
<div className={`
  rounded-xl overflow-hidden
  bg-[#f5f0e8]  // beige chaud
  shadow-lg shadow-black/20
  border border-[#e8dcc8]
  ${isRecent ? 'ring-1 ring-cyan-400/30' : ''}
`}>
  {/* Spirale gauche */}
  <SpiralDecoration />

  <div className="p-4 pl-12">
    <div className="flex justify-between items-start">
      <h3 className="font-serif text-stone-800 text-lg">{session.title || session.spot?.nom || 'Sans titre'}</h3>
      {moonPhase && <MoonPhaseIcon phase={moonPhase} />}
    </div>
    <p className="text-stone-500 text-xs mt-1">{formatSessionMeta(session)}</p>
    <div className="flex items-center justify-between mt-3">
      <span className="text-xl">{getSessionIcon(session)}</span>
      <span className="text-stone-500 text-xs flex items-center gap-1">
        <Fish className="h-3 w-3" />
        {session.captures_count} prise{session.captures_count > 1 ? 's' : ''}
      </span>
    </div>
  </div>
</div>
```

13. Commit : `feat(sessions): harmonize session card style with FishDex design system`

---

## P4.5 — Background par défaut quand pas de photo d'ambiance (détail session)

**Problème** : le background en haut du détail session est une photo générique verdâtre.

**Instructions** :

Si `session.photo_ambiance_url === null`, choisir un background selon le contexte :

```typescript
function getDefaultSessionBackground(session: Session): string {
  // Selon saison + light_phase
  const map: Record<string, string> = {
    'printemps-aube': '/backgrounds/home-default.webp',
    'printemps-matin': '/backgrounds/lac-lever-soleil.webp',
    'été-midi': '/backgrounds/lac-ete.webp',
    'automne-crépuscule': '/backgrounds/coucher-soleil.webp',
    'hiver-nuit': '/backgrounds/lac-nuit.webp',
    // etc.
  };

  const key = `${session.season}-${session.light_phase}`;
  return map[key] || '/backgrounds/home-default.webp';
}
```

14. Commit : `feat(sessions): contextual default background based on session season and light`

---

# PRIORITÉ 5 — AMÉLIORATIONS FISHDEX SUPPLÉMENTAIRES

## P5.1 — FishFeed : interdire publication sans photo

**Problème** : l'user peut potentiellement publier une capture sans photo.

**Instructions** :

1. Dans le formulaire de publication FishFeed, le bouton "Publier" est désactivé si `catch_.photo_url === null`

```tsx
<button
  disabled={!catch_.photo_url}
  className={!catch_.photo_url ? 'opacity-40 cursor-not-allowed' : ''}
>
  Publier
</button>
```

2. Si la capture sélectionnée n'a pas de photo, afficher un message :
```tsx
{!catch_.photo_url && (
  <p className="text-sm text-amber-400 flex items-center gap-2">
    <Camera className="h-4 w-4" />
    Ajoute une photo à cette capture pour la partager
  </p>
)}
```

3. Dans la Server Action de publication, vérifier côté serveur que `photo_url` est non-null

15. Commit : `fix(fishfeed): require photo to publish a catch`

---

## P5.2 — Météo dans le détail session : supprimer "— H3"

**Problème** : "Météo — H3" est visible dans les détails de sessions existantes où la météo n'a pas été capturée au démarrage.

**Instructions** :

```tsx
// Dans le widget CONDITIONS du détail session
{session.meteo_data ? (
  <WeatherDisplay meteo={session.meteo_data} />
) : (
  <p className="text-sm text-white/40 italic">
    Conditions météo non enregistrées pour cette session
  </p>
)}
```

Ne jamais afficher "H3" ou tout autre marqueur technique visible à l'user.

16. Commit : `fix(sessions): remove H3 placeholder from weather display`

---

# VÉRIFICATIONS FINALES

Après avoir appliqué toutes les corrections, vérifie ces points :

```bash
# 1. TypeScript propre
npx tsc --noEmit

# 2. Build propre
npm run build

# 3. Pas de placeholder technique visible
grep -r "H3\|TODO\|placeholder\|À venir avec" src/app --include="*.tsx" | grep -v node_modules
```

**Test visuel obligatoire sur mobile (390×844)** :
- [ ] Home : compteur 92 espèces, scroll horizontal captures, spots pleine largeur si 1 seul
- [ ] FishDex : pas d'étoile ni losange improvisé sur les fiches
- [ ] FishDex : section Record avec état vide élégant
- [ ] Aquarium : 5 filtres fonctionnels (Toutes/Rareté/Records/Espèces/Spot)
- [ ] Sessions liste : card carnet enrichie avec icône contextuelle
- [ ] Sessions détail : Polaroïd placeholder si pas de photo
- [ ] Sessions détail : "Tu peux encore modifier..." au lieu de "Modifiable jusqu'au..."
- [ ] Sessions détail : pas de "Météo — H3"
- [ ] FishFeed : publication bloquée sans photo
- [ ] Météo : utilise le GPS, pas "Paris" en dur
- [ ] Validation capture : warning si valeurs impossibles

---

## Ordre des commits attendus

1. `fix(fishdex): remove improvised stars and diamonds from species cards`
2. `fix(home): correct species counter to 92 non-mirage species`
3. `feat(capture): biological validation warnings for impossible catch values`
4. `feat(weather): GPS-based weather with dual API key fallback`
5. `feat(home): full-width horizontal scroll for recent catches`
6. `fix(home): spots widget adapts to single spot with full-width card`
7. `fix(fishdex): elegant empty state for personal record section`
8. `feat(aquarium): add Species and Spot filter groups`
9. `fix(sessions): warmer phrasing for editable window message`
10. `feat(sessions): polaroid placeholder and multi-moment photo upload`
11. `feat(sessions): contextual icon in session card based on style and season`
12. `feat(sessions): harmonize session card style with FishDex design system`
13. `feat(sessions): contextual default background based on season and light`
14. `fix(fishfeed): require photo to publish a catch`
15. `fix(sessions): remove H3 placeholder from weather display`

---

*FishDex — Chaque amélioration sert l'ADN : contemplatif, premium, jamais gaming.*
