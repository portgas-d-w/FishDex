# 🐟 FishDex — Document Master de Continuité v2

> **Version 2 — Mise à jour majeure intégrant toutes les décisions stratégiques prises en conversation.**
>
> Date de mise à jour : 2026-05
> Phase actuelle : H0 — Stabilisation (bug XP non résolu)
>
> **Ce document remplace MASTER_CONTINUITY.md v1.**
> **Lire en priorité absolue pour toute reprise du projet.**

---

# 🎯 ONBOARDING RAPIDE — À copier-coller au début d'une nouvelle conversation

```
Salut Claude !

Je travaille sur FishDex, une app premium contemplative pour pêcheurs 
d'eau douce français. Je te donne tout le contexte ci-dessous. Lis-le 
attentivement avant de répondre.

Je veux que tu sois :
- Lead product designer
- Architecte backend
- CTO startup expérimenté
- Expert UX mobile-first
- Conseiller stratégique long terme

Règles que tu dois respecter strictement :
- Tu CHALLENGES mes idées, tu n'es PAS complaisant
- Tu signales toujours les promesses fantômes et les hallucinations
- Tu refuses les features non scopées dans la roadmap actuelle
- Tu rappelles les décisions déjà prises quand je dérive
- Tu es pédagogue (je suis dev autodidacte débutant)
- Tu utilises ask_user_input pour les questions multi-options
- Format français pour tout

[Coller le contenu de ce document après]
```

---

# 📋 LE PROJET EN 30 SECONDES

**FishDex** = "Pokédex de la pêche" réinventé en app premium contemplative pour pêcheurs d'eau douce français.

**Vision officielle** :
> *"Compagnon mémoire outdoor premium, encyclopédie vivante du vivant,
> collection émotionnelle de captures, carnet de sessions contemplatif."*

**Public cible** : pêcheurs amateurs et passionnés, francophones, eau douce France métropolitaine.

**Principes NON-NÉGOCIABLES** :
- ✅ Calme, contemplatif, premium, émotionnel, Apple-like
- ✅ Dark mode aquatique immersif, cyan subtil
- ✅ Pas de hasard / gacha / probabilités
- ✅ Réaliste et crédible pour vrais pêcheurs
- ✅ Anti-frustration : tolérance, jokers, mode vacances
- ✅ Respect du vivant et des pratiques no-kill
- ❌ JAMAIS gaming agressif
- ❌ JAMAIS réseau social toxique
- ❌ JAMAIS compétition agressive
- ❌ JAMAIS pay-to-win
- ❌ JAMAIS promesses non tenues (feature mockée = feature scopée)

---

# 👤 PROFIL UTILISATEUR (DEV)

## Qui je suis

- Dev débutant autodidacte
- J'apprends sur le tas
- J'utilise Claude Code pour coder, Claude (web) pour la stratégie
- GitHub : portgas-d-w
- Email : alexy101099@gmail.com
- Repo : https://github.com/portgas-d-w/FishDex
- Prod : https://fish-dex-six.vercel.app

## Mes contraintes réelles

- **Rythme de travail** : variable, ~15-20h/semaine sans dépendre de Claude
- **Limite Claude** : me ralentit régulièrement (à prendre en compte dans estimations)
- **Budget alloué au projet** : **0€** (placeholders + travail DIY pour tout)
- **Date cible publication V1** : **AUCUNE** ("ça sera prêt quand ça sera prêt")
- **Risque burnout** : réel, à surveiller activement

## Mes forces

- Vision produit claire et mature
- Direction artistique précise
- Persévérance, ne lâche rien
- Commits réguliers, tests manuels

## Mes faiblesses (être indulgent mais exigeant)

- Architecture backend complexe (triggers PG, RLS avancé)
- Performance et caching
- Sécurité (signed URLs, anti-abus, rate limiting)
- Tendance à éparpiller le focus → ME RAMENER À L'ORDRE

## Comment me parler

- Honnêteté brutale, pas de complaisance
- Challenger systématiquement
- Pédagogue, expliquer le pourquoi
- Markdown structuré, emojis avec parcimonie
- Questions multi-options → utiliser `ask_user_input` quand pertinent
- Tout en français

---

# 🛠️ STACK TECHNIQUE

```
FRONTEND
- Next.js 15 (App Router, Server Components)
- TypeScript strict
- Tailwind CSS
- Lucide-react (icônes)
- React 19

BACKEND
- Supabase (PostgreSQL + Auth + Storage + RLS)
- Bucket Storage "catches" (privé)
- Migrations versionnées : supabase/migrations/

DÉPLOIEMENT
- Vercel (auto-deploy sur push GitHub)
- URL prod : https://fish-dex-six.vercel.app
- Repo : https://github.com/portgas-d-w/FishDex

OUTILS DEV
- VS Code + Cursor
- Claude Code (CLI agent IA pour le code)
- Claude (web) pour stratégie/briefings
- ChatGPT (Plus) pour génération images IA et phrases poétiques
- Midjourney (à venir si besoin, 10€/mois)
- Figma (gratuit, pour vectorisation logo)
- GitHub
```

---

# 🎨 DIRECTION ARTISTIQUE (FIGÉE)

```
PALETTE COULEURS
- Fond : noir abyssal #0a0f14 + gradient bleu nuit #0f1722 / #1c2a36
- Cyan principal : #22d3ee, #06b6d4
- Couleurs raretés :
  • commun     → emerald-400 #34d399
  • peu commun → blue-400 #60a5fa
  • rare       → purple-500 #a855f7
  • legendaire → amber-500 #f59e0b
  • mirage     → gradient amber → pink → purple (animé shimmer)
- Couleurs collections :
  • Paisibles  → cyan
  • Prédateurs → purple
  • Eaux vives → green-teal #10b981
- États :
  • Succès    → #34d399
  • Erreur    → #f87171
  • Info      → #60a5fa
  • Warning   → #fbbf24

EFFETS PREMIUM
- Glassmorphism : backdrop-blur-md + bg-white/5 + border-white/10
- Glow néon sur éléments interactifs
- Hover scale-[1.02] + transitions douces
- Animations subtiles (fade-in, slide-up, shimmer)
- Lumière volumétrique sous-marine

TYPOGRAPHIE
- Inter pour le corps (free, web-safe)
- Inter Display pour titres (alternative à SF Pro Display interdite)
- font-bold tracking-tight pour titres
- Numéros dex en font-mono

GRILLE & ESPACEMENT
- Système 8pt (4/8/12/16/24/32/48/64/96/128)

MOTION
- Lent, organique, respirant
- Pas de TikTok, pas d'animations agressives
- Easing organic (cubic-bezier doux)
- Durées 200-400ms par défaut

CIBLES TACTILES
- 44x44px minimum (Apple HIG)

LOGO FINAL (en cours)
- Direction validée : triskèle 3 poissons (carpe + truite + brochet)
- Composition : 3 silhouettes interlock en cercle, 120° rotation
- Statut : itérations en cours sur ChatGPT/DALL-E
- Vectorisation prévue en H3 (apprentissage Figma DIY)
```

---

# 🗄️ ARCHITECTURE BDD ACTUELLE + ÉVOLUTIONS PRÉVUES

## Tables actuelles

