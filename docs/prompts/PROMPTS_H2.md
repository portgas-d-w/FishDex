# 🔵 FishDex — Prompts Claude Code · Phase H2 SESSIONS

> Prompts opérationnels pour la phase Sessions = LA killer feature.
>
> **⚠️ PRÉREQUIS H1** : tous les items de PROMPTS_H1.md doivent être ✅.
>
> Estimation : 6-8 semaines de travail effectif.
>
> Document de référence pour design : `docs/H2_SESSIONS.md` (briefing détaillé original).

---

## 📋 Ordre d'exécution recommandé

1. **S2.1** Migration BDD Sessions (foundation)
2. **S2.2** Server Actions Sessions (logique métier)
3. **S2.3** Écrans Sessions (UI complète)
4. **S2.4** Intégration flow capture (couture)
5. **S2.5** UI/UX détails (no-kill, capture_source, finitions)

**Ne pas paralléliser.** L'ordre est critique : sans BDD on ne peut pas faire les actions, sans actions on ne peut pas faire les écrans.

---

## ⚠️ Décisions verrouillées (rappel)

| Décision | Statut |
|---|---|
| Fin de session = page plein écran, pas modal | ✅ |
| Fenêtre édition 48h figée après ended_at | ✅ |
| Pas de Distance / Température eau / XP affiché | ✅ |
| Ressenti emoji (6) + notes + photo ambiance | ✅ |
| Champ title optionnel | ✅ |
| Champ is_bookmarked (sessions mémorables) | ✅ |
| capture_source (camera/gallery) sur catches | ✅ |
| released (no-kill) sur catches | ✅ |
| PAS de scan IA — sélection manuelle uniquement | ✅ |

---

# 🔵 PROMPT S2.1 — Migration BDD Sessions

**Format détaillé. Foundation de toute la phase H2.**

---PROMPT---

CONTEXTE — Migration BDD pour Sessions (H2.1)

Objectif : créer toute l'infrastructure BDD nécessaire pour les Sessions.

═══════════════════════════════════════════
ÉTAPE 1 — AUDIT
═══════════════════════════════════════════

Vérifie l'état actuel :
- Table catches existe et a quels champs ?
- Table profiles a quels champs ?
- Pas de table sessions / spots déjà existante ?

Lance les requêtes :

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('catches', 'profiles', 'sessions', 'spots')
ORDER BY table_name, ordinal_position;

Présente le résultat avant d'agir.

═══════════════════════════════════════════
ÉTAPE 2 — MIGRATION COMPLÈTE
═══════════════════════════════════════════

Crée `supabase/migrations/[timestamp]_h2_sessions.sql` avec EXACTEMENT ce contenu :

-- ============================================
-- H2 SESSIONS — Migration complète
-- ============================================

-- 1. Table SPOTS (lieux de pêche favoris)
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

-- 2. Table SESSIONS
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
CREATE INDEX idx_sessions_user_active ON public.sessions(user_id) WHERE ended_at IS NULL;

-- 3. ALTER catches : ajouter session_id + capture_source + released
ALTER TABLE public.catches
  ADD COLUMN session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  ADD COLUMN capture_source TEXT CHECK (capture_source IN ('camera', 'gallery')),
  ADD COLUMN released BOOLEAN DEFAULT NULL;

CREATE INDEX idx_catches_session_id ON public.catches(session_id);

-- 4. ALTER profiles : préférences sessions + no-kill par défaut
ALTER TABLE public.profiles
  ADD COLUMN suggest_session_on_capture BOOLEAN DEFAULT TRUE,
  ADD COLUMN default_release BOOLEAN DEFAULT FALSE;

-- 5. FUNCTION : calcule season + light_phase au INSERT
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

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_session_context
BEFORE INSERT ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.calculate_session_context();

-- 6. FUNCTION : calcule editable_until quand ended_at est set
CREATE OR REPLACE FUNCTION public.set_editable_until()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.editable_until := NEW.ended_at + INTERVAL '48 hours';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_editable_until_trigger
BEFORE UPDATE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION public.set_editable_until();

