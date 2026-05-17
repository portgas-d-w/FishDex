-- ============================================================
-- H2.5 — Badges de collection
-- ============================================================
-- À appliquer dans Supabase Dashboard SQL Editor
-- ============================================================

INSERT INTO public.badges (slug, category, title, description, icon, color, xp_reward, display_order) VALUES
  ('maitre_paisibles',  'discovery', 'Maître Paisibles',   'Capture toutes les espèces visibles Paisibles',   '🐟', 'cyan',    500, 50),
  ('maitre_predateurs', 'discovery', 'Maître Prédateurs',  'Capture toutes les espèces visibles Prédateurs',  '🦈', 'red',     500, 51),
  ('maitre_eaux_vives', 'discovery', 'Maître Eaux vives',  'Capture toutes les espèces visibles Eaux vives',  '🌊', 'emerald', 500, 52),
  ('completionniste_collections', 'discovery', 'Complétionniste', 'Obtiens les 3 badges Maître', '🏆', 'amber', 1500, 53),
  ('chasseur_mirages',  'hidden',    'Chasseur de Mirages', 'Capture 3 Mirages différents', '✦', 'pink', 750, 54),
  ('mirage_supreme',    'hidden',    'Mirage suprême',      'Capture tous les Mirages', '✨', 'gold', 2000, 55)
ON CONFLICT (slug) DO NOTHING;
