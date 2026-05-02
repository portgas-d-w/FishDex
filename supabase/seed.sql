-- ============================================================
-- FishDex — Seed : les 35 espèces de poissons
-- ============================================================

insert into public.species
  (common_name, scientific_name, photo_url, average_size_cm, max_size_cm,
   average_weight_g, max_weight_g, diet, reproduction_period,
   conservation_status, description)
values

-- ── CARNASSIERS ──────────────────────────────────────────────

(
  'Brochet', 'Esox lucius',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Esox_lucius_1.jpg/1280px-Esox_lucius_1.jpg',
  70, 130, 2000, 35000,
  'Carnivore (poissons, grenouilles, petits mammifères)',
  'Février à avril',
  'LC',
  'Le brochet est le grand prédateur des eaux douces françaises. Reconnaissable à son museau en forme de bec de canard, il est solitaire et embusqué dans les herbiers.'
),
(
  'Sandre', 'Sander lucioperca',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Sander_lucioperca_2008_G1.jpg/1280px-Sander_lucioperca_2008_G1.jpg',
  55, 100, 1500, 12000,
  'Carnivore (poissons, crevettes)',
  'Avril à juin',
  'LC',
  'Le sandre est un prédateur nocturne aux yeux caractéristiques adaptés à la pénombre. Très apprécié des pêcheurs aux leurres, il affectionne les eaux profondes et troubles.'
),
(
  'Perche commune', 'Perca fluviatilis',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Perca_fluviatilis_drawing.jpg/1280px-Perca_fluviatilis_drawing.jpg',
  25, 50, 300, 3000,
  'Carnivore (petits poissons, insectes, crustacés)',
  'Avril à mai',
  'LC',
  'La perche est facilement reconnaissable à ses rayures verticales sombres et ses nageoires orangées. Elle chasse en groupe et est idéale pour les débutants aux leurres souples.'
),
(
  'Black-bass à grande bouche', 'Micropterus salmoides',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Largemouth_bass_USFWS.jpg/1280px-Largemouth_bass_USFWS.jpg',
  35, 70, 800, 10000,
  'Carnivore (poissons, grenouilles, insectes)',
  'Mai à juillet',
  'LC',
  'Originaire d''Amérique du Nord, le black-bass est devenu un poisson de sport très prisé en France. Sa grande bouche lui permet d''engloutir des proies volumineuses.'
),
(
  'Black-bass à petite bouche', 'Micropterus dolomieu',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Micropterus_dolomieu_Rafinesque.jpg/1280px-Micropterus_dolomieu_Rafinesque.jpg',
  30, 55, 600, 5000,
  'Carnivore (écrevisses, insectes, petits poissons)',
  'Mai à juillet',
  'LC',
  'Plus rare que son cousin, le smallmouth bass préfère les eaux claires et courantes. Combattif et puissant pour sa taille, il est très apprécié des pêcheurs sportifs.'
),
(
  'Silure glane', 'Silurus glanis',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Silure_Glane.jpg/1280px-Silure_Glane.jpg',
  150, 300, 20000, 150000,
  'Carnivore opportuniste (poissons, oiseaux, rongeurs)',
  'Mai à juillet',
  'LC',
  'Le silure est le plus grand poisson d''eau douce d''Europe. Nocturne et discret, il peut vivre plus de 80 ans. Sa pêche nécessite un matériel robuste et une bonne connaissance du milieu.'
),
(
  'Truite fario', 'Salmo trutta fario',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Brown_trout_Salmo_trutta.jpg/1280px-Brown_trout_Salmo_trutta.jpg',
  30, 80, 400, 10000,
  'Carnivore (insectes, vers, petits poissons)',
  'Octobre à janvier',
  'LC',
  'La truite fario est la reine des eaux vives. Ses points rouges et noirs cerclés de blanc la rendent inconfondable. Très méfiante, sa pêche demande discrétion et technicité.'
),
(
  'Truite arc-en-ciel', 'Oncorhynchus mykiss',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Rainbow_Trout_FWS_1.jpg/1280px-Rainbow_Trout_FWS_1.jpg',
  35, 90, 600, 12000,
  'Carnivore (insectes, vers, crustacés, petits poissons)',
  'Janvier à avril',
  'LC',
  'Originaire d''Amérique du Nord, la truite arc-en-ciel est très répandue dans les plans d''eau français. Sa bande irisée sur le flanc la distingue facilement de la fario.'
),
(
  'Truite de mer', 'Salmo trutta trutta',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Salmo_trutta_Gervais.jpg/1280px-Salmo_trutta_Gervais.jpg',
  50, 100, 1500, 15000,
  'Carnivore (poissons, crustacés, insectes)',
  'Novembre à janvier',
  'LC',
  'La truite de mer est une forme migrante de la truite commune qui passe une partie de sa vie en mer. Elle remonte les rivières pour se reproduire, offrant une pêche exceptionnelle.'
),
(
  'Aspe', 'Aspius aspius',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Aspius_aspius_1.jpg/1280px-Aspius_aspius_1.jpg',
  50, 90, 1200, 12000,
  'Carnivore (poissons de surface)',
  'Mars à mai',
  'LC',
  'L''aspe est le seul grand cyprinidé exclusivement carnivore d''Europe. Chasseur de surface spectaculaire, il bondit hors de l''eau pour attraper ses proies.'
),

