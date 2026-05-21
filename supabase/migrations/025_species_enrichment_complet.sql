-- ============================================================
-- Migration 025 — Enrichissement complet 102 espèces
-- Ajout : saison_active, temperature_eau, conseil_fishdex,
--         conditions_ideales, techniques_recommandees, statut_reglementaire
-- ============================================================

-- ════════════════════════════════════════════════════════
-- PARTIE 1 — Espèces partielles (conditions + techniques)
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  conditions_ideales='{"meteo":"Beau temps, été chaud","moment_jour":"Toute la journée, pics matin et soirée","profondeur":"0-2 m","vent":"Faible à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Pêche à la mouche","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface à 1 m","animation":"Mouche sèche posée délicatement, dérive naturelle"},{"nom":"Pêche au leurre ultra-léger","difficulte":3,"efficacite":4,"profondeur_optimale":"0-2 m","animation":"Petits cranks, leurres souples 5 cm"},{"nom":"Pêche à la cerise / pain","difficulte":1,"efficacite":4,"profondeur_optimale":"Surface","animation":"Esche flottante sous arbres fruitiers"},{"nom":"Pêche à la fouettée","difficulte":2,"efficacite":3,"profondeur_optimale":"0-2 m","animation":"Sauterelle, criquet ou insecte vivant"}]'::jsonb
WHERE slug='chevesne';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert ou ensoleillé doux","moment_jour":"Matin et début d''après-midi","profondeur":"2-4 m","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":5,"profondeur_optimale":"2-4 m","animation":"Amorce régulière, asticots ou pellets fond"},{"nom":"Pêche au feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"3-5 m","animation":"Cage amorcée, vers ou maggots fond"},{"nom":"Bolognaise","difficulte":2,"efficacite":3,"profondeur_optimale":"1-3 m","animation":"Dérive douce en eau courante, plombée légère"}]'::jsonb
WHERE slug='gardon';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Matin et après-midi","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive fond en courant modéré, petit ver ou larve"},{"nom":"Coup à la godille","difficulte":3,"efficacite":3,"profondeur_optimale":"Fond","animation":"Godille légère pour dériver l''appât naturellement"},{"nom":"Nymphe légère","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite nymphe en dérive sub-surface"}]'::jsonb
WHERE slug='goujon';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matinée et crépuscule","profondeur":"Surface","vent":"Nul à très faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Coup en surface","difficulte":1,"efficacite":4,"profondeur_optimale":"Surface","animation":"Bouchon fin, présentation légère près des herbiers"},{"nom":"Mouche sèche","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Dérive naturelle sur herbiers, imitation insecte"},{"nom":"Bolognaise légère","difficulte":2,"efficacite":3,"profondeur_optimale":"Surface à mi-eau","animation":"Dérive douce près de la végétation"}]'::jsonb
WHERE slug='rotengle';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert et chaud","moment_jour":"Aube et crépuscule","profondeur":"Fond","vent":"Nul"}'::jsonb,
  techniques_recommandees='[{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Pose fond, cage ouverte avec groundbait, relever lentement"},{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne court"},{"nom":"Coup fond","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Plombée coulissante lente vers le fond vaseux"}]'::jsonb