-- 7. FUNCTION : bloque édition après editable_until
CREATE OR REPLACE FUNCTION public.check_session_editable()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la session est fermée ET la fenêtre est dépassée
  IF OLD.ended_at IS NOT NULL
     AND OLD.editable_until IS NOT NULL
     AND NOW() > OLD.editable_until THEN
    -- Autoriser uniquement is_bookmarked (peut toujours être changé)
    IF (NEW.title IS DISTINCT FROM OLD.title) OR
       (NEW.intention IS DISTINCT FROM OLD.intention) OR
       (NEW.compagnons IS DISTINCT FROM OLD.compagnons) OR
       (NEW.style_peche IS DISTINCT FROM OLD.style_peche) OR
       (NEW.started_at IS DISTINCT FROM OLD.started_at) OR
       (NEW.ended_at IS DISTINCT FROM OLD.ended_at) OR
       (NEW.photo_ambiance_url IS DISTINCT FROM OLD.photo_ambiance_url) OR
       (NEW.ressenti IS DISTINCT FROM OLD.ressenti) OR
       (NEW.notes IS DISTINCT FROM OLD.notes) OR
       (NEW.spot_id IS DISTINCT FROM OLD.spot_id) THEN
      RAISE EXCEPTION 'Session is no longer editable (48h window expired)';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_late_session_edit
BEFORE UPDATE ON public.sessions
FOR EACH ROW
WHEN (OLD.ended_at IS NOT NULL)
EXECUTE FUNCTION public.check_session_editable();

-- 8. RLS Policies
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Spots : owner only
CREATE POLICY "spots_select_own" ON public.spots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "spots_insert_own" ON public.spots
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spots_update_own" ON public.spots
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "spots_delete_own" ON public.spots
  FOR DELETE USING (auth.uid() = user_id);

-- Sessions : owner only
CREATE POLICY "sessions_select_own" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert_own" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update_own" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessions_delete_own" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

═══════════════════════════════════════════
ÉTAPE 3 — TEST EN LOCAL
═══════════════════════════════════════════

1. `supabase db reset` (si tu travailles en local complet)
   OU `supabase db push` (si juste migration incrémentale)

2. Test manuel via Supabase Studio :

   -- Test création session
   INSERT INTO public.sessions (user_id, title, started_at)
   VALUES (auth.uid(), 'Test', NOW());

   -- Vérifie que season + light_phase sont calculés automatiquement
   SELECT id, title, season, light_phase, editable_until
   FROM public.sessions
   WHERE title = 'Test';

   -- Test fermeture session
   UPDATE public.sessions
   SET ended_at = NOW()
   WHERE title = 'Test';

   -- Vérifie editable_until = ended_at + 48h
   SELECT title, ended_at, editable_until
   FROM public.sessions
   WHERE title = 'Test';

   -- Test protection 48h (simuler que 49h sont passées)
   UPDATE public.sessions
   SET editable_until = NOW() - INTERVAL '1 hour'
   WHERE title = 'Test';

   -- Tentative d'édition → doit échouer
   UPDATE public.sessions
   SET title = 'Hacked'
   WHERE title = 'Test';
   -- ↑ ERROR: Session is no longer editable (48h window expired)

   -- Cleanup
   DELETE FROM public.sessions WHERE title IN ('Test', 'Hacked');

═══════════════════════════════════════════
ÉTAPE 4 — APPLY REMOTE
═══════════════════════════════════════════

Si les tests locaux passent : `supabase db push --linked`

═══════════════════════════════════════════
ÉTAPE 5 — COMMIT
═══════════════════════════════════════════

Commit : "feat(db): add sessions and spots tables, capture extensions for H2"

⚠️ NE PAS supprimer les tables existantes
⚠️ Si erreur sur ALTER catches → vérifier si déjà appliqué partiellement
⚠️ Les valeurs season/light_phase sont en FRANÇAIS (pas anglais)

---PROMPT---

---

# 🔵 PROMPT S2.2 — Server Actions Sessions

**Format détaillé. Toute la logique métier.**

---PROMPT---

CONTEXTE — Server Actions pour Sessions (H2.2)

Maintenant que la BDD est en place, on crée toutes les Server Actions nécessaires.

═══════════════════════════════════════════
ÉTAPE 1 — STRUCTURE FICHIERS
═══════════════════════════════════════════

Crée le fichier : `src/app/actions/sessions.ts`

═══════════════════════════════════════════
ÉTAPE 2 — TYPES PARTAGÉS
═══════════════════════════════════════════

Crée d'abord `src/lib/sessions/types.ts` :