-- ── SALMONIDÉS / EAUX VIVES ──────────────────────────────────

(
  'Saumon atlantique', 'Salmo salar',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Atlantic_salmon_Salmo_salar.jpg/1280px-Atlantic_salmon_Salmo_salar.jpg',
  80, 150, 4000, 46000,
  'Carnivore (insectes en rivière, poissons en mer)',
  'Novembre à janvier',
  'LC',
  'Le saumon atlantique effectue un voyage épique depuis l''Atlantique nord jusqu''aux rivières de sa naissance pour se reproduire. Sa pêche est très réglementée en France.'
),
(
  'Omble chevalier', 'Salvelinus alpinus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Salvelinus_alpinus_fluviatilis.jpg/1280px-Salvelinus_alpinus_fluviatilis.jpg',
  35, 70, 500, 9000,
  'Carnivore (insectes, crustacés, petits poissons)',
  'Octobre à décembre',
  'LC',
  'L''omble chevalier est un salmonidé des eaux très froides et profondes des lacs alpins. Ses flancs tachetés de rouge et orange en font un des plus beaux poissons d''eau douce.'
),
(
  'Omble de fontaine', 'Salvelinus fontinalis',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/FONTINALIS.jpg/1280px-FONTINALIS.jpg',
  25, 65, 300, 6000,
  'Carnivore (insectes, vers, petits poissons)',
  'Octobre à décembre',
  'LC',
  'Originaire d''Amérique du Nord, l''omble de fontaine est acclimaté dans quelques rivières françaises. Ses magnifiques marbrures rouges et bleues en font un trophée prisé.'
),
(
  'Ombre commun', 'Thymallus thymallus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Thymallus_thymallus_(Marek_Szczepanek).jpg/1280px-Thymallus_thymallus_(Marek_Szczepanek).jpg',
  35, 60, 400, 6000,
  'Omnivore (insectes, larves, petits invertébrés)',
  'Mars à mai',
  'LC',
  'L''ombre commun se distingue par sa majestueuse nageoire dorsale violacée. Poisson emblématique de la pêche à la mouche, il fréquente les eaux fraîches et oxygénées.'
),

-- ── CYPRINIDÉS / POISSONS BLANCS ─────────────────────────────