WHERE slug='tanche';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé","moment_jour":"Toute la journée","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Très petit hameçon, ver fragmenté en dérive naturelle"},{"nom":"Nymphe","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite nymphe légère en dérive naturelle"},{"nom":"Petite mouche sèche","difficulte":4,"efficacite":3,"profondeur_optimale":"Surface","animation":"Imitation insecte en surface, approche discrète"}]'::jsonb
WHERE slug='vairon';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Nuageux à couvert","moment_jour":"Nuit","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":1,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver lombric en pose statique fond, bas de ligne long"},{"nom":"Au vif","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Petit poisson mort posé fond, pose nocturne"},{"nom":"Ligne dormante","difficulte":1,"efficacite":3,"profondeur_optimale":"Fond","animation":"Plusieurs lignes fond de nuit, sonnette ou détecteur"}]'::jsonb
WHERE slug='anguille-europeenne';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert à variable","moment_jour":"Matin tôt et fin d''après-midi","profondeur":"Mi-eau à fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Jerkbait","difficulte":3,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Jerk sec et pause, nage saccadée dans les herbiers"},{"nom":"Spinnerbait","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération linéaire près des herbiers et obstacles"},{"nom":"Au vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Gardon ou ablette vif sous bouchon ou paternoster"},{"nom":"Swimbait","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Nage lente et régulière en récupération linéaire"}]'::jsonb
WHERE slug='brochet';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Nul à faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Pain, maïs ou ver sous bouchon léger"},{"nom":"Feeder léger","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Cage amorcée fond dans les fosses"},{"nom":"Bouillette","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Petite bouillette fruitée sur cheveu court"}]'::jsonb
WHERE slug='carassin-dore';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cage méthode ou open-end avec groundbait collant"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain ou floater, extrême discrétion"}]'::jsonb
WHERE slug='carpe-commune';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Fin d''après-midi et soir","profondeur":"Mi-eau","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère tournante","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération moyenne en courant, trajectoire variée"},{"nom":"Streamer","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Dérive et nage saccadée en courant"},{"nom":"Mouche noyée","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Dérive en courant, légère tension de ligne"}]'::jsonb
WHERE slug='ide-melanote';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé","moment_jour":"Après-midi","profondeur":"Mi-eau","vent":"Nul à faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Micro-leurres","difficulte":1,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Petite cuillère ou leurre souple en récupération lente"},{"nom":"Coup au ver","difficulte":1,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Petit hameçon, ver d''égout ou asticot sous bouchon"},{"nom":"Cuillère fine","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite cuillère ondulante en récupération irrégulière"}]'::jsonb
WHERE slug='perche-soleil';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert","moment_jour":"Crépuscule et nuit","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Jig tête plombée, animation fond avec pauses longues"},{"nom":"Jerkbait","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Petits jerks nerveux en récupération lente fond"},{"nom":"Au vif nocturne","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Vif posé fond ou paternoster en zone profonde"}]'::jsonb
WHERE slug='sandre';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert à ensoleillé","moment_jour":"Matin et fin de journée","profondeur":"Mi-eau","vent":"Faible à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère tournante","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération régulière en travers du courant"},{"nom":"Leurre souple","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Shad ou grub en récupération lente"},{"nom":"Mouche noyée","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Dérive naturelle avec légère tension de ligne"}]'::jsonb
WHERE slug='truite-arc-en-ciel';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé","moment_jour":"Midi et après-midi","profondeur":"Surface","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère de surface","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface","animation":"Récupération rapide en surface imitant un alevin fuyant"},{"nom":"Streamer","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Lancer en amont, dérive active en surface"},{"nom":"Popper","difficulte":3,"efficacite":3,"profondeur_optimale":"Surface","animation":"Chugs courts et pauses, imitation de surface"}]'::jsonb
WHERE slug='aspe';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert à légèrement ensoleillé","moment_jour":"Matin tôt et crépuscule","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche sèche","difficulte":5,"efficacite":5,"profondeur_optimale":"Surface","animation":"Dérive naturelle sans draguer, présentation en amont"},{"nom":"Nymphe","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Dérive fond sub-surface, indicateur de touche"},{"nom":"Toc","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive naturelle fond en courant, ver ou larve"},{"nom":"Cuillère","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite cuillère en récupération irrégulière cross-courant"}]'::jsonb
WHERE slug='truite-fario';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Chaud et orageux","moment_jour":"Nuit","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Clonk","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Percussion surface + museau de bœuf fond, attente active"},{"nom":"Au vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros vif posé fond, laisse coulée, attente nocturne"},{"nom":"Grande canne","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros leurre souple tête plombée lourde, animation lente fond"}]'::jsonb
WHERE slug='silure-glane';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert et frais","moment_jour":"Aube et crépuscule","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche noyée","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Tube fly ou streamer lourd, dérive en courant"},{"nom":"Cuillère lourde","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau à fond","animation":"Lancer travers courant, récupération lente fond"},{"nom":"Leurre souple","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Shad lourd en dérive profonde dans les fosses"}]'::jsonb
WHERE slug='saumon-atlantique';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Couvert et venteux","moment_jour":"Nuit et aube","profondeur":"Mi-eau","vent":"Modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche noyée","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Grandes mouillées en streamer, dérive active nocturne"},{"nom":"Cuillère ondulante","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération lente en surface et mi-eau, nuit"},{"nom":"Streamer","difficulte":4,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Lancer loin, dérive et nage active en courant"}]'::jsonb
WHERE slug='truite-de-mer';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Variable","moment_jour":"Matin et fin d''après-midi","profondeur":"Mi-eau","vent":"Faible à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Gros jerkbait","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Jerks puissants et pauses longues, présentation en courant"},{"nom":"Streamer lourd","difficulte":4,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Gros tube fly ou streamer, dérive en courant fort"},{"nom":"Swimbait articulé","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Nage réaliste en récupération lente dans les courants"}]'::jsonb
WHERE slug='huchon';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Frais et couvert","moment_jour":"Matin et soir","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Traîne profonde","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cuillère lestée en traîne lente dans les grandes profondeurs"},{"nom":"Mouche","difficulte":4,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Mouche noyée ou nymphe en lac, dérive lente"},{"nom":"Cuillère ondulante","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Récupération lente à grande profondeur en lac"}]'::jsonb
WHERE slug='omble-chevalier';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et après-midi","profondeur":"Mi-eau à fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Végétaux naturels","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Herbe, maïs ou pellets végétaux présentés fond sur cheveu"},{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette végétale sur cheveu court, bas de ligne anti-fuite"},{"nom":"Longchamp végétal","difficulte":3,"efficacite":3,"profondeur_optimale":"Fond","animation":"Longchamp léger avec présentation ras du fond"}]'::jsonb
WHERE slug='amour-blanc';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé","moment_jour":"Matin et après-midi","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc léger","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive légère fond, petit ver ou larve de chironome"},{"nom":"Nymphe légère","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite nymphe en dérive sub-surface dans le courant"}]'::jsonb
WHERE slug='spirlin';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Variable","moment_jour":"Toute la journée","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Micro-toc","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Très petit hameçon n°20+, micro-asticot ou larve en dérive"},{"nom":"Coup ultra-fin","difficulte":4,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Plombée légèrissime, fil 0.08 mm, présentation délicate"}]'::jsonb
WHERE slug='bouviere';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Dérive fond naturelle en courant modéré, ver ou larve"},{"nom":"Mouche sèche légère","difficulte":4,"efficacite":3,"profondeur_optimale":"Surface","animation":"Imitation de mouche en surface au coucher du soleil"},{"nom":"Cuillère fine","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite cuillère légère en récupération lente"}]'::jsonb
WHERE slug='vandoise';

UPDATE public.species SET
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Fond sous cailloux","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Minuscule ver présenté au fond, parmi les galets et graviers"},{"nom":"Toc nocturne","difficulte":3,"efficacite":3,"profondeur_optimale":"Fond","animation":"Toc fin de nuit, ver fond dans les courants rapides"}]'::jsonb
WHERE slug='chabot';

UPDATE public.species SET
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":1,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver lombric en pose fond nocturne, bord de courant froid"},{"nom":"Au vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Petit poisson mort ou vif posé fond en courant froid, hiver"},{"nom":"Leurre souple","difficulte":3,"efficacite":3,"profondeur_optimale":"Fond","animation":"Shad lourd en récupération très lente fond, nuit d''hiver"}]'::jsonb
WHERE slug='lotte-de-riviere';

UPDATE public.species SET
  techniques_recommandees='[{"nom":"Observation naturaliste","difficulte":5,"efficacite":1,"profondeur_optimale":"Fond","animation":"Espèce en danger critique — pêche interdite, observation seule"}]'::jsonb
WHERE slug='apron-du-rhone';

UPDATE public.species SET
  techniques_recommandees='[{"nom":"Observation naturaliste","difficulte":5,"efficacite":1,"profondeur_optimale":"Fond","animation":"Espèce protégée — toute perturbation intentionnelle est interdite"}]'::jsonb
WHERE slug='lamproie-de-planer';

-- ════════════════════════════════════════════════════════
-- PARTIE 2 — Variantes Carpe
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival, nuit de juin à août)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe miroir se distingue par ses grandes écailles éparses et brillantes. Pêchez identiquement à la carpe commune : amorçage long terme, bouillette ou maïs sur cheveu, fond.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cage méthode ou open-end avec groundbait collant"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain ou floater, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Variante de la carpe commune. Pas de taille légale nationale. No kill recommandé sur les grands spécimens.'
WHERE slug='carpe-miroir';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe cuir est la variante sans écailles de la carpe commune. Technique identique à la carpe miroir. Sa peau lisse la rend plus fragile — manipulez-la avec des mains humides.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cage méthode ou open-end avec groundbait collant"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain ou floater, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Variante de la carpe commune. Pas de taille légale nationale. No kill recommandé sur les grands spécimens.'
WHERE slug='carpe-cuir';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe linéaire porte une rangée unique d''écailles le long de la ligne latérale. Techniques identiques à la carpe commune, avec une préférence pour les zones profondes et les fonds durs.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cage méthode ou open-end avec groundbait collant"}]'::jsonb,
  statut_reglementaire='Variante de la carpe commune. Pas de taille légale nationale. No kill recommandé sur les grands spécimens.'
