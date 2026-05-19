-- ============================================================
-- Migration 024 — Seed 45 espèces enrichies + variantes
-- ============================================================

-- ════════════════════════════════════
-- PARTIE 1 — UPDATE slug exact (30)
-- ════════════════════════════════════

UPDATE public.species SET
  nom_fr='Ablette', nom_scientifique='Alburnus alburnus', famille='Cyprinidés (Leuciscidae)',
  rarete='commun', eau='douce', taille_min_cm=12, taille_max_cm=25, taille_moyenne_cm=12,
  poids_max_kg=0.15, poids_moyen_kg=0.03, longevite_annees='5-7 ans', regime='omnivore',
  habitat=ARRAY['riviere','lac','canal'], profondeur='0-2 m', temperature_eau='10-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Petit poisson argenté grégaire, l''ablette anime les surfaces calmes en bancs serrés. Son éclat argenté servait autrefois à fabriquer des fausses perles. Présente partout en France, elle est le maillon nourricier de nombreux prédateurs.',
  techniques=ARRAY['Pêche au coup','Pêche à la mouche sèche','Streamer ultra-light'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":5,"profondeur_optimale":"Surface","animation":"Amorce légère, esche minuscule"},{"nom":"Pêche à la mouche sèche","difficulte":2,"efficacite":4,"profondeur_optimale":"Surface","animation":"Mouches #18-22, dérive naturelle"},{"nom":"Streamer ultra-light","difficulte":3,"efficacite":3,"profondeur_optimale":"0-1 m","animation":"Lancers courts, récupération vibrante"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, légère brise","moment_jour":"Journée entière, pics en fin d après-midi","profondeur":"Surface","vent":"Léger à modéré"}'::jsonb,
  conseil_fishdex='Cherche les rondes en surface au crépuscule, c''est là qu''elles trahissent leur présence. Un hameçon trop gros, et tu pêcheras dans le vide toute la journée.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Peut être utilisée comme vif dans les zones autorisées.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='ablette';

UPDATE public.species SET
  nom_fr='Brème commune', nom_scientifique='Abramis brama', famille='Cyprinidés (Leuciscidae)',
  rarete='commun', eau='douce', taille_min_cm=40, taille_max_cm=80, taille_moyenne_cm=40,
  poids_max_kg=8, poids_moyen_kg=1.5, longevite_annees='10-20 ans', regime='omnivore',
  habitat=ARRAY['etang','lac','riviere'], profondeur='2-6 m', temperature_eau='12-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre, frai en mai-juin',
  description='Poisson au corps haut et comprimé latéralement, la brème commune se déplace en bancs sur les fonds vaseux. Sa silhouette de feuille est inimitable, surtout au printemps lors du frai bruyant.',
  techniques=ARRAY['Pêche au feeder','Pêche au coup au grand pivot','Pêche à la bolognaise'],
  techniques_recommandees='[{"nom":"Pêche au feeder","difficulte":2,"efficacite":5,"profondeur_optimale":"2-5 m","animation":"Amorce sucrée, vers de terre ou pellets"},{"nom":"Pêche au coup au grand pivot","difficulte":3,"efficacite":4,"profondeur_optimale":"3-6 m","animation":"Sondage précis, amorçage régulier"},{"nom":"Pêche à la bolognaise","difficulte":2,"efficacite":3,"profondeur_optimale":"1-3 m","animation":"Dérive lente le long des bordures"}]'::jsonb,
  conditions_ideales='{"meteo":"Couvert, chaleur stable","moment_jour":"Aube et crépuscule","profondeur":"3-5 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Quand tu trouves un banc, reste patient et amorce régulièrement. Les grosses brèmes mordent souvent juste après que les petites se calment.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='breme-commune';

UPDATE public.species SET
  nom_fr='Brème bordelière', nom_scientifique='Blicca bjoerkna', famille='Cyprinidés (Leuciscidae)',
  rarete='peu commun', eau='douce', taille_min_cm=20, taille_max_cm=36, taille_moyenne_cm=20,
  poids_max_kg=1, poids_moyen_kg=0.3, longevite_annees='8-10 ans', regime='omnivore',
  habitat=ARRAY['etang','riviere'], profondeur='1-4 m', temperature_eau='12-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Souvent confondue avec la jeune brème commune, la bordelière s''en distingue par ses yeux plus grands et ses nageoires légèrement rougeâtres. Plus petite, plus argentée, elle vit dans les mêmes eaux mais reste discrète.',
  techniques=ARRAY['Pêche au coup','Pêche au feeder léger'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":2,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Amorce fine, vers de vase ou asticots"},{"nom":"Pêche au feeder léger","difficulte":2,"efficacite":3,"profondeur_optimale":"2-4 m","animation":"Méthode classique, esches discrètes"}]'::jsonb,
  conditions_ideales='{"meteo":"Couvert ou ensoleillé doux","moment_jour":"Journée","profondeur":"2-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Entre brème commune et bordelière, beaucoup de pêcheurs se trompent. La bordelière a l''œil plus grand par rapport à la tête, c''est le signe le plus fiable.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='breme-bordeliere';

UPDATE public.species SET
  nom_fr='Carassin doré', nom_scientifique='Carassius auratus', famille='Cyprinidés (Cyprinidae)',
  rarete='commun', eau='douce', taille_min_cm=15, taille_max_cm=45, taille_moyenne_cm=15,
  poids_max_kg=2, poids_moyen_kg=0.2, longevite_annees='10-25 ans', regime='omnivore',
  habitat=ARRAY['etang','mare','canal'], profondeur='0.5-3 m', temperature_eau='8-30 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Originaire d''Asie, le carassin doré (ancêtre du poisson rouge) s''est largement naturalisé en France. Sa robe varie du bronze sombre à l''orange vif. Très rustique, il colonise les eaux les moins hospitalières.',
  techniques=ARRAY['Pêche au coup'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":4,"profondeur_optimale":"1-2 m","animation":"Esches simples, près du fond"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, calme","moment_jour":"Journée","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Espèce introduite, le carassin doré croise avec le carassin commun et menace sa survie. À prendre en compte si tu pêches dans des eaux fragiles.',
  statut_reglementaire='Pas de réglementation nationale de pêche spécifique. Espèce introduite.',
  difficulte=1, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='carassin-dore';

UPDATE public.species SET
  nom_fr='Chevesne', nom_scientifique='Squalius cephalus', famille='Cyprinidés (Leuciscidae)',
  rarete='commun', eau='douce', taille_min_cm=35, taille_max_cm=80, taille_moyenne_cm=35,
  poids_max_kg=6, poids_moyen_kg=1, longevite_annees='10-15 ans', regime='omnivore',
  habitat=ARRAY['riviere','fleuve','lac'], profondeur='0.5-4 m', temperature_eau='8-24 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Cyprinidé puissant et méfiant, le chevesne combine curiosité d''opportuniste et prudence de poisson chassé. Il monte avaler une cerise tombée d''un arbre, gobe un insecte en surface, mais détale au moindre bruit.',
  techniques=ARRAY['Pêche à la mouche','Pêche au leurre ultra-léger','Pêche à la cerise / pain','Pêche à la fouettée'],
  techniques_recommandees='[{"nom":"Pêche à la mouche","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface à 1 m","animation":"Mouche sèche posée délicatement, dérive naturelle"},{"nom":"Pêche au leurre ultra-léger","difficulte":3,"efficacite":4,"profondeur_optimale":"0-2 m","animation":"Petits cranks, leurres souples 5 cm"},{"nom":"Pêche à la cerise / pain","difficulte":1,"efficacite":4,"profondeur_optimale":"Surface","animation":"Esche flottante sous arbres fruitiers"},{"nom":"Pêche à la fouettée","difficulte":2,"efficacite":3,"profondeur_optimale":"0-2 m","animation":"Sauterelle, criquet, insecte vivant"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, été chaud","moment_jour":"Toute la journée, mieux en matinée et soirée","profondeur":"0-2 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='Le chevesne est l''un des poissons les plus malins de nos rivières. Approche en silence, lance sans projeter d''ombre. Les plus gros sont sous les arbres qui touchent l''eau.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='chevesne';

UPDATE public.species SET
  nom_fr='Gardon', nom_scientifique='Rutilus rutilus', famille='Cyprinidés (Leuciscidae)',
  rarete='commun', eau='douce', taille_min_cm=18, taille_max_cm=50, taille_moyenne_cm=18,
  poids_max_kg=2, poids_moyen_kg=0.15, longevite_annees='10-13 ans', regime='omnivore',
  habitat=ARRAY['etang','lac','riviere','canal'], profondeur='0.5-4 m', temperature_eau='8-24 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Le poisson de l''initiation. Le gardon, avec ses nageoires rouge orangé et son corps argenté, est souvent la première prise des jeunes pêcheurs. Présent partout en France, grégaire, vorace, il transmet le goût des choses simples.',
  techniques=ARRAY['Pêche au coup','Pêche à la grande canne','Pêche à la bolognaise'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":5,"profondeur_optimale":"1-3 m","animation":"Asticot, vers, amorce sucrée légère"},{"nom":"Pêche à la grande canne","difficulte":2,"efficacite":4,"profondeur_optimale":"2-4 m","animation":"Sondage précis, amorçage régulier"},{"nom":"Pêche à la bolognaise","difficulte":2,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Dérive en rivière lente"}]'::jsonb,
  conditions_ideales='{"meteo":"Doux, stable","moment_jour":"Matin et fin d après-midi","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Le gardon récompense le calme et la régularité. Une bonne session, c''est avant tout une bonne amorce et une eau lue avec patience.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=1, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='gardon';

