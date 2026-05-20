-- ============================================================
-- Migration 025 — Placeholders image_url pour les 39 nouvelles espèces
-- Date      : 2026-05-20
-- Auteur    : FishDex
-- Dépend de : 024_species_seed.sql
-- ============================================================
-- Les espèces #58–96 ont été insérées via seed-new-species.ts
-- sans image_url. Cette migration pose le chemin placeholder
-- /fishes/{slug}.png en attendant que les vrais PNG soient fournis.
-- N'écrase pas un image_url déjà renseigné.
-- ============================================================

-- Sécurité : ajouter la colonne si elle n'existe pas encore
-- (idempotent — no-op si elle est déjà présente)
ALTER TABLE public.species
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Placeholder pour les 39 nouvelles espèces (#58–96)
-- Le chemin est calculé directement depuis le slug pour éviter toute
-- désynchronisation en cas de slug accentué (ex: corégone-palee).
UPDATE public.species
SET image_url = '/fishes/' || slug || '.png'
WHERE slug IN (
  -- Communs (#58–64)
  'nase',
  'spirlin',
  'bouviere',
  'poisson-chat',
  'vandoise',
  'loche-franche',
  'chabot',
  -- Rares (#65–74)
  'carpe-herbivore',
  'carassin-argente',
  'hotu',
  'toxostome',
  'soufie',
  'black-bass-petite-bouche',
  'omble-fontaine',
  'lavaret',
  'grande-alose',
  'alose-feinte',
  -- Épiques (#75–85)
  'saumon-atlantique',
  'truite-de-mer',
  'truite-lac',
  'huchon',
  'omble-chevalier',
  'eperlan',
  'barbeau-meridional',
  'perche-fluviatile',
  'sandre-dore',
  'corégone-palee',
  'lamproie-fluviatile',
  -- Légendaires (#86–91)
  'esturgeon-europeen',
  'silure-wels-record',
  'brochet-trophee',
  'carpe-commune-record',
  'sandre-geant',
  'saumon-roi',
  -- Mirages (#92–96)
  'brochet-albinos',
  'perche-albinos',
  'saumon-atlantique-albinos',
  'grande-alose-albinos',
  'sandre-albinos'
)
AND (image_url IS NULL OR image_url = '');
