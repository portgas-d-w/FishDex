-- F2 : Formules Le Cren complètes — toutes les espèces (W = a × L^b, L en cm, W en grammes)
-- Sources : FishBase (fishbase.org), valeurs moyennes sur populations françaises

-- ── Cyprinidés ────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0082, weight_formula_b = 3.01 WHERE slug = 'ablette';
UPDATE public.species SET weight_formula_a = 0.0052, weight_formula_b = 3.16 WHERE slug = 'aspe';
UPDATE public.species SET weight_formula_a = 0.0067, weight_formula_b = 3.12 WHERE slug = 'amour-blanc';
UPDATE public.species SET weight_formula_a = 0.0072, weight_formula_b = 3.08 WHERE slug = 'carpe-amour-argente';
UPDATE public.species SET weight_formula_a = 0.0072, weight_formula_b = 3.08 WHERE slug = 'carpe-herbivore';
UPDATE public.species SET weight_formula_a = 0.0085, weight_formula_b = 3.04 WHERE slug = 'carpe-marbre';
UPDATE public.species SET weight_formula_a = 0.0070, weight_formula_b = 3.11 WHERE slug = 'barbeau';
UPDATE public.species SET weight_formula_a = 0.0070, weight_formula_b = 3.11 WHERE slug = 'barbeau-meridional';
UPDATE public.species SET weight_formula_a = 0.0250, weight_formula_b = 2.97 WHERE slug = 'bouviere';
UPDATE public.species SET weight_formula_a = 0.0180, weight_formula_b = 2.94 WHERE slug = 'breme-commune';
UPDATE public.species SET weight_formula_a = 0.0180, weight_formula_b = 2.94 WHERE slug = 'breme-bronze';
UPDATE public.species SET weight_formula_a = 0.0191, weight_formula_b = 2.99 WHERE slug = 'breme-bordeliere';
UPDATE public.species SET weight_formula_a = 0.0316, weight_formula_b = 2.92 WHERE slug = 'carassin-dore';
UPDATE public.species SET weight_formula_a = 0.0251, weight_formula_b = 3.03 WHERE slug = 'carassin-commun';
UPDATE public.species SET weight_formula_a = 0.0316, weight_formula_b = 2.92 WHERE slug = 'carassin-argente';

-- Carpe commune et variantes (même formule)
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-commune';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-commune-record';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-miroir';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-cuir';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-lineaire';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-fully-scaled';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-ghost';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-ghost-miroir';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-koi-kohaku';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-koi-ogon';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-koi-platinum';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-koi-sanke';
UPDATE public.species SET weight_formula_a = 0.0149, weight_formula_b = 2.99 WHERE slug = 'carpe-koi-showa';

UPDATE public.species SET weight_formula_a = 0.0123, weight_formula_b = 3.00 WHERE slug = 'chevesne';
UPDATE public.species SET weight_formula_a = 0.0196, weight_formula_b = 2.91 WHERE slug = 'gardon';
UPDATE public.species SET weight_formula_a = 0.0196, weight_formula_b = 2.91 WHERE slug = 'gardon-rouge';
UPDATE public.species SET weight_formula_a = 0.0082, weight_formula_b = 3.07 WHERE slug = 'goujon';
UPDATE public.species SET weight_formula_a = 0.0040, weight_formula_b = 3.10 WHERE slug = 'gobie';
UPDATE public.species SET weight_formula_a = 0.0133, weight_formula_b = 2.99 WHERE slug = 'hotu';
UPDATE public.species SET weight_formula_a = 0.0100, weight_formula_b = 3.06 WHERE slug = 'ide-melanote';
UPDATE public.species SET weight_formula_a = 0.0100, weight_formula_b = 3.06 WHERE slug = 'ide-dore';
UPDATE public.species SET weight_formula_a = 0.0040, weight_formula_b = 3.10 WHERE slug = 'loche-franche';
UPDATE public.species SET weight_formula_a = 0.0133, weight_formula_b = 2.99 WHERE slug = 'nase';
UPDATE public.species SET weight_formula_a = 0.0177, weight_formula_b = 3.00 WHERE slug = 'rotengle';
UPDATE public.species SET weight_formula_a = 0.0090, weight_formula_b = 3.05 WHERE slug = 'soufie';
UPDATE public.species SET weight_formula_a = 0.0090, weight_formula_b = 3.05 WHERE slug = 'spirlin';
UPDATE public.species SET weight_formula_a = 0.0210, weight_formula_b = 2.89 WHERE slug = 'tanche';
UPDATE public.species SET weight_formula_a = 0.0210, weight_formula_b = 2.89 WHERE slug = 'tanche-doree';
UPDATE public.species SET weight_formula_a = 0.0120, weight_formula_b = 3.00 WHERE slug = 'toxostome';
UPDATE public.species SET weight_formula_a = 0.0100, weight_formula_b = 3.04 WHERE slug = 'vairon';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.15 WHERE slug = 'vandoise';

-- ── Ésocidés ──────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0084, weight_formula_b = 3.04 WHERE slug = 'brochet';
UPDATE public.species SET weight_formula_a = 0.0084, weight_formula_b = 3.04 WHERE slug = 'brochet-albinos';
UPDATE public.species SET weight_formula_a = 0.0084, weight_formula_b = 3.04 WHERE slug = 'brochet-trophee';