export type Session = {
  id: string;
  user_id: string;
  spot_id: string | null;
  title: string | null;
  intention: string | null;
  compagnons: string | null;
  style_peche: string | null;
  started_at: string;
  ended_at: string | null;
  editable_until: string | null;
  photo_ambiance_url: string | null;
  ressenti: string | null;
  notes: string | null;
  is_bookmarked: boolean;
  season: 'printemps' | 'été' | 'automne' | 'hiver' | null;
  light_phase: 'aube' | 'matin' | 'midi' | 'aprem' | 'crépuscule' | 'nuit' | null;
  meteo_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type Spot = {
  id: string;
  user_id: string;
  nom: string;
  latitude: number | null;
  longitude: number | null;
  nb_visites: number;
  created_at: string;
};

export type SessionFilters = {
  bookmarkedOnly?: boolean;
  spotId?: string;
  season?: Session['season'];
  fromDate?: string;
  toDate?: string;
};

export const RESSENTI_OPTIONS = [
  { value: 'apaise', emoji: '😌', label: 'Apaisé' },
  { value: 'stoke', emoji: '🤩', label: 'Stoké' },
  { value: 'amuse', emoji: '😂', label: 'Amusé' },
  { value: 'frustre', emoji: '😤', label: 'Frustré' },
  { value: 'pensif', emoji: '🤔', label: 'Pensif' },
  { value: 'reconnaissant', emoji: '🙏', label: 'Reconnaissant' },
] as const;

export const INTENTION_OPTIONS = [
  { value: 'detente', emoji: '😌', label: 'Détente' },
  { value: 'record', emoji: '🏆', label: 'Record' },
  { value: 'decouverte', emoji: '🔭', label: 'Découverte' },
  { value: 'test', emoji: '🛠️', label: 'Test matériel' },
  { value: 'famille', emoji: '👨‍👩‍👧', label: 'Famille' },
] as const;

═══════════════════════════════════════════
ÉTAPE 3 — SERVER ACTIONS
═══════════════════════════════════════════

Dans `src/app/actions/sessions.ts`, crée les 9 actions suivantes :

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod'; // ou autre validation si tu as
import type { Session, Spot, SessionFilters } from '@/lib/sessions/types';

// ============================================
// 1. startSession — démarrer une nouvelle session
// ============================================
export async function startSession(input: {
  spot_id?: string;
  spot_nom?: string; // si nouveau spot, le créer
  intention?: string;
  compagnons?: string;
  style_peche?: string;
  title?: string;
}): Promise<{ session: Session; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { session: null as unknown as Session, error: 'Non authentifié' };

  // Si une session active existe déjà → erreur
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle();

  if (activeSession) {
    return {
      session: null as unknown as Session,
      error: 'Une session est déjà active. Ferme-la avant d\'en démarrer une nouvelle.'
    };
  }

  let spotId = input.spot_id ?? null;

  // Si nouveau spot à créer
  if (!spotId && input.spot_nom) {
    const { data: newSpot } = await supabase
      .from('spots')
      .insert({ user_id: user.id, nom: input.spot_nom })
      .select('id')
      .single();
    spotId = newSpot?.id ?? null;
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      spot_id: spotId,
      intention: input.intention,
      compagnons: input.compagnons,
      style_peche: input.style_peche,
      title: input.title,
      started_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) return { session: null as unknown as Session, error: error.message };

  // Incrémenter nb_visites du spot
  if (spotId) {
    await supabase.rpc('increment_spot_visits', { spot_id_param: spotId });
  }

  revalidatePath('/');
  revalidatePath('/sessions');

  return { session };
}

// ============================================
// 2. endSession — clôturer la session active
// ============================================
export async function endSession(input: {
  session_id: string;
  photo_ambiance_url?: string;
  ressenti?: string;
  notes?: string;
  title?: string; // possibilité d'ajouter titre à la fermeture
}): Promise<{ session: Session; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { session: null as unknown as Session, error: 'Non authentifié' };

  const { data: session, error } = await supabase
    .from('sessions')
    .update({
      ended_at: new Date().toISOString(),
      photo_ambiance_url: input.photo_ambiance_url,
      ressenti: input.ressenti,
      notes: input.notes,
      title: input.title,
    })
    .eq('id', input.session_id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) return { session: null as unknown as Session, error: error.message };

  revalidatePath('/');
  revalidatePath('/sessions');
  revalidatePath(`/sessions/${input.session_id}`);

  return { session };
}

// ============================================
// 3. getActiveSession — récupérer la session en cours
// ============================================
export async function getActiveSession(): Promise<Session | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle();

  return data;
}

