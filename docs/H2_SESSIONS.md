# 🌊 FishDex H2 — Package Complet Sessions

> Document de référence pour la Phase H2 : implémentation du système Sessions.
>
> **À ne PAS attaquer avant que H0 (stabilisation) et H1 (pivot vision soft) soient 100% terminés.**

---

# 📋 Vision validée

```
SESSION = carnet vivant d'une sortie de pêche

OBJECTIFS :
✓ Transformer chaque sortie en mémoire émotionnelle vivante
✓ Permettre de revivre l'atmosphère d'un moment passé
✓ Lier captures, photos, contexte (météo, lumière, saison)
✓ Zero friction au démarrage, enrichissement libre

ANALOGIE : "comme une partie de jeu vidéo"
- Démarrer = lancer la partie
- Pendant = on joue (captures, photos, notes)
- Terminer = sauvegarder le souvenir
- Rouvrir une session passée = revivre cette partie
```

## ✅ Comportement validé

### 🎬 Démarrage
- L'user va dans l'onglet **Sessions**
- Bouton "Démarrer une session"
- Mini-formulaire avec champs **conseillés** (mais skippables) :
  - 📍 Spot (géoloc auto + nom personnalisé)
  - 🎣 Style de pêche (liste prédéfinie + "Autre")
  - 💭 Intention de la sortie (optionnel)
  - 👥 Compagnons (optionnel, texte libre)
