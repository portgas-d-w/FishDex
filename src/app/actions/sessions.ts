'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Session, SessionFilters } from '@/lib/sessions/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function err(msg: string): { session: null; error: string } {
  return { session: null, error: msg };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. startSession — démarrer une nouvelle session
// ─────────────────────────────────────────────────────────────────────────────
export async function startSession(input: {
  spot_id?: string;
  spot_nom?: string;
  intention?: string;
  compagnons?: string;
  style_peche?: string;
  title?: string;
}): Promise<{ session: Session | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err('Non authentifié');

  // Vérifier qu'aucune session active n'existe
  const { data: active } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle();

  if (active) {
    return err("Une session est déjà active. Ferme-la avant d'en démarrer une nouvelle.");
  }

  let spotId = input.spot_id ?? null;

  // Créer le spot s'il est nouveau
  if (!spotId && input.spot_nom?.trim()) {
    const nom = input.spot_nom.trim();

    // Chercher un spot existant (insensible à la casse)
    const { data: existing } = await supabase
      .from('spots')
      .select('id')
      .eq('user_id', user.id)
      .ilike('nom', nom)
      .maybeSingle();

    if (existing) {
      spotId = existing.id;
    } else {
      const { data: newSpot } = await supabase
        .from('spots')
        .insert({ user_id: user.id, nom, nb_visites: 0 })
        .select('id')
        .single();
      spotId = newSpot?.id ?? null;
    }
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id:     user.id,
      spot_id:     spotId,
      intention:   input.intention   ?? null,
      compagnons:  input.compagnons  ?? null,
      style_peche: input.style_peche ?? null,
      title:       input.title       ?? null,
      started_at:  new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) return err(error.message);

  // Incrémenter nb_visites du spot
  if (spotId) {
    try {
      await supabase.rpc('increment_spot_visits', { spot_id_param: spotId });
    } catch { /* RPC optionnelle */ }
  }

  revalidatePath('/');
  revalidatePath('/sessions');
  return { session: session as Session };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. endSession — clôturer la session active
// ─────────────────────────────────────────────────────────────────────────────
export async function endSession(input: {
  session_id: string;
  photo_ambiance_url?: string;
  ressenti?: string;
  notes?: string;
  title?: string;
}): Promise<{ session: Session | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err('Non authentifié');

  const updates: Record<string, unknown> = {
    ended_at: new Date().toISOString(),
  };
  if (input.photo_ambiance_url !== undefined) updates.photo_ambiance_url = input.photo_ambiance_url;
  if (input.ressenti  !== undefined) updates.ressenti  = input.ressenti;
  if (input.notes     !== undefined) updates.notes     = input.notes;
  if (input.title     !== undefined) updates.title     = input.title;

  const { data: session, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', input.session_id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) return err(error.message);

  revalidatePath('/');
  revalidatePath('/sessions');
  revalidatePath(`/sessions/${input.session_id}`);
  return { session: session as Session };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. getActiveSession
// ─────────────────────────────────────────────────────────────────────────────
export async function getActiveSession(): Promise<Session | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .maybeSingle();

  return (data as Session | null);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. getSessions — liste des sessions terminées
// ─────────────────────────────────────────────────────────────────────────────
export async function getSessions(filters?: SessionFilters): Promise<Session[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false });

  if (filters?.bookmarkedOnly) query = query.eq('is_bookmarked', true);
  if (filters?.spotId)         query = query.eq('spot_id', filters.spotId);
  if (filters?.season)         query = query.eq('season', filters.season);
  if (filters?.fromDate)       query = query.gte('started_at', filters.fromDate);
  if (filters?.toDate)         query = query.lte('started_at', filters.toDate);

  const { data } = await query;
  return (data ?? []) as Session[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. getSessionById
// ─────────────────────────────────────────────────────────────────────────────
export async function getSessionById(sessionId: string): Promise<Session | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .maybeSingle();

  return (data as Session | null);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. updateSession — édition (trigger PG bloque après 48h)
// ─────────────────────────────────────────────────────────────────────────────
export async function updateSession(
  sessionId: string,
  updates: Partial<Pick<Session,
    'title' | 'intention' | 'compagnons' | 'style_peche' |
    'photo_ambiance_url' | 'ressenti' | 'notes' | 'spot_id'
  >>
): Promise<{ session: Session | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err('Non authentifié');

  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    if (error.message.includes('no longer editable')) {
      return err('Cette session ne peut plus être modifiée (fenêtre de 48h dépassée).');
    }
    return err(error.message);
  }

  revalidatePath(`/sessions/${sessionId}`);
  return { session: data as Session };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. deleteSession — supprime la session, délie les captures
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  // Délier les captures sans les supprimer
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

// ─────────────────────────────────────────────────────────────────────────────
// 8. bookmarkSession — toggle favori
// ─────────────────────────────────────────────────────────────────────────────
export async function bookmarkSession(
  sessionId: string,
  value: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('sessions')
    .update({ is_bookmarked: value })
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath('/sessions');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. attachCaptureToSession — rattacher/détacher une prise
// ─────────────────────────────────────────────────────────────────────────────
export async function attachCaptureToSession(
  catchId: string,
  sessionId: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('catches')
    .update({ session_id: sessionId })
    .eq('id', catchId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/sessions');
  if (sessionId) revalidatePath(`/sessions/${sessionId}`);
  return { success: true };
}