// ============================================
// 4. getSessions — liste des sessions de l'user
// ============================================
export async function getSessions(filters?: SessionFilters): Promise<Session[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .not('ended_at', 'is', null) // sessions terminées seulement
    .order('started_at', { ascending: false });

  if (filters?.bookmarkedOnly) query = query.eq('is_bookmarked', true);
  if (filters?.spotId) query = query.eq('spot_id', filters.spotId);
  if (filters?.season) query = query.eq('season', filters.season);
  if (filters?.fromDate) query = query.gte('started_at', filters.fromDate);
  if (filters?.toDate) query = query.lte('started_at', filters.toDate);

  const { data } = await query;
  return data ?? [];
}

// ============================================
// 5. getSessionById — détail session
// ============================================
export async function getSessionById(sessionId: string): Promise<Session | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .maybeSingle();

  return data;
}

// ============================================
// 6. updateSession — édition (avec check 48h via trigger PG)
// ============================================
export async function updateSession(
  sessionId: string,
  updates: Partial<Pick<Session, 'title' | 'intention' | 'compagnons' | 'style_peche' | 'photo_ambiance_url' | 'ressenti' | 'notes' | 'spot_id'>>
): Promise<{ session: Session | null; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { session: null, error: 'Non authentifié' };

  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    if (error.message.includes('no longer editable')) {
      return { session: null, error: 'Cette session ne peut plus être modifiée (fenêtre de 48h dépassée).' };
    }
    return { session: null, error: error.message };
  }

  revalidatePath(`/sessions/${sessionId}`);
  return { session: data };
}

// ============================================
// 7. deleteSession — suppression (avec confirmation)
// ============================================
export async function deleteSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  // Délier les captures (mais ne pas les supprimer)
  await supabase
    .from('catches')
    .update({ session_id: null })
    .eq('session_id', sessionId)
    .eq('user_id', user.id);

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/sessions');
  return { success: true };
}

// ============================================
// 8. bookmarkSession — toggle session mémorable
// ============================================
export async function bookmarkSession(sessionId: string, value: boolean): Promise<{ success: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from('sessions')
    .update({ is_bookmarked: value })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) return { success: false };
  revalidatePath(`/sessions/${sessionId}`);
  return { success: true };
}

// ============================================
// 9. attachCaptureToSession — rattacher une prise existante
// ============================================
export async function attachCaptureToSession(catchId: string, sessionId: string | null): Promise<{ success: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from('catches')
    .update({ session_id: sessionId })
    .eq('id', catchId)
    .eq('user_id', user.id);

  if (error) return { success: false };
  revalidatePath('/sessions');
  return { success: true };
}

═══════════════════════════════════════════
ÉTAPE 4 — RPC HELPER (incrément spot visits)
═══════════════════════════════════════════

Crée une migration `supabase/migrations/[timestamp]_increment_spot_visits.sql` :

CREATE OR REPLACE FUNCTION public.increment_spot_visits(spot_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.spots
  SET nb_visites = nb_visites + 1
  WHERE id = spot_id_param AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

═══════════════════════════════════════════
ÉTAPE 5 — SERVER ACTION SPOTS
═══════════════════════════════════════════

Crée `src/app/actions/spots.ts` :

'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserSpots(): Promise<Spot[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('spots')
    .select('*')
    .eq('user_id', user.id)
    .order('nb_visites', { ascending: false });

  return data ?? [];
}

export async function getFavoriteSpots(limit = 2): Promise<Spot[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('spots')
    .select('*')
    .eq('user_id', user.id)
    .order('nb_visites', { ascending: false })
    .limit(limit);

  return data ?? [];
}

═══════════════════════════════════════════
ÉTAPE 6 — TESTS
═══════════════════════════════════════════

Pour chaque action, fais un test rapide en local (peux faire via page de test temporaire) :

1. startSession sans spot → OK
2. startSession avec nouveau spot → spot créé + session créée
3. startSession quand session active → erreur attendue
4. endSession avec ressenti + notes → OK + editable_until calculé
5. getActiveSession → retourne null après endSession
6. getSessions → liste les sessions fermées
7. updateSession dans la fenêtre 48h → OK
8. updateSession hors fenêtre 48h → erreur

═══════════════════════════════════════════
ÉTAPE 7 — COMMIT
═══════════════════════════════════════════

`npx tsc --noEmit`
Commit : "feat(sessions): server actions for full session lifecycle"