UPDATE public.species SET
  nom_fr='Goujon', nom_scientifique='Gobio gobio', famille='Cyprinidés (Gobionidae)',
  rarete='commun', eau='douce', taille_min_cm=10, taille_max_cm=21, taille_moyenne_cm=10,
  poids_max_kg=0.2, poids_moyen_kg=0.02, longevite_annees='5-8 ans', regime='carnivore',
  habitat=ARRAY['riviere','ruisseau'], profondeur='0.3-2 m', temperature_eau='10-20 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre',
  description='Petit poisson de fond aux barbillons caractéristiques, le goujon est un indicateur d''eau saine. Discret, grégaire, il foule les graviers à la recherche de larves. Sa pêche initiatique fait partie du patrimoine des rivières françaises.',
  techniques=ARRAY['Pêche au toc / au plomb','Pêche au coup en rivière'],
  techniques_recommandees='[{"nom":"Pêche au toc / au plomb","difficulte":1,"efficacite":5,"profondeur_optimale":"Fond","animation":"Vers, larves, esche au ras du gravier"},{"nom":"Pêche au coup en rivière","difficulte":1,"efficacite":4,"profondeur_optimale":"0.5-1.5 m","animation":"Dérive courte, plombée près du fond"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, eau claire","moment_jour":"Journée","profondeur":"0.5-1.5 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Un ruisseau plein de goujons, c''est un ruisseau qui se porte bien. Profite-en pour montrer aux enfants ce qu''est une vraie pêche : simple, sans batterie, sans écran.',
  statut_reglementaire='Pas de taille légale nationale. Catégorie 1 dans les rivières à salmonidés. Peut être utilisé comme vif dans les zones autorisées.',
  difficulte=1, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='goujon';

UPDATE public.species SET
  nom_fr='Hotu', nom_scientifique='Chondrostoma nasus', famille='Cyprinidés (Leuciscidae)',
  rarete='peu commun', eau='douce', taille_min_cm=30, taille_max_cm=55, taille_moyenne_cm=30,
  poids_max_kg=2, poids_moyen_kg=0.6, longevite_annees='10-15 ans', regime='herbivore',
  habitat=ARRAY['riviere','fleuve'], profondeur='1-3 m', temperature_eau='10-20 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Reconnaissable à son museau pointu et sa bouche infère adaptée au broutage des pierres, le hotu vit en bancs serrés dans les eaux vives. Il racle inlassablement le biofilm algal des fonds caillouteux.',
  techniques=ARRAY['Pêche à la bolognaise','Pêche au toc','Pêche au coup en courant'],
  techniques_recommandees='[{"nom":"Pêche à la bolognaise","difficulte":3,"efficacite":5,"profondeur_optimale":"1-3 m","animation":"Esche végétale ou pâte verte près du fond"},{"nom":"Pêche au toc","difficulte":2,"efficacite":4,"profondeur_optimale":"Fond pierreux","animation":"Pâte, blé cuit, asticots groupés"},{"nom":"Pêche au coup en courant","difficulte":3,"efficacite":3,"profondeur_optimale":"1-2 m","animation":"Dérive lente, esche frôlant le fond"}]'::jsonb,
  conditions_ideales='{"meteo":"Eau claire, beau temps","moment_jour":"Journée","profondeur":"1-2 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='Le hotu se trahit par les coups secs qu''il donne sur la ligne avant de gober. Ne ferre pas trop tôt. Une fois piqué, il tire fort vers le courant : laisse-le filer.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Catégorie 1 dans les rivières à fort courant.',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='hotu';

UPDATE public.species SET
  nom_fr='Ide mélanote', nom_scientifique='Leuciscus idus', famille='Cyprinidés (Leuciscidae)',
  rarete='rare', eau='douce', taille_min_cm=40, taille_max_cm=80, taille_moyenne_cm=40,
  poids_max_kg=5, poids_moyen_kg=1.5, longevite_annees='15-20 ans', regime='omnivore',
  habitat=ARRAY['riviere','fleuve','lac'], profondeur='1-4 m', temperature_eau='10-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Cousin du chevesne dont il diffère par ses nageoires rougeâtres et sa robe argentée, l''ide mélanote vit dans les eaux plus larges. Plus rare en France, présent surtout dans les bassins du Rhin et de la Moselle.',
  techniques=ARRAY['Pêche au coup','Pêche au leurre léger','Pêche à la mouche'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":3,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Esches naturelles, amorce parfumée"},{"nom":"Pêche au leurre léger","difficulte":3,"efficacite":3,"profondeur_optimale":"0-2 m","animation":"Petits leurres souples, cranks"},{"nom":"Pêche à la mouche","difficulte":4,"efficacite":3,"profondeur_optimale":"Surface à 1 m","animation":"Mouches noyées, streamer fin"}]'::jsonb,
  conditions_ideales='{"meteo":"Doux, stable","moment_jour":"Matin et soir","profondeur":"1-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Si tu pêches dans le Rhin ou en Alsace, garde l''œil : l''ide mélanote est plus présent là-bas. Sa robe argentée aux reflets dorés est inimitable.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='ide-melanote';