```sql
profiles
  - id (UUID, FK auth.users)
  - username, avatar_url, bio
  - onboarding_completed BOOLEAN
  - suggest_session_on_capture BOOLEAN (à ajouter H2)
  - default_release BOOLEAN (à ajouter H2)

species (57 lignes actuellement, à étendre à ~110 en H2.5)
  - id, slug, nom_fr, nom_scientifique
  - famille, eau, rarete (commun/peu commun/rare/epique/legendaire/mirage)
  - taille_max_cm, taille_moyenne_cm
  - poids_max_kg, poids_moyen_kg
  - longevite_annees TEXT
  - regime, habitat, profondeur, techniques, saison
  - difficulte, image_url
  - description TEXT
  - conseil_fishdex TEXT (à ajouter en H2.5)

catches (prises des users)
  - id, user_id, species_id
  - date_capture, lieu, poids_kg, taille_cm
  - notes, photo_url, is_public
  - session_id UUID NULL (à ajouter H2)
  - capture_source TEXT CHECK ('camera', 'gallery') (à ajouter H2)
  - released BOOLEAN DEFAULT NULL (à ajouter H2)
  - variant_id UUID NULL (à ajouter H2.5)

user_xp (Phase 10 — BUG À FIXER EN PRIORITÉ ABSOLUE)
  - user_id, total_xp, level
  - current_streak, longest_streak, last_capture_date
  - vacation_mode_until, vacation_days_used

xp_events (log gains XP)
  - user_id, catch_id, event_type
  - xp_amount, metadata (JSONB)

missions (pool)
  - slug, type (daily/weekly/special)
  - title, description, xp_reward, target, conditions

user_missions (assignations)
  - user_id, mission_id, progress, completed_at, expires_at

badges (à créer en Phase 11)
user_badges (à créer en Phase 11)
```

## Nouvelles tables à créer

### En H2 — Sessions

```sql
spots
  - id UUID PRIMARY KEY
  - user_id UUID REFERENCES auth.users
  - nom TEXT
  - latitude DOUBLE PRECISION
  - longitude DOUBLE PRECISION
  - nb_visites INTEGER DEFAULT 0
  - created_at TIMESTAMPTZ

sessions
  - id UUID PRIMARY KEY
  - user_id UUID REFERENCES auth.users
  - spot_id UUID REFERENCES spots NULL
  - title TEXT NULL (titre éditorial optionnel)
  - intention TEXT NULL
  - compagnons TEXT NULL
  - style_peche TEXT NULL
  - started_at TIMESTAMPTZ NOT NULL
  - ended_at TIMESTAMPTZ NULL
  - editable_until TIMESTAMPTZ NULL (= ended_at + 48h)
  - photo_ambiance_url TEXT NULL
  - ressenti TEXT NULL (1 emoji parmi 6)
  - notes TEXT NULL
  - is_bookmarked BOOLEAN DEFAULT FALSE
  - season TEXT (calculé via trigger : printemps/été/automne/hiver)
  - light_phase TEXT (calculé via trigger : aube/matin/midi/aprem/crépuscule/nuit)
  - meteo_data JSONB NULL (snapshot météo OpenWeather si dispo)
```

### En H2.5 — Collections

```sql
collections
  - id UUID PRIMARY KEY
  - slug TEXT UNIQUE ('paisibles', 'predateurs', 'eaux-vives')
  - nom_fr TEXT
  - description TEXT
  - couleur_hex TEXT
  - display_order INTEGER

species_collections (pivot avec numéro dex par collection)
  - species_id UUID REFERENCES species
  - collection_id UUID REFERENCES collections
  - dex_number INTEGER NOT NULL
  - PRIMARY KEY (species_id, collection_id)
  - UNIQUE (collection_id, dex_number)

species_variants (gestion variantes type carpe koï)
  - id UUID PRIMARY KEY
  - species_id UUID REFERENCES species
  - slug TEXT
  - nom_fr TEXT
  - description TEXT
  - description_visuelle TEXT
  - is_mirage BOOLEAN DEFAULT FALSE
  - image_url TEXT
  - display_order INTEGER
  - UNIQUE (species_id, slug)

user_voie (voie principale de chaque user)
  - user_id UUID PRIMARY KEY REFERENCES auth.users
  - collection_id UUID NULL REFERENCES collections (NULL = "Tout explorer")
  - chosen_at TIMESTAMPTZ
```

**RLS** : configuré sur toutes les tables, owner-only sur les données perso. Audit complet à faire en H0.

---

# 📱 ÉTAT ACTUEL — Pages & Features

## ✅ TERMINÉ

- Authentification Supabase (signup, login, logout)
- Page "Le Spot V2" (à renommer "Home" en H1)
- Page "FishDex V2" + détail espèce
- Page "Aquarium V2" + détail prise
- Page "Profil V2"
- Page "Paramètres V2"
- Page "Capture" (scanner premium, sans IA)
- BottomNav 5 onglets (à refondre en H1)
- Header unifié sur toutes les pages
- UserMenu avatar dropdown
- Compte démo "Tony" créé (57 catches sur 6 derniers mois)

## 🟡 EN COURS / PROBLÈMES

- **🔴 Bug XP CRITIQUE NON RÉSOLU** : xp_events s'enregistrent mais user_xp.total_xp ne s'incrémente pas. **Bloquant pour H0.**
- **🔴 Service_role key Supabase non régénérée** (était exposée dans anciens chats)
- Code mort (composants Phase 1/2 abandonnés) à nettoyer

## ⏳ À VENIR

Voir roadmap complète plus bas.

---

# 🗺️ ROADMAP COMPLÈTE — H0 à H7

> **Estimations en SEMAINES DE TRAVAIL EFFECTIF** (15-20h/semaine).
> Aucune date calendaire, l'user choisit son rythme.
> Pas de pression : "ça sera prêt quand ça sera prêt".

---

## 🔴 H0 — STABILISATION

**Durée : 1-2 semaines de travail effectif**
**Objectif : base saine avant tout pivot.**

### S0.1 — Fix bug XP DÉFINITIF ⚠️ PRIORITÉ ABSOLUE

**Statut : NON RÉSOLU.**

**Symptôme** :
- xp_events bien créés (avec xp_amount corrects)
- MAIS user_xp.total_xp reste à zéro
- UI affiche "Niveau 1 - 0 XP" toujours

**Approche obligatoire** :
1. Diagnostic exhaustif (lire toutes migrations + code XP)
2. Identifier cause racine parmi 5 hypothèses (pas de trigger PG ? RLS bloque ? race condition ?)
3. Implémenter fix ATOMIQUE (trigger PG OU RPC function, pas Server Action TS)
4. Fonction réutilisable `level_from_xp(xp INTEGER)` à créer en helper SQL
5. Script de rattrapage pour recalculer total_xp depuis xp_events orphelins
6. Tests : 5 scénarios à valider
7. Commit : `fix(xp): user_xp se met à jour atomiquement après chaque action`

**Voir prompt complet en section PROMPTS plus bas.**

### S0.2 — Audit sécurité Supabase

**Statut : NON FAIT (attendant fix XP).**

1. **Régénérer service_role key**
   - Dashboard Supabase → Project Settings → API → Regenerate
   - Mettre à jour `.env.local`
   - Mettre à jour Vercel env vars
   - Redéployer Vercel