---PROMPT---

---

# 🔵 PROMPT S2.3 — Écrans Sessions

**Format détaillé. UI complète. Le gros chantier visuel de H2.**

---PROMPT---

CONTEXTE — Création des 8 écrans Sessions (H2.3)

Maintenant qu'on a la BDD + les Server Actions, on crée toute l'UI Sessions.

═══════════════════════════════════════════
ÉCRANS À CRÉER
═══════════════════════════════════════════

1. **/sessions** — Liste historique (état vide + état avec sessions)
2. **/sessions/new** — Démarrage session (formulaire)
3. **/sessions/active** — Session en cours (timer + actions)
4. **/sessions/[id]/end** — Fin de session (recap plein écran)
5. **/sessions/[id]** — Détail session passée (lecture)
6. **/sessions/[id]/edit** — Édition (dans la fenêtre 48h)

═══════════════════════════════════════════
ÉTAPE 1 — ÉCRAN /sessions (liste historique)
═══════════════════════════════════════════

Crée `src/app/(app)/sessions/page.tsx` :

import { getSessions, getActiveSession } from '@/app/actions/sessions';
import { ActiveSessionBanner } from '@/components/sessions/ActiveSessionBanner';
import { SessionsList } from '@/components/sessions/SessionsList';
import { EmptyState } from '@/components/sessions/EmptyState';

export default async function SessionsPage() {
  const activeSession = await getActiveSession();
  const sessions = await getSessions();

  return (
    <main className="min-h-screen pb-24">
      <header className="px-4 pt-8 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Les Sessions</h1>
        <p className="text-sm text-white/60 mt-1">Retrouve tes plus beaux souvenirs de pêche</p>
      </header>

      {/* Banner si session active */}
      {activeSession && <ActiveSessionBanner session={activeSession} />}

      {/* Liste ou état vide */}
      {sessions.length === 0 ? (
        <EmptyState hasActive={!!activeSession} />
      ) : (
        <SessionsList sessions={sessions} />
      )}
    </main>
  );
}

Crée les composants :

**EmptyState** : illustration + texte "Démarre ta première session" + CTA vers /sessions/new (sauf si session active déjà)

**ActiveSessionBanner** : grosse carte glassmorphism avec :
- Pill "🟢 SESSION ACTIVE"
- Spot + intention si présent
- Timer en direct (durée écoulée)
- Bouton "Ouvrir →" qui mène vers /sessions/active

**SessionsList** : timeline verticale avec dates à gauche + cards sessions :
- Hero photo (photo_ambiance_url ou placeholder)
- Title ou nom du spot
- Date + heure début/fin
- Stats : nb captures, durée, plus grosse prise
- Bookmark icon toggleable
- Tap → /sessions/[id]

═══════════════════════════════════════════
ÉTAPE 2 — ÉCRAN /sessions/new (démarrage)
═══════════════════════════════════════════

Crée `src/app/(app)/sessions/new/page.tsx` :

Structure :
1. Header avec back arrow
2. Hero zone avec photo lac brumeux blurred + titre "Démarrer une session"
3. Sous-titre : "Tous les champs sont optionnels"
4. Card "FishDex remplit pour toi" : date + saison + heure + light_phase auto
5. Section Spot : input + chips spots récents + "Nouveau spot"
6. Section Style de pêche : pills (Carpe / Carnassier / Mouche / Truite / etc.)
7. Section Intention : pills avec emoji (Détente / Record / Découverte / Test / Famille)
8. Section Compagnons : input texte libre
9. CTA "Démarrer la session →" (sticky bottom)

Le formulaire utilise startSession() de sessions.ts.

Importer INTENTION_OPTIONS depuis types.ts.

═══════════════════════════════════════════
ÉTAPE 3 — ÉCRAN /sessions/active (session en cours)
═══════════════════════════════════════════

Crée `src/app/(app)/sessions/active/page.tsx` :

Vérifier qu'une session active existe, sinon redirect /sessions.

Structure (référence : mockup batch 3 image 1 Étang des Saules) :
1. Header avec back arrow + avatar
2. Hero : background photo + status pill SESSION ACTIVE + spot nom + timer en direct
3. Météo strip : temp / vent / lever soleil (si données disponibles)
4. Stats row : 4 cards (Captures / Espèces / Plus grosse prise / Nouvelle espèce)
5. Timeline en direct : événements factuels (pas de filler poétique IA)
6. Carrousel "Dernières captures" de la session
7. CTA principal "+ Ajouter une prise" (cyan glow)
8. CTA secondaire "Terminer la Session" → vers /sessions/[id]/end