UPDATE public.species SET
  nom_fr='Rotengle', nom_scientifique='Scardinius erythrophthalmus', famille='Cyprinidés (Leuciscidae)',
  rarete='commun', eau='douce', taille_min_cm=20, taille_max_cm=50, taille_moyenne_cm=20,
  poids_max_kg=2, poids_moyen_kg=0.3, longevite_annees='10-15 ans', regime='omnivore',
  habitat=ARRAY['etang','lac','riviere'], profondeur='0.5-3 m', temperature_eau='12-24 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre',
  description='Souvent confondu avec le gardon, le rotengle s''en distingue par ses nageoires plus rouges et sa bouche légèrement orientée vers le haut. Il fréquente les herbiers où il broute insectes et végétation tendre.',
  techniques=ARRAY['Pêche au coup','Pêche à la mouche sèche'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":2,"efficacite":5,"profondeur_optimale":"0.5-2 m","animation":"Esche flottante près des herbiers"},{"nom":"Pêche à la mouche sèche","difficulte":3,"efficacite":4,"profondeur_optimale":"Surface","animation":"Petite mouche imitative en surface"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, chaud","moment_jour":"Matin et fin d après-midi","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Cherche les herbiers en pleine eau, c''est là qu''il monte gober. Un petit hameçon, un asticot bien présenté en surface, et tu sentiras la touche franche.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='rotengle';

UPDATE public.species SET
  nom_fr='Spirlin', nom_scientifique='Alburnoides bipunctatus', famille='Cyprinidés (Leuciscidae)',
  rarete='rare', eau='douce', taille_min_cm=10, taille_max_cm=16, taille_moyenne_cm=10,
  poids_max_kg=0.05, poids_moyen_kg=0.015, longevite_annees='4-6 ans', regime='omnivore',
  habitat=ARRAY['riviere','ruisseau'], profondeur='0.3-1.5 m', temperature_eau='10-20 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre',
  description='Petit cyprinidé d''eaux vives, le spirlin se reconnaît à la ligne sombre qui parcourt ses flancs. Indicateur d''eaux de qualité, il colonise les zones à truite. Sa présence témoigne de la santé écologique d''un cours d''eau.',
  techniques=ARRAY['Pêche à la mouche sèche fine','Pêche au coup ultra-léger'],
  techniques_recommandees='[{"nom":"Pêche à la mouche sèche fine","difficulte":3,"efficacite":3,"profondeur_optimale":"Surface","animation":"Mouches minuscules #20-24"},{"nom":"Pêche au coup ultra-léger","difficulte":2,"efficacite":3,"profondeur_optimale":"0.5 m","animation":"Esches minuscules en dérive courte"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps","moment_jour":"Matin à fin d après-midi","profondeur":"0.5-1 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Capturer un spirlin signe une rivière en bonne santé. Plus qu''une prise, c''est un témoignage. Relâche-le délicatement, c''est une espèce sensible.',
  statut_reglementaire='Espèce d''intérêt communautaire (Directive Habitats Annexes II et IV). Relâche obligatoire recommandée.',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='spirlin';

UPDATE public.species SET
  nom_fr='Vairon', nom_scientifique='Phoxinus phoxinus', famille='Cyprinidés (Leuciscidae)',
  rarete='commun', eau='douce', taille_min_cm=8, taille_max_cm=14, taille_moyenne_cm=8,
  poids_max_kg=0.03, poids_moyen_kg=0.01, longevite_annees='4-7 ans', regime='omnivore',
  habitat=ARRAY['ruisseau','riviere'], profondeur='0.2-1.5 m', temperature_eau='5-18 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre',
  description='Petit poisson grégaire des eaux vives, le vairon arbore de superbes couleurs de noces au printemps : ventre rouge orangé, flancs verdâtres, points dorés. Compagnon habituel de la truite, sa présence indique des eaux froides et oxygénées.',
  techniques=ARRAY['Pêche au toc / petit hameçon'],
  techniques_recommandees='[{"nom":"Pêche au toc / petit hameçon","difficulte":1,"efficacite":5,"profondeur_optimale":"0.3-1 m","animation":"Asticot, ver minuscule en dérive"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, eau claire","moment_jour":"Journée","profondeur":"0.5-1 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Au printemps, observe les vairons en parade nuptiale : robes rouges et dorées sur fond de graviers — c''est l''un des plus beaux spectacles discrets de nos rivières.',
  statut_reglementaire='Catégorie 1 dans la plupart des ruisseaux et rivières à salmonidés. Peut être utilisé comme vif dans les zones autorisées.',
  difficulte=1, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='vairon';

UPDATE public.species SET
  nom_fr='Vandoise', nom_scientifique='Leuciscus leuciscus', famille='Cyprinidés (Leuciscidae)',
  rarete='peu commun', eau='douce', taille_min_cm=20, taille_max_cm=40, taille_moyenne_cm=20,
  poids_max_kg=1, poids_moyen_kg=0.15, longevite_annees='10-15 ans', regime='omnivore',
  habitat=ARRAY['riviere'], profondeur='0.5-2.5 m', temperature_eau='8-20 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Cyprinidé élancé aux flancs argentés, la vandoise vit dans les rivières propres à courant modéré. Plus farouche que le gardon, elle gobe les insectes en surface comme une truite. Sa présence indique une qualité d''eau supérieure à la moyenne.',
  techniques=ARRAY['Pêche à la mouche sèche','Pêche au coup léger'],
  techniques_recommandees='[{"nom":"Pêche à la mouche sèche","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface","animation":"Mouches imitatives fines, dérive précise"},{"nom":"Pêche au coup léger","difficulte":2,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Dérive avec esche naturelle"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, éclosions","moment_jour":"Matin et soir","profondeur":"0.5-1.5 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Quand tu vois des ronds en surface qui ne sont pas ceux d''une truite, c''est souvent la vandoise. Mouche posée délicatement, dérive parfaite : elle pardonne moins qu''un chevesne.',
  statut_reglementaire='Catégorie 1 dans la plupart de ses habitats. Pas de taille légale nationale.',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='vandoise';

UPDATE public.species SET
  nom_fr='Bouvière', nom_scientifique='Rhodeus amarus', famille='Cyprinidés (Acheilognathidae)',
  rarete='rare', eau='douce', taille_min_cm=6, taille_max_cm=9, taille_moyenne_cm=6,
  poids_max_kg=0.01, poids_moyen_kg=0.005, longevite_annees='4-5 ans', regime='omnivore',
  habitat=ARRAY['etang','riviere'], profondeur='0.3-2 m', temperature_eau='12-24 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Petit cyprinidé aux couleurs irisées, la bouvière dépend d''un partenaire inattendu pour sa reproduction : la moule d''eau douce. La femelle pond ses œufs dans le siphon de la moule. Cette symbiose unique en fait une espèce vulnérable.',
  techniques=ARRAY[]::text[],
  techniques_recommandees='[]'::jsonb,
  conditions_ideales='{"meteo":"Doux","moment_jour":"Journée","profondeur":"0.5-1.5 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='La bouvière ne se pêche pas en pratique (trop petite). Si tu en aperçois, c''est signe que les moules d''eau douce sont là aussi. Une bonne nouvelle écologique.',
  statut_reglementaire='Espèce protégée. Directive Habitats Annexe II.',
  difficulte=NULL, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='bouviere';

UPDATE public.species SET
  nom_fr='Tanche', nom_scientifique='Tinca tinca', famille='Cyprinidés (Tincidae)',
  rarete='peu commun', eau='douce', taille_min_cm=40, taille_max_cm=84, taille_moyenne_cm=40,
  poids_max_kg=9, poids_moyen_kg=1.5, longevite_annees='15-20 ans', regime='omnivore',
  habitat=ARRAY['etang','mare','riviere'], profondeur='0.5-3 m', temperature_eau='12-26 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Poisson trapu à la peau couverte de mucus, à la robe verte sombre tirant sur le bronze. La tanche aime les eaux chaudes et stagnantes, où elle fouille la vase. Discrète et farouche, c''est un poisson qui se mérite.',
  techniques=ARRAY['Pêche au feeder','Pêche au coup à fond','Pêche à la grande canne'],
  techniques_recommandees='[{"nom":"Pêche au feeder","difficulte":2,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Vers de terre, pellets, amorce sucrée"},{"nom":"Pêche au coup à fond","difficulte":2,"efficacite":4,"profondeur_optimale":"1-2.5 m","animation":"Esche posée près des herbiers"},{"nom":"Pêche à la grande canne","difficulte":3,"efficacite":3,"profondeur_optimale":"1-2 m","animation":"Amorçage régulier, esches naturelles"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, lourd, orageux","moment_jour":"Aube et crépuscule","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='La tanche aime les eaux chaudes et les nuits orageuses. Amorçage sucré, esche posée délicatement. Le combat est lent et puissant : ne brusque rien.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='tanche';

UPDATE public.species SET
  nom_fr='Carpe commune', nom_scientifique='Cyprinus carpio', famille='Cyprinidés (Cyprinidae)',
  rarete='commun', eau='douce', taille_min_cm=50, taille_max_cm=120, taille_moyenne_cm=50,
  poids_max_kg=40, poids_moyen_kg=5, longevite_annees='20-50 ans', regime='omnivore',
  habitat=ARRAY['etang','lac','riviere'], profondeur='1-6 m', temperature_eau='10-28 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre, frai en mai-juin',
  description='Poisson emblématique de la pêche en France, la carpe commune a été introduite par les Romains et élevée depuis le Moyen Âge. Intelligente, méfiante, puissante, elle a engendré une culture de pêche à part entière.',
  techniques=ARRAY['Pêche à la carpe au feeder/cheveu','Pêche au stalking','Pêche à la grande canne'],
  techniques_recommandees='[{"nom":"Pêche à la carpe au feeder/cheveu","difficulte":3,"efficacite":5,"profondeur_optimale":"2-5 m","animation":"Bouillettes, amorçage en boules, longues sessions"},{"nom":"Pêche au stalking","difficulte":4,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Repérage visuel, présentation discrète"},{"nom":"Pêche à la grande canne","difficulte":3,"efficacite":4,"profondeur_optimale":"2-4 m","animation":"Amorce parfumée, esches naturelles"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, lourd","moment_jour":"Aube et crépuscule, nuit","profondeur":"2-4 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='La carpe se mérite par la patience. Une session de 24 ou 48h, c''est aussi un moment de contemplation. Apprends à lire l''eau, à entendre le silence d''un lac.',
  statut_reglementaire='Taille légale : 40 cm (variable selon plans d''eau et départements). Certains parcours imposent le no-kill. Pêche de nuit autorisée selon les eaux.',
  difficulte=3, taille_legale_cm=40, is_hidden_in_dex=false, updated_at=now()
WHERE slug='carpe-commune';

UPDATE public.species SET
  nom_fr='Amour blanc', nom_scientifique='Ctenopharyngodon idella', famille='Cyprinidés (Xenocyprididae)',
  rarete='peu commun', eau='douce', taille_min_cm=60, taille_max_cm=150, taille_moyenne_cm=60,
  poids_max_kg=45, poids_moyen_kg=5, longevite_annees='15-20 ans', regime='herbivore',
  habitat=ARRAY['etang','lac','canal'], profondeur='1-5 m', temperature_eau='15-28 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Originaire de Chine, l''amour blanc a été introduit pour son rôle de débroussailleur naturel : il consomme jusqu''à son poids en végétation par jour. Reconnaissable à son corps allongé et sa tête volumineuse.',
  techniques=ARRAY['Pêche au herbe / pain','Pêche à la carpe (esches végétales)'],
  techniques_recommandees='[{"nom":"Pêche au herbe / pain","difficulte":3,"efficacite":4,"profondeur_optimale":"Surface à 2 m","animation":"Herbe coupée, pain flottant près des berges"},{"nom":"Pêche à la carpe (esches végétales)","difficulte":3,"efficacite":3,"profondeur_optimale":"1-3 m","animation":"Bouillettes végétales, maïs"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, ensoleillé","moment_jour":"Journée","profondeur":"1-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Cherche les amours à proximité des herbiers par temps chaud. L''esche végétale est obligatoire. Une fois piqué, c''est un combat de force pure, prépare ton matériel solide.',
  statut_reglementaire='Taille légale variable selon les plans d''eau, souvent 40 cm. Espèce introduite ne se reproduisant pas naturellement en France.',
  difficulte=3, taille_legale_cm=40, is_hidden_in_dex=false, updated_at=now()
WHERE slug='amour-blanc';

UPDATE public.species SET
  nom_fr='Brochet', nom_scientifique='Esox lucius', famille='Ésocidés (Esocidae)',
  rarete='peu commun', eau='douce', taille_min_cm=60, taille_max_cm=150, taille_moyenne_cm=60,
  poids_max_kg=25, poids_moyen_kg=3, longevite_annees='10-25 ans', regime='carnivore',
  habitat=ARRAY['etang','lac','riviere'], profondeur='0.5-4 m', temperature_eau='8-22 °C',
  saison=ARRAY['hiver','printemps','ete','automne'], saison_active='Toute l année hors frai (février-avril)',
  description='Prédateur iconique des eaux françaises, le brochet chasse à l''affût, immobile entre les herbiers. Sa silhouette allongée, ses mâchoires armées, son explosion lors de l''attaque : c''est le carnassier qui marque les pêcheurs.',
  techniques=ARRAY['Pêche au jerkbait','Pêche au spinnerbait','Pêche au swimbait','Pêche au vif (lorsque autorisé)'],
  techniques_recommandees='[{"nom":"Pêche au jerkbait","difficulte":3,"efficacite":5,"profondeur_optimale":"1-3 m","animation":"Twitchs irréguliers, pauses marquées"},{"nom":"Pêche au spinnerbait","difficulte":2,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Récupération constante avec accélérations"},{"nom":"Pêche au swimbait","difficulte":3,"efficacite":4,"profondeur_optimale":"1-4 m","animation":"Récupération linéaire lente"},{"nom":"Pêche au vif (lorsque autorisé)","difficulte":2,"efficacite":5,"profondeur_optimale":"1-3 m","animation":"Présentation près des herbiers"}]'::jsonb,
  conditions_ideales='{"meteo":"Temps couvert, pluie fine","moment_jour":"Lever et coucher du soleil","profondeur":"1-3 m","vent":"Léger à modéré"}'::jsonb,
  conseil_fishdex='Le brochet est souvent plus agressif au lever du soleil par temps couvert. Privilégie les bordures avec herbiers. Respecte la fenêtre de fermeture : la reproduction est sacrée.',
  statut_reglementaire='Période de fermeture : fin janvier à fin avril selon départements. Taille légale : 50 cm (ou 60 cm selon zones).',
  difficulte=3, taille_legale_cm=50, is_hidden_in_dex=false, updated_at=now()
WHERE slug='brochet';

UPDATE public.species SET
  nom_fr='Sandre', nom_scientifique='Sander lucioperca', famille='Percidés (Percidae)',
  rarete='peu commun', eau='douce', taille_min_cm=50, taille_max_cm=130, taille_moyenne_cm=50,
  poids_max_kg=15, poids_moyen_kg=2, longevite_annees='10-20 ans', regime='carnivore',
  habitat=ARRAY['lac','fleuve','riviere'], profondeur='3-10 m', temperature_eau='8-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mars-Décembre, frai avril-mai',
  description='Carnassier sobre et discret, le sandre chasse souvent en groupe et en profondeur. Ses yeux glauques, adaptés à la pénombre, lui permettent de chasser au crépuscule. Plus subtil que le brochet, il demande de la finesse.',
  techniques=ARRAY['Pêche au leurre souple','Pêche au drop shot','Pêche à la verticale'],
  techniques_recommandees='[{"nom":"Pêche au leurre souple","difficulte":4,"efficacite":5,"profondeur_optimale":"3-8 m","animation":"Animation linéaire à coups légers, près du fond"},{"nom":"Pêche au drop shot","difficulte":4,"efficacite":5,"profondeur_optimale":"3-10 m","animation":"Petites secousses sur place, esche au-dessus du fond"},{"nom":"Pêche à la verticale","difficulte":3,"efficacite":4,"profondeur_optimale":"5-12 m","animation":"Esche à la verticale, déplacement bateau lent"}]'::jsonb,
  conditions_ideales='{"meteo":"Temps couvert, pression basse","moment_jour":"Crépuscule et nuit","profondeur":"3-8 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='Le sandre est exigeant sur la finesse. Touches très discrètes : sois attentif au moindre tic. Sa prudence à venir mordre récompense les patients.',
  statut_reglementaire='Pas de période de fermeture nationale. Taille légale : 40 cm (variable selon départements).',
  difficulte=4, taille_legale_cm=40, is_hidden_in_dex=false, updated_at=now()
WHERE slug='sandre';

UPDATE public.species SET
  nom_fr='Perche soleil', nom_scientifique='Lepomis gibbosus', famille='Centrarchidés (Centrarchidae)',
  rarete='commun', eau='douce', taille_min_cm=12, taille_max_cm=30, taille_moyenne_cm=12,
  poids_max_kg=0.6, poids_moyen_kg=0.1, longevite_annees='6-10 ans', regime='carnivore',
  habitat=ARRAY['etang','mare','riviere'], profondeur='0.5-3 m', temperature_eau='12-28 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Originaire d''Amérique du Nord, la perche soleil a été introduite comme poisson d''aquarium au XIXe siècle. Aujourd''hui invasive, elle colonise les eaux calmes. Aux couleurs vives malgré tout — bleu, orange, vert iridescent.',
  techniques=ARRAY['Pêche au coup','Pêche au leurre ultra-light'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":1,"efficacite":5,"profondeur_optimale":"0.5-2 m","animation":"Asticot, vers, petite esche"},{"nom":"Pêche au leurre ultra-light","difficulte":2,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Petits leurres souples ou cuillers"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, ensoleillé","moment_jour":"Journée","profondeur":"1 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Espèce invasive : ne la relâche jamais dans une autre eau. C''est aussi un excellent poisson pour initier les enfants à la pêche.',
  statut_reglementaire='Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant interdit.',
  difficulte=1, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='perche-soleil';

UPDATE public.species SET
  nom_fr='Silure glane', nom_scientifique='Silurus glanis', famille='Siluridés (Siluridae)',
  rarete='rare', eau='douce', taille_min_cm=150, taille_max_cm=280, taille_moyenne_cm=150,
  poids_max_kg=130, poids_moyen_kg=30, longevite_annees='30-80 ans', regime='carnivore',
  habitat=ARRAY['fleuve','lac'], profondeur='3-15 m', temperature_eau='8-26 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre',
  description='Plus grand prédateur d''eau douce français, le silure peut dépasser 2 mètres. Activité nocturne, vie en fosses profondes : il marque les pêcheurs par sa puissance et le mystère qui l''entoure.',
  techniques=ARRAY['Pêche au clonk','Pêche au vif sur posée','Pêche au leurre lourd'],
  techniques_recommandees='[{"nom":"Pêche au clonk","difficulte":4,"efficacite":5,"profondeur_optimale":"5-15 m","animation":"Clonk en surface pour attirer, esche dérivante"},{"nom":"Pêche au vif sur posée","difficulte":3,"efficacite":5,"profondeur_optimale":"5-12 m","animation":"Esche posée, attente longue"},{"nom":"Pêche au leurre lourd","difficulte":4,"efficacite":4,"profondeur_optimale":"3-10 m","animation":"Gros swimbaits, jerks lents et larges"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, lourd, orageux","moment_jour":"Crépuscule et nuit","profondeur":"5-12 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='Le silure se mérite. Matériel solide, patience, nuits sur la berge. Respect : remets-le à l''eau délicatement, c''est un animal âgé qui mérite d''autres saisons.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Réglementation variable selon les plans d''eau.',
  difficulte=4, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='silure-glane';

UPDATE public.species SET
  nom_fr='Aspe', nom_scientifique='Leuciscus aspius', famille='Cyprinidés (Leuciscidae)',
  rarete='rare', eau='douce', taille_min_cm=50, taille_max_cm=120, taille_moyenne_cm=50,
  poids_max_kg=12, poids_moyen_kg=2, longevite_annees='10-15 ans', regime='carnivore',
  habitat=ARRAY['riviere','fleuve','lac'], profondeur='1-5 m', temperature_eau='10-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Octobre',
  description='Curiosité de la nature : l''aspe est un cyprinidé piscivore. Introduit en France via le Rhin, il chasse en surface par poursuites énergiques, spécialiste des ablettes. Sa pêche au leurre se développe.',
  techniques=ARRAY['Pêche au leurre métallique','Pêche aux leurres durs imitatifs','Pêche à la mouche streamer'],
  techniques_recommandees='[{"nom":"Pêche au leurre métallique","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface à 2 m","animation":"Cuillers tournantes ou ondulantes, récupération rapide"},{"nom":"Pêche aux leurres durs imitatifs","difficulte":3,"efficacite":4,"profondeur_optimale":"0-3 m","animation":"Jerkbaits fins type ablette, animation vive"},{"nom":"Pêche à la mouche streamer","difficulte":4,"efficacite":3,"profondeur_optimale":"0-2 m","animation":"Streamers imitant ablette, animation rapide"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps, eau claire","moment_jour":"Matin et soir","profondeur":"1-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Les bancs d''ablettes en surface sont ses cantines préférées. Lance ton leurre devant le poisson, récupération rapide. C''est une espèce récente en France, encore mal connue.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Répartition très localisée (Rhin, Moselle, Loire, Seine).',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='aspe';

UPDATE public.species SET
  nom_fr='Anguille européenne', nom_scientifique='Anguilla anguilla', famille='Anguillidés (Anguillidae)',
  rarete='rare', eau='douce', taille_min_cm=60, taille_max_cm=150, taille_moyenne_cm=60,
  poids_max_kg=6, poids_moyen_kg=0.8, longevite_annees='15-30 ans (jusqu à 50 ans)',
  regime='carnivore', habitat=ARRAY['lac','etang','riviere','fleuve'],
  profondeur='1-5 m', temperature_eau='8-25 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Avril-Novembre (activité nocturne)',
  description='Cycle de vie mystérieux : née dans la mer des Sargasses, l''anguille migre vers les côtes européennes, remonte les fleuves, vit jusqu''à 30 ans en eau douce, puis retourne mourir en mer. Espèce en danger critique, sa population a chuté de 95% en 30 ans.',
  techniques=ARRAY['Pêche au ver à la posée (lorsque autorisé)'],
  techniques_recommandees='[{"nom":"Pêche au ver à la posée (lorsque autorisé)","difficulte":2,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Esche posée près du fond, surtout la nuit"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, lourd, orageux","moment_jour":"Nuit","profondeur":"1-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='L''anguille est en danger critique d''extinction. Si tu en croises une, relâche-la avec soin : c''est un animal qui a peut-être déjà vécu 15 ou 20 ans dans nos eaux.',
  statut_reglementaire='Espèce en danger critique (UICN). Réglementation stricte et évolutive : quotas, périodes, tailles légales. Vérifier la réglementation locale à jour annuellement.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='anguille-europeenne';

UPDATE public.species SET
  nom_fr='Truite fario', nom_scientifique='Salmo trutta fario', famille='Salmonidés (Salmonidae)',
  rarete='peu commun', eau='douce', taille_min_cm=25, taille_max_cm=80, taille_moyenne_cm=25,
  poids_max_kg=5, poids_moyen_kg=0.3, longevite_annees='8-15 ans', regime='carnivore',
  habitat=ARRAY['ruisseau','riviere'], profondeur='0.3-2 m', temperature_eau='5-18 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mars-Septembre (selon ouvertures)',
  description='Reine des rivières françaises, la truite fario est la forme sédentaire de Salmo trutta. Sa robe, constellée de points rouges et noirs, varie selon les rivières. Méfiante, vue perçante, elle exige précision et discrétion.',
  techniques=ARRAY['Pêche à la mouche sèche','Pêche à la nymphe à vue','Pêche au toc','Pêche au leurre ultra-léger'],
  techniques_recommandees='[{"nom":"Pêche à la mouche sèche","difficulte":4,"efficacite":5,"profondeur_optimale":"Surface","animation":"Imitations d éphémères ou trichoptères, dérive parfaite"},{"nom":"Pêche à la nymphe à vue","difficulte":4,"efficacite":5,"profondeur_optimale":"0.5-2 m","animation":"Nymphes lestées, détection par fil"},{"nom":"Pêche au toc","difficulte":3,"efficacite":5,"profondeur_optimale":"0.5-1.5 m","animation":"Vers ou larves en dérive naturelle"},{"nom":"Pêche au leurre ultra-léger","difficulte":3,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Petits leurres imitatifs ou cuillers"}]'::jsonb,
  conditions_ideales='{"meteo":"Couvert, après pluie légère","moment_jour":"Matin et fin d après-midi","profondeur":"0.5-1.5 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Approche en remontant le courant, l''eau cache ton ombre. Lance court, fil tendu, observe avant chaque lancer. La truite fario apprend vite : c''est ce qui fait la beauté de cette pêche.',
  statut_reglementaire='Période d''ouverture variable selon départements (1ère catégorie). Taille légale : 23 ou 25 cm selon zones.',
  difficulte=4, taille_legale_cm=23, is_hidden_in_dex=false, updated_at=now()
WHERE slug='truite-fario';

UPDATE public.species SET
  nom_fr='Truite arc-en-ciel', nom_scientifique='Oncorhynchus mykiss', famille='Salmonidés (Salmonidae)',
  rarete='peu commun', eau='douce', taille_min_cm=30, taille_max_cm=100, taille_moyenne_cm=30,
  poids_max_kg=10, poids_moyen_kg=0.5, longevite_annees='7-11 ans', regime='carnivore',
  habitat=ARRAY['riviere','plan_eau'], profondeur='0.5-3 m', temperature_eau='5-22 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mars-Septembre',
  description='Originaire du Pacifique nord-américain, la truite arc-en-ciel est largement introduite en France. Reconnaissable à sa bande latérale rose iridescente, elle est moins méfiante que la fario et combat plus violemment.',
  techniques=ARRAY['Pêche au leurre','Pêche à la mouche','Pêche au toc / lancer'],
  techniques_recommandees='[{"nom":"Pêche au leurre","difficulte":2,"efficacite":5,"profondeur_optimale":"0.5-3 m","animation":"Cuillers tournantes, leurres souples"},{"nom":"Pêche à la mouche","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface à 2 m","animation":"Sèches, nymphes, streamers"},{"nom":"Pêche au toc / lancer","difficulte":2,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Vers, esches naturelles"}]'::jsonb,
  conditions_ideales='{"meteo":"Variable","moment_jour":"Matin et fin d après-midi","profondeur":"1-2 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='Plus combative que la fario, l''arc-en-ciel est souvent issue de lâchers. Pour le no-kill, manipule-la peu et délicatement.',
  statut_reglementaire='Soumise aux ouvertures de 1ère catégorie. Taille légale : 23 à 25 cm selon zones.',
  difficulte=2, taille_legale_cm=23, is_hidden_in_dex=false, updated_at=now()
WHERE slug='truite-arc-en-ciel';

UPDATE public.species SET
  nom_fr='Omble chevalier', nom_scientifique='Salvelinus alpinus', famille='Salmonidés (Salmonidae)',
  rarete='epique', eau='douce', taille_min_cm=40, taille_max_cm=90, taille_moyenne_cm=40,
  poids_max_kg=12, poids_moyen_kg=1, longevite_annees='15-25 ans', regime='carnivore',
  habitat=ARRAY['lac'], profondeur='30-100 m', temperature_eau='4-12 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre principalement',
  description='Relique de la dernière glaciation, l''omble chevalier vit dans les lacs alpins profonds. Sa robe orange-rouge éclatante à la période de frai en fait l''un des plus beaux poissons d''eau douce.',
  techniques=ARRAY['Pêche à la traîne profonde','Pêche à la gambe (gandolyne)','Pêche à la mouche en surface'],
  techniques_recommandees='[{"nom":"Pêche à la traîne profonde","difficulte":4,"efficacite":5,"profondeur_optimale":"20-50 m","animation":"Cuillers ondulantes, downriggers, bateau"},{"nom":"Pêche à la gambe (gandolyne)","difficulte":3,"efficacite":4,"profondeur_optimale":"30-60 m","animation":"Ligne verticale avec multiples hameçons garnis"},{"nom":"Pêche à la mouche en surface (frai)","difficulte":4,"efficacite":4,"profondeur_optimale":"Surface à 2 m","animation":"Streamers ou mouches imitatives à l automne"}]'::jsonb,
  conditions_ideales='{"meteo":"Variable, eaux froides","moment_jour":"Aube et crépuscule","profondeur":"20-50 m (variable)","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='L''omble chevalier ne se pêche pas n''importe où. Renseigne-toi auprès des fédérations alpines : Bourget, Léman, Annecy ont leurs traditions et leurs périodes.',
  statut_reglementaire='Réglementation locale stricte (lacs alpins). Périodes, tailles, quotas variables selon le lac.',
  difficulte=4, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='omble-chevalier';

UPDATE public.species SET
  nom_fr='Saumon atlantique', nom_scientifique='Salmo salar', famille='Salmonidés (Salmonidae)',
  rarete='epique', eau='douce', taille_min_cm=70, taille_max_cm=150, taille_moyenne_cm=70,
  poids_max_kg=30, poids_moyen_kg=4, longevite_annees='4-10 ans', regime='carnivore',
  habitat=ARRAY['riviere','fleuve'], profondeur='1-5 m', temperature_eau='4-18 °C',
  saison=ARRAY['printemps','ete'], saison_active='Mars-Juillet (montaisons selon rivière)',
  description='Roi des salmonidés français, le saumon atlantique est devenu rare. Il naît en rivière, descend en mer pour grandir, puis revient sur sa rivière natale pour se reproduire. En France, il survit dans une poignée de rivières bretonnes et basques.',
  techniques=ARRAY['Pêche à la mouche','Pêche à la cuiller','Pêche au lancer aux leurres'],
  techniques_recommandees='[{"nom":"Pêche à la mouche","difficulte":5,"efficacite":5,"profondeur_optimale":"0.5-3 m","animation":"Streamers, mouches saumons, skating ou noyée"},{"nom":"Pêche à la cuiller","difficulte":4,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Cuillers ondulantes, récupération régulière"},{"nom":"Pêche au lancer aux leurres","difficulte":4,"efficacite":3,"profondeur_optimale":"1-3 m","animation":"Devons, gros leurres imitatifs"}]'::jsonb,
  conditions_ideales='{"meteo":"Crues, eaux teintées","moment_jour":"Toute la journée selon montaison","profondeur":"1-3 m","vent":"Variable"}'::jsonb,
  conseil_fishdex='Le saumon atlantique est précieux. Quotas stricts, périodes courtes, parfois tirages au sort. Si tu en pêches un, tu rejoins une lignée de pêcheurs qui se battent pour préserver cette espèce.',
  statut_reglementaire='Pêche extrêmement réglementée : quotas annuels par rivière, tirage au sort sur certains parcours. Vérifier auprès de l''AAPPMA locale.',
  difficulte=5, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='saumon-atlantique';

UPDATE public.species SET
  nom_fr='Truite de mer', nom_scientifique='Salmo trutta trutta', famille='Salmonidés (Salmonidae)',
  rarete='rare', eau='douce', taille_min_cm=50, taille_max_cm=100, taille_moyenne_cm=50,
  poids_max_kg=15, poids_moyen_kg=2, longevite_annees='8-15 ans', regime='carnivore',
  habitat=ARRAY['riviere','fleuve'], profondeur='1-4 m', temperature_eau='6-18 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mars-Octobre (montaisons selon rivière)',
  description='Cousine migratrice de la truite fario, la truite de mer vit alternativement en eau douce et en mer. Elle revient se reproduire dans sa rivière natale, parfois plusieurs fois. Robe argentée éclatante à la remontée.',
  techniques=ARRAY['Pêche à la mouche de nuit','Pêche à la cuiller'],
  techniques_recommandees='[{"nom":"Pêche à la mouche de nuit","difficulte":5,"efficacite":5,"profondeur_optimale":"0.5-3 m","animation":"Streamers noirs, animation lente, pêche nocturne"},{"nom":"Pêche à la cuiller","difficulte":4,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Cuillers brillantes, récupération variée"}]'::jsonb,
  conditions_ideales='{"meteo":"Eau teintée, crue décroissante","moment_jour":"Nuit (souvent)","profondeur":"1-2 m","vent":"Variable"}'::jsonb,
  conseil_fishdex='La pêche de la truite de mer se fait souvent de nuit, dans des conditions précises. C''est une école de patience. Comme le saumon, ses populations chutent : pratique le no-kill quand tu peux.',
  statut_reglementaire='Soumise aux ouvertures de 1ère catégorie. Taille légale : 40 cm dans la plupart des zones. Vérifier auprès de la fédération locale.',
  difficulte=5, taille_legale_cm=40, is_hidden_in_dex=false, updated_at=now()
WHERE slug='truite-de-mer';

UPDATE public.species SET
  nom_fr='Huchon', nom_scientifique='Hucho hucho', famille='Salmonidés (Salmonidae)',
  rarete='legendaire', eau='douce', taille_min_cm=80, taille_max_cm=150, taille_moyenne_cm=80,
  poids_max_kg=50, poids_moyen_kg=10, longevite_annees='15-20 ans', regime='carnivore',
  habitat=ARRAY['riviere'], profondeur='1-5 m', temperature_eau='5-18 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mars-Octobre (selon réglementation)',
  description='Plus grand salmonidé d''Europe, le huchon (ou saumon du Danube) a été introduit en France dans les années 50 dans la rivière les Usses (Haute-Savoie). Présence aujourd''hui anecdotique voire éteinte localement.',
  techniques=ARRAY[]::text[],
  techniques_recommandees='[]'::jsonb,
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et crépuscule","profondeur":"1-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Le huchon en France relève du mythe. Sa présence actuelle dans les Usses est très incertaine. Si tu en captures un (ce serait extraordinaire), photo, relâche immédiate, signale à la fédération.',
  statut_reglementaire='Taille légale : 70 cm. Présence reproductrice incertaine en France. Vérifier la réglementation locale.',
  difficulte=NULL, taille_legale_cm=70, is_hidden_in_dex=false, updated_at=now()
WHERE slug='huchon';

UPDATE public.species SET
  nom_fr='Chabot commun', nom_scientifique='Cottus gobio', famille='Cottidés (Cottidae)',
  rarete='rare', eau='douce', taille_min_cm=10, taille_max_cm=17, taille_moyenne_cm=10,
  poids_max_kg=0.1, poids_moyen_kg=0.02, longevite_annees='5-8 ans', regime='carnivore',
  habitat=ARRAY['ruisseau','riviere'], profondeur='0.1-1 m', temperature_eau='5-15 °C',
  saison=ARRAY['hiver','printemps','ete','automne'], saison_active='Toute l année',
  description='Petit poisson de fond aux yeux saillants et à la grosse tête, le chabot vit caché sous les pierres des ruisseaux frais. Sa présence indique des eaux d''excellente qualité. Espèce d''intérêt patrimonial européen.',
  techniques=ARRAY[]::text[],
  techniques_recommandees='[]'::jsonb,
  conditions_ideales='{"meteo":"Eaux claires","moment_jour":"Crépuscule et nuit (activité)","profondeur":"0.2-0.5 m","vent":"Sans incidence"}'::jsonb,
  conseil_fishdex='Le chabot ne se pêche pas, c''est une observation. Soulève délicatement une pierre dans un ruisseau à truite : sa présence signe une eau de qualité. Espèce protégée européenne.',
  statut_reglementaire='Espèce protégée. Directive Habitats Annexe II.',
  difficulte=NULL, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='chabot';

-- ════════════════════════════════════
-- PARTIE 2 — UPDATE avec changement de slug (9)
-- ════════════════════════════════════

UPDATE public.species SET
  slug='carassin-commun', nom_fr='Carassin commun', nom_scientifique='Carassius carassius',
  famille='Cyprinidés (Cyprinidae)', rarete='rare', eau='douce',
  taille_min_cm=20, taille_max_cm=50, taille_moyenne_cm=20,
  poids_max_kg=3, poids_moyen_kg=0.4, longevite_annees='10-12 ans', regime='omnivore',
  habitat=ARRAY['etang','mare'], profondeur='0.5-3 m', temperature_eau='8-28 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Cousin sauvage du carassin doré, le carassin commun se reconnaît à sa coloration brun-bronze et ses formes trapues. De plus en plus rare en France, il subit la concurrence du carassin doré introduit.',
  techniques=ARRAY['Pêche au coup','Pêche à la grande canne'],
  techniques_recommandees='[{"nom":"Pêche au coup","difficulte":2,"efficacite":4,"profondeur_optimale":"1-2 m","animation":"Esches naturelles près du fond, herbiers"},{"nom":"Pêche à la grande canne","difficulte":2,"efficacite":3,"profondeur_optimale":"1-3 m","animation":"Esches lourdes, amorçage modéré"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, stable","moment_jour":"Aube et crépuscule","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Si tu en captures un, observe-le attentivement avant de le relâcher : il est moins commun qu''autrefois. Les petites eaux abandonnées sont souvent ses derniers refuges.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Population en déclin : relâche recommandée.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='carassin';

UPDATE public.species SET
  slug='carpe-amour-argente', nom_fr='Carpe amour argenté', nom_scientifique='Hypophthalmichthys molitrix',
  famille='Cyprinidés (Xenocyprididae)', rarete='rare', eau='douce',
  taille_min_cm=60, taille_max_cm=130, taille_moyenne_cm=60,
  poids_max_kg=40, poids_moyen_kg=8, longevite_annees='15-20 ans', regime='omnivore',
  habitat=ARRAY['lac','etang'], profondeur='1-5 m', temperature_eau='15-30 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Originaire d''Asie du Sud-Est, l''amour argenté filtre le plancton par ses branchiospines. Introduit pour contrôler le phytoplancton, il atteint des tailles impressionnantes. Sa capture reste un défi confidentiel en France.',
  techniques=ARRAY['Pêche au pain / pâte flottante de surface'],
  techniques_recommandees='[{"nom":"Pêche au pain / pâte flottante de surface","difficulte":4,"efficacite":3,"profondeur_optimale":"Surface à 1 m","animation":"Pain flottant, pâte très légère, sans plomb"}]'::jsonb,
  conditions_ideales='{"meteo":"Très chaud, calme","moment_jour":"Journée, grande chaleur","profondeur":"Surface à 1 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='L''amour argenté ne mange pas d''esches classiques : il filtre l''eau. Certains pêcheurs le capturent au pain flottant. Une prise reste un exploit rarissime en France.',
  statut_reglementaire='Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant dans le milieu naturel interdit.',
  difficulte=4, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='amour-argente';

UPDATE public.species SET
  slug='carpe-marbre', nom_fr='Carpe marbré', nom_scientifique='Hypophthalmichthys nobilis',
  famille='Cyprinidés (Xenocyprididae)', rarete='legendaire', eau='douce',
  taille_min_cm=70, taille_max_cm=150, taille_moyenne_cm=70,
  poids_max_kg=50, poids_moyen_kg=12, longevite_annees='20-25 ans', regime='omnivore',
  habitat=ARRAY['lac','etang'], profondeur='1-10 m', temperature_eau='15-30 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Plus grand des poissons du genre Hypophthalmichthys, la carpe marbré se reconnaît à sa robe grise marbrée et sa tête volumineuse. Présente très discrètement en France, sa capture y est un événement rare.',
  techniques=ARRAY['Pêche au pain / pâte de surface'],
  techniques_recommandees='[{"nom":"Pêche au pain / pâte de surface","difficulte":5,"efficacite":2,"profondeur_optimale":"Surface","animation":"Esches très légères flottantes"}]'::jsonb,
  conditions_ideales='{"meteo":"Très chaud, calme","moment_jour":"Journée, grande chaleur","profondeur":"Surface à 2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Sa robe marbrée unique est reconnaissable au premier regard. Captures extrêmement rares en France. Si tu en croises une, prends soin d''elle : c''est une prise d''exception.',
  statut_reglementaire='Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant dans le milieu naturel interdit. Présence très localisée en France.',
  difficulte=5, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='amour-marbre';

UPDATE public.species SET
  slug='perche-commune', nom_fr='Perche commune', nom_scientifique='Perca fluviatilis',
  famille='Percidés (Percidae)', rarete='commun', eau='douce',
  taille_min_cm=20, taille_max_cm=60, taille_moyenne_cm=20,
  poids_max_kg=4.8, poids_moyen_kg=0.3, longevite_annees='10-22 ans', regime='carnivore',
  habitat=ARRAY['etang','lac','riviere'], profondeur='1-6 m', temperature_eau='8-22 °C',
  saison=ARRAY['hiver','printemps','ete','automne'], saison_active='Toute l année',
  description='Petit prédateur omniprésent dans les eaux françaises, la perche se reconnaît à ses bandes verticales sombres et à ses nageoires rouge orangé. Vorace et grégaire jeune, elle devient plus solitaire en grandissant.',
  techniques=ARRAY['Pêche au leurre souple','Pêche au crank / lipless','Pêche au ver manié','Pêche au drop shot ultra-light'],
  techniques_recommandees='[{"nom":"Pêche au leurre souple","difficulte":2,"efficacite":5,"profondeur_optimale":"1-4 m","animation":"Petits shads, animation linéaire saccadée"},{"nom":"Pêche au crank / lipless","difficulte":2,"efficacite":4,"profondeur_optimale":"1-3 m","animation":"Récupération constante avec accélérations"},{"nom":"Pêche au ver manié","difficulte":1,"efficacite":5,"profondeur_optimale":"0.5-3 m","animation":"Ver vivant ou souple, animation rapide"},{"nom":"Pêche au drop shot ultra-light","difficulte":3,"efficacite":4,"profondeur_optimale":"2-5 m","animation":"Petits leurres, animation sur place"}]'::jsonb,
  conditions_ideales='{"meteo":"Beau temps modéré","moment_jour":"Toute la journée, pics matin/soir","profondeur":"2-4 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='La perche est un excellent poisson pour débuter le carnassier au leurre. Cherche les bancs en bordure des structures. Les grosses solitaires préfèrent les zones plus profondes.',
  statut_reglementaire='Pas de taille légale ni de période de fermeture nationale. Catégorie 1 ou 2 selon le cours d''eau.',
  difficulte=2, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='perche';

UPDATE public.species SET
  slug='black-bass-grande-bouche', nom_fr='Black-bass à grande bouche', nom_scientifique='Micropterus salmoides',
  famille='Centrarchidés (Centrarchidae)', rarete='rare', eau='douce',
  taille_min_cm=35, taille_max_cm=80, taille_moyenne_cm=35,
  poids_max_kg=10, poids_moyen_kg=1.5, longevite_annees='10-15 ans', regime='carnivore',
  habitat=ARRAY['lac','etang','riviere'], profondeur='0.5-5 m', temperature_eau='15-28 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Octobre',
  description='Originaire d''Amérique du Nord, le black-bass est un prédateur athlétique et combatif. Introduit en France au début du XXe siècle, il reste localisé dans certaines régions du sud et de l''ouest.',
  techniques=ARRAY['Pêche au leurre de surface (popper, walking)','Pêche au leurre souple texan','Pêche au jig / football'],
  techniques_recommandees='[{"nom":"Pêche au leurre de surface (popper, walking)","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface","animation":"Animations saccadées, pauses longues"},{"nom":"Pêche au leurre souple texan","difficulte":3,"efficacite":5,"profondeur_optimale":"0.5-3 m","animation":"Animation par à-coups près des structures"},{"nom":"Pêche au jig / football","difficulte":4,"efficacite":4,"profondeur_optimale":"2-5 m","animation":"Sauts contrôlés sur le fond"}]'::jsonb,
  conditions_ideales='{"meteo":"Chaud, stable, eau tiède","moment_jour":"Aube et crépuscule","profondeur":"1-3 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Le black-bass aime les couverts denses : nénuphars, arbres immergés, pontons. Une attaque en surface sur popper, c''est un souvenir qui ne s''oublie pas. Pratique le no-kill.',
  statut_reglementaire='Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant interdit. No-kill fortement recommandé.',
  difficulte=3, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='black-bass';

UPDATE public.species SET
  slug='lotte-de-riviere', nom_fr='Lotte de rivière', nom_scientifique='Lota lota',
  famille='Lotidés (Lotidae)', rarete='legendaire', eau='douce',
  taille_min_cm=40, taille_max_cm=100, taille_moyenne_cm=40,
  poids_max_kg=8, poids_moyen_kg=1, longevite_annees='10-20 ans', regime='carnivore',
  habitat=ARRAY['lac','riviere'], profondeur='5-50 m', temperature_eau='1-15 °C',
  saison=ARRAY['hiver','printemps'], saison_active='Hiver surtout (frai sous glace), activité nocturne',
  description='Seul gadidé exclusivement d''eau douce, la lotte est un poisson de l''ombre et du froid. Activité nocturne, reproduction sous la glace : c''est une espèce mystérieuse. Quasi disparue de France, elle subsiste dans quelques lacs alpins et le Doubs.',
  techniques=ARRAY[]::text[],
  techniques_recommandees='[]'::jsonb,
  conditions_ideales='{"meteo":"Froid, eau glaciale","moment_jour":"Nuit","profondeur":"10-30 m","vent":"Sans incidence"}'::jsonb,
  conseil_fishdex='La lotte est presque introuvable en France aujourd''hui. Si tu en croises une dans le Léman ou le Doubs, c''est un témoignage rare. Photo, relâche immédiate.',
  statut_reglementaire='Espèce vulnérable. Pêche très réglementée selon les eaux.',
  difficulte=NULL, taille_legale_cm=NULL, is_hidden_in_dex=false, updated_at=now()
WHERE slug='lotte';

UPDATE public.species SET
  slug='omble-de-fontaine', nom_fr='Omble de fontaine', nom_scientifique='Salvelinus fontinalis',
  famille='Salmonidés (Salmonidae)', rarete='rare', eau='douce',
  taille_min_cm=25, taille_max_cm=50, taille_moyenne_cm=25,
  poids_max_kg=3, poids_moyen_kg=0.4, longevite_annees='5-10 ans', regime='carnivore',
  habitat=ARRAY['ruisseau','lac'], profondeur='0.3-3 m', temperature_eau='4-15 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mai-Septembre',
  description='Originaire de l''est de l''Amérique du Nord, l''omble de fontaine a été introduit dans nos ruisseaux d''altitude. Sa robe est inoubliable : dos vermiculé de marbrures vertes, flancs constellés de points jaunes, rouges et bleus, ventre orangé.',
  techniques=ARRAY['Pêche à la mouche','Pêche au toc'],
  techniques_recommandees='[{"nom":"Pêche à la mouche","difficulte":3,"efficacite":5,"profondeur_optimale":"Surface à 1.5 m","animation":"Sèches, petites nymphes"},{"nom":"Pêche au toc","difficulte":2,"efficacite":4,"profondeur_optimale":"0.3-1.5 m","animation":"Vers, larves en dérive courte"}]'::jsonb,
  conditions_ideales='{"meteo":"Variable, eaux fraîches","moment_jour":"Matin et soir","profondeur":"0.5-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='Cherche l''omble de fontaine dans les ruisseaux d''altitude isolés. Sa robe est une œuvre. Photo, relâche, et garde le silence sur le spot — c''est la règle non écrite.',
  statut_reglementaire='Soumis aux ouvertures de 1ère catégorie. Taille légale : 23 cm généralement. Réglementation variable selon massif.',
  difficulte=3, taille_legale_cm=23, is_hidden_in_dex=false, updated_at=now()
WHERE slug='omble-fontaine';

UPDATE public.species SET
  slug='ombre-commun', nom_fr='Ombre commun', nom_scientifique='Thymallus thymallus',
  famille='Salmonidés (Salmonidae)', rarete='rare', eau='douce',
  taille_min_cm=35, taille_max_cm=60, taille_moyenne_cm=35,
  poids_max_kg=3, poids_moyen_kg=0.7, longevite_annees='10-14 ans', regime='carnivore',
  habitat=ARRAY['riviere'], profondeur='0.5-2.5 m', temperature_eau='8-18 °C',
  saison=ARRAY['hiver','printemps','ete','automne'], saison_active='Mai-Décembre (selon ouvertures locales)',
  description='Reconnaissable à sa grande nageoire dorsale colorée comme un voile et son odeur de thym à la sortie de l''eau, l''ombre commun vit dans des rivières d''une qualité d''eau remarquable. Sa pêche à la mouche est un art.',
  techniques=ARRAY['Pêche à la mouche sèche','Pêche à la nymphe au fil','Pêche à la mouche noyée'],
  techniques_recommandees='[{"nom":"Pêche à la mouche sèche","difficulte":4,"efficacite":5,"profondeur_optimale":"Surface","animation":"Petites mouches imitatives, dérive parfaite"},{"nom":"Pêche à la nymphe au fil","difficulte":5,"efficacite":5,"profondeur_optimale":"0.5-2 m","animation":"Nymphes lestées, détection visuelle au fil"},{"nom":"Pêche à la mouche noyée","difficulte":4,"efficacite":4,"profondeur_optimale":"0.5-1.5 m","animation":"Pêche en train de mouches, animation par le courant"}]'::jsonb,
  conditions_ideales='{"meteo":"Couvert, après pluie","moment_jour":"Journée entière","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  conseil_fishdex='L''ombre est un poisson de connaisseurs. Vue perçante, méfiance extrême, gobages discrets. Son odeur de thym à la sortie de l''eau est un mystère élégant. Pratique le no-kill.',
  statut_reglementaire='Ouverture variable selon départements, souvent plus tardive que la truite. Taille légale : 30-35 cm selon zones.',
  difficulte=4, taille_legale_cm=30, is_hidden_in_dex=false, updated_at=now()
WHERE slug='ombre';

UPDATE public.species SET
  slug='truite-lacustre', nom_fr='Truite lacustre', nom_scientifique='Salmo trutta lacustris',
  famille='Salmonidés (Salmonidae)', rarete='epique', eau='douce',
  taille_min_cm=50, taille_max_cm=120, taille_moyenne_cm=50,
  poids_max_kg=18, poids_moyen_kg=2.5, longevite_annees='10-20 ans', regime='carnivore',
  habitat=ARRAY['lac'], profondeur='5-50 m', temperature_eau='4-15 °C',
  saison=ARRAY['printemps','ete','automne'], saison_active='Mars-Octobre',
  description='Forme géante de la truite vivant en grands lacs alpins, la truite lacustre descend en profondeur en été et remonte les rivières affluentes pour se reproduire. Robe argentée, taches noires en X, taille impressionnante.',
  techniques=ARRAY['Pêche à la traîne','Pêche à la mouche en rivière (frai)'],
  techniques_recommandees='[{"nom":"Pêche à la traîne","difficulte":4,"efficacite":5,"profondeur_optimale":"5-30 m","animation":"Cuillers et poissons-nageurs, bateau"},{"nom":"Pêche à la mouche en rivière (frai)","difficulte":5,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Gros streamers, pêche en saison de remontée"}]'::jsonb,
  conditions_ideales='{"meteo":"Variable","moment_jour":"Aube et crépuscule","profondeur":"5-30 m","vent":"Faible à modéré"}'::jsonb,
  conseil_fishdex='La truite lacustre en grand lac alpin est une quête. Bateau, sondeur, connaissance fine. Quotas et périodes strictes : respecte-les sans concession.',
  statut_reglementaire='Pêche réglementée sur les grands lacs alpins. Taille légale : 40 à 50 cm selon le lac. Permis lac requis.',
  difficulte=4, taille_legale_cm=40, is_hidden_in_dex=false, updated_at=now()
WHERE slug='truite-lac';

-- ════════════════════════════════════
-- PARTIE 3 — INSERT nouvelles espèces (6)
-- ════════════════════════════════════

INSERT INTO public.species (slug, nom_fr, nom_scientifique, famille, rarete, eau,
  taille_min_cm, taille_max_cm, taille_moyenne_cm, poids_max_kg, poids_moyen_kg,
  longevite_annees, regime, habitat, profondeur, temperature_eau,
  saison, saison_active, description, techniques, techniques_recommandees,
  conditions_ideales, conseil_fishdex, statut_reglementaire,
  difficulte, taille_legale_cm, is_hidden_in_dex, categorie, numero_dex)
VALUES

('blageon','Blageon','Telestes souffia','Cyprinidés (Leuciscidae)','rare','douce',
  15,22,15, 0.2,0.08, '5-8 ans','omnivore',
  ARRAY['riviere','fleuve'], '0.5-2 m','10-20 °C',
  ARRAY['printemps','ete','automne'],'Avril-Octobre',
  'Cyprinidé méconnu mais magnifique, le blageon arbore une bande sombre marquée sur le flanc et des nageoires rougeâtres. Présent dans le bassin du Rhône, il fréquente les rivières propres. Espèce d''intérêt patrimonial européen.',
  ARRAY['Pêche au coup léger'],
  '[{"nom":"Pêche au coup léger","difficulte":3,"efficacite":3,"profondeur_optimale":"0.5-2 m","animation":"Asticot, esches fines en dérive"}]'::jsonb,
  '{"meteo":"Beau temps","moment_jour":"Journée","profondeur":"1 m","vent":"Faible"}'::jsonb,
  'Si tu en captures un, prends-en soin : c''est une espèce d''intérêt patrimonial européen. Photo rapide, relâche immédiate.',
  'Espèce d''intérêt communautaire (Directive Habitats Annexes II et IV). Répartition française restreinte au bassin du Rhône.',
  3, NULL, false, 'poisson', 97),

('apron-du-rhone','Apron du Rhône','Zingel asper','Percidés (Percidae)','legendaire','douce',
  17,22,17, 0.2,0.08, '3-5 ans','carnivore',
  ARRAY['riviere'], '0.5-2 m','8-18 °C',
  ARRAY['hiver','printemps','ete','automne'],'Toute l année (observation uniquement)',
  'Espèce endémique du bassin du Rhône, l''apron est l''un des poissons les plus menacés de France. En danger critique d''extinction, il a perdu 90% de son aire de répartition au XXe siècle. Petit percidé nocturne aux écailles rugueuses.',
  ARRAY[]::text[],
  '[]'::jsonb,
  '{"meteo":"Eaux claires et fraîches","moment_jour":"Nuit (espèce nocturne)","profondeur":"0.5-1.5 m","vent":"Sans incidence"}'::jsonb,
  'L''apron ne se pêche pas. C''est une espèce strictement protégée. Si tu en croises un, c''est un privilège : il en reste si peu. Signale ton observation au CEN Rhône-Alpes.',
  'Espèce strictement protégée. Arrêté du 8 décembre 1988. Directive Habitats Annexes II et IV. En danger critique d''extinction (UICN).',
  NULL, NULL, false, 'poisson', 98),

('pseudorasbora','Pseudorasbora','Pseudorasbora parva','Cyprinidés (Gobionidae)','commun','douce',
  8,12,8, 0.05,0.01, '3-5 ans','omnivore',
  ARRAY['etang','mare','canal'], '0.3-2 m','10-28 °C',
  ARRAY['printemps','ete','automne'],'Avril-Octobre',
  'Petit poisson originaire d''Asie orientale, introduit en France dans les années 80. Espèce invasive problématique : il consomme œufs et alevins d''autres poissons, propage des maladies, et concurrence les espèces locales.',
  ARRAY['Pêche au coup'],
  '[{"nom":"Pêche au coup","difficulte":1,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Asticot, esche petite"}]'::jsonb,
  '{"meteo":"Chaud, calme","moment_jour":"Journée","profondeur":"1 m","vent":"Faible"}'::jsonb,
  'Espèce invasive : ne la relâche jamais dans une autre eau. Si tu en captures dans un parcours où elle n''est pas encore présente, signale à la fédération.',
  'Espèce exotique envahissante. Transport et relâche dans le milieu naturel interdits.',
  1, NULL, false, 'poisson', 99),

('mulet-porc','Mulet porc','Chelon ramada','Mugilidés (Mugilidae)','peu commun','saumatre',
  30,70,30, 2.5,0.5, '10-15 ans','omnivore',
  ARRAY['estuaire','riviere'], '0.5-3 m','10-26 °C',
  ARRAY['printemps','ete','automne'],'Avril-Octobre',
  'Le mulet porc remonte les estuaires et fleuves français, parfois loin à l''intérieur des terres. Reconnaissable à sa silhouette fusiforme et sa tête massive, il broute le biofilm et filtre la vase.',
  ARRAY['Pêche à la pâte / pain','Pêche au coup à la mouche / asticot'],
  '[{"nom":"Pêche à la pâte / pain","difficulte":3,"efficacite":4,"profondeur_optimale":"0.5-2 m","animation":"Pâte parfumée, pain mou en surface"},{"nom":"Pêche au coup à la mouche / asticot","difficulte":3,"efficacite":3,"profondeur_optimale":"0.5-2 m","animation":"Esche très fine, amorçage léger"}]'::jsonb,
  '{"meteo":"Beau temps stable","moment_jour":"Marée montante","profondeur":"1-2 m","vent":"Faible"}'::jsonb,
  'Pêcher le mulet, c''est faire le pont entre rivière et mer. Cherche-le en estuaire au moment des marées montantes. Esches très fines, ferré immédiat : il rejette vite tout ce qui résiste.',
  'Taille légale : 20 cm en zone maritime et estuarienne. Pêche libre sur les cours d''eau où il remonte.',
  3, 20, false, 'poisson', 100),

('cristivomer','Cristivomer','Salvelinus namaycush','Salmonidés (Salmonidae)','legendaire','douce',
  60,100,60, 20,3, '20-30 ans','carnivore',
  ARRAY['lac'], '30-100 m','4-12 °C',
  ARRAY['printemps','ete','automne'],'Mai-Octobre',
  'Originaire des grands lacs nord-américains, le cristivomer (ou touladi) a été introduit dans le Léman au XIXe siècle. Son corps massif, sa robe sombre marbrée, et sa vie en profondeur en font un poisson presque mythique en France.',
  ARRAY['Pêche à la traîne profonde'],
  '[{"nom":"Pêche à la traîne profonde","difficulte":5,"efficacite":5,"profondeur_optimale":"30-80 m","animation":"Cuillers lourdes, downriggers, repérage sondeur"}]'::jsonb,
  '{"meteo":"Variable","moment_jour":"Journée selon profondeur","profondeur":"30-80 m","vent":"Faible à modéré"}'::jsonb,
  'Le cristivomer du Léman est l''un des poissons d''eau douce les plus difficiles à pêcher en France. Bateau, sondeur, downriggers. C''est une pêche de spécialistes.',
  'Pêche réglementée sur le Léman par commission franco-suisse. Périodes et quotas stricts. Se renseigner auprès de la Fédération de pêche de Haute-Savoie (74).',
  5, NULL, false, 'poisson', 101),

('lamproie-de-planer','Lamproie de Planer','Lampetra planeri','Pétromyzontidés (Petromyzontidae)','rare','douce',
  12,20,12, 0.05,0.015, '6-7 ans','omnivore',
  ARRAY['ruisseau','riviere'], '0.2-1.5 m','8-18 °C',
  ARRAY['printemps'],'Frai en avril-mai (adulte)',
  'Vertébré primitif sans mâchoire ni écailles, la lamproie de Planer est l''un des plus anciens groupes de vertébrés. Cycle de vie singulier : larves filtreuses enfouies 4-5 ans dans le sédiment, puis métamorphose et reproduction unique avant la mort.',
  ARRAY[]::text[],
  '[]'::jsonb,
  '{"meteo":"Variable","moment_jour":"Frai diurne au printemps","profondeur":"0.5-1 m","vent":"Sans incidence"}'::jsonb,
  'La lamproie de Planer ne se pêche pas. Si tu observes le frai au printemps dans un ruisseau, c''est un spectacle rare et précieux. Espèce d''intérêt européen.',
  'Espèce protégée. Directive Habitats Annexe II.',
  NULL, NULL, false, 'poisson', 102)

ON CONFLICT (slug) DO NOTHING;

-- ════════════════════════════════════
-- PARTIE 4 — Suppression espèces invalides
-- ════════════════════════════════════

DELETE FROM public.species WHERE slug = 'breme-bronze'
  AND NOT EXISTS (SELECT 1 FROM public.catches WHERE catches.species_id = species.id);

DELETE FROM public.species WHERE slug = 'gardon-rouge'
  AND NOT EXISTS (SELECT 1 FROM public.catches WHERE catches.species_id = species.id);

DELETE FROM public.species WHERE slug = 'silure-gold'
  AND NOT EXISTS (SELECT 1 FROM public.catches WHERE catches.species_id = species.id);

DELETE FROM public.species WHERE slug = 'silure-mandarin'
  AND NOT EXISTS (SELECT 1 FROM public.catches WHERE catches.species_id = species.id);

-- ════════════════════════════════════
-- PARTIE 5 — Liens collections
-- ════════════════════════════════════

-- Collection Paisibles
INSERT INTO public.species_collections (species_id, collection_id)
SELECT s.id, c.id FROM public.species s, public.collections c
WHERE c.slug = 'paisibles' AND s.slug IN (
  'ablette','breme-commune','breme-bordeliere','carassin-commun','carassin-dore',
  'chevesne','gardon','goujon','hotu','ide-melanote','rotengle','spirlin','vairon',
  'vandoise','blageon','apron-du-rhone','bouviere','tanche','pseudorasbora',
  'carpe-commune','amour-blanc','carpe-amour-argente','carpe-marbre'
)
ON CONFLICT DO NOTHING;

-- Collection Prédateurs
INSERT INTO public.species_collections (species_id, collection_id)
SELECT s.id, c.id FROM public.species s, public.collections c
WHERE c.slug = 'predateurs' AND s.slug IN (
  'brochet','sandre','perche-commune','perche-soleil','black-bass-grande-bouche',
  'silure-glane','aspe','anguille-europeenne','lotte-de-riviere','mulet-porc'
)
ON CONFLICT DO NOTHING;

-- Collection Eaux vives
INSERT INTO public.species_collections (species_id, collection_id)
SELECT s.id, c.id FROM public.species s, public.collections c
WHERE c.slug = 'eaux-vives' AND s.slug IN (
  'truite-fario','truite-arc-en-ciel','omble-chevalier','omble-de-fontaine',
  'cristivomer','ombre-commun','saumon-atlantique','truite-de-mer','truite-lacustre',
  'huchon','chabot','lamproie-de-planer'
)
ON CONFLICT DO NOTHING;

-- ════════════════════════════════════
-- PARTIE 6 — Variantes (species_variants)
-- ════════════════════════════════════

INSERT INTO public.species_variants (species_id, slug, nom_fr, description_courte, is_mirage, rarete_relative)
SELECT s.id, v.slug, v.nom_fr, v.desc, v.is_mirage, v.rarete
FROM public.species s
JOIN (VALUES
  ('carpe-commune','carpe-miroir','Carpe miroir','Écailles dispersées en plaques',false,'courante'),
  ('carpe-commune','carpe-cuir','Carpe cuir','Sans écailles, peau lisse',false,'peu fréquente'),
  ('carpe-commune','carpe-lineaire','Carpe linéaire','Une seule rangée d''écailles le long de la ligne latérale',false,'peu fréquente'),
  ('carpe-commune','carpe-fully-scaled','Carpe fully scaled','Entièrement couverte d''écailles régulières',false,'peu fréquente'),
  ('carpe-commune','carpe-koi-kohaku','Carpe koï Kohaku','Blanche avec taches rouges',false,'rare en milieu naturel'),
  ('carpe-commune','carpe-koi-sanke','Carpe koï Sanke','Tricolore blanc, rouge et noir',false,'rare en milieu naturel'),
  ('carpe-commune','carpe-koi-showa','Carpe koï Showa','Fond noir avec taches blanches et rouges',false,'rare en milieu naturel'),
  ('carpe-commune','carpe-koi-ogon','Carpe koï Ogon','Robe dorée uniforme',false,'rare en milieu naturel'),
  ('carpe-commune','carpe-koi-platinum','Carpe koï Platinum','Robe argentée brillante uniforme',false,'rare en milieu naturel'),
  ('carpe-commune','carpe-koi-asagi','Carpe koï Asagi','Bleu treillis dorsal, ventre orangé',false,'rare en milieu naturel'),
  ('carpe-commune','carpe-ghost','Carpe ghost','Hybride koï × carpe commune, robe métallique fantomatique',true,'exceptionnelle'),
  ('carpe-commune','carpe-ghost-miroir','Carpe ghost miroir','Ghost à écailles type miroir, robe métallique éclatante',true,'exceptionnelle'),
  ('carpe-commune','carpe-albinos','Carpe albinos','Anomalie génétique : absence totale de pigment',true,'exceptionnelle'),
  ('carassin-commun','carassin-albinos','Carassin albinos','Anomalie génétique sans pigment',true,'exceptionnelle'),
  ('tanche','tanche-doree','Tanche dorée','Variante orange-doré d''élevage, parfois en nature',false,'peu fréquente'),
  ('ide-melanote','ide-dore','Ide doré','Variante d''élevage à robe orange-rougeâtre',false,'peu fréquente'),
  ('brochet','brochet-melanique','Brochet mélanique','Anomalie génétique : robe quasi noire',true,'exceptionnelle'),
  ('brochet','brochet-albinos','Brochet albinos','Anomalie génétique : absence de pigment',true,'exceptionnelle'),
  ('silure-glane','silure-albinos','Silure albinos','Anomalie génétique : robe blanche-rosée',true,'exceptionnelle'),
  ('black-bass-grande-bouche','black-bass-petite-bouche','Black-bass à petite bouche','Espèce proche (Micropterus dolomieu), présence anecdotique en France',false,'rare en France'),
  ('black-bass-grande-bouche','black-bass-albinos','Black-bass albinos','Anomalie génétique exceptionnelle',true,'exceptionnelle'),
  ('truite-fario','truite-jaune','Truite jaune (variante)','Variante chromatique, fond jaune doré',false,'rare'),
  ('truite-fario','truite-albinos','Truite albinos','Anomalie génétique : pas de pigment',true,'exceptionnelle'),
  ('truite-fario','truite-tiger','Truite tigre (Tiger)','Hybride stérile fario × omble de fontaine, motif tigré marqué',true,'exceptionnelle'),
  ('ombre-commun','ombre-albinos','Ombre albinos','Anomalie génétique : absence de pigment',true,'exceptionnelle'),
  ('omble-de-fontaine','omble-fantome','Omble fantôme (Ghost)','Variante claire à robe presque blanche',true,'exceptionnelle'),
  ('saumon-atlantique','saumon-juvenile','Saumon juvénile (tacon)','Stade jeune en rivière, robe constellée typique',false,'fréquente (stade)'),
  ('saumon-atlantique','saumon-smolt','Saumon smolt','Stade descendant vers la mer, robe argentée',false,'fréquente (stade)'),
  ('saumon-atlantique','saumon-albinos','Saumon albinos','Anomalie génétique exceptionnelle',true,'exceptionnelle')
) AS v(species_slug, slug, nom_fr, desc, is_mirage, rarete) ON s.slug = v.species_slug
ON CONFLICT (slug) DO NOTHING;