WHERE slug='carpe-lineaire';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe fully scaled présente une couverture d''écailles complète et régulière, contrairement à la carpe miroir. Techniques identiques à la carpe commune.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cage méthode ou open-end avec groundbait collant"}]'::jsonb,
  statut_reglementaire='Variante de la carpe commune. Pas de taille légale nationale. No kill recommandé.'
WHERE slug='carpe-fully-scaled';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe ghost doit son nom à sa robe pâle et translucide. Souvent issue de croisements avec des koï, elle se comporte comme une carpe commune. Sa capture dans la nature est un événement rare.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain ou floater, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Variante de la carpe commune. Pas de taille légale nationale. No kill fortement recommandé — spécimen exceptionnel.'
WHERE slug='carpe-ghost';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe ghost miroir combine les caractéristiques de la carpe ghost (robe pâle) et de la carpe miroir (grandes écailles éparses). Extrêmement rare dans la nature.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne anti-fuite"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain ou floater, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Variante de la carpe commune. No kill obligatoire — spécimen mirage de premier ordre.'
WHERE slug='carpe-ghost-miroir';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival, sessions de nuit)',
  temperature_eau='12-28 °C',
  conseil_fishdex='La carpe record représente le saint graal du carpiste. Ces géantes exigent une pêche longue durée, un amorçage massif et patient, et souvent plusieurs nuits sur spot avant la touche.',
  conditions_ideales='{"meteo":"Couvert et doux","moment_jour":"Nuit","profondeur":"Fond","vent":"Léger à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Bouillette premium sur cheveu, amorçage long terme au bateau"},{"nom":"Stalking","difficulte":5,"efficacite":4,"profondeur_optimale":"Surface","animation":"Repérage à vue, présentation ultra-discrète floater"}]'::jsonb,
  statut_reglementaire='Variante légendaire de la carpe commune. No kill absolu — ces poissons font la réputation des plans d''eau.'
WHERE slug='carpe-commune-record';

-- ════════════════════════════════════════════════════════
-- PARTIE 3 — Variantes Koï
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Avril-Octobre (plus actif en eau chaude)',
  temperature_eau='15-28 °C',
  conseil_fishdex='Le Kohaku, à robe blanche et rouge, est le koï le plus iconique. Dans les plans d''eau où ils sont présents, les techniques de la carpe commune s''appliquent : cheveu, bouillette ou maïs. Capture exceptionnelle.',
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette fruitée ou maïs sur cheveu court"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain flottant, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Carpe ornementale. Pas de taille légale. No kill impératif. Remise à l''eau immédiate et délicate.'
WHERE slug='carpe-koi-kohaku';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='15-28 °C',
  conseil_fishdex='L''Ogon, à robe dorée ou argentée métallique, est une variante koï monochrome spectaculaire. Même comportement alimentaire que la carpe commune. Sa robe brillante facilite le repérage à vue.',
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Stalking","difficulte":4,"efficacite":5,"profondeur_optimale":"Surface","animation":"Approche à vue, pain flottant ou pellet surface"},{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette fruitée ou maïs sur cheveu court"}]'::jsonb,
  statut_reglementaire='Carpe ornementale. No kill impératif. Remise à l''eau immédiate et délicate.'
WHERE slug='carpe-koi-ogon';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='15-28 °C',
  conseil_fishdex='Le Sanke, à trois couleurs (blanc, rouge, noir), est l''un des koï les plus appréciés. Comportement identique à la carpe commune. La pêche au Sanke en plan d''eau libre est une expérience inoubliable.',
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette fruitée ou maïs sur cheveu court"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain flottant, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Carpe ornementale. No kill impératif. Remise à l''eau immédiate et délicate.'
WHERE slug='carpe-koi-sanke';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='15-28 °C',
  conseil_fishdex='Le Showa se distingue par son fond noir marbré de rouge et blanc. Comportement identique aux autres koï. Sa robe sombre le rend plus discret dans l''eau que les autres variantes.',
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette fruitée ou maïs sur cheveu court"},{"nom":"Stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue, pain flottant, extrême discrétion"}]'::jsonb,
  statut_reglementaire='Carpe ornementale. No kill impératif. Remise à l''eau immédiate et délicate.'
WHERE slug='carpe-koi-showa';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='15-28 °C',
  conseil_fishdex='La koï Platinum, à robe blanc pur et platine, est le graal des amateurs de koï. Extrêmement rare en plan d''eau libre. Techniques identiques aux autres koï. No kill absolu.',
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et soir","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Stalking","difficulte":5,"efficacite":4,"profondeur_optimale":"Surface","animation":"Approche à vue ultra-discrète, pain flottant ou pellet"},{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette fruitée sur cheveu court, amorçage léger"}]'::jsonb,
  statut_reglementaire='Carpe ornementale légendaire. No kill absolu — spécimen d''une valeur exceptionnelle.'
WHERE slug='carpe-koi-platinum';

-- ════════════════════════════════════════════════════════
-- PARTIE 4 — Esturgeons
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='8-22 °C',
  conseil_fishdex='L''esturgeon diamant se pêche au fond avec des vers ou du poisson haché. Il fouille les fonds vaseux avec son rostre. Remise à l''eau obligatoire — vérifiez toujours le statut du plan d''eau.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et soir","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver en pose fond statique, bas de ligne long"},{"nom":"Feeder lourd","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Poisson haché ou ver en cage fond, attente"}]'::jsonb,
  statut_reglementaire='Espèce présente principalement en étangs privés et lacs de pêche. No kill impératif. Vérifier le règlement du plan d''eau.'
WHERE slug='esturgeon-diamant';

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='6-20 °C',
  conseil_fishdex='L''esturgeon sibérien, adapté aux eaux froides, pêche principalement au fond. Ver lombric ou poisson haché sont les esches les plus efficaces. Pêche en plan d''eau spécialisé.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et soir","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver en pose fond statique, bas de ligne long"},{"nom":"Feeder lourd","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Poisson haché ou ver en cage fond, attente"}]'::jsonb,
  statut_reglementaire='Espèce présente en lacs de pêche spécialisés. No kill impératif. Vérifier le règlement du plan d''eau.'
WHERE slug='esturgeon-siberien';

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='6-20 °C',
  conseil_fishdex='L''esturgeon baeri, à rostre court, est très populaire dans les étangs de pêche sportive. Il se prend principalement avec des vers ou du poisson haché présentés fond.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et soir","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver en pose fond statique, bas de ligne long"},{"nom":"Feeder lourd","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Poisson haché ou ver en cage fond, attente"}]'::jsonb,
  statut_reglementaire='Espèce présente en lacs de pêche spécialisés. No kill impératif. Manipulation délicate — manipulez humide et horizontal.'
