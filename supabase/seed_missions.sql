-- ============================================================
-- FishDex — Seed : Missions pool
-- Exécuter APRÈS la migration 004
-- ============================================================

-- DAILY MISSIONS
insert into public.missions (slug, type, title, description, xp_reward, target, conditions) values
(
  'daily_any_catch_2',
  'daily',
  'Attraper 2 poissons',
  'Capture 2 poissons aujourd''hui',
  30, 2,
  '{"action":"any_catch"}'
),
(
  'daily_first_discovery',
  'daily',
  'Capturer une nouvelle espèce',
  'Pêche une espèce que tu n''as jamais capturée',
  50, 1,
  '{"action":"first_discovery"}'
),
(
  'daily_rare_or_more',
  'daily',
  'Capturer un poisson rare ou plus',
  'Attrape un poisson de rareté rare, épique ou supérieure',
  40, 1,
  '{"action":"catch_min_rarity","rarity":"rare"}'
),
(
  'daily_with_photo',
  'daily',
  'Immortaliser une prise',
  'Ajoute une photo à une de tes prises',
  15, 1,
  '{"action":"catch_with_photo"}'
),
(
  'daily_new_spot',
  'daily',
  'Pêcher dans un nouveau spot',
  'Pêche à un endroit où tu n''es jamais allé',
  25, 1,
  '{"action":"new_spot"}'
),
(
  'daily_min_weight_1kg',
  'daily',
  'Capturer un poisson > 1 kg',
  'Attrape un poisson de plus d''un kilo',
  35, 1,
  '{"action":"catch_min_weight","weight_kg":1}'
),
(
  'daily_2_species',
  'daily',
  'Pêcher 2 espèces différentes',
  'Capture 2 espèces différentes dans la même journée',
  30, 2,
  '{"action":"different_species_today"}'
);

-- WEEKLY MISSIONS
insert into public.missions (slug, type, title, description, xp_reward, target, conditions) values
(
  'weekly_any_catch_10',
  'weekly',
  'Capturer 10 poissons',
  'Attrape 10 poissons cette semaine',
  200, 10,
  '{"action":"any_catch"}'
),
(
  'weekly_discovery_3',
  'weekly',
  'Découvrir 3 nouvelles espèces',
  'Pêche 3 espèces que tu n''as jamais capturées',
  250, 3,
  '{"action":"first_discovery"}'
),
(
  'weekly_epic_or_more',
  'weekly',
  'Capturer un poisson épique ou plus',
  'Attrape un poisson épique, légendaire ou shiny',
  300, 1,
  '{"action":"catch_min_rarity","rarity":"epique"}'
),
(
  'weekly_personal_record',
  'weekly',
  'Battre un record personnel',
  'Dépasse ton meilleur poids ou ta meilleure taille',
  150, 1,
  '{"action":"personal_record"}'
),
(
  'weekly_5_days',
  'weekly',
  'Pêcher 5 jours cette semaine',
  'Sors pêcher 5 jours différents cette semaine',
  200, 5,
  '{"action":"unique_days"}'
),
(
  'weekly_2_rarities',
  'weekly',
  'Capturer 2 raretés différentes',
  'Pêche des poissons de 2 raretés différentes cette semaine',
  180, 2,
  '{"action":"different_rarities"}'
);

-- SPECIAL MISSIONS (long terme, toujours actives)
insert into public.missions (slug, type, title, description, xp_reward, target, conditions) values
(
  'special_10_common',
  'special',
  'Collectionneur commun',
  'Capture 10 espèces communes différentes',
  500, 10,
  '{"action":"unique_species_by_rarity","rarity":"commun"}'
),
(
  'special_all_rarities',
  'special',
  'Polyvalent',
  'Capture un poisson de chaque rareté (6 raretés)',
  1000, 6,
  '{"action":"all_rarity_types"}'
),
(
  'special_shiny',
  'special',
  'Chasseur de shinies',
  'Capture une espèce shiny',
  2000, 1,
  '{"action":"catch_min_rarity","rarity":"shiny"}'
),
(
  'special_complete_fishdex',
  'special',
  'Encyclopédiste',
  'Complète le FishDex — capture les 57 espèces',
  5000, 57,
  '{"action":"unique_species_total"}'
);
