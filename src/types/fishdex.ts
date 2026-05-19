// src/types/fishdex.ts

export type Eau = 'douce' | 'salee' | 'saumatre';
export type Regime = 'carnivore' | 'omnivore' | 'herbivore';
export type Profondeur = 'surface' | 'moyenne' | 'fond';
export type Rarete = 'commun' | 'peu commun' | 'rare' | 'epique' | 'legendaire' | 'mirage';
export type Categorie = 'poisson' | 'crustace';

export type SpeciesRow = {
  id: string;
  slug: string;
  nom_fr: string;
  nom_scientifique: string;
  famille: string | null;
  categorie: Categorie | null;
  numero_dex: number | null;
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