WHERE slug='esturgeon-baeri';

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='8-22 °C',
  conseil_fishdex='L''esturgeon gold, à robe dorée, est une variante rare et spectaculaire. Même comportement alimentaire que les autres esturgeons. Sa capture dans un lac de pêche est un événement mémorable.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et soir","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver en pose fond statique, bas de ligne long"},{"nom":"Feeder lourd","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Poisson haché en cage fond, attente"}]'::jsonb,
  statut_reglementaire='Variante ornementale en lac de pêche. No kill absolu. Manipulation extrêmement délicate.'
WHERE slug='esturgeon-gold';

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='8-22 °C',
  conseil_fishdex='L''esturgeon albinos, à robe blanc-crème, est une mutation extrêmement rare. Sa capture est un événement unique. Mêmes techniques que les autres esturgeons, manipulation encore plus délicate.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et soir","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros ver en pose fond statique, bas de ligne long"}]'::jsonb,
  statut_reglementaire='Mutation albinos extrêmement rare. No kill absolu. Manipulation ultra-délicate avec tapis humide.'
WHERE slug='esturgeon-albinos';

UPDATE public.species SET
  saison_active='Toute l''année (mais pêche interdite)',
  temperature_eau='8-20 °C',
  conseil_fishdex='L''esturgeon européen est en danger critique d''extinction. Sa pêche est totalement interdite en France et en Europe. Si tu en croises un accidentellement, remets-le à l''eau immédiatement et signale-le aux autorités.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Variable","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Observation uniquement","difficulte":5,"efficacite":1,"profondeur_optimale":"Fond","animation":"Espèce protégée — pêche totalement interdite en France et Europe"}]'::jsonb,
  statut_reglementaire='Espèce en danger critique d''extinction. PÊCHE TOTALEMENT INTERDITE. Signalement obligatoire à la FDPPMA en cas de capture accidentelle.'
WHERE slug='esturgeon-europeen';

-- ════════════════════════════════════════════════════════
-- PARTIE 5 — Silures variantes
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Mai-Octobre (pic nocturne estival)',
  temperature_eau='18-28 °C',
  conseil_fishdex='Le silure gold, à robe dorée-orange, est une mutation exceptionnelle. Mêmes techniques que le silure glane : clonk nocturne, gros vif au fond.',
  conditions_ideales='{"meteo":"Chaud et orageux","moment_jour":"Nuit","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Clonk","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Percussion surface + gros ver fond, attente nocturne"},{"nom":"Au vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros vif posé fond, laisse coulée, nuit"},{"nom":"Grande canne","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros leurre souple tête plombée lourde, fond lent"}]'::jsonb,
  statut_reglementaire='Mutation du silure glane. No kill fortement recommandé. Pas de taille légale nationale pour le silure.'
WHERE slug='silure-gold';

UPDATE public.species SET
  saison_active='Mai-Octobre (pic nocturne estival)',
  temperature_eau='18-28 °C',
  conseil_fishdex='Le silure mandarin doit son nom à sa robe aux reflets marbrés exceptionnels. Même comportement que le silure glane, mêmes techniques nocturnes.',
  conditions_ideales='{"meteo":"Chaud et orageux","moment_jour":"Nuit","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Clonk","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Percussion surface + gros ver fond, attente nocturne"},{"nom":"Au vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros vif posé fond, laisse coulée, nuit"}]'::jsonb,
  statut_reglementaire='Mutation du silure glane. No kill absolu. Spécimen exceptionnel.'
WHERE slug='silure-mandarin';

UPDATE public.species SET
  saison_active='Mai-Octobre (pic nocturne estival)',
  temperature_eau='18-28 °C',
  conseil_fishdex='Le silure albinos, à robe blanc-rose, est une mutation extrêmement rare. Même comportement que le silure glane. Sa capture est un événement unique dans une vie de pêcheur.',
  conditions_ideales='{"meteo":"Chaud et orageux","moment_jour":"Nuit","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Clonk","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Percussion surface + gros ver fond, attente nocturne"},{"nom":"Au vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros vif posé fond, laisse coulée, nuit"}]'::jsonb,
  statut_reglementaire='Mutation albinos du silure glane. No kill absolu. Manipulation ultra-délicate.'
WHERE slug='silure-albinos';

UPDATE public.species SET
  saison_active='Mai-Octobre (peak nocturne juillet-août)',
  temperature_eau='18-28 °C',
  conseil_fishdex='Le silure record représente la quête ultime du siluriste. Ces géants de plus de 2 mètres exigent du matériel de combat solide et des nuits en bord d''eau. No kill absolu.',
  conditions_ideales='{"meteo":"Chaud et orageux","moment_jour":"Nuit","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Clonk","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Clonk puissant + très grosse esche fond, session longue durée"},{"nom":"Au vif","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Très gros vif posé fond en zone connue"}]'::jsonb,
  statut_reglementaire='Silure glane de taille record. No kill absolu. Ces monuments vivants doivent être remis à l''eau immédiatement.'
WHERE slug='silure-wels-record';

-- ════════════════════════════════════════════════════════
-- PARTIE 6 — Truites variantes + Brochets variantes
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Printemps-Automne (ouverture 2ème samedi mars)',
  temperature_eau='8-18 °C',
  conseil_fishdex='La truite tiger, hybride naturel entre truite fario et omble de fontaine, est rarissime. Vigoureuse et agressivement carnassière, elle répond aux leurres avec une violence impressionnante.',
  conditions_ideales='{"meteo":"Couvert à légèrement ensoleillé","moment_jour":"Matin tôt et crépuscule","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche sèche","difficulte":5,"efficacite":5,"profondeur_optimale":"Surface","animation":"Dérive naturelle sans draguer, présentation amont"},{"nom":"Cuillère","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Petite cuillère en récupération irrégulière"},{"nom":"Nymphe","difficulte":4,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Dérive sub-surface, indicateur de touche"}]'::jsonb,
  statut_reglementaire='Hybride naturel rarissime. Taille légale : 23 cm minimum en zone 1. No kill fortement recommandé.'
WHERE slug='truite-tiger';

UPDATE public.species SET
  saison_active='Printemps-Automne (ouverture 2ème samedi mars)',
  temperature_eau='8-18 °C',
  conseil_fishdex='La truite jaune (gold), mutation mélanique inversée de la fario, est l''une des captures les plus rares. Sa robe dorée la trahit au moindre rayon de soleil. Comportement identique à la truite fario.',
  conditions_ideales='{"meteo":"Couvert à légèrement ensoleillé","moment_jour":"Matin tôt et crépuscule","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche sèche","difficulte":5,"efficacite":5,"profondeur_optimale":"Surface","animation":"Dérive naturelle sans draguer, présentation amont"},{"nom":"Nymphe","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Dérive fond sub-surface, indicateur de touche"},{"nom":"Toc","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive naturelle fond en courant, ver ou larve"}]'::jsonb,
  statut_reglementaire='Mutation de la truite fario. Taille légale : 23 cm minimum. No kill absolu — spécimen rarissime.'
