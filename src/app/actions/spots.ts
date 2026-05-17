'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Spot } from '@/lib/sessions/types';

// ─────────────────────────────────────────────────────────────────────────────
// Tous les spots de l'utilisateur, triés par popularité
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserSpots(): Promise<Spot[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('spots')
    .select('*')
    .eq('user_id', user.id)
    .order('nb_visites', { ascending: false });

  return (data ?? []) as Spot[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Top N spots favoris (pour la home et les widgets)
// ─────────────────────────────────────────────────────────────────────────────
export async function getFavoriteSpots(limit = 2): Promise<Spot[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('spots')
    .select('*')
    .eq('user_id', user.id)
    .order('nb_visites', { ascending: false })
    .limit(limit);

  return (data ?? []) as Spot[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Créer ou récupérer un spot par nom (upsert insensible à la casse)
// ─────────────────────────────────────────────────────────────────────────────
export async function upsertSpot(nom: string): Promise<{ spot: Spot | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { spot: null, error: 'Non authentifié' };

  const trimmed = nom.trim();
  if (!trimmed) return { spot: null, error: 'Nom vide' };

  const { data: existing } = await supabase
    .from('spots')
    .select('*')
    .eq('user_id', user.id)
    .ilike('nom', trimmed)
    .maybeSingle();

  if (existing) return { spot: existing as Spot };

  const { data, error } = await supabase
    .from('spots')
    .insert({ user_id: user.id, nom: trimmed, nb_visites: 0 })
    .select('*')
    .single();

  if (error) return { spot: null, error: error.message };

  revalidatePath('/sessions');
  return { spot: data as Spot };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mettre à jour les coordonnées GPS d'un spot
// ─────────────────────────────────────────────────────────────────────────────
export async function updateSpotCoords(
  spotId: string,
  coords: { latitude: number; longitude: number }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('spots')
    .update({ latitude: coords.latitude, longitude: coords.longitude })
    .eq('id', spotId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/sessions');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Supprimer un spot (ne supprime pas les sessions liées)
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteSpot(spotId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('spots')
    .delete()
    .eq('id', spotId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/sessions');
  return { success: true };
}