(
  'Carpe commune', 'Cyprinus carpio',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cyprinus_carpio.jpg/1280px-Cyprinus_carpio.jpg',
  50, 100, 3000, 40000,
  'Omnivore (végétaux, vers, insectes, mollusques)',
  'Mai à juillet',
  'VU',
  'La carpe commune est le poisson emblématique de la carpe fishing. Véritable adversaire de taille, elle peut vivre plus de 50 ans et atteindre des poids records impressionnants.'
),
(
  'Carpe miroir', 'Cyprinus carpio var. specularis',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Karpfen_Cyprinus_carpio.jpg/1280px-Karpfen_Cyprinus_carpio.jpg',
  55, 110, 4000, 45000,
  'Omnivore (végétaux, vers, insectes, mollusques)',
  'Mai à juillet',
  'VU',
  'La carpe miroir se distingue par ses grandes écailles irrégulières disposées en rangées. Très recherchée par les carpistes, elle peut dépasser les 30 kg dans certains étangs français.'
),
(
  'Carpe cuir', 'Cyprinus carpio var. nudus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cyprinus_carpio.jpg/1280px-Cyprinus_carpio.jpg',
  55, 105, 3500, 42000,
  'Omnivore (végétaux, vers, insectes, mollusques)',
  'Mai à juillet',
  'VU',
  'La carpe cuir est une variante quasi sans écailles, à la peau lisse et épaisse. Très rare, c''est un trophée exceptionnel pour tout carpiste.'
),
(
  'Tanche', 'Tinca tinca',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Tench_uk.jpg/1280px-Tench_uk.jpg',
  30, 70, 500, 7000,
  'Omnivore (vers, larves, végétaux, mollusques)',
  'Juin à juillet',
  'LC',
  'La tanche est reconnaissable à sa couleur vert olive dorée et ses petites écailles recouvertes de mucus. Elle affectionne les étangs envasés et les eaux lentes riches en végétation.'
),
(
  'Gardon', 'Rutilus rutilus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Rutilus_rutilus_Prague_Vltava_1.jpg/1280px-Rutilus_rutilus_Prague_Vltava_1.jpg',
  20, 45, 100, 1800,
  'Omnivore (algues, insectes, vers, petits crustacés)',
  'Avril à mai',
  'LC',
  'Le gardon est le poisson blanc le plus répandu en France. Ses yeux et nageoires rouges le rendent facilement identifiable. Idéal pour débuter la pêche au coup.'
),
(
  'Rotengle', 'Scardinius erythrophthalmus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Scardinius_erythrophthalmus_Prague_Vltava.jpg/1280px-Scardinius_erythrophthalmus_Prague_Vltava.jpg',
  20, 40, 150, 2000,
  'Omnivore (végétaux aquatiques, insectes de surface)',
  'Mai à juin',
  'LC',
  'Souvent confondu avec le gardon, le rotengle se distingue par sa bouche tournée vers le haut et ses nageoires rouge vif. Il chasse surtout en surface dans les herbiers.'
),
(
  'Brème commune', 'Abramis brama',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Abramis_brama_Prague_Vltava_3.jpg/1280px-Abramis_brama_Prague_Vltava_3.jpg',
  35, 75, 700, 9000,
  'Omnivore (vers, larves, mollusques, végétaux)',
  'Mai à juin',
  'LC',
  'La brème commune est un poisson plat au corps argenté caractéristique. Elle fouille les fonds vaseux en groupe et se pêche surtout au coup ou au feeder.'
),
(
  'Brème bordelière', 'Blicca bjoerkna',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Blicca_bjoerkna_Prague_Vltava.jpg/1280px-Blicca_bjoerkna_Prague_Vltava.jpg',
  20, 35, 200, 1500,
  'Omnivore (larves, vers, végétaux)',
  'Mai à juin',
  'LC',
  'La brème bordelière ressemble à la brème commune en plus petit. Elle se distingue par la base rougeâtre de ses nageoires pectorales et ventrales.'
),
(
  'Ablette', 'Alburnus alburnus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Alburnus_alburnus_Prague_Vltava.jpg/1280px-Alburnus_alburnus_Prague_Vltava.jpg',
  12, 20, 20, 100,
  'Omnivore (insectes de surface, plancton, algues)',
  'Mai à juillet',
  'LC',
  'L''ablette est un petit poisson argenté qui vit en bancs à la surface de l''eau. Elle sert souvent d''appât vivant et est très active par temps chaud.'
),
(
  'Chevesne', 'Squalius cephalus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Leuciscus_cephalus_Prague_Vltava.jpg/1280px-Leuciscus_cephalus_Prague_Vltava.jpg',
  30, 60, 400, 8000,
  'Omnivore opportuniste (insectes, fruits, écrevisses, petits poissons)',
  'Mai à juin',
  'LC',
  'Le chevesne est un poisson curieux et opportuniste qui mange de tout. Très combatif à la pêche, il s''attrape aux leurres de surface, à la mouche sèche ou aux appâts naturels.'
),
(
  'Vandoise', 'Leuciscus leuciscus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Leuciscus_leuciscus_Prague_Vltava.jpg/1280px-Leuciscus_leuciscus_Prague_Vltava.jpg',
  20, 35, 150, 500,
  'Omnivore (insectes, larves, algues)',
  'Mars à avril',
  'LC',
  'La vandoise fréquente les rivières claires et rapides. Proche du chevesne mais plus petite et plus élancée, elle vit en bancs dans les zones courantes oxygénées.'
),
(
  'Hotu', 'Chondrostoma nasus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Chondrostoma_nasus.jpg/1280px-Chondrostoma_nasus.jpg',
  30, 50, 300, 2000,
  'Herbivore (algues, diatomées, biofilm)',
  'Mars à avril',
  'LC',
  'Le hotu est un cyprinidé herbivore aux lèvres tranchantes adaptées pour gratter les algues sur les pierres. Il vit en bancs dans les rivières à fond de gravier.'
),

-- ── CARPES SPÉCIALES ─────────────────────────────────────────

