# 🟣 FishDex — Prompts Claude Code · Phase H3 V1 PUBLIQUE

> Prompts opérationnels pour la phase V1 publique (lancement officiel).
>
> **⚠️ PRÉREQUIS H2.5** : tous les items de H2.5 doivent être ✅ avant de commencer.
>
> Estimation : 4-5 semaines de travail effectif.
>
> **⚠️ NATURE DE CES PROMPTS** : H3 étant loin, ces prompts sont plus stratégiques que techniques. Quand tu y arriveras, reviens consulter Claude (web) pour raffiner selon le contexte du moment.

---

## 📋 Ordre d'exécution recommandé

1. **S3.1** Logo officiel vectorisé (préalable visuel)
2. **S3.2** Pipeline images optimisé (perfs)
3. **S3.3** Backgrounds dynamiques Home (8 photos contextuelles)
4. **S3.4** Onboarding contemplatif (premier contact user)
5. **S3.5** Météo réelle API OpenWeather
6. **S3.6** Carnet enrichi (souvenirs cycliques)
7. **S3.7** Sessions passées mode rétro
8. **S3.8** Préparation bêta fermée
9. **S3.9** Lancement bêta + itérations

---

# 🟣 PROMPT S3.1 — Logo officiel vectorisé

**Format mixte. Apprentissage Figma OU freelance.**

**⚠️ Préalable** : tu as ton triskèle DALL-E final validé (en PNG raster).

---PROMPT---

CONTEXTE — Vectorisation du logo FishDex (H3.1)

J'ai un logo triskèle 3 poissons en PNG (carpe + truite + brochet en rotation 120°).
Je veux le vectoriser en SVG propre pour usage en favicon, app icon, et différentes tailles.

═══════════════════════════════════════════
ÉTAPE 1 — DÉCISION VOIE
═══════════════════════════════════════════

Demande-moi quelle voie je choisis :

(a) Apprentissage Figma DIY (gratuit, 3-5h de travail)
(b) Freelance Fiverr (~30-80€, 2-5 jours de livraison)

Selon ma réponse :

SI (a) FIGMA DIY :
- Liste-moi les ressources pour apprendre Figma vectoriel rapidement
- Tutoriels YouTube recommandés (max 2-3, les meilleurs)
- Workflow étape par étape :
  1. Créer un projet Figma
  2. Importer le PNG
  3. Utiliser pen tool pour redessiner chaque poisson
  4. Exports SVG + PNG multi-tailles

SI (b) FREELANCE :
- Génère un brief détaillé en anglais pour le freelance contenant :
  * Le concept (triskèle 3 poissons)
  * Les références (image en PJ)
  * Les déclinaisons à fournir : SVG full color, SVG monochrome, PNG 16/32/180/192/512/1024
  * Le ton de marque : premium, contemplatif, naturaliste, dark mode aquatique
  * Les usages : favicon, app icon iOS/Android, header web, print
  * Le budget : 30-80€
  * Les sources d'inspiration : WWF, Patagonia, Jaguar

═══════════════════════════════════════════
ÉTAPE 2 — INTÉGRATION DANS LE PROJET
═══════════════════════════════════════════

Une fois le logo vectoriel obtenu (par moi via Figma OU livré par freelance) :

1. Crée la structure de dossier :

public/
├── logo/
│   ├── fishdex-full.svg            # logo + wordmark horizontal
│   ├── fishdex-icon.svg            # symbole seul (carré)
│   ├── fishdex-wordmark.svg        # texte seul
│   ├── fishdex-mono.svg            # version monochrome
│   ├── icon-1024.png
│   ├── icon-512.png
│   ├── icon-192.png
│   ├── icon-180.png                # iOS
│   ├── icon-32.png
│   └── favicon.svg