Le timer en direct se rafraîchit côté client (useEffect setInterval).

═══════════════════════════════════════════
ÉTAPE 4 — ÉCRAN /sessions/[id]/end (recap plein écran)
═══════════════════════════════════════════

Crée `src/app/(app)/sessions/[id]/end/page.tsx` :

Structure (référence : mockup batch 3 image 2 Fin de session) :

1. Header avec back + share icon
2. Hero golden hour + titre "Fin de session" + sous-titre "Quelle belle aventure !"
3. Card "Résumé de la session" : 3 stats (Captures / Espèces / Durée)
   ⚠️ PAS de Distance, PAS de Température eau, PAS de XP
4. Card "Captures réalisées" : carrousel horizontal
5. Card "Nouvelle espèce découverte !" (si applicable) avec illustration + nom + numéro dex
6. Card "Conditions pendant la session" : Ciel / Température air / Vent / Pression
   ⚠️ PAS de Température eau
7. Card "Timeline de ta session" : milestones horizontaux
8. **SECTION NOUVELLE : "Comment tu te sens ?"**
   Row de 6 emoji boutons (utiliser RESSENTI_OPTIONS) : 😌 🤩 😂 😤 🤔 🙏
   Sélection unique, cyan ring autour de l'option active
9. **SECTION NOUVELLE : "Une note pour te souvenir"**
   Textarea optionnel, placeholder italique : "Une phrase, une sensation..."
10. **SECTION NOUVELLE : "Photo d'ambiance"**
    Zone d'upload optionnelle, "+ Ajoute une photo de ce moment"
11. CTA UNIQUE "Enregistrer le souvenir" (cyan glow)
    ⚠️ PAS de second bouton "Reprendre une session"

Action au clic : endSession() avec ressenti + notes + photo_ambiance_url → redirect /sessions/[id]

═══════════════════════════════════════════
ÉTAPE 5 — ÉCRAN /sessions/[id] (détail lecture)
═══════════════════════════════════════════

Crée `src/app/(app)/sessions/[id]/page.tsx` :

Structure : version "lecture" de l'écran end, sans les sections d'édition.

1. Hero photo d'ambiance + title (ou spot nom) + dates
2. Bookmark icon en haut à droite (toggle is_bookmarked)
3. Card résumé stats
4. Carrousel captures
5. Card conditions
6. Timeline
7. Note (notes affichées en blockquote italique)
8. Ressenti (emoji + label)

EN BAS :
- Si NOW() < editable_until → bouton "Modifier" vers /sessions/[id]/edit
- Sinon : badge discret "Session figée" + tooltip "La fenêtre d'édition de 48h est dépassée"
- Bouton "Supprimer" (confirmation modal) → deleteSession

═══════════════════════════════════════════
ÉTAPE 6 — ÉCRAN /sessions/[id]/edit
═══════════════════════════════════════════

Crée `src/app/(app)/sessions/[id]/edit/page.tsx` :

Vérification serveur : NOW() < editable_until, sinon redirect /sessions/[id]

Formulaire identique au /end mais préfilled avec les valeurs existantes.
Banner en haut : "Tu peux modifier cette session pendant encore [X heures]."

Au save : updateSession() → redirect /sessions/[id]

═══════════════════════════════════════════
ÉTAPE 7 — COMPOSANTS RÉUTILISABLES
═══════════════════════════════════════════

Crée ces composants partagés :

- src/components/sessions/SessionCard.tsx (utilisé dans la liste)
- src/components/sessions/RessentiPicker.tsx (les 6 emoji buttons)
- src/components/sessions/SessionTimeline.tsx (timeline horizontale milestones)
- src/components/sessions/PhotoAmbianceUpload.tsx (zone upload)
- src/components/sessions/StyleSelector.tsx (pills style pêche)
- src/components/sessions/IntentionSelector.tsx (pills intention)

═══════════════════════════════════════════
ÉTAPE 8 — TESTS
═══════════════════════════════════════════