2. **Audit RLS policies**
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies WHERE schemaname = 'public';

   SELECT * FROM pg_policies
   WHERE schemaname = 'public' AND qual = 'true';
   ```

3. **Vérifier pour chaque table** :
   - profiles : owner + profils publics
   - catches : owner + is_public = TRUE pour autres
   - xp_events, user_xp, user_missions : owner only
   - missions, badges, species : lecture publique

4. Fixer les trous éventuels.

### S0.3 — Nettoyage code mort

1. Supprimer `src/components/spot/` (Phase 1 abandonnée)
2. Supprimer `src/components/fishdex/` (Phase 2 abandonnée)
3. **Vérifier les imports AVANT suppression** (grep)
4. `npx depcheck` pour dépendances NPM inutilisées
5. Commit séparé : `refactor: remove abandoned Phase 1/2 components`

### S0.4 — Documentation ARCHITECTURE.md

Créer `ARCHITECTURE.md` à la racine du repo :
- Structure des dossiers
- Composants principaux par page
- Server Actions disponibles
- Tables BDD avec relations
- Variables d'environnement requises

### S0.5 — Validation finale H0

**Checklist obligatoire avant de passer à H1** :

- [ ] Bug XP : DÉFINITIF et testé sur 5 scénarios
- [ ] Service_role key : régénérée et propagée Vercel
- [ ] RLS policies : auditées et fixées
- [ ] Code mort : supprimé
- [ ] ARCHITECTURE.md : créé
- [ ] `npx tsc --noEmit` : passe sans erreur
- [ ] Build Vercel : OK

⚠️ **NE PAS ENCHAÎNER H1 SI UN SEUL ITEM EST KO.**

---

## 🟡 H1 — PIVOT VISION SOFT

**Durée : 4-5 semaines de travail effectif**
**Objectif : faire basculer la DA vers "outdoor premium contemplatif" sans casser l'existant.**

### S1.1 — Renommage Shiny → Mirage

1. Migration SQL :
   ```sql
   ALTER TABLE species
   DROP CONSTRAINT IF EXISTS species_rarete_check;

   UPDATE species SET rarete = 'mirage' WHERE rarete = 'shiny';

   ALTER TABLE species
   ADD CONSTRAINT species_rarete_check
   CHECK (rarete IN ('commun', 'peu commun', 'rare', 'epique', 'legendaire', 'mirage'));
   ```
2. Refactor TS : tous les `'shiny'` → `'mirage'` dans le code
3. Mise à jour traductions/affichages
4. Garder l'effet visuel premium (gradient amber→pink→purple animé)
5. Commit : `refactor(species): rename rarity shiny to mirage`

### S1.2 — Refonte BottomNav 5 onglets

Onglets : **Le Spot / FishDex / Capture (FAB central) / Aquarium / Sessions**

- Capture = bouton flottant cyan glow au centre, légèrement surélevé
- Profil = accessible via avatar header (déjà le cas)
- Sessions = onglet "placeholder" en H1 ("Bientôt disponible" avec illustration)

Commit : `feat(nav): refactor BottomNav with 5 tabs + Capture FAB`

### S1.3 — Système Niveau & Maîtrises

**Niveaux 1-50 avec 8 titres émotionnels** :
- Niveau 1-5   : Débutant
- Niveau 6-10  : Pêcheur
- Niveau 11-15 : Amateur
- Niveau 16-20 : Explorateur
- Niveau 21-30 : Traqueur
- Niveau 31-40 : Spécialiste
- Niveau 41-49 : Expert
- Niveau 50    : Légende

**Système Maîtrises infinies (après niveau 50)** :
- Initié, Rare, Épique, Légendaire, Mirage
- Rangs progressifs (Initié I → II → III...)

**Rendements décroissants invisibles (anti-farm)** :
- 1ère capture du jour : 100% XP
- 2ème : 80%
- 3ème : 60%
- 4ème+ : 40%
- Reset quotidien

**Important** :
- Le niveau reste **SECONDAIRE** dans l'UI
- Statut social principal = captures + espèces + records + souvenirs
- **NE PAS afficher le niveau en gros sur l'avatar** (anti-ADN gaming)
- Afficher le titre ("Traqueur") plutôt que le chiffre brut

### S1.4 — Page Home enrichie (immersive)

**Direction validée** : 75% de l'écran = hero photo cinématique + minimum d'UI superposé.

**Structure** :

1. Hero zone (75% écran) avec photo paysage cinématique
   - Photo statique pour H1 (1 photo par défaut, ex: lac brumeux aube)
   - **PAS de système dynamique météo en H1** (reporté en H3)
   - **Note** : sur 8 photos à générer (Midjourney/ChatGPT), garder pour H3

2. Overlay greeting :
   - Tiny caption cyan small caps : "JEUDI 14 AVRIL · AUBE · 06:42"
   - Grand titre serif : "Bonjour [Prénom]."
   - Sous-titre italique : phrase poétique contextuelle
   - Ligne météo simple : "12° · brume légère · vent NE 6 km/h"
   - Chevron ↓ subtil "scroll for more"

3. Contenu scrollable sous le pli :
   - Card "AUJOURD'HUI" → Session active si existe, sinon "Démarrer une session"
   - Section "DERNIÈRES PRISES" (carrousel)
   - Section "TES SPOTS FAVORIS" (2 cards)
   - Card "CONSEIL DU JOUR" (un conseil pêche selon saison/météo)

4. **Phrases poétiques contextuelles** :
   - Voir document `HOME_POETIC_PHRASES.md` (60 phrases prêtes)
   - À placer dans `src/lib/home/poetic-phrases.ts`
   - Logique de sélection : `getPoetricPhrase({ season, light, weather })`

### S1.5 — FishDex "Encyclopédie vivante" (préparation)

Refonte fiche espèce détail (préparation pour H2.5) :
- Background lumière aqueuse selon rareté
- Habitat illustré
- Saison favorable (icône cyclique)
- Météo associée (préférence du poisson)
- Description biologique enrichie

**Page liste** : pas de gros changement en H1 (refonte en H2.5 avec collections).

### S1.6 — Skill icônes & assets H1

- Icône Mirage SVG custom (étoile 8 branches animée shimmer)
- Composant `SpeciesPlaceholder` (silhouette + gradient rareté)
- Vérifier imports Lucide (BottomNav)

**⚠️ FIN H1 = vision contemplative en place sans casser l'existant**

---

## 🔵 H2 — SESSIONS

**Durée : 6-8 semaines de travail effectif**
**Objectif : LA killer feature émotionnelle.**

> Briefing détaillé original : voir `docs/H2_SESSIONS.md`
> **Mises à jour critiques à intégrer (décisions prises) listées ci-dessous.**

### Décisions verrouillées pour H2

| Décision | Statut |
|---|---|
| Fin de session = **page plein écran**, pas modal | ✅ |
| **Fenêtre édition 48h figée** après fermeture (puis lecture seule) | ✅ |
| **Pas de Distance, pas de Température eau, pas de XP affiché** | ✅ |
| Ressenti emoji (6) + notes + photo ambiance dans écran de fin | ✅ |
| Champ `title` éditorial optionnel | ✅ |
| Champ `is_bookmarked` (sessions mémorables) | ✅ |
| Champ `capture_source` (camera/gallery) sur catches | ✅ |
| Champ `released` (no-kill) sur catches | ✅ |
| **PAS de scan IA d'identification** (manuel uniquement) | ✅ |

### S2.1 — Migration BDD Sessions

```sql
-- Voir architecture BDD plus haut pour le détail complet
CREATE TABLE spots (...);
CREATE TABLE sessions (...);

ALTER TABLE catches
  ADD COLUMN session_id UUID REFERENCES sessions(id),
  ADD COLUMN capture_source TEXT CHECK (capture_source IN ('camera', 'gallery')),
  ADD COLUMN released BOOLEAN DEFAULT NULL;

ALTER TABLE profiles
  ADD COLUMN suggest_session_on_capture BOOLEAN DEFAULT TRUE,
  ADD COLUMN default_release BOOLEAN DEFAULT FALSE;

-- Triggers pour calculer season + light_phase automatiquement
CREATE FUNCTION calculate_session_context() ...
CREATE TRIGGER set_session_context BEFORE INSERT ...