(
  'Carpe Koï', 'Cyprinus rubrofuscus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Koi_fish.jpg/1280px-Koi_fish.jpg',
  60, 90, 3000, 15000,
  'Omnivore (végétaux, vers, granulés)',
  'Mai à juillet',
  'NT',
  'La carpe koï est une variété ornementale aux couleurs spectaculaires. Bien qu''élevée initialement pour les bassins japonais, on la trouve parfois dans les étangs de pêche français.'
),
(
  'Carassin commun', 'Carassius carassius',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Carassius_carassius_Prague_Vltava.jpg/1280px-Carassius_carassius_Prague_Vltava.jpg',
  20, 45, 300, 3000,
  'Omnivore (végétaux, vers, insectes)',
  'Mai à juin',
  'LC',
  'Le carassin commun résiste à des conditions extrêmes (eaux peu oxygénées, gel). Plus trapu que le gardon, il fréquente les étangs vaseux et les fossés.'
),
(
  'Carassin doré', 'Carassius auratus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Goldfish_in_the_pond.jpg/1280px-Goldfish_in_the_pond.jpg',
  20, 40, 200, 2000,
  'Omnivore (granulés, insectes, algues)',
  'Avril à juin',
  'LC',
  'Ancêtre du poisson rouge, le carassin doré s''est naturalisé dans de nombreux étangs français après des lâchers accidentels. Sa couleur orangée le rend facilement identifiable.'
),

-- ── PETITS POISSONS ──────────────────────────────────────────

(
  'Goujon', 'Gobio gobio',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Gobio_gobio_Prague_Vltava.jpg/1280px-Gobio_gobio_Prague_Vltava.jpg',
  12, 20, 30, 150,
  'Omnivore (larves, vers, petits crustacés)',
  'Avril à juin',
  'LC',
  'Le goujon est un petit poisson de fond aux barbillons caractéristiques. Il vit en bancs dans les rivières à fond sableux ou graveleux et se pêche facilement à la ligne.'
),
(
  'Vairon', 'Phoxinus phoxinus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Phoxinus_phoxinus_Prague_Vltava.jpg/1280px-Phoxinus_phoxinus_Prague_Vltava.jpg',
  7, 12, 5, 30,
  'Omnivore (insectes, algues, petits crustacés)',
  'Avril à juin',
  'LC',
  'Le vairon est l''un des plus petits poissons des rivières françaises. Très coloré en période de reproduction, il vit en bancs denses dans les eaux claires et rapides.'
),
(
  'Perche-soleil', 'Lepomis gibbosus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lepomis_gibbosus_Prague_Vltava.jpg/1280px-Lepomis_gibbosus_Prague_Vltava.jpg',
  12, 20, 50, 300,
  'Carnivore (insectes, larves, petits poissons)',
  'Mai à juillet',
  'LC',
  'La perche-soleil est un poisson originaire d''Amérique du Nord aux couleurs extraordinaires — orange, bleu et vert. Espèce invasive en France, elle colonise les étangs et rivières lentes.'
),
(
  'Poisson-chat', 'Ameiurus melas',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Ameiurus_melas_Prague_Vltava.jpg/1280px-Ameiurus_melas_Prague_Vltava.jpg',
  20, 40, 200, 2000,
  'Omnivore (vers, insectes, matière organique)',
  'Juin à juillet',
  'LC',
  'Le poisson-chat américain, reconnaissable à ses barbillons et sa peau sans écailles, est une espèce invasive très répandue en France. Nocturne, il vit dans les fonds vaseux.'
),
(
  'Bouvière', 'Rhodeus amarus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Rhodeus_amarus_Prague_Vltava.jpg/1280px-Rhodeus_amarus_Prague_Vltava.jpg',
  5, 9, 5, 20,
  'Omnivore (algues, petits invertébrés)',
  'Avril à juin',
  'LC',
  'La bouvière est un minuscule cyprinidé à la biologie fascinante : la femelle pond ses œufs dans les moules d''eau douce grâce à un tube pondeur. Les mâles arborent des couleurs irisées en période nuptiale.'
),

-- ── DIVERS ───────────────────────────────────────────────────

(
  'Anguille européenne', 'Anguilla anguilla',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Anguilla_anguilla.jpg/1280px-Anguilla_anguilla.jpg',
  60, 150, 500, 6000,
  'Carnivore (vers, mollusques, crustacés, poissons)',
  'Migration en mer des Sargasses (automne)',
  'CR',
  'L''anguille effectue l''une des plus longues migrations animales : elle naît en mer des Sargasses et grandit dans nos rivières pendant 10 à 20 ans avant de repartir. Espèce en danger critique d''extinction.'
);
