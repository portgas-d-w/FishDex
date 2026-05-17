-- ============================================================
-- Mapping des 57 espèces existantes → collections
-- À exécuter APRÈS la migration 015
-- Idempotent : INSERT OR IGNORE via ON CONFLICT DO NOTHING
-- ============================================================

-- Helper CTE pour résoudre slug → UUID
WITH
  -- Collections IDs
  col_paisibles  AS (SELECT id FROM public.collections WHERE slug = 'paisibles'),
  col_predateurs AS (SELECT id FROM public.collections WHERE slug = 'predateurs'),
  col_eaux_vives AS (SELECT id FROM public.collections WHERE slug = 'eaux-vives'),

  -- Species mappings (slug → collection(s))
  -- Format : (species_slug, collection_slug)
  mappings (species_slug, collection_slug) AS (VALUES
    -- ══════════════════════════════
    -- 🐟 PAISIBLES
    -- Cyprinidés de fond/lac/rivière calme + Carpes + Esturgeons
    -- ══════════════════════════════
    ('ablette',           'paisibles'),
    ('breme-bordeliere',  'paisibles'),
    ('breme-bronze',      'paisibles'),
    ('breme-commune',     'paisibles'),
    ('carassin',          'paisibles'),
    ('chevesne',          'paisibles'),   -- aussi Prédateurs ci-dessous
    ('gardon',            'paisibles'),
    ('gardon-rouge',      'paisibles'),
    ('gobie',             'paisibles'),
    ('goujon',            'paisibles'),
    ('rotengle',          'paisibles'),
    ('tanche',            'paisibles'),
    ('vairon',            'paisibles'),   -- aussi Eaux vives ci-dessous
    ('carassin-dore',     'paisibles'),
    ('carpe-commune',     'paisibles'),
    ('ide-dore',          'paisibles'),   -- aussi Prédateurs ci-dessous
    ('ide-melanote',      'paisibles'),   -- aussi Prédateurs ci-dessous
    ('tanche-doree',      'paisibles'),
    ('aspe',              'paisibles'),   -- aussi Prédateurs ci-dessous
    ('carpe-cuir',        'paisibles'),
    ('carpe-koi',         'paisibles'),
    ('carpe-koi-kohaku',  'paisibles'),
    ('carpe-koi-ogon',    'paisibles'),
    ('carpe-koi-sanke',   'paisibles'),
    ('carpe-koi-showa',   'paisibles'),
    ('carpe-fully-scaled','paisibles'),
    ('carpe-lineaire',    'paisibles'),
    ('carpe-miroir',      'paisibles'),
    ('esturgeon-diamant', 'paisibles'),
    ('esturgeon-siberien','paisibles'),
    ('amour-argente',     'paisibles'),
    ('amour-blanc',       'paisibles'),
    ('amour-marbre',      'paisibles'),
    ('carpe-koi-platinum','paisibles'),
    ('esturgeon-baeri',   'paisibles'),
    ('esturgeon-gold',    'paisibles'),
    -- Mirages Paisibles (hidden)
    ('carpe-ghost',        'paisibles'),
    ('carpe-ghost-miroir', 'paisibles'),
    ('esturgeon-albinos',  'paisibles'),

    -- ══════════════════════════════
    -- 🦈 PRÉDATEURS
    -- Carnassiers : Brochet, Sandre, Perche, Silure, Anguille...
    -- ══════════════════════════════
    ('anguille-europeenne','predateurs'),
    ('black-bass',         'predateurs'),
    ('brochet',            'predateurs'),
    ('chevesne',           'predateurs'), -- dual : prédateur opportuniste
    ('ide-dore',           'predateurs'), -- dual : chasse à la surface
    ('ide-melanote',       'predateurs'), -- dual
    ('lotte',              'predateurs'),
    ('perche',             'predateurs'),
    ('perche-soleil',      'predateurs'),
    ('sandre',             'predateurs'),
    ('aspe',               'predateurs'), -- dual : carnassier cyprinidé
    ('silure-glane',       'predateurs'),
    ('silure-gold',        'predateurs'),
    ('silure-mandarin',    'predateurs'),
    -- Mirage Prédateurs (hidden)
    ('silure-albinos',     'predateurs'),

    -- ══════════════════════════════
    -- 🌊 EAUX VIVES
    -- Salmonidés + Cyprinidés de torrent
    -- ══════════════════════════════
    ('vairon',             'eaux-vives'), -- dual : espèce de courant
    ('barbeau',            'eaux-vives'), -- fond des rivières rapides
    ('truite-arc-en-ciel', 'eaux-vives'),
    ('truite-fario',       'eaux-vives'),
    ('truite-jaune',       'eaux-vives'),
    ('ombre',              'eaux-vives'),
    ('truite-tiger',       'eaux-vives'),
    -- Mirage Eaux vives (hidden)
    ('truite-albinos',     'eaux-vives')
  )

INSERT INTO public.species_collections (species_id, collection_id)
SELECT
  s.id AS species_id,
  c.id AS collection_id
FROM mappings m
JOIN public.species    s ON s.slug = m.species_slug
JOIN public.collections c ON c.slug = m.collection_slug
ON CONFLICT DO NOTHING;

-- Vérification
SELECT
  c.slug        AS collection,
  c.emoji,
  COUNT(sc.species_id) FILTER (WHERE sp.is_hidden_in_dex = FALSE) AS visible,
  COUNT(sc.species_id) FILTER (WHERE sp.is_hidden_in_dex = TRUE)  AS mirages
FROM public.collections c
LEFT JOIN public.species_collections sc ON sc.collection_id = c.id
LEFT JOIN public.species sp ON sp.id = sc.species_id
GROUP BY c.slug, c.emoji, c.ordre
ORDER BY c.ordre;
