-- F2 : Calculateur taille/poids — formule Le Cren par espèce
ALTER TABLE public.species
  ADD COLUMN IF NOT EXISTS weight_formula_a FLOAT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS weight_formula_b FLOAT DEFAULT NULL;

-- Seed des constantes (FishBase, W = a × L^b, L en cm, W en grammes)
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-commune';
UPDATE public.species SET weight_formula_a = 0.0084, weight_formula_b = 3.04 WHERE slug = 'brochet';
UPDATE public.species SET weight_formula_a = 0.0115, weight_formula_b = 3.02 WHERE slug = 'sandre';
UPDATE public.species SET weight_formula_a = 0.0221, weight_formula_b = 2.86 WHERE slug = 'perche-commune';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10 WHERE slug = 'truite-fario';
UPDATE public.species SET weight_formula_a = 0.0082, weight_formula_b = 3.08 WHERE slug = 'truite-arc-en-ciel';
UPDATE public.species SET weight_formula_a = 0.0196, weight_formula_b = 2.91 WHERE slug = 'gardon';
UPDATE public.species SET weight_formula_a = 0.0180, weight_formula_b = 2.94 WHERE slug = 'breme-commune';
UPDATE public.species SET weight_formula_a = 0.0210, weight_formula_b = 2.89 WHERE slug = 'tanche';
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73 WHERE slug = 'silure-glane';