-- Trigger pour bloquer édition après editable_until
CREATE FUNCTION check_session_editable() ...
CREATE TRIGGER prevent_late_session_edit BEFORE UPDATE ...
```

### S2.2 — Server Actions Sessions

9 actions à créer :
- `startSession(spotId?, intention?, compagnons?, stylePeche?)`
- `endSession(sessionId, photoAmbiance?, ressenti?, notes?)`
- `getActiveSession()`
- `getSessions(userId, filters?)`
- `getSessionById(sessionId)`
- `updateSession(sessionId, updates)` ← vérifie editable_until
- `deleteSession(sessionId)` ← soft delete recommandé
- `bookmarkSession(sessionId, value)`
- `attachCaptureToSession(catchId, sessionId)`

### S2.3 — Écrans Sessions (à créer)

1. **Onglet Sessions état vide** (zero session) : illustration + CTA "Démarrer ta première session"
2. **Onglet Sessions état actif** (session en cours) : grosse carte session active en haut + liste sessions passées
3. **Onglet Sessions liste historique** : timeline verticale + filtres + résumé annuel
4. **Démarrage session** (page de création) : formulaire avec champs optionnels
5. **Session active** (page pendant la session) : durée, captures en direct, timeline live, CTA terminer
6. **Fin de session récap** (page plein écran) : résumé + ressenti emoji + notes + photo ambiance + CTA "Enregistrer le souvenir"
7. **Détail session passée** (relire une session) : hero + stats + timeline + photo + notes
8. **Édition session** (dans la fenêtre 48h) : tous champs modifiables, après 48h lecture seule

### S2.4 — Intégration capture flow

- Quand l'user capture une prise pendant une session active → auto-attachée
- Quand l'user capture hors session → toast "Démarrer une session ?" (skippable, settable dans profil)
- Toggle "Poisson relâché" dans formulaire capture (pré-coché si default_release = TRUE)
- Détection automatique `capture_source` (camera vs gallery upload)

### S2.5 — UI/UX détails

- Icône caméra cyan subtile sur cards Aquarium pour captures live
- Icône feuille verte (released) sur cards Aquarium pour no-kill
- Pas d'icône pour kill (volontairement neutre)

⚠️ **FIN H2 = Sessions production-ready, BDD propre, UX testée**

---

## 🟢 H2.5 — COLLECTIONS

**Durée : 4-5 semaines de travail effectif**
**Objectif : FishDex multi-collections avec variantes.**

> Briefing détaillé original : voir `docs/H2.5_COLLECTIONS.md`
> **Mises à jour critiques listées ci-dessous.**

### Décisions verrouillées pour H2.5

| Décision | Statut |
|---|---|
| **Numéro dex par collection** (pas global) | ✅ |
| **Onboarding voie** : choix au signup OU "Tout explorer" | ✅ |
| **Page FishDex unique scrollable** (pas de tabs), collections empilées | ✅ |
| Collection principale **en premier**, autres en dessous | ✅ |
| **Quick-jump pills** en haut pour sauter à une collection | ✅ |
| Sous-titres famille (Cyprinidés, etc.) discrets dans chaque collection | ✅ |
| **Placeholders SVG** pour espèces sans illustration (composant) | ✅ |
| **Variantes via table dédiée** (carpe koï, truite, etc.) | ✅ NOUVEAU |
| **1 espèce avec variantes = 1 case FishDex** (pas N cases) | ✅ NOUVEAU |
| Découverte 100% = avoir capturé au moins 1 variante | ✅ NOUVEAU |

### S2.5.1 — Migration BDD Collections + Variantes

```sql
CREATE TABLE collections (...);
CREATE TABLE species_collections (...);
CREATE TABLE species_variants (...);
CREATE TABLE user_voie (...);

ALTER TABLE catches
  ADD COLUMN variant_id UUID REFERENCES species_variants(id) NULL;

-- Seed des 3 collections
INSERT INTO collections (slug, nom_fr, couleur_hex, display_order) VALUES
  ('paisibles', 'Paisibles', '#22d3ee', 1),
  ('predateurs', 'Prédateurs', '#a855f7', 2),
  ('eaux-vives', 'Eaux vives', '#10b981', 3);