2. Remplace tous les placeholders logo dans le code :
- src/app/layout.tsx (favicon, apple-touch-icon)
- src/components/layout/Header.tsx (si logo header)
- src/components/auth/* (logos sur pages login)
- public/manifest.json (icônes PWA)
- next.config.js (si paramètres icons)

3. Mets à jour le manifest.json :

{
  "name": "FishDex",
  "short_name": "FishDex",
  "icons": [
    { "src": "/logo/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/logo/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#22d3ee",
  "background_color": "#0a0f14",
  "display": "standalone"
}

═══════════════════════════════════════════
ÉTAPE 3 — TESTS
═══════════════════════════════════════════

1. Favicon visible dans l'onglet navigateur
2. Logo apparaît correctement en haut des pages avec le bon dégradé
3. Test PWA : "Ajouter à l'écran d'accueil" sur mobile → bonne icône
4. Test lighthouse : score > 90 sur "Icons present"

═══════════════════════════════════════════
ÉTAPE 4 — COMMIT
═══════════════════════════════════════════

Commit : "feat(branding): integrate official FishDex logo (vectorized) across the app"

---PROMPT---

---

# 🟣 PROMPT S3.2 — Pipeline images optimisé

**Format détaillé. Performance critique pour V1.**

---PROMPT---

CONTEXTE — Pipeline images optimisé (H3.2)

V1 publique = exposition aux vrais users → la perf images devient critique.
Sans optimisation, les pages Aquarium/FishDex peuvent ramer avec 50+ images.

═══════════════════════════════════════════
ÉTAPE 1 — AUDIT ACTUEL
═══════════════════════════════════════════

Lance ces vérifications :
- Quelle taille moyenne ont les photos uploadées (en KB) ?
- Quel format (JPEG, PNG, WebP) ?
- Compression actuelle ? (Likely : aucune)
- Strategy d'affichage actuelle (full size partout ? thumbnails ?)

Présente le rapport.

═══════════════════════════════════════════
ÉTAPE 2 — PIPELINE CIBLE
═══════════════════════════════════════════

Architecture cible :

1. UPLOAD CLIENT
- Browser image compression avant upload
- Lib : browser-image-compression
- Cible : 1920px max width, 70% quality, WebP si supporté
- Réduit la taille moyenne de 3-5 MB → 200-400 KB

2. PROCESSING SERVEUR (Supabase)
- Edge Function ou Server Action qui génère 3 tailles :
  * thumbnail : 200x200 (pour grilles)
  * medium : 600x600 (pour cards)
  * large : 1024x1024 (pour détail full screen)
- Lib serveur : sharp (via Edge Function ou conversion à l'upload)

3. STORAGE
- Bucket Supabase "catches" structure :
  catches/
  ├── original/[catch_id].webp
  ├── medium/[catch_id].webp
  └── thumb/[catch_id].webp

4. AFFICHAGE
- Composant <CatchImage> avec props variant="thumb"|"medium"|"large"
- Loads la bonne taille selon contexte
- Blur placeholder pendant le load (plaiceholder lib)
- Lazy loading natif (loading="lazy")

═══════════════════════════════════════════
ÉTAPE 3 — IMPLÉMENTATION
═══════════════════════════════════════════

1. Install dépendances :

npm install browser-image-compression sharp plaiceholder

2. Crée src/lib/images/upload.ts avec la fonction de compression client.

3. Crée une Server Action ou Edge Function qui :
- Reçoit le fichier
- Génère les 3 tailles avec sharp
- Upload dans le bucket aux 3 paths

4. Crée src/components/ui/CatchImage.tsx :

type Props = {
  catchId: string;
  variant: 'thumb' | 'medium' | 'large';
  alt: string;
  blurDataURL?: string;
};

export function CatchImage({ catchId, variant, alt, blurDataURL }: Props) {
  const src = `/storage/${variant}/${catchId}.webp`;
  return (
    <Image
      src={src}
      alt={alt}
      width={variant === 'thumb' ? 200 : variant === 'medium' ? 600 : 1024}
      height={variant === 'thumb' ? 200 : variant === 'medium' ? 600 : 1024}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      loading="lazy"
    />
  );
}

5. Remplace tous les <img> et <Image> existants par <CatchImage>.

═══════════════════════════════════════════
ÉTAPE 4 — CLEANUP TEMP/
═══════════════════════════════════════════

Crée un cron Supabase (pg_cron) ou Edge Function qui nettoie les fichiers temp/ tous les jours.
Empêche le bucket de grossir indéfiniment.

═══════════════════════════════════════════
ÉTAPE 5 — TESTS
═══════════════════════════════════════════

1. Upload une photo lourde 5 MB → vérifier qu'elle arrive en ~300 KB
2. Page Aquarium avec 50 catches → temps de chargement
3. Lighthouse Performance → score > 80
4. Network tab : les thumbs sont bien servis sur la liste, les medium sur détail

═══════════════════════════════════════════
ÉTAPE 6 — COMMIT
═══════════════════════════════════════════

Commit : "feat(images): optimized pipeline with client compression + multi-size storage"

---PROMPT---

---

# 🟣 PROMPT S3.3 — Backgrounds dynamiques Home

**Format compact. Logique de sélection contextuelle.**

**Préalable** : tu dois avoir 8 photos générées dans `docs/assets/backgrounds/nature/` (déjà fait normalement).

---PROMPT---

CONTEXTE — Système backgrounds dynamiques Home (H3.3)

En H1 on a mis 1 seul background statique. Maintenant on active la logique contextuelle.

ÉTAPE 1 — INVENTAIRE
Liste les backgrounds disponibles dans public/backgrounds/ (devraient être 8 :
- background-nature-lac-aube-grise
- background-nature-lac-lever-soleil
- background-nature-lac-nuit-lune
- background-nature-lac-orage-pluie
- background-nature-coucher-soleil-brume
- ... selon ce qui a été produit)

ÉTAPE 2 — LOGIQUE DE SÉLECTION
Crée src/lib/home/background-selector.ts :

type Context = {
  season: Season;
  light: LightPhase;
  weather: Weather;
};

const BACKGROUND_MAP: Record<string, string> = {
  // Format : "season-light-weather" → filename
  'spring-dawn-foggy': '/backgrounds/lac-aube-grise.webp',
  'spring-morning-clear': '/backgrounds/lac-lever-soleil.webp',
  'summer-midday-clear': '/backgrounds/lac-ete-soleil.webp',
  'autumn-dusk-cloudy': '/backgrounds/coucher-soleil-brume.webp',
  'autumn-rainy-any': '/backgrounds/lac-orage-pluie.webp',
  'winter-any-snowy': '/backgrounds/lac-hiver-neige.webp',
  'any-night-clear': '/backgrounds/lac-nuit-lune.webp',
  // ... toutes les combinaisons utiles
  default: '/backgrounds/lac-lever-soleil.webp',
};

export function getBackgroundForContext(context: Context): string {
  const key = `${context.season}-${context.light}-${context.weather}`;
  return BACKGROUND_MAP[key] || BACKGROUND_MAP.default;
}

ÉTAPE 3 — INTÉGRATION HOME
Dans src/app/(app)/page.tsx, remplace :

style={{ backgroundImage: 'url(/backgrounds/home-default.webp)' }}

Par :

const bgUrl = getBackgroundForContext(context);
style={{ backgroundImage: `url(${bgUrl})` }}

ÉTAPE 4 — TRANSITION SMOOTH
Quand le background change (changement d'heure typiquement), on veut une transition douce, pas un saute brutal :

<div
  className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
  style={{ backgroundImage: `url(${bgUrl})` }}
  key={bgUrl} // force re-render on change
/>

ÉTAPE 5 — TESTS
- Change manuellement l'heure du système → background change correctement
- Toutes les combinaisons context renvoient un background valide (pas de 404)

ÉTAPE 6 — COMMIT
"feat(home): dynamic backgrounds based on season/light/weather context"

⚠️ Si une photo manque pour une combinaison → fallback vers default propre, pas d'erreur visible
⚠️ Préserver la zone de lisibilité du texte (overlay gradient en bas)

---PROMPT---

---

# 🟣 PROMPT S3.4 — Onboarding contemplatif

**Format compact. Premier contact user.**

---PROMPT---

CONTEXTE — Onboarding 3-4 écrans contemplatifs (H3.4)

Le premier contact d'un nouvel user avec FishDex est crucial.

ÉTAPE 1 — STRUCTURE
4 écrans, swipeables, avec progress dots en bas :

ÉCRAN 1 — Bienvenue
- Background : lac brumeux à l'aube
- Logo FishDex centré
- Titre : "Préserve tes moments de pêche"
- Sous-titre : "Une encyclopédie vivante de tes aventures"
- CTA : "Commencer →"

ÉCRAN 2 — Capture
- Background : poisson tenu en main (no-kill, contemplatif)
- Titre : "Chaque prise devient un souvenir"
- Sous-titre : "Photographie, géolocalise, n'oublie rien"
- CTA : "Suivant →"

ÉCRAN 3 — Sessions
- Background : pêcheur de dos au coucher de soleil
- Titre : "Reviens à tes plus belles sorties"
- Sous-titre : "Le carnet vivant de tes sessions"
- CTA : "Suivant →"

ÉCRAN 4 — Permissions douces
- Background : neutre, calme
- Titre : "Quelques permissions pour bien commencer"
- 3 toggles :
  * Caméra (pour photographier tes prises)
  * Géolocalisation (pour mémoriser tes spots)
  * Notifications (météo idéale, nouvelles espèces)
- "Choix de voie" : différé, proposable plus tard via modal douce
- CTA : "Découvrir FishDex →"

ÉTAPE 2 — IMPLÉMENTATION
Crée src/app/onboarding/page.tsx avec gestion swipe + state.
Sauvegarder profiles.onboarding_completed = TRUE à la fin.

Redirige automatiquement vers /onboarding si user.onboarding_completed === FALSE au premier login post-signup.

ÉTAPE 3 — TESTS
- Nouveau signup → onboarding s'ouvre automatiquement
- Swipe entre écrans fluide
- Skip possible mais discouraged
- Permissions natives système iOS/Android demandées au bon moment
- Après ÉCRAN 4 → onboarding_completed = TRUE → redirect /

ÉTAPE 4 — COMMIT
"feat(onboarding): contemplative 4-screen welcome experience"

⚠️ Pas de gamification au signup ("Gagne ton 1er badge !") = anti-ADN
⚠️ Permissions doivent être explicables, pas forcées

---PROMPT---

---

# 🟣 PROMPT S3.5 — Météo réelle API OpenWeather

**Format compact. Remplace le placeholder.**

---PROMPT---

CONTEXTE — Intégration météo réelle (H3.5)

Jusqu'ici la météo affichée était placeholder. On branche OpenWeather API.

ÉTAPE 1 — SETUP OPENWEATHER
1. Crée un compte sur https://openweathermap.org (free tier suffisant : 1000 calls/jour)
2. Récupère ton API key
3. Ajoute dans .env.local : OPENWEATHER_API_KEY=xxx
4. Ajoute aussi dans Vercel ENV

ÉTAPE 2 — SERVER ACTION MÉTÉO
Crée src/app/actions/weather.ts :

'use server';

import { unstable_cache } from 'next/cache';

type WeatherData = {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_dir: string;
  conditions: string; // 'clear', 'cloudy', 'rainy', 'snowy', 'foggy'
  pressure: number;
  sunrise: string; // ISO
  sunset: string; // ISO
};

export const getWeather = unstable_cache(
  async (lat: number, lng: number): Promise<WeatherData | null> => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=fr&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return mapToWeatherData(data);
    } catch (e) {
      console.error('Weather fetch failed:', e);
      return null;
    }
  },
  ['weather'],
  { revalidate: 900 } // 15 min cache
);

ÉTAPE 3 — INTÉGRATION HOME
Dans le Home, récupère lat/lng :
- Si user a un spot favori → utilise ses coords
- Sinon → demande géoloc browser API
- Sinon → fallback Paris coords

Affiche la météo réelle au lieu du placeholder dans :
- Widget "Conditions actuelles"
- Greeting overlay (ligne météo inline)

ÉTAPE 4 — INTÉGRATION SESSIONS
Au démarrage d'une session, snapshot la météo dans sessions.meteo_data (JSONB).
Affiche cette météo snapshot dans le détail session (pas la météo actuelle).

ÉTAPE 5 — DÉTERMINATION 'weather' CONTEXT
Crée src/lib/weather/classifier.ts :

export function classifyWeather(data: WeatherData): Weather {
  if (data.conditions.includes('snow')) return 'snowy';
  if (data.conditions.includes('rain') || data.conditions.includes('drizzle')) return 'rainy';
  if (data.conditions.includes('fog') || data.conditions.includes('mist')) return 'foggy';
  if (data.conditions.includes('cloud')) return 'cloudy';
  return 'clear';
}

Cette fonction alimente le système de phrases poétiques + le sélecteur de background.

ÉTAPE 6 — TESTS
- Géoloc accordée → météo réelle s'affiche
- Géoloc refusée → fallback propre
- Cache 15 min respecté (pas de spam API)
- Conditions correctement classifiées

ÉTAPE 7 — COMMIT
"feat(weather): integrate OpenWeather API with smart caching and context classification"

---PROMPT---

---

# 🟣 PROMPT S3.6 — Carnet enrichi (souvenirs cycliques)

**Format compact. Features émotionnelles.**

---PROMPT---

CONTEXTE — Souvenirs cycliques + Wrapped FishDex (H3.6)

Features pour renforcer le rapport émotionnel au temps :
- "Il y a 1 an aujourd'hui" sur le Home
- "Wrapped" récap annuel (style Spotify)
- Export PDF/image de session

ÉTAPE 1 — SOUVENIRS CYCLIQUES SUR HOME
Crée src/lib/home/cyclic-memories.ts :

export async function getCyclicMemories(userId: string) {
  // Cherche des captures / sessions exactement à la même date (jour-mois)
  // dans les années précédentes
  // Retourne : { years_ago: 1, type: 'capture'|'session', data: {...} }
}

Dans le Home, si une mémoire existe → afficher une carte discrète :
"📅 Il y a 1 an aujourd'hui — Brochet 84cm à Étang des Saules"

ÉTAPE 2 — WRAPPED ANNUEL
Route spéciale /wrapped/[year] accessible en décembre + janvier seulement.

Crée /src/app/(app)/wrapped/[year]/page.tsx avec 8-10 slides :
- Slide 1 : "Ton année FishDex 2025"
- Slide 2 : "Tu as pêché X jours sur 365"
- Slide 3 : "X captures total"
- Slide 4 : "X espèces différentes"
- Slide 5 : "Ton plus beau souvenir" (capture marquée memorable)
- Slide 6 : "Tes lieux préférés"
- Slide 7 : "Ta saison favorite" (saison la plus active)
- Slide 8 : "Bilan émotionnel" (ressentis majoritaires)
- Slide 9 : "Partage ton année"
- Slide 10 : "Merci d'avoir pêché avec FishDex"

Auto-swipe ou tap to advance.
Export en image (slide unique partageable Instagram story).

ÉTAPE 3 — EXPORT SESSION PDF/IMAGE
Bouton "Partager" sur détail session → modal :
- "Exporter en PDF" (page imprimable)
- "Exporter en image" (carte partageable)

Lib : html2canvas pour image, react-pdf pour PDF.

ÉTAPE 4 — COMMIT
"feat(memory): cyclic memories, annual Wrapped, session exports"

⚠️ Wrapped uniquement en décembre/janvier (sinon route inaccessible)
⚠️ Souvenirs cycliques jamais intrusifs (juste une carte discrète sur Home)

---PROMPT---

---

# 🟣 PROMPT S3.7 — Sessions passées mode rétro

**Format compact. UX décalée.**

---PROMPT---

CONTEXTE — Création de sessions rétroactives (H3.7)

Permettre à l'user de créer des sessions pour des sorties qu'il a déjà faites avant FishDex.

ÉTAPE 1 — UI
Sur l'onglet /sessions, en plus du CTA "Démarrer une session" classique, ajouter "Créer un souvenir passé".

Formulaire simplifié :
- Date manuelle (pas auto NOW())
- Spot
- Style de pêche (optionnel)
- Captures existantes à rattacher (multi-select depuis Aquarium)
- Photo d'ambiance optionnelle
- Notes
- Ressenti

ÉTAPE 2 — SERVER ACTION
Crée createRetroSession dans actions/sessions.ts :
- started_at = date saisie
- ended_at = date saisie + durée par défaut (3h) si non spécifié
- editable_until = NULL (pas de fenêtre 48h pour les sessions rétro)
- Marquer comme retro (peut-être ajouter un champ is_retro BOOLEAN)

ÉTAPE 3 — RATTACHEMENT CAPTURES ORPHELINES
Sur les détails session retro, possibilité de rattacher des captures existantes qui sont sans session_id et dont la date_capture est proche.

ÉTAPE 4 — UI INDICATION
Sur la liste sessions, indicateur subtil "rétro" sur les sessions créées avec ce flow.

ÉTAPE 5 — COMMIT
"feat(sessions): retro session creation for past memories"

---PROMPT---

---

# 🟣 PROMPT S3.8 — Préparation bêta fermée

**Format stratégique. Mix code + organisationnel.**

---PROMPT---

CONTEXTE — Préparation bêta fermée 20-50 testeurs (H3.8)

Pas de code intense ici, surtout du setup et de la préparation.

ÉTAPE 1 — IDENTIFICATION TESTEURS
Liste les sources où trouver 20-50 pêcheurs français motivés :
- Forums : Pecheur.com, CarpFishing.fr, Forum Pêche en France
- Discord : Discord pêche France, Discord carpiste
- Reddit : r/Peche, r/Carpfishing
- Instagram : hashtag #pechefrance, comptes pêcheurs
- Proches : amis pêcheurs, famille

Aide-moi à rédiger 3 messages d'approche différents selon la plateforme.

ÉTAPE 2 — FORMULAIRE FEEDBACK
Crée un Tally form (gratuit) avec ces sections :
- Profil pêcheur (eau, espèces, fréquence)
- Première impression FishDex
- Bugs rencontrés
- Features manquantes
- Note 1-10
- Recommanderais-tu ? (NPS)

Link à mettre dans l'app + envoyer après 1 semaine d'usage.

ÉTAPE 3 — PAGE D'INSCRIPTION BÊTA
Crée /beta route avec :
- Présentation rapide FishDex
- "Je veux tester" → email + profil pêcheur
- Soumet → ajouté à une table beta_signups
- Toi tu valides manuellement et envoies les invitations

ÉTAPE 4 — INVITATIONS
Crée un système simple :
- Tu décides qui invite
- Génère un code unique
- L'user s'inscrit avec ce code → flagué beta_user en BDD

ÉTAPE 5 — ANALYTICS BÊTA
Active PostHog (free tier) ou Plausible pour :
- Pages les plus visitées
- Funnel signup → onboarding → première capture
- Rétention 7 jours / 30 jours

ÉTAPE 6 — COMMIT
"feat(beta): signup flow, invite system, feedback form integration"

---PROMPT---

---

# 🟣 PROMPT S3.9 — Bêta fermée + itérations

**Format stratégique. Pas un seul prompt, plusieurs sur 2-3 semaines.**

---PROMPT---

CONTEXTE — Phase bêta fermée (H3.9)

Cette phase n'est PAS du code en bloc. C'est un cycle :
- Recueillir feedback
- Prioriser
- Fixer / améliorer
- Pusher
- Repeat

ÉTAPE 1 — SEMAINE 1 DE BÊTA
- Invites envoyées (10 testeurs au début, pour pas overwhelm)
- Monitor PostHog / errors Sentry
- Lis tous les retours
- Identifie les 5 bugs les plus critiques
- Fixe-les un par un

ÉTAPE 2 — SEMAINE 2
- Élargis à 30-50 testeurs
- Analyse les patterns de comportement réel
- Identifie les 3 frictions UX majeures
- Fixe-les

ÉTAPE 3 — SEMAINE 3
- Polish général
- Pas de nouvelles features
- Préparation lancement public

ÉTAPE 4 — DÉCISION LANCEMENT
Critères pour lancer publiquement :
- NPS moyen > 30
- < 5 bugs critiques connus
- Onboarding completion rate > 60%
- App stable sur 3 navigateurs (Chrome, Safari, Firefox)
- Mobile parfait sur iPhone + Android

Si critères OK → lancement public (S3.10)
Si non OK → bêta étendue 1-2 semaines

---PROMPT---

---

# ✅ CHECKLIST FINALE H3 — avant de passer à H4

- [ ] **S3.1 — Logo officiel** : vectorisé, intégré partout
- [ ] **S3.2 — Pipeline images** : compression + multi-size + lazy load
- [ ] **S3.3 — Backgrounds dynamiques** : 8 photos contextuelles
- [ ] **S3.4 — Onboarding** : 4 écrans contemplatifs fluides
- [ ] **S3.5 — Météo OpenWeather** : intégrée et cachée 15min
- [ ] **S3.6 — Carnet enrichi** : cyclic memories + Wrapped + exports
- [ ] **S3.7 — Sessions rétro** : création de souvenirs passés
- [ ] **S3.8 — Préparation bêta** : signup + invite + feedback form
- [ ] **S3.9 — Bêta fermée** : 3 semaines avec itérations
- [ ] **Lancement public** : critères validés, app stable

⚠️ **NE PAS PASSER À H4 (long terme) SANS AVOIR PUBLIÉ V1 PUBLIQUE.**

V1 publique livrée. 🚀