WHERE slug='truite-jaune';

UPDATE public.species SET
  saison_active='Printemps-Automne (ouverture 2ème samedi mars)',
  temperature_eau='8-18 °C',
  conseil_fishdex='La truite albinos, à robe blanc-rose avec yeux rouges, est une mutation rare en rivière. Comportement identique à la fario. Sa capture est un moment exceptionnel.',
  conditions_ideales='{"meteo":"Couvert à légèrement ensoleillé","moment_jour":"Matin tôt et crépuscule","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche sèche","difficulte":5,"efficacite":5,"profondeur_optimale":"Surface","animation":"Dérive naturelle sans draguer, présentation amont"},{"nom":"Nymphe","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Dérive sub-surface, indicateur de touche"}]'::jsonb,
  statut_reglementaire='Mutation albinos de la truite fario. Taille légale : 23 cm minimum. No kill absolu.'
WHERE slug='truite-albinos';

UPDATE public.species SET
  saison_active='Printemps-Automne (pic post-frai)',
  temperature_eau='8-16 °C',
  conseil_fishdex='Le brochet trophée, au-delà de 90 cm, est le rêve de tout brochetier. Ces géants exigent des leurres imposants. No kill vivement recommandé.',
  conditions_ideales='{"meteo":"Couvert à variable","moment_jour":"Matin tôt et fin d''après-midi","profondeur":"Mi-eau","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Gros jerkbait","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Jerk puissant et pause longue, imitation poisson blessé"},{"nom":"Grand swimbait","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Nage lente et réaliste, récupération régulière"},{"nom":"Gros vif","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Gardon de 20 cm+ sous bouchon résistant"}]'::jsonb,
  statut_reglementaire='Brochet de taille trophée. Taille légale : 50 cm minimum. No kill fortement recommandé au-delà de 80 cm.'
WHERE slug='brochet-trophee';

UPDATE public.species SET
  saison_active='Toute l''année (plus actif printemps et automne)',
  temperature_eau='8-18 °C',
  conseil_fishdex='Le brochet albinos, à robe blanc-argentée avec yeux roses, est une mutation exceptionnelle. Même agressivité que la fario. Remettez-le à l''eau immédiatement avec précaution.',
  conditions_ideales='{"meteo":"Couvert à variable","moment_jour":"Matin tôt et fin d''après-midi","profondeur":"Mi-eau","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Jerkbait","difficulte":3,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Jerk sec et pause, nage saccadée dans les herbiers"},{"nom":"Spinnerbait","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération linéaire près des herbiers"}]'::jsonb,
  statut_reglementaire='Mutation albinos du brochet. Taille légale : 50 cm minimum. No kill absolu.'
WHERE slug='brochet-albinos';

-- ════════════════════════════════════════════════════════
-- PARTIE 7 — Sandres variantes + Perche albinos + Salmonidés
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='8-18 °C',
  conseil_fishdex='Le sandre géant, au-delà de 70 cm, est la quête de tout sandrier. Ces vieux poissons sont méfiants et souvent postés sur les points durs profonds. Pêchez lentement, fond, et soyez patients.',
  conditions_ideales='{"meteo":"Couvert","moment_jour":"Crépuscule et nuit","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Gros jig tête plombée, animation fond avec longues pauses"},{"nom":"Jerkbait","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Jerks nerveux en récupération lente fond"},{"nom":"Au vif nocturne","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros vif posé fond en zone profonde"}]'::jsonb,
  statut_reglementaire='Sandre de taille record. Taille légale : 40 cm minimum. No kill fortement recommandé au-delà de 60 cm.'
WHERE slug='sandre-geant';

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='8-18 °C',
  conseil_fishdex='Le sandre doré, à robe aux reflets mordorés, est une variante colorée exceptionnelle du sandre commun. Mêmes habitudes nocturnes, mêmes techniques. Une capture mémorable.',
  conditions_ideales='{"meteo":"Couvert","moment_jour":"Crépuscule et nuit","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Jig tête plombée, animation fond avec pauses longues"},{"nom":"Jerkbait","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Petits jerks nerveux en récupération lente fond"}]'::jsonb,
  statut_reglementaire='Variante du sandre. Taille légale : 40 cm minimum. No kill recommandé.'
WHERE slug='sandre-dore';

UPDATE public.species SET
  saison_active='Toute l''année (pics printemps et automne)',
  temperature_eau='8-18 °C',
  conseil_fishdex='Le sandre albinos, à robe blanc-crème et yeux roses, est une mutation rarissime. Comportement identique au sandre commun. Sa capture est un événement que peu de pêcheurs connaissent.',
  conditions_ideales='{"meteo":"Couvert","moment_jour":"Crépuscule et nuit","profondeur":"Fond","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple","difficulte":3,"efficacite":5,"profondeur_optimale":"Fond","animation":"Jig tête plombée, animation fond avec pauses longues"}]'::jsonb,
  statut_reglementaire='Mutation albinos du sandre. Taille légale : 40 cm minimum. No kill absolu.'
WHERE slug='sandre-albinos';

UPDATE public.species SET
  saison_active='Toute l''année (plus actif printemps-été)',
  temperature_eau='10-22 °C',
  conseil_fishdex='La perche albinos, à robe blanc-rose, est une mutation rarissime. Même comportement que la perche commune : chasse en bancs, répond aux micro-leurres. Une capture inoubliable.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Matin et après-midi","profondeur":"Mi-eau","vent":"Faible à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Petit shad ou grub en récupération lente, animations variées"},{"nom":"Cuillère tournante","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Récupération régulière en travers du courant"}]'::jsonb,
  statut_reglementaire='Mutation albinos de la perche commune. Pas de taille légale nationale. No kill absolu.'
WHERE slug='perche-albinos';

UPDATE public.species SET
  saison_active='Printemps-Automne (ouverture variable selon rivière)',
  temperature_eau='4-16 °C',
  conseil_fishdex='Le saumon royal (Chinook) est le plus grand saumon du monde. Naturalisé dans quelques rivières françaises, il se prend aux mêmes techniques que le saumon atlantique mais avec du matériel encore plus puissant.',
  conditions_ideales='{"meteo":"Couvert et frais","moment_jour":"Aube et crépuscule","profondeur":"Mi-eau","vent":"Faible à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche noyée","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Gros tube fly, dérive en courant fort"},{"nom":"Cuillère lourde","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Lancer travers courant, récupération lente fond"},{"nom":"Leurre souple","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Gros shad en dérive profonde dans les fosses"}]'::jsonb,
  statut_reglementaire='Pêche soumise à réglementation locale stricte. No kill recommandé — espèce peu commune en France.'
WHERE slug='saumon-roi';