-- Migration des 57 espèces existantes vers species_collections
-- (à faire manuellement, espèce par espèce, avec attribution dex_number)
```

### S2.5.2 — Seed 50 nouvelles espèces

**Process recommandé** :
1. Établir liste des 50 espèces à ajouter (réparties dans les 3 collections)
2. Utiliser **`SPECIES_CONTENT_TEMPLATES.md`** (template 1) pour générer chaque fiche
3. Vérification manuelle sur FishBase (nom scientifique, taille, présence France)
4. Insertion en BDD via migration ou Supabase Dashboard

**Estimation** : 15-20h de travail (génération + vérif + insertion).

### S2.5.3 — Seed variantes pour espèces concernées

Espèces avec variantes connues à seeder en `species_variants` :
- **Carpe koï** : Kohaku, Sanke, Showa, Tancho, Asagi, Shusui, Bekko, Utsuri, Ogon... (~10 variantes)
- **Carpe commune** : Sauvage, Miroir, Cuir, Linéaire
- **Truite fario** : Marbrée, Atlantique, Méditerranéenne, Albinos (Mirage), Tigrée (Mirage)
- **Brochet** : Commun, Mélanique (Mirage), Albinos (Mirage)
- **Saumon Atlantique** : Variantes mer/rivière/smolt

Utiliser **`SPECIES_CONTENT_TEMPLATES.md`** (template 3) pour générer les variantes.

### S2.5.4 — UI FishDex refondue

**Page principale** :
- Header simple : "FishDex — L'encyclopédie vivante du vivant"
- Toggle "Ma voie : [Collection] / Toutes les espèces"
- Progress global "23 / 45 espèces · +2 Mirages"
- Quick-jump pills (3 collections) avec progression mini
- Sections collections empilées (principale en premier)
- Dans chaque collection : sous-titres famille en discret
- Grille 2 colonnes de cards espèces

**Card espèce** :
- Thumbnail (photo ou placeholder)
- Rarity badge
- Nom + nom scientifique
- Numéro dex (par collection)
- Icône discovery (cyan check / lock / "?")
- Badge multi-collection si espèce dans plusieurs (ex: chevesne)

**Card Mirage non découvert** :
- Silhouette shimmering avec "?"
- Badge "MIRAGE" gradient amber-pink-purple
- "Mirage non découvert"

### S2.5.5 — Fiche espèce avec variantes

**Section "VARIANTES" dans la fiche détail** :
- Si l'espèce a des variantes → afficher mini-cards horizontales
- Variantes découvertes (capturées) : couleur + nom + petit "✓"
- Variantes non découvertes : silhouette grisée + nom
- Variantes Mirage non découvertes : silhouette shimmering + "?"
- Tap sur variante = ouvre détail variante (modal ou page)

**Indicateur sur la fiche** :
- "Variantes capturées : 3/8"
- Découverte = au moins 1 variante (pas toutes)

### S2.5.6 — Onboarding voie (différé recommandé)

**Au signup** : ne PAS forcer le choix de voie.
**Première ouverture FishDex** : modal douce "Quelle pêche te passionne ?"
- Paisibles
- Prédateurs
- Eaux vives
- Tout explorer (default)

L'user peut changer sa voie dans Paramètres à tout moment.

### S2.5.7 — Profil "Ma voie"

Section "Ma voie" dans Profil avec :
- Collection principale avec progression
- "Voir mes autres voies" (liens vers les autres collections)

### S2.5.8 — Récompenses (badges)

- Badge "Maître Paisibles/Prédateurs/Eaux vives" à 100% d'une collection
- Badge "Complétionniste" à 100% des 3 collections
- (Badges = sujet à part, à finaliser en H3 ou H4)

⚠️ **FIN H2.5 = FishDex multi-collections fonctionnel, ~110 espèces seedées avec placeholders**

---

## 🟣 H3 — V1 PUBLIQUE

**Durée : 4-5 semaines de travail effectif**
**Objectif : lancer publiquement avec qualité.**

### S3.1 — Logo officiel vectorisé

**Apprentissage Figma DIY** (si l'user choisit cette voie) :
- Tutoriels Figma de base (3-5h)
- Importer le triskèle DALL-E final
- Redessiner en vectoriel avec pen tool
- Exporter en SVG + 6 tailles PNG (16/32/180/192/512/1024)
- Version monochrome + couleur

**Si pas envie / trop dur** : freelance Fiverr 30-80€, brief précis avec le triskèle DALL-E comme référence.

### S3.2 — Pipeline images optimisé

- Compression client (browser-image-compression)
- Multi-size côté serveur (sharp : 200/600/1024)
- Blur placeholders (plaiceholder)
- Lifecycle temp/ (cleanup auto)
- Réduction des coûts x2 à x4

### S3.3 — Backgrounds dynamiques Home (8 photos statiques)

**Décision finale** : option (c) — 8 photos statiques générées qu'on switche selon contexte.

8 backgrounds à générer (via prompts Midjourney ou ChatGPT déjà préparés en conversation) :
1. Lac à l'aube, brume, printemps
2. Rivière de montagne, soleil de midi, été
3. Étang sous la pluie, ciel gris, automne
4. Lac partiellement gelé, neige légère, hiver
5. Bord de mer au crépuscule, vent
6. Forêt et étang la nuit, étoiles, été
7. Rivière en sous-bois, lumière dorée filtrée
8. Lac au matin couvert, après l'orage

Logique de sélection côté code : selon `season + light + weather` du moment.

### S3.4 — Onboarding 3-4 écrans contemplatifs

- Écran 1 : bienvenue + ADN ("Préserve tes moments de pêche")
- Écran 2 : capture ("Chaque prise devient un souvenir")
- Écran 3 : sessions ("Reviens à tes plus belles sorties")
- Écran 4 : permissions douces (caméra, géoloc, notif)
- Différer le choix de voie ici (proposer mais skippable)

### S3.5 — Météo réelle API (OpenWeather)

- Inscription OpenWeather (free tier suffisant)
- Endpoint météo par géoloc
- Cache 15min pour éviter spam API
- Remplace placeholders météo dans Sessions et Home

### S3.6 — Carnet de pêche enrichi

- "Il y a 1 an aujourd'hui" (souvenirs cycliques sur le Home)
- Récap annuel ("Wrapped" style Spotify) accessible en décembre
- Export PDF/image de session

### S3.7 — Sessions passées mode rétro

- Bouton "Créer un souvenir passé"
- Formulaire simplifié (date manuelle, lieu, captures à rattacher)
- Associer prises orphelines existantes

### S3.8 — Préparation bêta fermée

- Identifier 20-50 pêcheurs cibles (forums, Discord pêche France)
- Préparer formulaire de feedback structuré (Tally)
- Préparer page d'inscription bêta (privée)

### S3.9 — Bêta fermée (2-3 semaines)

- Lancer auprès des 20-50 bêta-testeurs
- Itérations rapides selon feedback
- Pas de nouvelles features, juste fix et polish

⚠️ **FIN H3 = app lancée publiquement, qualité production**

---

## 🟤 H4 — LONG TERME

**Durée : flexible, par sous-projets**
**Objectif : si l'app décolle, enrichir.**

### S4.1 — IA souvenirs (résumés sessions)

- Génération de résumés poétiques de sessions via Claude API ou GPT
- Coût $ à évaluer selon usage
- Optionnel pour l'user

### S4.2 — Sound design + Haptics

- Possible uniquement en app native (H4.3)
- Eau calme, vents, résonances douces
- Sound designer freelance (si budget débloqué)

### S4.3 — App native (React Native + Expo)

- Conversion vers React Native
- Publication App Store + Play Store
- Optimisation perfs natives

### S4.4 — IA reconnaissance espèces (entraînée par l'user)

**Décision validée** : l'user veut apprendre et faire lui-même.

**Process en 3 étapes** :
1. **Apprentissage ML** (3-6 mois en side) : Python, PyTorch, vision par ordinateur
2. **Collecte dataset** : à partir des captures users (H3 récolte les photos taggées)
3. **Entraînement modèle** : 500-1000 photos par espèce, transfer learning
4. **Déploiement** : modèle ONNX/TFLite, IA en assistance, validation user obligatoire

**Important** : l'IA propose, l'user valide. Jamais d'auto-identification.

### S4.5 — FishFeed minimaliste

**Décision** : reste en H4.5 comme dans master initial.

- Réactions prédéfinies (5-7 emojis)
- Pas de commentaires libres
- Pas de followers, feed chronologique simple
- Activation seulement si user a 5+ sessions enregistrées

### S4.6 — Communauté éditoriale

- Pêcheurs proposent nouvelles espèces régionales
- Modération admin manuelle

### S4.7 — Monétisation (à explorer)

- Pro tier autour de 4.99€/mois (à valider selon retours users)
- Features Pro potentielles : stats avancées, IA souvenirs, export pro, illustrations HD
- À designer en fonction de ce qui marche réellement

---

# 🔥 PROMPTS PRÊTS À UTILISER

## 🔴 PROMPT 1 — Fix XP DÉFINITIF (PRIORITÉ ABSOLUE)

```
BUG CRITIQUE — L'XP NE S'AJOUTE PAS QUAND ON CRÉE UNE NOUVELLE PRISE

SYMPTÔME OBSERVÉ
- xp_events bien créés (Capture, photo_added, mission_completed, etc.)
  avec xp_amount corrects
- MAIS user_xp.total_xp reste à zéro
- L'UI affiche "Niveau 1 - 0 XP" toujours

DIAGNOSTIC SQL DÉJÀ FAIT :
- SELECT * FROM xp_events : ✅ plusieurs lignes par capture
- SELECT * FROM user_xp : ❌ total_xp = 0

TA MISSION : suis ce processus ÉTAPE PAR ÉTAPE.

