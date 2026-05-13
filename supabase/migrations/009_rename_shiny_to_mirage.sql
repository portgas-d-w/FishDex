-- Migration 009 : renomme la rareté "shiny" → "mirage"

ALTER TABLE public.species
DROP CONSTRAINT IF EXISTS species_rarete_check;

UPDATE public.species
SET rarete = 'mirage'
WHERE rarete = 'shiny';

ALTER TABLE public.species
ADD CONSTRAINT species_rarete_check
CHECK (rarete IN ('commun', 'peu commun', 'rare', 'epique', 'legendaire', 'mirage'));