UPDATE public.species SET
  saison_active='Printemps-Automne (ouverture variable selon rivière)',
  temperature_eau='6-16 °C',
  conseil_fishdex='Le saumon atlantique albinos est une mutation exceptionnelle. Même comportement migrateur que le saumon commun. Remettez-le à l''eau impérativement.',
  conditions_ideales='{"meteo":"Couvert et frais","moment_jour":"Aube et crépuscule","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Mouche noyée","difficulte":4,"efficacite":5,"profondeur_optimale":"Mi-eau","animation":"Tube fly ou streamer lourd, dérive en courant"},{"nom":"Cuillère lourde","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau à fond","animation":"Lancer travers courant, récupération lente fond"}]'::jsonb,
  statut_reglementaire='Mutation albinos du saumon atlantique. Pêche soumise à permis spécial. No kill absolu — spécimen inestimable.'
WHERE slug='saumon-atlantique-albinos';

UPDATE public.species SET
  saison_active='Printemps-Automne',
  temperature_eau='6-16 °C',
  conseil_fishdex='La grande alose albinos est une mutation extrêmement rare de cette espèce migratrice. Sa pêche est soumise aux mêmes réglementations strictes. No kill impératif.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit et aube","profondeur":"Mi-eau","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère tournante","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération lente en courant, cuillère colorée"},{"nom":"Mouche","difficulte":4,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Grosse mouche noyée en dérive dans les fosses"}]'::jsonb,
  statut_reglementaire='Mutation albinos de la grande alose. No kill absolu. Signalement recommandé aux autorités halieutiques.'
WHERE slug='grande-alose-albinos';

-- ════════════════════════════════════════════════════════
-- PARTIE 8 — Espèces indépendantes vides
-- ════════════════════════════════════════════════════════

UPDATE public.species SET
  saison_active='Avril-Octobre (frai en mai-juin)',
  temperature_eau='12-22 °C',
  conseil_fishdex='La brème bronze est souvent confondue avec la brème commune. Plus petite, elle fréquente les mêmes zones mais en eaux légèrement moins profondes. Feeder fin et asticots au fond font merveille.',
  conditions_ideales='{"meteo":"Couvert, chaleur stable","moment_jour":"Aube et crépuscule","profondeur":"2-4 m","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Pêche au feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"2-4 m","animation":"Cage ouverte, pellets ou vers fond, amorçage régulier"},{"nom":"Pêche au coup","difficulte":2,"efficacite":4,"profondeur_optimale":"2-4 m","animation":"Plombée fond, asticots ou ver de vase"},{"nom":"Bolognaise","difficulte":2,"efficacite":3,"profondeur_optimale":"1-3 m","animation":"Dérive lente le long des bordures végétalisées"}]'::jsonb,
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.'
WHERE slug='breme-bronze';

UPDATE public.species SET
  saison_active='Mars-Octobre (pic printanier)',
  temperature_eau='14-24 °C',
  conseil_fishdex='Le gardon rouge fréquente les eaux chaudes et très végétalisées. Contrairement au gardon, il monte volontiers en surface. Pêchez près des herbiers avec du pain ou des asticots.',
  conditions_ideales='{"meteo":"Ensoleillé","moment_jour":"Matinée et après-midi","profondeur":"Surface à mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Coup en surface","difficulte":1,"efficacite":4,"profondeur_optimale":"Surface","animation":"Bouchon léger, asticots ou pain près des herbiers"},{"nom":"Bolognaise","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Dérive douce en eau courante, plombée légère"},{"nom":"Mouche sèche","difficulte":4,"efficacite":3,"profondeur_optimale":"Surface","animation":"Imitation insecte en dérive naturelle près des herbiers"}]'::jsonb,
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.'
WHERE slug='gardon-rouge';

UPDATE public.species SET
  saison_active='Toute l''année (plus actif printemps-été)',
  temperature_eau='8-25 °C',
  conseil_fishdex='Le gobie s''est largement répandu dans les rivières et estuaires européens. Il fouille les fonds rocheux et graveleux. Pêchez très fin, au fond, avec un petit ver ou un asticot.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Toute la journée","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Fond finesse","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Petit hameçon n°16, asticot ou ver fond entre les rochers"},{"nom":"Toc léger","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Dérive fond en courant entre les cailloux"}]'::jsonb,
  statut_reglementaire='Espèce invasive non réglementée. Pas de taille légale. Peut être utilisée comme vif dans les zones autorisées.'
WHERE slug='gobie';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic juin-août)',
  temperature_eau='14-22 °C',
  conseil_fishdex='Le barbeau aime les fonds graveleux et les courants vifs. Pêchez au feeder lourd avec un gros ver ou au toc en courant rapide. Ses combats sont puissants et sa prise de courant dévastatrice.',
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Fin d''après-midi et soir","profondeur":"Fond","vent":"Modéré acceptable"}'::jsonb,
  techniques_recommandees='[{"nom":"Feeder lourd","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Cage lourde en courant, gros ver ou pellets fond"},{"nom":"Toc","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive fond en courant vif, ver lombric ou vers de rivière"},{"nom":"Bolognaise fond","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Bolognaise plombée fond en courant modéré"}]'::jsonb,
  statut_reglementaire='Taille légale variable selon département, généralement 30 cm minimum. Espèce de 1ère catégorie dans certains secteurs.'
WHERE slug='barbeau';

UPDATE public.species SET
  saison_active='Mars-Octobre (pic printanier)',
  temperature_eau='10-20 °C',
  conseil_fishdex='L''ide doré, la forme ornementale de l''ide mélanote, se rencontre parfois dans les plans d''eau. Sa robe dorée brillante le trahit en surface. Même technique que l''ide mélanote.',
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Fin d''après-midi et soir","profondeur":"Mi-eau","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère tournante","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération moyenne en courant, trajectoire variée"},{"nom":"Streamer","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Dérive et nage saccadée en courant"},{"nom":"Mouche noyée","difficulte":3,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Dérive en courant, légère tension de ligne"}]'::jsonb,
  statut_reglementaire='Variante ornementale de l''ide mélanote. Pas de taille légale spécifique. No kill recommandé.'
WHERE slug='ide-dore';

UPDATE public.species SET
  saison_active='Mai-Septembre (pic estival)',
  temperature_eau='18-28 °C',
  conseil_fishdex='La tanche dorée est la variante ornementale de la tanche commune. Même comportement fouisseur dans les eaux chaudes et végétalisées. Feeder fond ou cheveu comme pour la tanche.',
  conditions_ideales='{"meteo":"Couvert et chaud","moment_jour":"Aube et crépuscule","profondeur":"Fond","vent":"Nul"}'::jsonb,
  techniques_recommandees='[{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Pose fond, cage ouverte avec groundbait, relever lentement"},{"nom":"Méthode cheveu","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Bouillette ou maïs sur cheveu, bas de ligne court"}]'::jsonb,
  statut_reglementaire='Variante ornementale de la tanche commune. Pas de taille légale. No kill recommandé.'