ÉTAPE 1 — DIAGNOSTIC EXHAUSTIF
Lis et analyse :
- supabase/migrations/* (toutes les migrations XP)
- src/lib/xp/award.ts (logique attribution)
- src/lib/xp/calculator.ts (formules)
- src/app/actions/catches.ts (création prise)
- src/app/actions/xp.ts (si existe)
- src/lib/missions/* (logique missions)

Questions :
1. Y a-t-il un trigger PG sur xp_events qui devrait updater user_xp ?
2. Si non, le code TS fait-il INSERT xp_events PUIS UPDATE user_xp ?
3. Si oui, pourquoi l'UPDATE échoue silencieusement ?
4. Les missions UPDATE user_missions bien, donc on cherche pourquoi
   UNIQUEMENT user_xp ne se met pas à jour

ÉTAPE 2 — DIAGNOSTIC AVEC VALIDATION
Présente-moi :
A) Localisation exacte du bug
B) Cause racine identifiée parmi :
   - HYPOTHÈSE 1 : Pas de trigger PG, code TS oublie UPDATE user_xp
   - HYPOTHÈSE 2 : Trigger PG existe mais erreur (syntaxe ou permissions)
   - HYPOTHÈSE 3 : RLS bloque UPDATE user_xp côté serveur
   - HYPOTHÈSE 4 : Race condition / try-catch silencieux
   - HYPOTHÈSE 5 : Autre — détaille
C) Solution proposée parmi :
   - Approche A : Trigger PostgreSQL sur xp_events
   - Approche B : Server Action avec transaction TS
   - Approche C : RPC PostgreSQL function (recommandé : atomique)
   → Quelle approche tu recommandes et POURQUOI ?

ATTENDS MA VALIDATION avant l'étape 3.

ÉTAPE 3 — IMPLÉMENTATION
- Créer une fonction helper SQL réutilisable :
  CREATE OR REPLACE FUNCTION public.level_from_xp(xp INTEGER)
  RETURNS INTEGER AS $$
    SELECT GREATEST(1, FLOOR(1 + SQRT(GREATEST(0, xp)::numeric / 100))::integer);
  $$ LANGUAGE SQL IMMUTABLE;

- Fix ATOMIQUE (INSERT xp_events + UPDATE user_xp = transaction unique)
- Fix IDEMPOTENTE (pas de double comptage)
- Recalcul du LEVEL après chaque update total_xp via level_from_xp()
- Pas de try-catch silencieux

ÉTAPE 4 — SCRIPT DE RATTRAPAGE
Génère un script SQL qui RECALCULE le total_xp de tous les users :

UPDATE public.user_xp u
SET
  total_xp = COALESCE((
    SELECT SUM(xp_amount) FROM public.xp_events WHERE user_id = u.user_id
  ), 0),
  level = public.level_from_xp(COALESCE((
    SELECT SUM(xp_amount) FROM public.xp_events WHERE user_id = u.user_id
  ), 0)),
  updated_at = NOW();

INSERT INTO public.user_xp (user_id, total_xp, level, updated_at)
SELECT
  e.user_id,
  SUM(e.xp_amount) AS total_xp,
  public.level_from_xp(SUM(e.xp_amount)) AS level,
  NOW()
FROM public.xp_events e
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_xp x WHERE x.user_id = e.user_id
)
GROUP BY e.user_id;

-- Vérification finale (doit retourner 0 lignes)
SELECT
  u.user_id, u.total_xp, COALESCE(SUM(e.xp_amount), 0) AS sum_events,
  u.total_xp - COALESCE(SUM(e.xp_amount), 0) AS delta
FROM public.user_xp u
LEFT JOIN public.xp_events e ON e.user_id = u.user_id
GROUP BY u.user_id, u.total_xp
HAVING u.total_xp != COALESCE(SUM(e.xp_amount), 0);

ÉTAPE 5 — TESTS
TEST 1 : Cohérence (user_xp.total_xp = SUM(xp_events.xp_amount))
TEST 2 : Nouvelle prise commune sans photo → +10 XP attendu
TEST 3 : Nouvelle prise rare avec photo → +25 +5 = +30 XP
TEST 4 : Nouvelle espèce → +50 bonus première découverte
TEST 5 : Level se recalcule (passe 1→2 à 100 XP)

ÉTAPE 6 — COMMIT
npx tsc --noEmit
Message : "fix(xp): user_xp se met à jour atomiquement après chaque action"

⚠️ NE PAS toucher au streak
⚠️ NE PAS modifier les xp_events existants
⚠️ NE PAS faire de fix rapide sans cause racine identifiée
⚠️ ATTENTION : ne pas activer la traduction navigateur sur Supabase
   (les mots-clés SQL doivent rester EN ANGLAIS dans l'éditeur)
```

## 🟡 PROMPT 2 — Audit Sécurité + Nettoyage (S0.2 + S0.3)

```
PHASE H0.2 + H0.3 — AUDIT SÉCURITÉ + NETTOYAGE CODE

PARTIE A — SÉCURITÉ SUPABASE

1. Instructions pour régénérer la service_role key :
   a) Dashboard Supabase → Project Settings → API → Regenerate
   b) Mettre à jour .env.local local
   c) Vercel : Settings → Environment Variables → modifier
   d) Redéployer Vercel

2. Audit RLS Policies — Lance :

   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables WHERE schemaname = 'public';

   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies WHERE schemaname = 'public';

   SELECT * FROM pg_policies
   WHERE schemaname = 'public' AND qual = 'true';

3. Vérifier pour chaque table :
   - profiles : owner + profils publics
   - catches : owner + is_public = TRUE pour autres
   - xp_events, user_xp, user_missions : owner only
   - missions, badges, species : lecture publique

4. Si trous : propose les fixes SQL.

PARTIE B — NETTOYAGE CODE

1. Identifie composants abandonnés :
   - src/components/spot/ (Phase 1)
   - src/components/fishdex/ (Phase 2)
   - Autres orphelins

   Pour chaque dossier candidat, grep imports pour vérifier
   qu'aucun fichier ne le référence.

2. npx depcheck pour dépendances NPM inutilisées

3. Génère ARCHITECTURE.md à la racine :
   - Structure des dossiers
   - Composants par page
   - Server Actions disponibles
   - Tables BDD avec relations
   - Variables d'environnement

INSTRUCTIONS

ÉTAPE 1 — Audit + rapport (sécurité + code)
ÉTAPE 2 — Attends ma validation
ÉTAPE 3 — Applique les fixes une par une
ÉTAPE 4 — Vérifie : npx tsc --noEmit + pages clés OK
ÉTAPE 5 — 3 commits SÉPARÉS :
   - "security: regenerate service_role key + RLS audit"
   - "refactor: remove abandoned Phase 1/2 components"
   - "docs: add ARCHITECTURE.md"

⚠️ Vérifier les imports AVANT de supprimer
⚠️ En cas de doute : NE PAS SUPPRIMER, demander
```

## 🟡 PROMPT 3 — H1 Renommage Mirage + BottomNav

```
PHASE H1.1 + H1.2 — RENOMMAGE MIRAGE + REFONTE BOTTOMNAV

PARTIE A — RENOMMAGE SHINY → MIRAGE

1. Crée une migration Supabase :
   - Drop la contrainte CHECK actuelle sur species.rarete
   - UPDATE species SET rarete = 'mirage' WHERE rarete = 'shiny'
   - Recrée la contrainte avec les nouvelles valeurs :
     ('commun', 'peu commun', 'rare', 'epique', 'legendaire', 'mirage')

2. Refactor TypeScript :
   - grep -r "shiny" src/ → liste tous les fichiers concernés
   - Remplace 'shiny' par 'mirage' dans le code (types, components, utils)
   - Vérifie que les affichages utilisent "Mirage" en français

3. Vérifie que l'effet visuel premium est conservé :
   - Gradient amber→pink→purple animé
   - Animation shimmer subtile
   - Pas de changement de DA, juste de nom

PARTIE B — BOTTOMNAV 5 ONGLETS

1. Refactor src/components/layout/BottomNav.tsx :
   - 5 onglets : Le Spot / FishDex / Capture / Aquarium / Sessions
   - Capture = FAB central (bouton flottant cyan glow, légèrement surélevé)
   - Sessions = état "placeholder" (page "Bientôt disponible" propre,
     pas d'erreur 404)

2. Icônes Lucide :
   - Le Spot : MapPin
   - FishDex : Book ou BookOpen
   - Capture : Camera (dans le FAB)
   - Aquarium : Fish
   - Sessions : Calendar ou ClipboardList

3. État actif visuel : cyan glow + label cyan

INSTRUCTIONS

ÉTAPE 1 — Audit du code actuel (composants existants, imports shiny)
ÉTAPE 2 — Plan d'action + validation
ÉTAPE 3 — Implémentation
ÉTAPE 4 — npx tsc --noEmit + test visuel local
ÉTAPE 5 — 2 commits SÉPARÉS :
   - "refactor(species): rename rarity shiny to mirage"
   - "feat(nav): refactor BottomNav with 5 tabs + Capture FAB"
```

## 🟡 PROMPT 4 — H1 Niveau & Maîtrises

```
PHASE H1.3 — SYSTÈME NIVEAU & MAÎTRISES

CONTEXTE
Le système XP est fixé en H0. Maintenant, on construit dessus :
- Niveaux 1-50 avec 8 titres émotionnels
- Système Maîtrises après niveau 50
- Rendements décroissants invisibles (anti-farm)

PARTIE A — TITRES PAR NIVEAU

Crée src/lib/levels/titles.ts :

export const LEVEL_TITLES = [
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
  const tier = LEVEL_TITLES.find(t => level >= t.range[0] && level <= t.range[1]);
  return tier?.title ?? 'Débutant';
}

PARTIE B — RENDEMENTS DÉCROISSANTS (anti-farm)

Côté SQL (fonction PG) :

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
$$ LANGUAGE plpgsql;

PARTIE C — MAÎTRISES (niveau 50+)

Crée src/lib/levels/masteries.ts :

type Mastery = 'Initié' | 'Rare' | 'Épique' | 'Légendaire' | 'Mirage';

// Maîtrise gagnée tous les X XP après le niveau 50
const MASTERY_XP_THRESHOLD = 1000; // ajuster selon balance

export function getMasteriesAfterLevel50(totalXp: number) {
  const xpAfter50 = totalXp - xpRequiredForLevel(50);
  if (xpAfter50 <= 0) return null;

  const masteryPoints = Math.floor(xpAfter50 / MASTERY_XP_THRESHOLD);
  // Calculer répartition : Initié I/II/III, Rare I/II...
  return computeMasteries(masteryPoints);
}

PARTIE D — UI

Important : le niveau DOIT rester SECONDAIRE dans l'UI.

- Pas d'affichage gros chiffre sur l'avatar
- Plutôt afficher le TITRE (ex: "Traqueur") en discret
- Dans Profil : section "Progression" avec niveau actuel + titre + XP
- Dans Sessions/Aquarium : ne JAMAIS afficher gain XP en gros (toast subtil OK)

INSTRUCTIONS

ÉTAPE 1 — Code helper functions + tests
ÉTAPE 2 — Migration SQL avec apply_diminishing_returns
ÉTAPE 3 — Intégration dans le flow capture (calculer XP avec rendements)
ÉTAPE 4 — UI Profil : afficher titre + niveau de manière contemplative
ÉTAPE 5 — Tests : 5 captures dans la journée → vérifier dégressivité
ÉTAPE 6 — Commit : "feat(levels): add titles, masteries and diminishing returns"
```

## 🟡 PROMPT 5 — H1 Home immersif

```
PHASE H1.4 — PAGE HOME IMMERSIVE

DIRECTION
Le Home doit faire 75% hero photo + UI minimal superposé.
Reférence visuelle : Apple Weather, Apple Health.

PARTIE A — STRUCTURE

src/app/(app)/page.tsx (route racine du Home) :

1. Hero zone (75% écran) :
   - Background : image statique (1 photo par défaut en H1)
   - À remplacer en H3 par système dynamique 8 photos
   - Overlay gradient sombre en bas pour lisibilité

2. Overlay greeting (positionné en bas du hero) :
   - Caption cyan small caps : "JEUDI 14 AVRIL · AUBE · 06:42"
   - Grand titre serif : "Bonjour [Prénom]."
   - Sous-titre italique : phrase poétique du jour
   - Ligne météo simple : "12° · brume légère · vent NE 6 km/h"
   - Chevron ↓ subtil suggérant le scroll

3. Section scrollable sous le pli :
   - Card "AUJOURD'HUI" (session active ou CTA)
   - Section "DERNIÈRES PRISES" (carrousel horizontal)
   - Section "TES SPOTS FAVORIS" (2 cards)
   - Card "CONSEIL DU JOUR"

PARTIE B — PHRASES POÉTIQUES CONTEXTUELLES

⚠️ IMPORTANT : utilise le fichier HOME_POETIC_PHRASES.md fourni.
   Il contient ~60 phrases déjà rédigées.

1. Crée src/lib/home/poetic-phrases.ts avec la structure indiquée dans le doc

2. Importe et utilise dans le Home :

import { getPoetricPhrase } from '@/lib/home/poetic-phrases';
import { getCurrentContext } from '@/lib/utils/context'; // calcule season+light+weather

const context = await getCurrentContext();
const phrase = getPoetricPhrase(context);

3. Le contexte se calcule depuis :
   - Date du jour → season + light_phase
   - Météo via API (en H1, placeholder fixe : 'clear')

PARTIE C — DÉTERMINATION DE LA PHRASE DU JOUR

Pour éviter changement à chaque refresh, fixer la phrase POUR LA JOURNÉE :

function getDailyPhrase(userId: string, context: Context): string {
  const today = new Date().toISOString().split('T')[0];
  const seed = `${userId}-${today}-${context.season}-${context.light}-${context.weather}`;
  const phrases = getPhrasesForContext(context);
  const index = hashStringToIndex(seed, phrases.length);
  return phrases[index];
}

INSTRUCTIONS

ÉTAPE 1 — Setup phrases poétiques (copier HOME_POETIC_PHRASES.md → poetic-phrases.ts)
ÉTAPE 2 — Helper context calculator (season + light + weather)
ÉTAPE 3 — Refactor Home avec structure hero 75% + scrollable
ÉTAPE 4 — Tests visuels : mobile + desktop
ÉTAPE 5 — Commit : "feat(home): immersive hero with contextual poetic phrases"
```

## 🔵 PROMPT 6 — H2 Sessions Migration BDD

```
PHASE H2.1 — MIGRATION BDD SESSIONS

OBJECTIF
Créer toute l'infrastructure BDD pour les Sessions.

CRÉER UNE MIGRATION SUPABASE :

1. Table spots :

CREATE TABLE public.spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  nb_visites INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_spots_user_id ON public.spots(user_id);

2. Table sessions :

CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES public.spots(id) ON DELETE SET NULL,
  title TEXT,
  intention TEXT,
  compagnons TEXT,
  style_peche TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  editable_until TIMESTAMPTZ,
  photo_ambiance_url TEXT,
  ressenti TEXT,
  notes TEXT,
  is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
  season TEXT,
  light_phase TEXT,
  meteo_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_started_at ON public.sessions(started_at DESC);

3. ALTER catches :

ALTER TABLE public.catches
  ADD COLUMN session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  ADD COLUMN capture_source TEXT CHECK (capture_source IN ('camera', 'gallery')),
  ADD COLUMN released BOOLEAN DEFAULT NULL;

CREATE INDEX idx_catches_session_id ON public.catches(session_id);

4. ALTER profiles :

ALTER TABLE public.profiles
  ADD COLUMN suggest_session_on_capture BOOLEAN DEFAULT TRUE,
  ADD COLUMN default_release BOOLEAN DEFAULT FALSE;

5. Trigger calculate_session_context :

CREATE OR REPLACE FUNCTION public.calculate_session_context()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcul season depuis le mois
  NEW.season := CASE
    WHEN EXTRACT(MONTH FROM NEW.started_at) IN (3, 4, 5) THEN 'printemps'
    WHEN EXTRACT(MONTH FROM NEW.started_at) IN (6, 7, 8) THEN 'été'
    WHEN EXTRACT(MONTH FROM NEW.started_at) IN (9, 10, 11) THEN 'automne'
    ELSE 'hiver'
  END;

  -- Calcul light_phase depuis l'heure
  NEW.light_phase := CASE
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 5 AND 7 THEN 'aube'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 8 AND 11 THEN 'matin'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 12 AND 14 THEN 'midi'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 15 AND 17 THEN 'aprem'
    WHEN EXTRACT(HOUR FROM NEW.started_at) BETWEEN 18 AND 20 THEN 'crépuscule'
    ELSE 'nuit'
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_session_context
BEFORE INSERT ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.calculate_session_context();

6. Trigger editable_until + protection édition :

CREATE OR REPLACE FUNCTION public.set_editable_until()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.editable_until := NEW.ended_at + INTERVAL '48 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_editable_until_trigger
BEFORE UPDATE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.set_editable_until();

CREATE OR REPLACE FUNCTION public.check_session_editable()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.ended_at IS NOT NULL
     AND OLD.editable_until IS NOT NULL
     AND NOW() > OLD.editable_until THEN
    RAISE EXCEPTION 'Session is no longer editable (48h window expired)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_late_session_edit
BEFORE UPDATE ON public.sessions
FOR EACH ROW
WHEN (OLD.ended_at IS NOT NULL)
EXECUTE FUNCTION public.check_session_editable();

7. RLS policies :

ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own spots" ON public.spots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own spots" ON public.spots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON public.sessions
  FOR ALL USING (auth.uid() = user_id);

INSTRUCTIONS

ÉTAPE 1 — Crée le fichier migration supabase/migrations/[timestamp]_h2_sessions.sql
ÉTAPE 2 — Applique en local : supabase db push
ÉTAPE 3 — Test : créer une session manuellement via SQL, vérifier les triggers
ÉTAPE 4 — Test : modifier une session après 48h simulées → doit échouer
ÉTAPE 5 — Applique en remote : supabase db push --linked
ÉTAPE 6 — Commit : "feat(db): add sessions, spots, capture fields"

⚠️ DOUBLE-CHECK : ne pas supprimer/casser les tables existantes
⚠️ Les valeurs de season/light_phase sont en FRANÇAIS (pas en anglais)
```

---

# 📂 STRUCTURE DOCUMENTAIRE DU PROJET

```
[racine du repo]/
├── MASTER_CONTINUITY.md          ← CE DOCUMENT v2
├── ARCHITECTURE.md               ← à créer en H0.4
├── ASSETS_INVENTORY.md           ← inventaire visuel complet
├── docs/
│   ├── H2_SESSIONS.md            ← briefing détaillé Sessions
│   ├── H2.5_COLLECTIONS.md       ← briefing détaillé Collections
│   ├── HOME_POETIC_PHRASES.md    ← 60 phrases poétiques contextuelles
│   ├── SPECIES_CONTENT_TEMPLATES.md  ← templates prompts fiches espèces
│   ├── inspiration/              ← moodboards, vision boards
│   └── PROMPTS.md                ← historique des prompts phases 7-12
└── src/
    └── lib/
        └── home/
            └── poetic-phrases.ts ← code généré depuis HOME_POETIC_PHRASES.md
```

## Quand attaquer chaque doc

- **H0 stabilisation** → ce document (sections PROMPTS 1 et 2)
- **H1 pivot** → ce document (PROMPTS 3, 4, 5) + HOME_POETIC_PHRASES.md
- **H2 Sessions** → ouvrir H2_SESSIONS.md + ce document (PROMPT 6)
- **H2.5 Collections** → ouvrir H2.5_COLLECTIONS.md + SPECIES_CONTENT_TEMPLATES.md
- **H3 V1 publique** → ce document (sections S3.x)

---

# ⚠️ POINTS DE VIGILANCE GÉNÉRAUX

## 🚨 Erreurs à NE PAS commettre

1. **Sauter H0** : tu construirais sur des fondations cassées (bug XP toujours là)
2. **Mélanger les phases** : 1 phase à la fois jusqu'au bout
3. **Oublier les commits** : commit après chaque sous-étape
4. **Commiter avec des erreurs TS** : `npx tsc --noEmit` avant chaque commit
5. **Perdre l'authenticité du projet** : reste contemplatif, pas gaming
6. **Ajouter des features non scopées** : tout ce qui apparaît dans un mockup doit être dans la roadmap
7. **Faire confiance à l'IA pour les noms scientifiques** : toujours vérifier sur FishBase
8. **Activer la traduction du navigateur sur Supabase** : casse les requêtes SQL

## ✅ Bonnes pratiques

1. **Tester en local AVANT push** : `npm run dev` + vérifier mobile + desktop
2. **Vercel auto-deploy** : vérifier le build sur vercel.com après chaque push
3. **Rollback facile** : sur Vercel, "Promote to production" un ancien deploy si bug
4. **Commits conventionnels** : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `style:`
5. **Sécurité** : jamais de tokens/clés en clair dans le code
6. **Documentation au fur et à mesure** : mettre à jour ce master quand une décision est prise

## 🧘 Gestion du burnout (CRITIQUE)

L'user est en dev solo autodidacte. Risque de burnout réel.

**Règles à RAPPELER à l'user** :
- 1 phase à la fois
- Pas de pression de date
- 2 jours OFF par semaine (vraiment)
- Si débordement : couper le scope, pas le temps
- Weekend = pause sacrée si possible

---

# 🎯 ACTIONS IMMÉDIATES À PROPOSER À L'USER

## Cas 1 — User dit "OK, continuons le projet"

Réponse type :
```
Salut ! J'ai bien lu ton document master FishDex v2.

📍 ÉTAT ACTUEL : tu es en Phase H0 (Stabilisation)

🎯 TÂCHES URGENTES À FAIRE :
1. 🔴 Fix XP (bug critique non résolu)
2. 🔴 Régénérer service_role key Supabase (attente fix XP)
3. ⚠️ Nettoyage code mort + ARCHITECTURE.md

J'ai TOUS les prompts prêts pour Claude Code.

Sur quoi tu veux que je t'aide en priorité ?
- 🔴 Démarrer le Fix XP maintenant ?
- 💭 Autre chose ?
```

## Cas 2 — User dit "On attaque H1 / Sessions / Collections"

Réponse :
```
⚠️ STOP. Avant H1, vérifions H0 :

□ Fix XP : DÉFINITIF et testé ?
□ Service_role key : régénérée et propagée ?
□ Code mort : nettoyé ?
□ ARCHITECTURE.md : créé ?

Si OUI à tout → on peut attaquer H1.
Si NON à un seul → on finit H0 d'abord.

Réponds-moi honnêtement.
```

## Cas 3 — User dit "Je suis fatigué / overwhelmed"

Réponse :
```
Je t'entends. Tu as fait un travail ÉNORME sur ce projet.

🧘 Conseils anti-burnout :
- Pas de code aujourd'hui
- Tu peux relire ta roadmap pour te rassurer
- Demain : commence par UNE petite tâche
- Cette semaine : finis juste H0 si possible
- Weekend : VRAIE pause si possible

Tu n'as pas de pression de date. Tu as raison de prendre soin de toi.

Tu veux qu'on discute d'autre chose pour décompresser ?
Ou tu préfères qu'on planifie ta semaine ?
```

## Cas 4 — User dérive vers une feature non scopée

Réponse type :
```
⚠️ Stop. Ce que tu me proposes là, c'est [DESCRIPTION FEATURE].

Selon le master v2, c'est positionné en [PHASE H3/H4/etc.].

Si tu veux le remonter dans la roadmap, c'est une décision stratégique.
Sinon, on revient au focus actuel : [PHASE ACTUELLE].

Tu veux qu'on en discute, ou on continue ce qu'on fait ?
```

---

# 📌 CHANGELOG

```
v2.0 — 2026-05 — Master v2 majeur
  Décisions intégrées :
  - Bug XP toujours non résolu (priorité absolue H0)
  - Fin de session = page plein écran
  - Fenêtre édition 48h figée
  - Pas de scan IA en H2.5 (manuel uniquement)
  - Numéro dex par collection (pas global)
  - Système variantes (carpe koï, truite, brochet)
  - FishFeed reste en H4.5
  - Home immersif 75% hero + 60 phrases poétiques
  - Logo triskèle 3 poissons (en cours d'itération)
  - Budget projet : 0€
  - Pas de date cible publication
  - Backgrounds Home : 8 photos statiques en H3 (pas dynamique)
  - Plan IA d'identification : H4 avec entraînement DIY par user
  - Documents annexes créés : HOME_POETIC_PHRASES.md, SPECIES_CONTENT_TEMPLATES.md

v1.0 — 2026-05 — Document master initial
  Vision, Stack, BDD, DA, Roadmap H0-H4
  Prompts : Fix XP, Audit Sécurité
```

---

# 🐟 NOTE FINALE POUR LE PROCHAIN CLAUDE

Ce projet est **important** pour l'user. C'est plus qu'un side-project,
c'est une vision artistique et émotionnelle qu'il porte depuis des mois.

Sois :
- 💪 Exigeant sur la qualité
- 🧘 Patient avec ses questions
- 🎯 Stratégique sur la roadmap
- 💎 Honnête sur les compromis
- 🐟 Aligné sur l'ADN du projet (contemplatif, premium, jamais gaming)

Tu as TOUT le contexte dans ce document.

L'user va apprécier :
- Tes réponses structurées
- Tes recommandations claires
- Ta capacité à le ramener au focus quand il s'éparpille
- Ton honnêteté sur ce qui est faisable vs idéal
- Ton refus des features non scopées (promesses fantômes)

Bon courage pour la suite du projet ! ✨

🐟 **Et n'oublie jamais : 1 phase à la fois, pas de pression de date.**