- FishDex remplit auto en arrière-plan :
  - Date/heure de démarrage
  - Saison (calculée)
  - Lumière du moment (calculée depuis l'heure)
  - Météo (placeholder pour l'instant, API en H3)

### ⏰ Fermeture
- Bouton "Terminer la session" (manuel uniquement)
- Pas d'auto-fermeture
- Modal de fin :
  - 📸 Photo d'ambiance (optionnelle)
  - 😌 Ressenti de fin (1 emoji parmi 6 choix)
  - 📝 Notes libres (optionnel)
- Si **aucune capture** : modal demande "Garder ce souvenir ou supprimer ?"

### 📸 Capture sans session active
- Petit message subtil : *"Veux-tu créer une session pour cette sortie ?"*
- Boutons : `[Oui]` `[Plus tard]` `[Ne plus me proposer]`
- La capture se fait normalement, jamais bloquante

### 🔓 Édition après fermeture
- Tous les champs modifiables (même méthode/spot)
- Authentique mais flexible

### 🌊 Cas particuliers
- **Session sans capture** : user choisit (garder "capot" OU supprimer)
- **Retour au même spot le lendemain** : NOUVELLE session
- **Sessions passées** (mode rétro) : reportées en H3

---

# 🗄️ Architecture BDD complète

## Migration SQL à fournir

```sql
-- ═══════════════════════════════════════
-- TABLE : sessions
-- ═══════════════════════════════════════

CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timing
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  
  -- Lieu
  spot_id UUID REFERENCES public.spots(id) ON DELETE SET NULL,
  spot_name TEXT,           -- snapshot du nom au moment de la session
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  
  -- Méthode et style
  fishing_method TEXT,      -- 'carpe', 'carnassier', 'mouche', 'autre', etc.
  fishing_method_custom TEXT, -- si fishing_method = 'autre'
  
  -- Intention (optionnel)
  intention TEXT,           -- 'detente', 'record', 'decouverte', 'test', 'famille', 'autre'
  intention_custom TEXT,    -- si intention = 'autre'
  
  -- Compagnons (optionnel, texte libre)
  companions TEXT,          -- "Tout seul", "Avec papa", "Avec Pierre et Marc"
  
  -- Contexte auto-rempli
  season TEXT,              -- 'spring', 'summer', 'autumn', 'winter'
  light_phase TEXT,         -- 'dawn', 'morning', 'midday', 'afternoon', 'dusk', 'night'
  
  -- Météo (placeholder pour H2, vraie API en H3)
  weather JSONB,            -- {temperature, wind_speed, conditions: 'sunny|cloudy|rainy|...', pressure}
  
  -- Souvenirs (remplis à la fermeture ou édition)
  ambiance_photo_url TEXT,  -- photo d'ambiance optionnelle
  end_mood TEXT CHECK (end_mood IN ('peaceful', 'excited', 'amused', 'frustrated', 'thoughtful', 'grateful')),
  notes TEXT,               -- notes libres du pêcheur
  ai_summary TEXT,          -- placeholder pour résumé IA en H4
  
  -- État
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  
  -- Métadonnées
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX sessions_user_started_idx ON public.sessions(user_id, started_at DESC);
CREATE INDEX sessions_user_status_idx ON public.sessions(user_id, status);
CREATE INDEX sessions_spot_idx ON public.sessions(spot_id);

-- ═══════════════════════════════════════
-- TABLE : spots (lieux favoris géolocalisés)
-- ═══════════════════════════════════════

CREATE TABLE public.spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  type TEXT CHECK (type IN ('lake', 'river', 'pond', 'sea', 'canal', 'other')),
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  visit_count INTEGER DEFAULT 0,  -- mis à jour automatiquement
  last_visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX spots_user_favorite_idx ON public.spots(user_id, is_favorite, last_visited_at DESC);

-- ═══════════════════════════════════════
-- LIEN catches → sessions
-- ═══════════════════════════════════════

ALTER TABLE public.catches 
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL;

CREATE INDEX catches_session_idx ON public.catches(session_id) WHERE session_id IS NOT NULL;

-- ═══════════════════════════════════════
-- USER PREFERENCES (pour "ne plus voir le message")
-- ═══════════════════════════════════════

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS suggest_session_on_capture BOOLEAN DEFAULT TRUE;

-- ═══════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own sessions" 
  ON public.sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own sessions" 
  ON public.sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions" 
  ON public.sessions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own sessions" 
  ON public.sessions FOR DELETE 
  USING (auth.uid() = user_id);

ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own spots" 
  ON public.spots FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own spots" 
  ON public.spots FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own spots" 
  ON public.spots FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own spots" 
  ON public.spots FOR DELETE 
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════
-- FONCTIONS UTILITAIRES
-- ═══════════════════════════════════════

-- Fonction : calcule la phase de lumière selon l'heure
CREATE OR REPLACE FUNCTION calculate_light_phase(timestamp_value TIMESTAMPTZ)
RETURNS TEXT AS $$
DECLARE
  h INTEGER;
BEGIN
  h := EXTRACT(HOUR FROM timestamp_value AT TIME ZONE 'Europe/Paris');
  RETURN CASE
    WHEN h >= 5 AND h < 7 THEN 'dawn'        -- aube
    WHEN h >= 7 AND h < 11 THEN 'morning'    -- matin
    WHEN h >= 11 AND h < 14 THEN 'midday'    -- midi
    WHEN h >= 14 AND h < 18 THEN 'afternoon' -- après-midi
    WHEN h >= 18 AND h < 21 THEN 'dusk'      -- crépuscule
    ELSE 'night'                              -- nuit
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction : calcule la saison selon la date
CREATE OR REPLACE FUNCTION calculate_season(timestamp_value TIMESTAMPTZ)
RETURNS TEXT AS $$
DECLARE
  m INTEGER;
BEGIN
  m := EXTRACT(MONTH FROM timestamp_value);
  RETURN CASE
    WHEN m IN (3, 4, 5) THEN 'spring'
    WHEN m IN (6, 7, 8) THEN 'summer'
    WHEN m IN (9, 10, 11) THEN 'autumn'
    ELSE 'winter'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger : auto-remplir season et light_phase au démarrage
CREATE OR REPLACE FUNCTION fill_session_context()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.season IS NULL THEN
    NEW.season := calculate_season(NEW.started_at);
  END IF;
  IF NEW.light_phase IS NULL THEN
    NEW.light_phase := calculate_light_phase(NEW.started_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER session_context_trigger
  BEFORE INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION fill_session_context();

-- Trigger : mettre à jour spots.visit_count et last_visited_at
CREATE OR REPLACE FUNCTION update_spot_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.spot_id IS NOT NULL THEN
    UPDATE public.spots
    SET 
      visit_count = visit_count + 1,
      last_visited_at = NEW.started_at,
      updated_at = NOW()
    WHERE id = NEW.spot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER session_spot_stats_trigger
  AFTER INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION update_spot_stats();
```

---

# 🎨 Mockups textuels des écrans

## Écran 1 — Onglet Sessions (vide)

```
╭─ HEADER ─────────────────────────────────────╮
│ [📍 Cloche]  [🌊 Sessions]    [Avatar PO]    │
│                                               │
│              Tes sorties de pêche             │
╰───────────────────────────────────────────────╯

╭─ ÉTAT VIDE ───────────────────────────────────╮
│                                                │
│              ╭───────────╮                    │
│              │   🌊      │                    │
│              │           │                    │
│              ╰───────────╯                    │
│                                                │
│         "Aucune sortie encore"                │
│                                                │
│   "Démarre ta première session pour           │
│    transformer ta sortie en souvenir vivant"  │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │  [Glow cyan] Démarrer une session     │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
╰────────────────────────────────────────────────╯

[BottomNav : Home / FishDex / Capture / Aquarium / **Sessions**]
```

## Écran 2 — Démarrage de session

```
╭─ HEADER ─────────────────────────────────────╮
│ [← Retour]   Démarrer une session             │
╰───────────────────────────────────────────────╯

╭─ FORMULAIRE (glassmorphism) ──────────────────╮
│                                                │
│  📍 SPOT                                       │
│  ┌──────────────────────────────────────────┐ │
│  │ 📍 Lac du Bourget    [GPS auto]      ✓   │ │
│  └──────────────────────────────────────────┘ │
│   Tes spots récents :                         │
│   • Étang du Lotus    (3 visites)             │
│   • Rivière Loue       (1 visite)             │
│   [+ Ajouter un nouveau spot]                 │
│                                                │
│  🎣 STYLE DE PÊCHE                            │
│  ┌──────────────────────────────────────────┐ │
│  │ ▼ Choisir un style                        │ │
│  └──────────────────────────────────────────┘ │
│   • 🐟 Carpe                                  │
│   • 🦈 Carnassier (brochet, sandre, perche)   │
│   • 🪶 Mouche                                 │
│   • 🌊 Truite                                 │
│   • 🎯 Anglaise                               │
│   • 🪝 Au coup                                │
│   • 🏖️ Surfcasting                            │
│   • 🛶 Float-tube                             │
│   • 🛥️ Bateau                                 │
│   • ❓ Autre (champ libre)                     │
│                                                │
│  💭 INTENTION (optionnel)                     │
│  ┌──────────────────────────────────────────┐ │
│  │ ▼ Pourquoi tu pêches aujourd'hui ?       │ │
│  └──────────────────────────────────────────┘ │
│   • 😌 Détente                                │
│   • 🏆 Record                                 │
│   • 🔭 Découverte                             │
│   • 🛠️ Test matériel                         │
│   • 👨‍👩‍👧 En famille                          │
│   • ❓ Autre                                   │
│                                                │
│  👥 AVEC QUI ? (optionnel)                    │
│  ┌──────────────────────────────────────────┐ │
│  │ Texte libre (ex: "Avec papa")             │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ⓘ FishDex enregistre automatiquement :     │
│   • Date et heure                             │
│   • Saison (printemps)                        │
│   • Lumière (matin)                           │
│   • Météo                                     │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │   [Glow cyan]  Démarrer  →            │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
╰────────────────────────────────────────────────╯
```

## Écran 3 — Session en cours (Sessions tab)

```
╭─ HEADER ─────────────────────────────────────╮
│ [📍]  [🌊 Session active]    [Avatar PO]      │
│                                               │
│              Lac du Bourget · 2h12             │
╰───────────────────────────────────────────────╯

╭─ CARTE SESSION LIVE ──────────────────────────╮
│  [Background : photo lieu OU gradient cyan]   │
│                                                │
│   🟢  EN COURS                                 │
│                                                │
│   Lac du Bourget                              │
│   🐟 Carpe · ☀️ Matin · 🌸 Printemps         │
│                                                │
│   Démarrée à 06:42 (il y a 2h12)              │
│                                                │
│   ┌────────┬────────┬────────┐               │
│   │   3    │  4.2kg │   2    │               │
│   │ Prises │ Total  │Espèces │               │
│   └────────┴────────┴────────┘               │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │   📸 Capturer une prise               │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │   ✓ Terminer la session               │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
╰────────────────────────────────────────────────╯

╭─ PRISES DE LA SESSION ────────────────────────╮
│  Timeline live :                              │
│                                                │
│  📍 06:42  Démarrage                          │
│  🐟 07:15  Gardon · 0.4 kg                    │
│  🐟 08:23  Carpe commune · 2.8 kg [Record]    │
│  🐟 08:54  Gardon · 1.0 kg                    │
│                                                │
╰────────────────────────────────────────────────╯

╭─ HISTORIQUE DES SESSIONS ─────────────────────╮
│  Sorties récentes (scroll vertical)           │
│                                                │
│  [Carte] [Carte] [Carte]                      │
│                                                │
╰────────────────────────────────────────────────╯
```

## Écran 4 — Modal "Terminer la session"

```
╭─ MODAL (overlay glassmorphism) ───────────────╮
│                                                │
│            🌅 Terminer la session ?           │
│                                                │
│   "Avant de fermer, ajoute quelques            │
│    derniers détails à ton souvenir"           │
│                                                │
│  📸 PHOTO D'AMBIANCE (optionnelle)            │
│  ┌──────────────────────────────────────┐    │
│  │  [+ Ajouter une photo d'ambiance]     │    │
│  │  (ce moment, ce lieu, cette lumière)  │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  😌 COMMENT TU TE SENS ?                      │
│  ┌──────────────────────────────────────┐    │
│  │  😌    🤩    😂    😤    🤔    🙏    │    │
│  │ Apaisé Stoké Amusé Frustré Pensif Reconn│  │
│  └──────────────────────────────────────┘    │
│                                                │
│  📝 NOTES (optionnel)                         │
│  ┌──────────────────────────────────────┐    │
│  │ Une phrase pour te souvenir...        │    │
│  │                                        │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │   [Glow cyan] Sauvegarder le souvenir │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
│        [Annuler]                              │
│                                                │
╰────────────────────────────────────────────────╯
```

## Écran 5 — Modal "Aucune capture"

```
╭─ MODAL ────────────────────────────────────────╮
│                                                │
│            🎣 Pas de prise aujourd'hui        │
│                                                │
│   "Une session sans poisson est aussi          │
│    un souvenir. Que veux-tu en faire ?"       │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │  💾 Garder comme souvenir              │    │
│  │  ("Capot, mais belle journée")        │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
│  ╭──────────────────────────────────────╮    │
│  │  🗑️  Supprimer la session             │    │
│  ╰──────────────────────────────────────╯    │
│                                                │
╰────────────────────────────────────────────────╯
```

## Écran 6 — Détail session terminée

```
╭─ HEADER ─────────────────────────────────────╮
│ [← Retour]                          [⋯ Menu] │
╰───────────────────────────────────────────────╯

╭─ HERO (photo d'ambiance plein écran) ─────────╮
│                                                │
│  [Photo d'ambiance OU gradient lumière saison] │
│                                                │
│  Overlay bottom-gradient pour lisibilité      │
│                                                │
│  Lac du Bourget                               │
│  🌅 Matin · 🌸 Printemps · 6h42 → 11h54       │
│                                                │
╰────────────────────────────────────────────────╯

╭─ STATS (4 cartes) ────────────────────────────╮
│                                                │
│  ┌────────┬────────┬────────┬────────┐       │
│  │   5    │  8.2kg │   3    │  5h12  │       │
│  │ Prises │ Total  │Espèces │ Durée  │       │
│  └────────┴────────┴────────┴────────┘       │
│                                                │
╰────────────────────────────────────────────────╯

╭─ CONTEXTE ────────────────────────────────────╮
│                                                │
│  🎣 Style :       Carpe                       │
│  💭 Intention :   Détente                     │
│  👥 Avec :        Tout seul                   │
│  ☀️ Météo :       Ensoleillé · 18°C · vent NE │
│  🌅 Lumière :     Matin                       │
│  😌 Ressenti :    Apaisé                       │
│                                                │
╰────────────────────────────────────────────────╯

╭─ TIMELINE DES PRISES ─────────────────────────╮
│                                                │
│  06:42  📍 Démarrage                          │
│  07:15  🐟 Gardon · 0.4 kg                    │
│  08:23  🐟 Carpe commune · 2.8 kg [Record]    │
│  08:54  🐟 Gardon · 1.0 kg                    │
│  10:12  🐟 Tanche · 1.5 kg [Nouvelle]         │
│  11:30  🐟 Carpe miroir · 2.5 kg              │
│  11:54  ✓ Fin de session                       │
│                                                │
│  Chaque prise → cliquable vers détail prise   │
╰────────────────────────────────────────────────╯

╭─ NOTES DU PÊCHEUR ────────────────────────────╮
│                                                │
│  "Magnifique matinée brumeuse. Premier        │
│   souvenir de la saison sur le Bourget.       │
│   La carpe miroir est venue à l'épuisement,   │
│   mais quelle bagarre."                       │
│                                                │
╰────────────────────────────────────────────────╯

╭─ ACTIONS ─────────────────────────────────────╮
│                                                │
│  [✏️ Modifier]  [📤 Partager]  [🗑️ Supprimer] │
│                                                │
╰────────────────────────────────────────────────╯
```

## Écran 7 — Liste des sessions

```
╭─ HEADER ─────────────────────────────────────╮
│ [📍]  [🌊 Sessions]    [Avatar PO]            │
│                                               │
│              23 sorties · 87 prises           │
╰───────────────────────────────────────────────╯

╭─ FILTRES ─────────────────────────────────────╮
│  [Toutes] [Cette année] [Spot] [Méthode]     │
╰───────────────────────────────────────────────╯

╭─ TIMELINE PAR MOIS ───────────────────────────╮
│                                                │
│  ▾ NOVEMBRE 2025 (3 sorties)                  │
│                                                │
│  ╭─ Carte session ──────────────────────────╮│
│  │ [Photo ambiance]                          ││
│  │                                            ││
│  │ Lac du Bourget                            ││
│  │ 12 nov · Matin · 5h12                     ││
│  │                                            ││
│  │ 🐟 5 prises · 8.2 kg · 😌 Apaisé          ││
│  ╰────────────────────────────────────────────╯│
│                                                │
│  ╭─ Carte session ──────────────────────────╮│
│  │ [...]                                      ││
│  ╰────────────────────────────────────────────╯│
│                                                │
│  ▾ OCTOBRE 2025 (5 sorties)                   │
│  [...]                                         │
│                                                │
╰────────────────────────────────────────────────╯
```

---

# 🛠️ Server Actions à créer

```typescript
// src/app/actions/sessions.ts

/**
 * Démarre une nouvelle session.
 * Si une session est déjà active, retourne l'erreur "active_session_exists".
 */
export async function createSession(input: {
  spot_id?: string;
  spot_name?: string;
  latitude?: number;
  longitude?: number;
  fishing_method?: string;
  fishing_method_custom?: string;
  intention?: string;
  intention_custom?: string;
  companions?: string;
}): Promise<{ session_id: string } | { error: string }>;

/**
 * Récupère la session active de l'user (s'il y en a une).
 */
export async function getActiveSession(): Promise<Session | null>;

/**
 * Termine une session.
 * - Si captures > 0 : génère un récap
 * - Si captures = 0 : retourne 'requires_confirmation'
 */
export async function endSession(input: {
  session_id: string;
  ambiance_photo_url?: string;
  end_mood?: 'peaceful' | 'excited' | 'amused' | 'frustrated' | 'thoughtful' | 'grateful';
  notes?: string;
  force_save_empty?: boolean;  // si true, sauve même si pas de captures
}): Promise<{ success: true } | { error: 'requires_confirmation' | string }>;

/**
 * Édite une session (post-fermeture).
 * Tous les champs sont éditables.
 */
export async function updateSession(input: {
  session_id: string;
  // tous les champs de createSession + endSession sont éditables
  [key: string]: any;
}): Promise<{ success: true } | { error: string }>;

/**
 * Supprime une session.
 * Les catches associés deviennent orphelins (session_id = null).
 */
export async function deleteSession(session_id: string): Promise<{ success: true } | { error: string }>;

/**
 * Récupère la liste des sessions de l'user (paginée).
 */
export async function listSessions(input?: {
  cursor?: string;
  limit?: number;
  filter_spot_id?: string;
  filter_fishing_method?: string;
  year?: number;
}): Promise<{ sessions: Session[]; nextCursor: string | null }>;

/**
 * Récupère le détail d'une session avec ses captures.
 */
export async function getSessionDetail(session_id: string): Promise<{
  session: Session;
  catches: CatchWithSpecies[];
} | { error: string }>;

/**
 * Auto-attache une nouvelle capture à la session active si elle existe.
 * Utilisé dans createCatch().
 */
export async function attachCatchToActiveSession(catch_id: string): Promise<void>;

/**
 * Met à jour les préférences user (suggestion session).
 */
export async function updateSessionSuggestionPreference(suggest: boolean): Promise<{ success: true }>;
```

---

# 📋 BRIEFING H2 COMPLET pour Claude Code

```
H2 — IMPLÉMENTATION DU SYSTÈME SESSIONS

═══════════════════════════════════════
CONTEXTE
═══════════════════════════════════════

H0 (stabilisation) ✅ et H1 (pivot vision) ✅ sont terminés.
Maintenant on implémente la feature qui transforme FishDex en compagnon 
mémoire : les Sessions.

VISION
Une Session = carnet vivant d'une sortie de pêche, du début à la fin.
Pas un dashboard, pas un log technique. Un souvenir émotionnel.

L'analogie : "comme une partie de jeu vidéo".
- Démarrer = lancer la partie
- Pendant = jouer (captures, photos, notes)
- Terminer = sauvegarder le souvenir
- Rouvrir une session = revivre cette partie

═══════════════════════════════════════
COMPORTEMENT À IMPLÉMENTER
═══════════════════════════════════════

DÉMARRAGE
- L'user va dans l'onglet Sessions
- Clique "Démarrer une session"
- Mini-formulaire avec champs CONSEILLÉS (pas obligatoires) :
  • Spot (géoloc auto + nom personnalisé)
  • Style de pêche (liste prédéfinie + "Autre")
  • Intention (optionnel : Détente, Record, Découverte, Test, Famille, Autre)
  • Compagnons (optionnel, texte libre)
- FishDex remplit auto :
  • Date/heure de démarrage
  • Saison (calculée depuis la date)
  • Lumière (calculée depuis l'heure)
  • Météo (placeholder JSONB pour H2, vraie API en H3)

PENDANT LA SESSION
- L'user voit la session active sur l'onglet Sessions
- Peut faire des captures qui s'auto-attachent à la session
- Peut consulter ses prises de la session en cours

FERMETURE
- Bouton "Terminer la session" manuel uniquement
- Modal de fin :
  • Photo d'ambiance optionnelle (upload)
  • Ressenti de fin (1 emoji parmi 6 : 😌🤩😂😤🤔🙏)
  • Notes libres optionnelles
- Si aucune capture : modal "Garder comme souvenir OU supprimer"

CAPTURE SANS SESSION
- Si l'user fait une capture sans session active
- Petit message subtil "Veux-tu créer une session pour cette sortie ?"
- 3 boutons : Oui / Plus tard / Ne plus me proposer
- Le "Ne plus me proposer" stocke profiles.suggest_session_on_capture = false
- La capture se fait normalement (pas bloquante)

ÉDITION POST-FERMETURE
- Tous les champs modifiables (spot, méthode, notes, photo, ressenti)
- Garde l'authenticité tout en permettant l'enrichissement

CAS PARTICULIERS
- Session sans capture : user choisit (sauver "capot" OU supprimer)
- Retour au même spot le lendemain : NOUVELLE session (analogie partie)
- Sessions passées : reportées en H3 (pas dans H2)

═══════════════════════════════════════
ARCHITECTURE BDD
═══════════════════════════════════════

[Voir la migration SQL complète dans le document de référence]

Tables à créer :
- sessions
- spots (lieux favoris)

Modifications :
- catches : ajouter session_id (FK nullable)
- profiles : ajouter suggest_session_on_capture BOOLEAN DEFAULT TRUE

Triggers à créer :
- session_context_trigger : auto-remplir saison + lumière
- session_spot_stats_trigger : update visit_count des spots

Fonctions SQL utiles :
- calculate_light_phase(timestamp) → 'dawn'|'morning'|...
- calculate_season(timestamp) → 'spring'|'summer'|...

═══════════════════════════════════════
ARCHITECTURE FRONTEND
═══════════════════════════════════════

À CRÉER

ROUTES :
- src/app/sessions/page.tsx (Server Component, liste)
- src/app/sessions/[id]/page.tsx (Server Component, détail)
- src/app/sessions/nouvelle/page.tsx (Client, formulaire démarrage)

COMPOSANTS :
- src/components/sessions-v2/Header.tsx
- src/components/sessions-v2/EmptyState.tsx
- src/components/sessions-v2/StartSessionForm.tsx (Client)
- src/components/sessions-v2/ActiveSessionCard.tsx
- src/components/sessions-v2/SessionsList.tsx
- src/components/sessions-v2/SessionCard.tsx (cartes individuelles)
- src/components/sessions-v2/EndSessionModal.tsx (Client)
- src/components/sessions-v2/EmptySessionConfirmModal.tsx (Client)
- src/components/sessions-v2/SuggestSessionToast.tsx (Client, "veux-tu créer ?")

COMPOSANTS DÉTAIL :
- src/components/sessions-v2/detail/Hero.tsx (photo d'ambiance plein écran)
- src/components/sessions-v2/detail/StatsRow.tsx (4 cartes : prises, total, espèces, durée)
- src/components/sessions-v2/detail/ContextSection.tsx (style, intention, météo, ressenti)
- src/components/sessions-v2/detail/Timeline.tsx (séquence chronologique)
- src/components/sessions-v2/detail/NotesSection.tsx
- src/components/sessions-v2/detail/ActionsBar.tsx (modifier/partager/supprimer)

LIB :
- src/lib/sessions/types.ts (Session, Spot interfaces)
- src/lib/sessions/light.ts (helpers light_phase)
- src/lib/sessions/season.ts (helpers saison)
- src/lib/sessions/format.ts (formatters durée, dates, etc.)

SERVER ACTIONS :
- src/app/actions/sessions.ts (createSession, endSession, etc.)

À MODIFIER :
- src/app/actions/catches.ts → après createCatch, appeler 
  attachCatchToActiveSession()
- src/components/spot-v2/CaptureZone.tsx (ou capture flow) → 
  afficher le toast "Veux-tu créer une session" si applicable
- src/components/BottomNavV2.tsx → activer onglet Sessions (déjà placeholder)

À CONSERVER (ne pas toucher) :
- Auth, profiles, species, badges, missions, XP
- Toutes les pages V2 existantes (Spot/Home, FishDex, Aquarium, Profil, Paramètres)
- Bucket Storage et policies catches (la photo d'ambiance peut réutiliser)

═══════════════════════════════════════
SERVER ACTIONS À IMPLÉMENTER
═══════════════════════════════════════

[Voir la liste détaillée dans le document de référence]

createSession(input)
getActiveSession()
endSession(input)
updateSession(input)
deleteSession(session_id)
listSessions(input)
getSessionDetail(session_id)
attachCatchToActiveSession(catch_id)
updateSessionSuggestionPreference(suggest)

EXIGENCES
- Toutes les Server Actions doivent vérifier que l'user est authentifié
- Toutes doivent vérifier que la session appartient à l'user (RLS double-check)
- attachCatchToActiveSession() doit être idempotent
- endSession() doit calculer la durée auto (ended_at - started_at)
- L'user ne peut avoir qu'UNE session active à la fois (status='active')

═══════════════════════════════════════
INSTRUCTIONS D'EXÉCUTION
═══════════════════════════════════════

ÉTAPE 0 — Lis ces éléments avant de proposer quoi que ce soit :
- src/app/actions/catches.ts (logique createCatch existante)
- src/components/spot-v2/CaptureZone.tsx (où injecter le toast suggestion)
- src/components/aquarium-v2/* (pour la cohérence visuelle)
- src/components/shared/PageHeader.tsx (à utiliser)
- supabase/migrations/* (pour comprendre le schéma actuel)
- src/lib/supabase/server.ts (client Supabase serveur)

ÉTAPE 1 — Génère la MIGRATION SQL complète à exécuter dans Supabase.
Donne-moi le fichier supabase/migrations/00X_sessions.sql que je 
copie-colle dans l'éditeur SQL Supabase.

⚠️ ATTENDS QUE JE CONFIRME L'EXÉCUTION avant de continuer.

ÉTAPE 2 — Propose un PLAN détaillé en 15-20 sous-étapes ordonnées.

Suggestion d'ordre :
1) Migration SQL (à exécuter)
2) Lib types + helpers (light, season, format)
3) Server Actions (toutes)
4) Tests des Server Actions (curl ou similar)
5) Composants atomiques (Header, EmptyState, SessionCard)
6) Page sessions/page.tsx (liste vide + liste avec sessions)
7) StartSessionForm (avec géoloc, dropdown méthodes)
8) Page sessions/nouvelle/page.tsx
9) ActiveSessionCard (session live)
10) Modification page sessions/page.tsx pour afficher session active
11) EndSessionModal + EmptySessionConfirmModal
12) Logique de fermeture
13) Composants détail (Hero, StatsRow, Timeline, etc.)
14) Page sessions/[id]/page.tsx
15) Suggestion toast après capture
16) Intégration attachCatchToActiveSession dans createCatch
17) Tests end-to-end manuels
18) Type-check + commit + push

ÉTAPE 3 — Attends ma validation du plan AVANT de coder.

ÉTAPE 4 — Implémente UNE sous-étape à la fois :
- Annonce ce que tu vas faire
- Crée/modifie les fichiers
- Demande validation à chaque étape importante (je teste sur localhost)
- Ne passe pas à la suite sans mon feu vert

ÉTAPE 5 — À la fin :
- npx tsc --noEmit (zéro erreur)
- Tests manuels :
  • Démarrer une session → vérifier en BDD
  • Faire une capture → vérifier session_id rattaché
  • Terminer la session → vérifier status = completed
  • Voir la liste des sessions
  • Voir le détail d'une session
  • Modifier une session
  • Supprimer une session
  • Capture sans session → toast suggestion
- Commit avec message conventionnel : "feat(sessions): implémentation H2 complète"

═══════════════════════════════════════
POINTS DE VIGILANCE CRITIQUES
═══════════════════════════════════════

⚠️ COHÉRENCE VISUELLE TOTALE avec le reste de l'app V2
   (mêmes effets glassmorphism, palette cyan, glow, transitions)

⚠️ MOBILE-FIRST absolu
   Tester en 375px de large d'abord

⚠️ UNE SEULE session active à la fois
   Si l'user a déjà une session active, lui dire (pas créer la 2ème)

⚠️ PHOTOS D'AMBIANCE
   Réutilise le bucket Storage "catches" mais avec un sous-dossier 
   ambiances/ pour bien séparer

⚠️ ÉDITION FLEXIBLE
   Tous les champs modifiables après fermeture
   Authentique mais pas figé

⚠️ DURÉE AUTO-CALCULÉE
   ended_at - started_at, formaté humain (5h12, 2h45)

⚠️ PERFORMANCE
   La liste des sessions = pagination cursor-based
   Pas de fetch de toutes les sessions d'un coup

⚠️ UX SUGGESTION SESSION
   Toast "Veux-tu créer une session" : 
   - Discret, pas intrusif
   - Persistance du choix "Ne plus me proposer"
   - Animation douce (slide-up depuis le bas)

⚠️ COULEURS DES RESSENTIS
   - 😌 Apaisé : cyan
   - 🤩 Stoké : amber/gold
   - 😂 Amusé : pink
   - 😤 Frustré : red subtle
   - 🤔 Pensif : purple
   - 🙏 Reconnaissant : green

═══════════════════════════════════════
CHECKLIST DE FIN H2
═══════════════════════════════════════

Avant de considérer H2 comme TERMINÉ :

□ Migration SQL exécutée et vérifiée en BDD
□ Toutes les Server Actions testées
□ Démarrer une session fonctionne
□ Géoloc auto fonctionne (avec fallback si refus)
□ Liste des spots favoris s'affiche dans le formulaire
□ Capture pendant session → auto-attachement
□ Capture sans session → toast suggestion (1ère fois)
□ "Ne plus me proposer" persiste correctement
□ Terminer une session → modal photo + ressenti + notes
□ Session sans capture → confirm "garder ou supprimer"
□ Détail session → toutes les infos affichées
□ Édition session → tous champs modifiables
□ Suppression session → catches deviennent orphelins (pas supprimés)
□ Liste paginée fonctionne
□ Mobile + desktop OK
□ TypeScript zéro erreur
□ Commit + push + Vercel deploy success
□ Test prod sur fish-dex-six.vercel.app

C'est parti ! Cette phase prendra 3-4 semaines bien faites.
Pas la peine de courir, mieux vaut une session magique qu'une 
session bâclée.
```

---

# 🎯 Plan d'exécution réaliste

## Estimation honnête de la durée

```
PHASE H2 SESSIONS — 3-4 semaines en solo dev

Semaine 1 : Backend
- Migration SQL + tests manuels en BDD
- Server Actions complètes
- Lib types + helpers

Semaine 2 : Frontend liste + démarrage
- Onglet Sessions (état vide + liste)
- StartSessionForm
- ActiveSessionCard
- EndSessionModal

Semaine 3 : Frontend détail + intégration
- Page détail session (Hero + Timeline + Notes)
- Édition session
- Suggestion toast après capture
- Tests end-to-end

Semaine 4 : Polissage + déploiement
- Animations subtiles
- Tests mobile + desktop
- Bug fixes
- Commit + push final
```

## Avant de commencer

✅ Vérifier que H0 est terminé (XP fixé, sécurité, nettoyage, Tony)
✅ Vérifier que H1 est terminé (Mirage renommé, BottomNav 5 onglets, Niveau/Maîtrises)
✅ Avoir le weekend off avant pour démarrer frais
✅ Bloquer 4 semaines mentalement sur cette feature uniquement

---

# 📚 Annexes

## Conventions de nommage

```
fishing_method (BDD)  ↔  Style de pêche (UI)
spot_name (BDD)       ↔  Spot (UI)
end_mood (BDD)        ↔  Ressenti (UI)
ambiance_photo_url    ↔  Photo d'ambiance
```

## Émojis ressentis (à utiliser exactement)

```
peaceful    → 😌 Apaisé
excited     → 🤩 Stoké
amused      → 😂 Amusé
frustrated  → 😤 Frustré
thoughtful  → 🤔 Pensif
grateful    → 🙏 Reconnaissant
```

## Liste des méthodes de pêche

```
carpe         → 🐟 Carpe
predateur     → 🦈 Carnassier (brochet, sandre, perche)
mouche        → 🪶 Mouche
truite        → 🌊 Truite
anglaise      → 🎯 Anglaise
au_coup       → 🪝 Au coup
surfcasting   → 🏖️ Surfcasting
float_tube    → 🛶 Float-tube
bateau        → 🛥️ Bateau
autre         → ❓ Autre (champ libre)
```

## Liste des intentions

```
detente       → 😌 Détente
record        → 🏆 Record
decouverte    → 🔭 Découverte
test          → 🛠️ Test matériel
famille       → 👨‍👩‍👧 En famille
autre         → ❓ Autre (champ libre)
```

---

# 🐟 Note finale

Cette feature est **THE killer feature** de FishDex.
Si elle est bien faite, c'est ce qui transforme une app *"pêche sympa"* en *"app indispensable du pêcheur"*.

**Prends ton temps.** 4 semaines ≠ 4 jours bâclés.

Bonne chance pour H2 ! 🚀✨