WHERE slug='tanche-doree';

UPDATE public.species SET
  saison_active='Avril-Septembre (pic mai-juillet)',
  temperature_eau='12-22 °C',
  conseil_fishdex='Le nase broute les algues des fonds durs et graveleux. Sa bouche infère et cartilagineuse le distingue de tous les autres cyprinidés. Pêchez au toc avec une présentation ras du fond en courant modéré.',
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Matin et après-midi","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive fond en courant graveleux, ver ou larve de chironome"},{"nom":"Nymphe lestée","difficulte":4,"efficacite":3,"profondeur_optimale":"Fond","animation":"Nymphe tungsten fond dans les zones de courant rapide"}]'::jsonb,
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.'
WHERE slug='nase';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='15-28 °C',
  conseil_fishdex='Le poisson-chat (importé d''Amérique du Nord) est omniprésent dans nos plans d''eau. Il mord sur tout et à toute heure. Pêchez au fond avec des vers ou de l''appât animal fort.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit et crépuscule","profondeur":"Fond","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":1,"efficacite":5,"profondeur_optimale":"Fond","animation":"Gros ver ou boule de vers au fond, attente"},{"nom":"Feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cage amorcée fond, amorce forte odeur"}]'::jsonb,
  statut_reglementaire='Espèce invasive. Pas de taille légale nationale. Sa remise à l''eau dans les milieux naturels est interdite.'
WHERE slug='poisson-chat';

UPDATE public.species SET
  saison_active='Toute l''année (plus actif la nuit)',
  temperature_eau='8-22 °C',
  conseil_fishdex='La loche franche est une discrète fouisseuse de fond qui s''active surtout la nuit. Elle se prend accidentellement sur de petits hameçons avec des vers. Indicateur d''une bonne qualité d''eau.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Fond nocturne","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Micro-ver présenté fond parmi les cailloux, nuit"},{"nom":"Toc léger","difficulte":3,"efficacite":2,"profondeur_optimale":"Fond","animation":"Très petit hameçon, dérive fond en courant graveleux"}]'::jsonb,
  statut_reglementaire='Espèce de 2ème catégorie. Pas de taille légale. Indicateur de qualité écologique — manipulation avec soin.'
WHERE slug='loche-franche';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic printanier)',
  temperature_eau='12-25 °C',
  conseil_fishdex='Le carassin argenté (Poisson de Prusse) s''est largement naturalisé en France. Rustique et prolifique, il résiste aux eaux peu oxygénées. Techniques identiques au carassin commun.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Matin et après-midi","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Pain, asticots ou vers sous bouchon léger"},{"nom":"Feeder léger","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Cage amorcée fond dans les zones calmes"}]'::jsonb,
  statut_reglementaire='Espèce introduite. Pas de taille légale nationale. Espèce de 2ème catégorie.'
WHERE slug='carassin-argente';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='14-26 °C',
  conseil_fishdex='La carpe herbivore dévore la végétation aquatique. Elle se prend sur végétaux naturels ou bouillettes végétales. Techniques proches de l''amour blanc.',
  conditions_ideales='{"meteo":"Ensoleillé et chaud","moment_jour":"Matin et après-midi","profondeur":"Mi-eau à fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Végétaux naturels","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond","animation":"Herbe, algues ou maïs sur cheveu, fond ou surface"},{"nom":"Méthode cheveu","difficulte":2,"efficacite":3,"profondeur_optimale":"Fond","animation":"Bouillette végétale sur cheveu court"}]'::jsonb,
  statut_reglementaire='Carpe herbivore introduite. Pas de taille légale nationale. Espèce de 2ème catégorie.'
WHERE slug='carpe-herbivore';

UPDATE public.species SET
  saison_active='Avril-Septembre (pic mai-juillet)',
  temperature_eau='12-20 °C',
  conseil_fishdex='Le toxostome est un cyprinidé endémique du sud de la France, proche du nase. Il broute les algues avec sa bouche cartilagineuse. Pêchez au toc très fin en courant graveleux.',
  conditions_ideales='{"meteo":"Ensoleillé","moment_jour":"Matin et après-midi","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc très fin","difficulte":4,"efficacite":3,"profondeur_optimale":"Fond","animation":"Dérive fond en courant graveleux, micro-ver ou larve"}]'::jsonb,
  statut_reglementaire='Espèce endémique du bassin Rhône-Méditerranée. Pas de taille légale. Manipulation délicate et remise à l''eau immédiate.'
WHERE slug='toxostome';

UPDATE public.species SET
  saison_active='Avril-Septembre (pic printanier)',
  temperature_eau='10-20 °C',
  conseil_fishdex='La soufie est une espèce endémique proche du nase. Elle fréquente les rivières propres à fond caillouteux. Pêche identique au toxostome : toc fin au fond.',
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Matin","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Toc très fin","difficulte":4,"efficacite":3,"profondeur_optimale":"Fond","animation":"Dérive fond en courant graveleux, micro-ver ou larve"}]'::jsonb,
  statut_reglementaire='Espèce endémique du bassin Rhône-Méditerranée. Pas de taille légale. Espèce sensible — manipulation avec précaution.'
WHERE slug='soufie';

UPDATE public.species SET
  saison_active='Avril-Octobre (pic estival)',
  temperature_eau='16-26 °C',
  conseil_fishdex='Le black-bass à petite bouche est légèrement plus méfiant que son cousin à grande bouche. Il préfère les eaux fraîches et claires. Les leurres fins et naturels fonctionnent mieux sur ce poisson.',
  conditions_ideales='{"meteo":"Couvert à variable","moment_jour":"Matin et fin d''après-midi","profondeur":"Mi-eau","vent":"Léger"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple finesse","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Drop shot ou shaky head en présentation naturelle"},{"nom":"Spinnerbait","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération lente près des herbiers et rochers"},{"nom":"Crankbait","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Récupération régulière, stops fréquents"}]'::jsonb,
  statut_reglementaire='Espèce introduite. Pas de taille légale nationale. Sa remise à l''eau dans les milieux naturels non autorisés est interdite.'
WHERE slug='black-bass-petite-bouche';

UPDATE public.species SET
  saison_active='Hiver-Printemps (novembre-avril en lac)',
  temperature_eau='4-14 °C',
  conseil_fishdex='Le lavaret (corégone) vit en grandes profondeurs des lacs alpins. Il monte la nuit près de la surface en hiver. Pêchez à la traîne profonde ou à la cuillère légère.',
  conditions_ideales='{"meteo":"Froid et calme","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Nul à faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Traîne profonde","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cuillère lestée en traîne lente dans les grandes profondeurs"},{"nom":"Cuillère légère","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Récupération lente en eau froide profonde"}]'::jsonb,
  statut_reglementaire='Réglementation variable selon le lac. Renseignez-vous auprès de la FDPPMA locale avant de pêcher.'