PARCOURS COMPLET :
1. Aller sur /sessions → état vide
2. Cliquer "Démarrer une session" → /sessions/new
3. Remplir formulaire minimal (spot + intention) → submit
4. Arriver sur /sessions/active avec timer qui tourne
5. Cliquer "Terminer la Session" → /sessions/[id]/end
6. Remplir ressenti + note → "Enregistrer le souvenir"
7. Arriver sur /sessions/[id] en lecture
8. Voir badge "Modifiable encore X heures"
9. Cliquer "Modifier" → page edit avec valeurs préfillées
10. Changer la note → save → retour détail avec note mise à jour
11. Simuler 49h passées (UPDATE editable_until en SQL)
12. Tenter d'aller sur /edit → redirect automatique
13. Voir badge "Session figée"
14. Retour /sessions → la session apparaît dans la liste avec bookmark

═══════════════════════════════════════════
ÉTAPE 9 — COMMIT
═══════════════════════════════════════════

`npx tsc --noEmit`
Commit : "feat(sessions): full UI for sessions lifecycle (list, start, active, end, detail, edit)"

⚠️ Respecter le scope :
   - PAS de scan IA
   - PAS de Distance
   - PAS de Température eau
   - PAS de XP affiché
   - PAS de feature communauté
⚠️ Ton contemplatif, pas gaming

---PROMPT---

---

# 🔵 PROMPT S2.4 — Intégration flow capture

**Format compact. Couture entre capture et sessions.**

---PROMPT---

CONTEXTE — Intégration capture ↔ sessions (H2.4)

Quand l'user fait une capture, il faut :
- Si session active : auto-attacher la capture à la session
- Si pas de session : proposer de démarrer une (skippable selon préférence user)
- Capturer capture_source (camera vs gallery)
- Permettre de marquer released (no-kill)

═══════════════════════════════════════════
ÉTAPE 1 — AUDIT
═══════════════════════════════════════════