-- ── Percidés ──────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0221, weight_formula_b = 2.86 WHERE slug = 'perche-commune';
UPDATE public.species SET weight_formula_a = 0.0221, weight_formula_b = 2.86 WHERE slug = 'perche-fluviatile';
UPDATE public.species SET weight_formula_a = 0.0221, weight_formula_b = 2.86 WHERE slug = 'perche-albinos';
UPDATE public.species SET weight_formula_a = 0.0115, weight_formula_b = 3.02 WHERE slug = 'sandre';
UPDATE public.species SET weight_formula_a = 0.0115, weight_formula_b = 3.02 WHERE slug = 'sandre-albinos';
UPDATE public.species SET weight_formula_a = 0.0115, weight_formula_b = 3.02 WHERE slug = 'sandre-dore';
UPDATE public.species SET weight_formula_a = 0.0115, weight_formula_b = 3.02 WHERE slug = 'sandre-geant';
UPDATE public.species SET weight_formula_a = 0.0150, weight_formula_b = 3.00 WHERE slug = 'apron-du-rhone';

-- ── Centrarchidés ─────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0231, weight_formula_b = 3.07 WHERE slug = 'perche-soleil';
UPDATE public.species SET weight_formula_a = 0.0126, weight_formula_b = 3.17 WHERE slug = 'black-bass-grande-bouche';
UPDATE public.species SET weight_formula_a = 0.0135, weight_formula_b = 3.15 WHERE slug = 'black-bass-petite-bouche';

-- ── Siluridés ─────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73 WHERE slug = 'silure-glane';
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73 WHERE slug = 'silure-albinos';
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73 WHERE slug = 'silure-gold';
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73 WHERE slug = 'silure-mandarin';
UPDATE public.species SET weight_formula_a = 0.0621, weight_formula_b = 2.73 WHERE slug = 'silure-wels-record';

-- ── Ictaluridés ───────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0140, weight_formula_b = 3.12 WHERE slug = 'poisson-chat';

-- ── Anguilles ─────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0011, weight_formula_b = 3.05 WHERE slug = 'anguille-europeenne';

-- ── Salmonidés ────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10 WHERE slug = 'truite-fario';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10 WHERE slug = 'truite-de-mer';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10 WHERE slug = 'truite-lacustre';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10 WHERE slug = 'truite-albinos';
UPDATE public.species SET weight_formula_a = 0.0074, weight_formula_b = 3.10 WHERE slug = 'truite-jaune';
UPDATE public.species SET weight_formula_a = 0.0082, weight_formula_b = 3.08 WHERE slug = 'truite-arc-en-ciel';
UPDATE public.species SET weight_formula_a = 0.0082, weight_formula_b = 3.08 WHERE slug = 'truite-tiger';
UPDATE public.species SET weight_formula_a = 0.0062, weight_formula_b = 3.11 WHERE slug = 'saumon-atlantique';
UPDATE public.species SET weight_formula_a = 0.0062, weight_formula_b = 3.11 WHERE slug = 'saumon-atlantique-albinos';
UPDATE public.species SET weight_formula_a = 0.0056, weight_formula_b = 3.17 WHERE slug = 'saumon-roi';
UPDATE public.species SET weight_formula_a = 0.0056, weight_formula_b = 3.18 WHERE slug = 'omble-chevalier';
UPDATE public.species SET weight_formula_a = 0.0072, weight_formula_b = 3.12 WHERE slug = 'omble-de-fontaine';
UPDATE public.species SET weight_formula_a = 0.0060, weight_formula_b = 3.08 WHERE slug = 'huchon';
UPDATE public.species SET weight_formula_a = 0.0084, weight_formula_b = 3.02 WHERE slug = 'ombre-commun';
UPDATE public.species SET weight_formula_a = 0.0051, weight_formula_b = 3.17 WHERE slug = 'corégone-palee';
UPDATE public.species SET weight_formula_a = 0.0051, weight_formula_b = 3.17 WHERE slug = 'lavaret';
UPDATE public.species SET weight_formula_a = 0.0052, weight_formula_b = 3.24 WHERE slug = 'eperlan';

-- ── Alosidés ──────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0063, weight_formula_b = 3.06 WHERE slug = 'grande-alose';
UPDATE public.species SET weight_formula_a = 0.0063, weight_formula_b = 3.06 WHERE slug = 'grande-alose-albinos';
UPDATE public.species SET weight_formula_a = 0.0063, weight_formula_b = 3.08 WHERE slug = 'alose-feinte';

-- ── Cottidés ──────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0085, weight_formula_b = 3.16 WHERE slug = 'chabot';

-- ── Lotidés ───────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0042, weight_formula_b = 3.25 WHERE slug = 'lotte-de-riviere';

-- ── Acipensers (esturgeons) ────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0020, weight_formula_b = 3.20 WHERE slug = 'esturgeon-europeen';
UPDATE public.species SET weight_formula_a = 0.0020, weight_formula_b = 3.20 WHERE slug = 'esturgeon-siberien';
UPDATE public.species SET weight_formula_a = 0.0020, weight_formula_b = 3.20 WHERE slug = 'esturgeon-baeri';
UPDATE public.species SET weight_formula_a = 0.0022, weight_formula_b = 3.18 WHERE slug = 'esturgeon-diamant';
UPDATE public.species SET weight_formula_a = 0.0020, weight_formula_b = 3.20 WHERE slug = 'esturgeon-albinos';
UPDATE public.species SET weight_formula_a = 0.0020, weight_formula_b = 3.20 WHERE slug = 'esturgeon-gold';

-- ── Lamproies ─────────────────────────────────────────────────────────────────
UPDATE public.species SET weight_formula_a = 0.0008, weight_formula_b = 3.10 WHERE slug = 'lamproie-de-planer';
UPDATE public.species SET weight_formula_a = 0.0008, weight_formula_b = 3.10 WHERE slug = 'lamproie-fluviatile';
