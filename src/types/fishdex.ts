// src/types/fishdex.ts

export type Eau = 'douce' | 'salee' | 'saumatre';
export type Regime = 'carnivore' | 'omnivore' | 'herbivore';
export type Profondeur = 'surface' | 'moyenne' | 'fond';
export type Rarete = 'commun' | 'peu_commun' | 'rare' | 'tres_rare';
export type RareteMutation = Rarete | 'legendaire';
export type Categorie = 'poisson' | 'crustace';

// Type d'une espèce telle qu'elle vient de Supabase
export type SpeciesRow = {
  id: string;
  slug: string;
  nom_fr: string;
  nom_scientifique: string;
  famille: string | null;
  categorie: Categorie | null;
  taille_min_cm: number | null;
  taille_max_cm: number | null;
  poids_max_kg: number | null;
  description: string | null;
  image_url: string | null;
  eau: Eau;
  habitat: string[] | null;
  regime: Regime | null;
  profondeur: Profondeur | null;
  techniques: string[] | null;
  saison: string[] | null;
  difficulte: number | null;
  taille_legale_cm: number | null;
  rarete: Rarete | null;
  created_at: string;
  updated_at: string;
};

// Type d'une variété
export type VarietyRow = {
  id: string;
  species_id: string;
  slug: string;
  nom_fr: string;
  description: string | null;
  image_url: string | null;
  taille_max_cm: number | null;
  poids_max_kg: number | null;
  rarete: Rarete | null;
  caracteristiques: string[] | null;
  created_at: string;
  updated_at: string;
};

// Type d'une mutation
export type MutationRow = {
  id: string;
  variety_id: string;
  slug: string;
  nom_fr: string;
  description: string | null;
  image_url: string | null;
  type_genetique: string | null;
  couleurs: string[] | null;
  rarete: RareteMutation | null;
  created_at: string;
  updated_at: string;
};

// Type composite pour une espèce avec ses variétés et mutations
export type SpeciesWithRelations = SpeciesRow & {
  varieties: (VarietyRow & {
    mutations: MutationRow[];
  })[];
};