Lis le code actuel de capture :
- src/app/(app)/capture/page.tsx
- src/app/actions/catches.ts (createCatch action)
- src/components/capture/*

Identifie où ajouter :
- Détection camera vs gallery
- Toggle "Poisson relâché"
- Auto-attachement session active
- Toast "Démarrer une session ?"

═══════════════════════════════════════════
ÉTAPE 2 — CHAMP CAPTURE_SOURCE
═══════════════════════════════════════════

Dans le formulaire de capture :

1. Composant photo upload doit distinguer :
   - <input type="file" capture="environment"> → 'camera'
   - <input type="file"> → 'gallery'

2. Stocker l'origine dans le state et la passer à createCatch.

3. Si upload via le bouton "Prendre une photo" vs "Importer une photo" :
   - "Prendre" → capture: 'camera', capture_source: 'camera'
   - "Importer" → pas de capture attribute, capture_source: 'gallery'

═══════════════════════════════════════════
ÉTAPE 3 — TOGGLE NO-KILL
═══════════════════════════════════════════

Dans le formulaire capture, ajoute un toggle :

<div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
  <div>
    <p className="text-sm font-medium">Poisson relâché</p>
    <p className="text-xs text-white/60">No-kill, retour à l'eau</p>
  </div>
  <Toggle
    checked={released}
    onCheckedChange={setReleased}
  />
</div>

Pre-coché si profile.default_release === true.

═══════════════════════════════════════════
ÉTAPE 4 — AUTO-ATTACHEMENT SESSION
═══════════════════════════════════════════

Dans la Server Action createCatch :

import { getActiveSession } from '@/app/actions/sessions';

export async function createCatch(input: CreateCatchInput) {
  // ... validation, etc.

  const activeSession = await getActiveSession();
  const session_id = activeSession?.id ?? null;

  const { data: catch_ } = await supabase
    .from('catches')
    .insert({
      // ... champs existants
      session_id,
      capture_source: input.capture_source,
      released: input.released,
    })
    .select('*')
    .single();

  return { catch_, attached_to_session: !!session_id };
}

═══════════════════════════════════════════
ÉTAPE 5 — TOAST "DÉMARRER UNE SESSION ?"
═══════════════════════════════════════════

Si createCatch retourne attached_to_session: false ET profile.suggest_session_on_capture === true :

Afficher un toast discret après la capture :
"Belle prise ! 🎣 Tu veux démarrer une session pour suivre tes prochaines captures ?"
Avec 2 actions :
- "Démarrer" → /sessions/new
- "Plus tard"

Si l'user clique "Plus tard" 3 fois de suite : proposer "Ne plus me demander" qui met
profile.suggest_session_on_capture = false.

═══════════════════════════════════════════
ÉTAPE 6 — PARAMÈTRES PROFIL
═══════════════════════════════════════════

Dans la page Paramètres, ajoute 2 toggles :

1. "Suggérer une session après une capture"
   → modifie profile.suggest_session_on_capture

2. "Cocher 'Relâché' par défaut"
   → modifie profile.default_release

═══════════════════════════════════════════
ÉTAPE 7 — TESTS
═══════════════════════════════════════════

1. Capture via "Prendre une photo" → capture_source = 'camera'
2. Capture via "Importer" → capture_source = 'gallery'
3. Toggle released → champ released = TRUE en BDD
4. Capture pendant session active → session_id auto-attaché
5. Capture hors session avec suggest=true → toast affiché
6. Capture hors session avec suggest=false → pas de toast

═══════════════════════════════════════════
ÉTAPE 8 — COMMIT
═══════════════════════════════════════════

`npx tsc --noEmit`
Commit : "feat(capture): integrate session auto-attach, capture_source, released toggle"

---PROMPT---

---

# 🔵 PROMPT S2.5 — UI/UX détails Aquarium + Sessions

**Format compact. Finitions visuelles.**

---PROMPT---

CONTEXTE — Détails UI/UX H2.5 finitions

3 améliorations visuelles pour finaliser H2.

═══════════════════════════════════════════
ÉTAPE 1 — ICÔNE CAMERA SUR AQUARIUM
═══════════════════════════════════════════

Pour distinguer les captures "live" (camera) des imports (gallery), ajoute une icône discrète sur les cards Aquarium.

Dans le composant CatchCard de l'Aquarium :

{catch_.capture_source === 'camera' && (
  <div className="absolute top-2 right-2 rounded-full bg-cyan-500/20 backdrop-blur p-1.5">
    <Camera className="h-3 w-3 text-cyan-300" />
  </div>
)}

Pas d'icône pour 'gallery' ou null (volontaire, on valorise sans dévaloriser).

═══════════════════════════════════════════
ÉTAPE 2 — ICÔNE NO-KILL
═══════════════════════════════════════════

Pour les captures released, icône feuille verte à côté des stats poids/taille :

{catch_.released === true && (
  <div className="flex items-center gap-1 text-emerald-400">
    <Leaf className="h-3 w-3" />
    <span className="text-xs">Relâché</span>
  </div>
)}

Pas d'icône si released === false ou null.

═══════════════════════════════════════════
ÉTAPE 3 — SESSION ASSOCIÉE SUR CARDS
═══════════════════════════════════════════

Si une capture appartient à une session, indicateur subtil :

{catch_.session_id && (
  <div className="text-xs text-white/40 flex items-center gap-1">
    <Calendar className="h-3 w-3" />
    Session
  </div>
)}

Tap sur cet indicateur → ouvre /sessions/[session_id]

═══════════════════════════════════════════
ÉTAPE 4 — COMMIT
═══════════════════════════════════════════

`npx tsc --noEmit`
Commit : "feat(aquarium): add camera, no-kill, and session indicators on catch cards"

---PROMPT---

---

# ✅ CHECKLIST FINALE H2 — avant de passer à H2.5

- [ ] **S2.1 — Migration BDD** : sessions + spots + alter catches + triggers + RLS
- [ ] **S2.2 — Server Actions** : 9 actions + types + RPC increment_spot_visits
- [ ] **S2.3 — Écrans Sessions** : 6 écrans fonctionnels + composants partagés
- [ ] **S2.4 — Intégration capture** : auto-attach + capture_source + released + toast
- [ ] **S2.5 — UI/UX détails** : icônes camera + leaf + session sur cards

**Tests parcours complet :**
- [ ] Créer session → capturer 3 prises → terminer → écrire ressenti + note → lecture détail
- [ ] Bookmark session → la voir épinglée
- [ ] Éditer dans la fenêtre 48h → OK
- [ ] Tenter d'éditer après 48h → bloqué proprement
- [ ] Capturer hors session avec suggest=true → toast s'affiche
- [ ] Capturer hors session avec suggest=false → pas de toast

**Tests techniques :**
- [ ] `npx tsc --noEmit` passe
- [ ] Build Vercel OK
- [ ] App responsive mobile + desktop
- [ ] Aucune feature gaming agressive

⚠️ **Tant qu'un item est KO → ne pas passer à H2.5.**

Sessions livré. C'est LA killer feature de FishDex. 🎣