WHERE slug='lavaret';

UPDATE public.species SET
  saison_active='Printemps (migration de frai mars-juin)',
  temperature_eau='14-22 °C',
  conseil_fishdex='La grande alose est un poisson migrateur spectaculaire qui remonte les rivières au printemps. Elle mord aux cuillères brillantes et aux mouches spéciales. Sa pêche est soumise à réglementation stricte.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit et aube","profondeur":"Mi-eau","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère tournante","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération lente en courant, cuillère colorée brillante"},{"nom":"Mouche à alose","difficulte":4,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Grosse mouche noyée en dérive dans les fosses de migration"}]'::jsonb,
  statut_reglementaire='Réglementation stricte selon les rivières. Taille légale généralement 30 cm. Quota journalier. Vérifiez la réglementation locale.'
WHERE slug='grande-alose';

UPDATE public.species SET
  saison_active='Printemps (migration de frai avril-juin)',
  temperature_eau='14-22 °C',
  conseil_fishdex='L''alose feinte est une proche parente de la grande alose, plus petite. Elle remonte moins loin dans les rivières. Techniques identiques à la grande alose, mais avec du matériel plus léger.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit et aube","profondeur":"Mi-eau","vent":"Variable"}'::jsonb,
  techniques_recommandees='[{"nom":"Cuillère tournante","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération lente en courant lors de la migration"},{"nom":"Mouche noyée","difficulte":4,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Dérive en courant dans les fosses de migration"}]'::jsonb,
  statut_reglementaire='Réglementation stricte selon les rivières. Taille légale généralement 25-30 cm. Vérifiez la réglementation locale avant de pêcher.'
WHERE slug='alose-feinte';

UPDATE public.species SET
  saison_active='Hiver-Printemps (décembre-mars en mer, rivière au printemps)',
  temperature_eau='4-14 °C',
  conseil_fishdex='L''éperlan remonte les rivières en hiver-printemps pour frayer. Très grégaire, il se pêche en bancs avec du très petit matériel. Son odeur de concombre est caractéristique.',
  conditions_ideales='{"meteo":"Froid","moment_jour":"Nuit et aube","profondeur":"Mi-eau","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Coup ultra-fin","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Très petit hameçon, asticot ou ver fin en dérive"},{"nom":"Traîne légère","difficulte":2,"efficacite":3,"profondeur_optimale":"Mi-eau","animation":"Petite cuillère en traîne lente en eau froide"}]'::jsonb,
  statut_reglementaire='Réglementation variable selon les rivières et les périodes. Renseignez-vous auprès de la FDPPMA locale.'
WHERE slug='eperlan';

UPDATE public.species SET
  saison_active='Avril-Septembre (pic mai-août)',
  temperature_eau='16-24 °C',
  conseil_fishdex='Le barbeau méridional fréquente les rivières méditerranéennes à fond graveleux et courants vifs. Comportement proche du barbeau commun mais dans des eaux plus chaudes. Feeder lourd en courant.',
  conditions_ideales='{"meteo":"Ensoleillé à variable","moment_jour":"Fin d''après-midi et soir","profondeur":"Fond","vent":"Modéré acceptable"}'::jsonb,
  techniques_recommandees='[{"nom":"Feeder lourd","difficulte":2,"efficacite":5,"profondeur_optimale":"Fond","animation":"Cage lourde en courant, gros ver ou pellets fond"},{"nom":"Toc","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Dérive fond en courant vif, ver ou larve de fond"}]'::jsonb,
  statut_reglementaire='Espèce endémique du bassin méditerranéen. Taille légale variable selon département. Espèce sensible.'
WHERE slug='barbeau-meridional';

UPDATE public.species SET
  saison_active='Toute l''année (plus actif printemps-automne)',
  temperature_eau='10-22 °C',
  conseil_fishdex='La perche fluviatile désigne la perche commune en milieu courant, plus combative que sa cousine des eaux calmes. Elle chasse en bancs dans les courants modérés. Leurres souples et cuillères sont redoutables.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Matin et après-midi","profondeur":"Mi-eau","vent":"Faible à modéré"}'::jsonb,
  techniques_recommandees='[{"nom":"Leurre souple","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Petit shad ou grub en récupération lente, animations variées"},{"nom":"Cuillère tournante","difficulte":2,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Récupération régulière en courant modéré"},{"nom":"Drop shot","difficulte":3,"efficacite":4,"profondeur_optimale":"Mi-eau","animation":"Grub en suspension dans le courant, animation verticale"}]'::jsonb,
  statut_reglementaire='Pas de taille légale nationale. Espèce de 2ème catégorie en eau courante. Réglementation locale possible.'
WHERE slug='perche-fluviatile';

UPDATE public.species SET
  saison_active='Hiver-Printemps (octobre-mars en lac)',
  temperature_eau='4-14 °C',
  conseil_fishdex='La corégone palée vit dans les grands lacs alpins à grande profondeur. Proche du lavaret, elle se pêche en traîne profonde ou à la verticale en hiver quand elle remonte.',
  conditions_ideales='{"meteo":"Froid et calme","moment_jour":"Nuit et aube","profondeur":"Fond","vent":"Nul à faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Traîne profonde","difficulte":3,"efficacite":4,"profondeur_optimale":"Fond","animation":"Cuillère lestée en traîne dans les grandes profondeurs"},{"nom":"Verticale","difficulte":3,"efficacite":3,"profondeur_optimale":"Fond","animation":"Cuillère légère animée verticalement sous le bateau"}]'::jsonb,
  statut_reglementaire='Réglementation variable selon le lac. Renseignez-vous auprès de la FDPPMA locale.'
WHERE slug='corégone-palee';

UPDATE public.species SET
  saison_active='Printemps (migration de frai mars-mai)',
  temperature_eau='10-18 °C',
  conseil_fishdex='La lamproie fluviatile est un poisson primitif parasite qui remonte les rivières pour frayer. Sa pêche est peu pratiquée. Espèce bioindicatrice importante pour l''évaluation des milieux.',
  conditions_ideales='{"meteo":"Variable","moment_jour":"Nuit","profondeur":"Fond","vent":"Faible"}'::jsonb,
  techniques_recommandees='[{"nom":"Vers de fond","difficulte":2,"efficacite":2,"profondeur_optimale":"Fond","animation":"Ver présenté fond en courant lors de la migration printanière"}]'::jsonb,
  statut_reglementaire='Espèce protégée dans certaines rivières. Vérifiez la réglementation locale. Indicateur de bonne qualité des eaux — manipulation avec précaution.'
WHERE slug='lamproie-fluviatile';
