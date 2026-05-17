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
  { value: 'apaise',        emoji: '😌', label: 'Apaisé' },
  { value: 'stoke',         emoji: '🤩', label: 'Stoké' },
  { value: 'amuse',         emoji: '😂', label: 'Amusé' },
  { value: 'frustre',       emoji: '😤', label: 'Frustré' },
  { value: 'pensif',        emoji: '🤔', label: 'Pensif' },
  { value: 'reconnaissant', emoji: '🙏', label: 'Reconnaissant' },
] as const;

export const INTENTION_OPTIONS = [
  { value: 'detente',    emoji: '😌',       label: 'Détente' },
  { value: 'record',     emoji: '🏆',       label: 'Record' },
  { value: 'decouverte', emoji: '🔭',       label: 'Découverte' },
  { value: 'test',       emoji: '🛠️',       label: 'Test matériel' },
  { value: 'famille',    emoji: '👨‍👩‍👧', label: 'Famille' },
] as const;

export type RessentiValue  = typeof RESSENTI_OPTIONS[number]['value'];
export type IntentionValue = typeof INTENTION_OPTIONS[number]['value'];
