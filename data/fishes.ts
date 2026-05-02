// data/fishes.ts

// ============ TYPES ============

export type Eau = 'douce' | 'salee' | 'saumatre';
export type Regime = 'carnivore' | 'omnivore' | 'herbivore';
export type Profondeur = 'surface' | 'moyenne' | 'fond';
export type Rarete = 'commun' | 'peu_commun' | 'rare' | 'tres_rare';
export type RareteMutation = Rarete | 'legendaire';
export type Saison = 'printemps' | 'ete' | 'automne' | 'hiver';
export type Difficulte = 1 | 2 | 3 | 4 | 5;
export type TypeGenetique = 'albinos' | 'leucistique' | 'xanthique' | 'melanique' | 'autre';
export type Categorie = 'poisson' | 'crustace';

export type Mutation = {
  slug: string;
  nom_fr: string;
  description?: string;
  image_url?: string;
  type_genetique?: TypeGenetique;
  couleurs?: string[];
  rarete?: RareteMutation;
};

export type Variety = {
  slug: string;
  nom_fr: string;
  description?: string;
  image_url?: string;
  taille_max_cm?: number;
  poids_max_kg?: number;
  rarete?: Rarete;
  caracteristiques?: string[];
  mutations?: Mutation[];
};

export type Species = {
  slug: string;
  nom_fr: string;
  nom_scientifique: string;
  famille?: string;
  categorie?: Categorie;
  taille_min_cm?: number;
  taille_max_cm?: number;
  poids_max_kg?: number;
  description?: string;
  image_url?: string;
  eau: Eau;
  habitat?: string[];
  regime?: Regime;
  profondeur?: Profondeur;
  techniques?: string[];
  saison?: Saison[];
  difficulte?: Difficulte;
  taille_legale_cm?: number;
  rarete?: Rarete;
  varieties?: Variety[];
};

// ============ DONNÉES ============

export const SPECIES: Species[] = [
  // ==================== CARPES ====================
  {
    slug: 'carpe-commune',
    nom_fr: 'Carpe commune',
    nom_scientifique: 'Cyprinus carpio',
    famille: 'Cyprinidae',
    image_url: '/fishes/carpe-commune.png',
    taille_min_cm: 30, taille_max_cm: 120, poids_max_kg: 40,
    description: "Poisson d'eau douce robuste et puissant, star incontestée de la pêche au coup et du carpisme.",
    eau: 'douce', habitat: ['lac', 'etang', 'riviere'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['bouillette', 'mais', 'pellet', 'feeder', 'method'],
    saison: ['printemps', 'ete', 'automne'],
    difficulte: 3, rarete: 'commun',
    varieties: [
      { slug: 'miroir', nom_fr: 'Carpe miroir', image_url: '/varieties/carpe-miroir.png', description: 'Écaillure dispersée et irrégulière, grandes écailles éparses sur le corps.', caracteristiques: ['ecailles_dispersees', 'grandes_ecailles'], rarete: 'peu_commun' },
      { slug: 'cuir', nom_fr: 'Carpe cuir', image_url: '/varieties/carpe-cuir.png', description: 'Sans écailles, peau lisse comme du cuir.', caracteristiques: ['sans_ecailles'], rarete: 'rare' },
      { slug: 'lineaire', nom_fr: 'Carpe linéaire', image_url: '/varieties/carpe-lineaire.png', description: "Rangée d'écailles alignée le long de la ligne latérale.", caracteristiques: ['ecailles_en_ligne'], rarete: 'rare' },
      { slug: 'fully-scaled', nom_fr: 'Carpe fully scaled', image_url: '/varieties/carpe-fully-scaled.png', description: "Variante très écaillée, parfois confondue avec l'écailleuse mais aux écailles plus grandes et brillantes.", caracteristiques: ['ecailles_grandes_brillantes'], rarete: 'peu_commun' },
      {
        slug: 'ghost', nom_fr: 'Carpe ghost', image_url: '/varieties/carpe-ghost.png',
        description: 'Croisement entre carpe commune et koï, robe métallisée fantomatique.',
        caracteristiques: ['robe_metallisee', 'hybride_koi'], rarete: 'rare',
        mutations: [
          { slug: 'ghost-miroir', nom_fr: 'Ghost miroir', image_url: '/mutations/carpe-ghost-miroir.png', description: 'Carpe ghost avec écaillure de type miroir.', type_genetique: 'autre', couleurs: ['argent', 'noir'], rarete: 'tres_rare' },
        ],
      },
    ],
  },

  {
    slug: 'carpe-koi',
    nom_fr: 'Carpe koï',
    nom_scientifique: 'Cyprinus rubrofuscus',
    famille: 'Cyprinidae',
    image_url: '/fishes/carpe-koi.png',
    taille_min_cm: 25, taille_max_cm: 100, poids_max_kg: 20,
    description: 'Carpe ornementale japonaise aux couleurs vives, très prisée en bassin et parfois pêchée en eaux libres.',
    eau: 'douce', habitat: ['etang', 'lac', 'bassin'], regime: 'omnivore', profondeur: 'moyenne',
    techniques: ['bouillette', 'mais', 'pellet'],
    saison: ['printemps', 'ete', 'automne'],
    difficulte: 3, rarete: 'rare',
    varieties: [
      { slug: 'kohaku', nom_fr: 'Kohaku', image_url: '/varieties/carpe-koi-kohaku.png', description: 'Robe blanche avec motifs rouges (hi).', caracteristiques: ['blanc_rouge'], rarete: 'peu_commun' },
      { slug: 'sanke', nom_fr: 'Sanke', image_url: '/varieties/carpe-koi-sanke.png', description: 'Trois couleurs : blanc, rouge et noir (sumi).', caracteristiques: ['tricolore'], rarete: 'rare' },
      { slug: 'showa', nom_fr: 'Showa', image_url: '/varieties/carpe-koi-showa.png', description: 'Fond noir avec marques rouges et blanches.', caracteristiques: ['fond_noir'], rarete: 'rare' },
      { slug: 'ogon', nom_fr: 'Ogon (gold)', image_url: '/varieties/carpe-koi-ogon.png', description: 'Robe métallisée dorée unie, brillante.', caracteristiques: ['dore_metallise'], rarete: 'rare' },
      { slug: 'platinum', nom_fr: 'Platinum', image_url: '/varieties/carpe-koi-platinum.png', description: 'Robe métallisée blanc argenté pur.', caracteristiques: ['platine_metallise'], rarete: 'tres_rare' },
    ],
  },

  {
    slug: 'amour-blanc',
    nom_fr: 'Carpe amour blanc',
    nom_scientifique: 'Ctenopharyngodon idella',
    famille: 'Cyprinidae',
    image_url: '/fishes/amour-blanc.png',
    taille_min_cm: 40, taille_max_cm: 150, poids_max_kg: 45,
    description: 'Grand cyprinidé herbivore, introduit pour le contrôle de la végétation aquatique. Combat très puissant.',
    eau: 'douce', habitat: ['lac', 'etang', 'riviere'], regime: 'herbivore', profondeur: 'moyenne',
    techniques: ['bouillette_vegetale', 'herbe', 'mais', 'pain'],
    saison: ['ete', 'automne'],
    difficulte: 4, rarete: 'peu_commun',
    varieties: [
      {
        slug: 'amour-blanc-classique', nom_fr: 'Amour blanc classique',
        description: 'Forme standard à la robe gris-argenté.',
        caracteristiques: ['robe_argentee'], rarete: 'peu_commun',
        mutations: [
          { slug: 'albinos', nom_fr: 'Amour blanc albinos', image_url: '/mutations/carpe-amour-blanc-albinos.png', description: 'Mutation albinos rare, robe blanche aux yeux rouges.', type_genetique: 'albinos', couleurs: ['blanc', 'rose'], rarete: 'tres_rare' },
        ],
      },
    ],
  },

  {
    slug: 'amour-argente',
    nom_fr: 'Carpe amour argenté',
    nom_scientifique: 'Hypophthalmichthys molitrix',
    famille: 'Xenocyprididae',
    image_url: '/fishes/amour-argente.png',
    taille_min_cm: 50, taille_max_cm: 130, poids_max_kg: 50,
    description: "Filtreur planctonique, sauteur impressionnant lorsqu'effrayé. Difficile à pêcher car peu intéressé par les appâts classiques.",
    eau: 'douce', habitat: ['lac', 'riviere'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['amorce_fine', 'bombette'],
    saison: ['ete'],
    difficulte: 5, rarete: 'rare',
  },

  {
    slug: 'amour-marbre',
    nom_fr: 'Carpe amour marbré',
    nom_scientifique: 'Hypophthalmichthys nobilis',
    famille: 'Xenocyprididae',
    image_url: '/fishes/amour-marbre.png',
    taille_min_cm: 50, taille_max_cm: 140, poids_max_kg: 50,
    description: "Cousin de l'amour argenté, robe tachetée caractéristique. Filtreur également, rare en Europe.",
    eau: 'douce', habitat: ['lac', 'riviere'], regime: 'omnivore', profondeur: 'moyenne',
    techniques: ['amorce_fine'],
    saison: ['ete'],
    difficulte: 5, rarete: 'tres_rare',
  },

  // ==================== TANCHE ====================
  {
    slug: 'tanche',
    nom_fr: 'Tanche',
    nom_scientifique: 'Tinca tinca',
    famille: 'Tincidae',
    image_url: '/fishes/tanche.png',
    taille_min_cm: 20, taille_max_cm: 70, poids_max_kg: 7,
    description: 'Poisson trapu à la peau visqueuse, vit dans les eaux calmes et envasées. Surnommée "le médecin des poissons".',
    eau: 'douce', habitat: ['etang', 'lac', 'riviere_lente'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['ver', 'mais', 'asticot', 'pellet'],
    saison: ['printemps', 'ete', 'automne'],
    difficulte: 2, rarete: 'commun',
    varieties: [
      { slug: 'tanche-commune', nom_fr: 'Tanche commune', description: 'Forme sauvage, robe vert-bronze à reflets dorés.', caracteristiques: ['vert_bronze'], rarete: 'commun' },
      { slug: 'tanche-doree', nom_fr: 'Tanche dorée', image_url: '/varieties/tanche-doree.png', description: 'Variété ornementale à la robe dorée éclatante.', caracteristiques: ['robe_doree'], rarete: 'rare' },
    ],
  },

  // ==================== BREMES ====================
  {
    slug: 'breme-commune', nom_fr: 'Brême commune', nom_scientifique: 'Abramis brama', famille: 'Cyprinidae',
    image_url: '/fishes/breme-commune.png',
    taille_min_cm: 20, taille_max_cm: 80, poids_max_kg: 9,
    description: 'Poisson au corps haut et aplati latéralement, vit en bancs dans les eaux calmes.',
    eau: 'douce', habitat: ['lac', 'etang', 'riviere_lente'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['feeder', 'asticot', 'ver_de_terre', 'mais'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 2, rarete: 'commun',
  },
  {
    slug: 'breme-bronze', nom_fr: 'Brême bronze', nom_scientifique: 'Abramis brama (forme bronze)', famille: 'Cyprinidae',
    image_url: '/fishes/breme-bronze.png',
    taille_min_cm: 25, taille_max_cm: 70, poids_max_kg: 7,
    description: 'Forme adulte de la brême commune, reflets bronze marqués.',
    eau: 'douce', habitat: ['lac', 'riviere_lente'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['feeder', 'asticot', 'mais'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 2, rarete: 'peu_commun',
  },
  {
    slug: 'breme-bordeliere', nom_fr: 'Brême bordelière', nom_scientifique: 'Blicca bjoerkna', famille: 'Cyprinidae',
    image_url: '/fishes/breme-bordeliere.png',
    taille_min_cm: 15, taille_max_cm: 35, poids_max_kg: 1,
    description: 'Plus petite que la brême commune, nageoires aux reflets rougeâtres.',
    eau: 'douce', habitat: ['lac', 'etang', 'riviere_lente'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'pinkie', 'pain'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
  },

  // ==================== GARDON ====================
  {
    slug: 'gardon', nom_fr: 'Gardon', nom_scientifique: 'Rutilus rutilus', famille: 'Cyprinidae',
    image_url: '/fishes/gardon.png',
    taille_min_cm: 10, taille_max_cm: 45, poids_max_kg: 2,
    description: "Poisson le plus pêché en France, vit en bancs. Robe argentée aux nageoires rougeâtres.",
    eau: 'douce', habitat: ['riviere', 'lac', 'etang', 'canal'], regime: 'omnivore', profondeur: 'moyenne',
    techniques: ['asticot', 'pain', 'mais', 'chenevis'], saison: ['printemps', 'ete', 'automne', 'hiver'],
    difficulte: 1, rarete: 'commun',
    varieties: [
      { slug: 'gardon-commun', nom_fr: 'Gardon commun', description: 'Forme classique aux nageoires orangées.', rarete: 'commun' },
      { slug: 'gardon-rouge', nom_fr: 'Gardon rouge', image_url: '/varieties/gardon-rouge.png', description: "Nageoires d'un rouge particulièrement vif.", caracteristiques: ['nageoires_rouge_vif'], rarete: 'peu_commun' },
      { slug: 'gros-gardon', nom_fr: 'Gros gardon', image_url: '/varieties/gros-gardon.png', description: 'Spécimen de taille exceptionnelle, généralement au-delà de 35 cm.', taille_max_cm: 50, poids_max_kg: 2.5, rarete: 'rare' },
    ],
  },

  // ==================== ROTENGLE ====================
  {
    slug: 'rotengle', nom_fr: 'Rotengle', nom_scientifique: 'Scardinius erythrophthalmus', famille: 'Cyprinidae',
    image_url: '/fishes/rotengle.png',
    taille_min_cm: 10, taille_max_cm: 50, poids_max_kg: 2,
    description: 'Cousin du gardon, plus coloré, aux nageoires rouge vif et au dos plus haut.',
    eau: 'douce', habitat: ['lac', 'etang', 'riviere_lente'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['mouche_seche', 'asticot', 'pain', 'chenevis'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
    varieties: [
      { slug: 'rotengle-commun', nom_fr: 'Rotengle commun', description: 'Forme classique sauvage.', rarete: 'commun' },
      { slug: 'rotengle-gold', nom_fr: 'Rotengle gold', image_url: '/varieties/rotengle-gold.png', description: 'Variante à la robe dorée, très lumineuse.', caracteristiques: ['robe_doree'], rarete: 'rare' },
      { slug: 'gros-rotengle', nom_fr: 'Gros rotengle', image_url: '/varieties/gros-rotengle.png', description: 'Spécimen exceptionnel au-delà de 35 cm.', taille_max_cm: 50, poids_max_kg: 2, rarete: 'rare' },
    ],
  },

  // ==================== IDE ====================
  {
    slug: 'ide-melanote', nom_fr: 'Ide mélanote', nom_scientifique: 'Leuciscus idus', famille: 'Cyprinidae',
    image_url: '/fishes/ide-melanote.png',
    taille_min_cm: 25, taille_max_cm: 80, poids_max_kg: 8,
    description: "Cyprinidé puissant des grandes rivières, ressemble à un gros gardon allongé.",
    eau: 'douce', habitat: ['riviere', 'lac'], regime: 'omnivore', profondeur: 'moyenne',
    techniques: ['mouche', 'leurre_souple', 'ver', 'pain'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 3, rarete: 'peu_commun',
    varieties: [
      { slug: 'ide-melanote-classique', nom_fr: 'Ide mélanote classique', description: 'Forme sauvage, robe argentée au dos sombre.', rarete: 'peu_commun' },
      { slug: 'ide-dore', nom_fr: 'Ide doré', image_url: '/varieties/ide-dore.png', description: 'Variété ornementale à robe orangée/dorée éclatante.', caracteristiques: ['robe_doree_orangee'], rarete: 'rare' },
    ],
  },

  // ==================== CARASSIN ====================
  {
    slug: 'carassin', nom_fr: 'Carassin', nom_scientifique: 'Carassius carassius', famille: 'Cyprinidae',
    image_url: '/fishes/carassin.png',
    taille_min_cm: 15, taille_max_cm: 50, poids_max_kg: 3,
    description: 'Poisson trapu très résistant, capable de survivre dans des eaux pauvres en oxygène.',
    eau: 'douce', habitat: ['etang', 'mare', 'canal'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'mais', 'pellet', 'pain'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 2, rarete: 'commun',
    varieties: [
      { slug: 'carassin-commun', nom_fr: 'Carassin commun', description: 'Forme sauvage, robe bronze à dorée.', rarete: 'commun' },
      { slug: 'carassin-dore', nom_fr: 'Carassin doré', image_url: '/varieties/carassin-dore.png', description: "Variété ornementale orangée, ancêtre du poisson rouge.", caracteristiques: ['robe_orangee'], rarete: 'peu_commun' },
    ],
  },

  // ==================== AUTRES ====================
  {
    slug: 'goujon', nom_fr: 'Goujon', nom_scientifique: 'Gobio gobio', famille: 'Cyprinidae',
    image_url: '/fishes/goujon.png',
    taille_min_cm: 8, taille_max_cm: 20, poids_max_kg: 0.2,
    description: 'Petit poisson de fond grégaire, deux barbillons sur la lèvre supérieure. Apprécié comme vif.',
    eau: 'douce', habitat: ['riviere', 'ruisseau'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['asticot', 'ver_de_vase'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
  },
  {
    slug: 'vairon', nom_fr: 'Vairon', nom_scientifique: 'Phoxinus phoxinus', famille: 'Cyprinidae',
    image_url: '/fishes/vairon.png',
    taille_min_cm: 5, taille_max_cm: 14, poids_max_kg: 0.05,
    description: 'Petit poisson grégaire des eaux fraîches et oxygénées, motifs colorés en période de reproduction.',
    eau: 'douce', habitat: ['ruisseau', 'riviere_courante'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['asticot', 'mouche_naine'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
  },
  {
    slug: 'ablette', nom_fr: 'Ablette', nom_scientifique: 'Alburnus alburnus', famille: 'Cyprinidae',
    image_url: '/fishes/ablette.png',
    taille_min_cm: 10, taille_max_cm: 25, poids_max_kg: 0.1,
    description: 'Petit poisson argenté de surface, vit en bancs très actifs. Excellent vif.',
    eau: 'douce', habitat: ['riviere', 'lac', 'canal'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['asticot', 'pinkie', 'mouche'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
  },

  // ==================== PERCHE / SANDRE ====================
  {
    slug: 'perche', nom_fr: 'Perche commune', nom_scientifique: 'Perca fluviatilis', famille: 'Percidae',
    image_url: '/fishes/perche.png',
    taille_min_cm: 15, taille_max_cm: 60, poids_max_kg: 4.5,
    description: 'Prédateur élégant aux rayures verticales noires, vit en chasse organisée. Très combatif.',
    eau: 'douce', habitat: ['lac', 'etang', 'riviere'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['leurre_souple', 'cuiller_tournante', 'vif', 'ver'], saison: ['printemps', 'ete', 'automne', 'hiver'],
    difficulte: 2, rarete: 'commun',
  },
  {
    slug: 'perche-soleil', nom_fr: 'Perche soleil', nom_scientifique: 'Lepomis gibbosus', famille: 'Centrarchidae',
    image_url: '/fishes/perche-soleil.png',
    taille_min_cm: 8, taille_max_cm: 25, poids_max_kg: 0.4,
    description: "Petit poisson coloré introduit d'Amérique du Nord, considéré comme nuisible en France.",
    eau: 'douce', habitat: ['etang', 'lac', 'riviere_lente'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['ver', 'asticot', 'petit_leurre'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
  },
  {
    slug: 'sandre', nom_fr: 'Sandre', nom_scientifique: 'Sander lucioperca', famille: 'Percidae',
    image_url: '/fishes/sandre.png',
    taille_min_cm: 40, taille_max_cm: 130, poids_max_kg: 18,
    description: "Grand prédateur d'eau douce aux yeux opalescents, redoutable la nuit et dans les eaux profondes.",
    eau: 'douce', habitat: ['lac', 'riviere', 'fleuve'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['leurre_souple', 'verticale', 'vif', 'mort_manie'], saison: ['printemps', 'automne', 'hiver'],
    difficulte: 4, taille_legale_cm: 50, rarete: 'peu_commun',
  },

  // ==================== SILURES ====================
  {
    slug: 'silure-glane', nom_fr: 'Silure glane', nom_scientifique: 'Silurus glanis', famille: 'Siluridae',
    image_url: '/fishes/silure-glane.png',
    taille_min_cm: 60, taille_max_cm: 280, poids_max_kg: 130,
    description: "Plus grand poisson d'eau douce d'Europe, prédateur opportuniste. Combat épique.",
    eau: 'douce', habitat: ['fleuve', 'grand_lac', 'riviere'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['vif', 'pellet', 'clonk', 'leurre_lourd'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 5, rarete: 'peu_commun',
    varieties: [
      {
        slug: 'silure-glane-classique', nom_fr: 'Silure glane classique',
        description: 'Forme sauvage, robe sombre marbrée.', rarete: 'peu_commun',
        mutations: [
          { slug: 'albinos', nom_fr: 'Silure albinos', image_url: '/mutations/silure-albinos.png', description: 'Mutation rare, robe blanche/rose, yeux rouges.', type_genetique: 'albinos', couleurs: ['blanc', 'rose'], rarete: 'tres_rare' },
          { slug: 'gold', nom_fr: 'Silure gold', image_url: '/mutations/silure-gold.png', description: 'Mutation xanthique, robe dorée à orangée.', type_genetique: 'xanthique', couleurs: ['or', 'orange'], rarete: 'legendaire' },
        ],
      },
    ],
  },
  {
    slug: 'silure-mandarin', nom_fr: 'Silure mandarin', nom_scientifique: 'Leiocassis longirostris', famille: 'Bagridae',
    image_url: '/fishes/silure-mandarin.png',
    taille_min_cm: 30, taille_max_cm: 100, poids_max_kg: 15,
    description: 'Silure asiatique de taille moyenne, occasionnellement présent en eaux fermées.',
    eau: 'douce', habitat: ['lac', 'etang'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['ver', 'vif', 'pellet'], saison: ['ete', 'automne'],
    difficulte: 4, rarete: 'tres_rare',
  },

  // ==================== BROCHET ====================
  {
    slug: 'brochet', nom_fr: 'Brochet', nom_scientifique: 'Esox lucius', famille: 'Esocidae',
    image_url: '/fishes/brochet.png',
    taille_min_cm: 40, taille_max_cm: 140, poids_max_kg: 25,
    description: "Prédateur emblématique aux dents acérées, embuscade redoutable. Le rêve de tout pêcheur de carnassiers.",
    eau: 'douce', habitat: ['lac', 'etang', 'riviere'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['leurre_dur', 'leurre_souple', 'vif', 'mort_manie', 'cuiller'], saison: ['printemps', 'automne', 'hiver'],
    difficulte: 3, taille_legale_cm: 60, rarete: 'peu_commun',
  },

  // ==================== TRUITES ====================
  {
    slug: 'truite-fario', nom_fr: 'Truite fario', nom_scientifique: 'Salmo trutta', famille: 'Salmonidae',
    image_url: '/fishes/truite-fario.png',
    taille_min_cm: 18, taille_max_cm: 100, poids_max_kg: 15,
    description: 'Truite sauvage des rivières, robe tachetée de rouge et noir. Reine des eaux vives.',
    eau: 'douce', habitat: ['riviere_courante', 'ruisseau', 'lac_montagne'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['mouche', 'toc', 'leurre_souple', 'cuiller'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 4, taille_legale_cm: 23, rarete: 'peu_commun',
  },
  {
    slug: 'truite-arc-en-ciel', nom_fr: 'Truite arc-en-ciel', nom_scientifique: 'Oncorhynchus mykiss', famille: 'Salmonidae',
    image_url: '/fishes/truite-arc-en-ciel.png',
    taille_min_cm: 20, taille_max_cm: 100, poids_max_kg: 20,
    description: "Originaire d'Amérique du Nord, robe argentée traversée par une bande rose-violet caractéristique.",
    eau: 'douce', habitat: ['lac', 'riviere', 'pisciculture'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['mouche', 'leurre_souple', 'cuiller', 'pate_truite'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 3, taille_legale_cm: 23, rarete: 'commun',
    varieties: [
      {
        slug: 'arc-en-ciel-classique', nom_fr: 'Arc-en-ciel classique',
        description: 'Forme standard à la bande rose latérale.', rarete: 'commun',
        mutations: [
          { slug: 'truite-jaune', nom_fr: 'Truite jaune (gold)', image_url: '/mutations/truite-jaune.png', description: 'Mutation xanthique, robe entièrement dorée.', type_genetique: 'xanthique', couleurs: ['or', 'jaune'], rarete: 'rare' },
          { slug: 'truite-albinos', nom_fr: 'Truite albinos', image_url: '/mutations/truite-albinos.png', description: 'Mutation albinos, robe blanche/rose, yeux rouges.', type_genetique: 'albinos', couleurs: ['blanc', 'rose'], rarete: 'tres_rare' },
          { slug: 'truite-tiger', nom_fr: 'Truite tiger', image_url: '/mutations/truite-tiger.png', description: "Hybride entre truite arc-en-ciel et omble de fontaine, motifs vermiculés.", type_genetique: 'autre', couleurs: ['marron', 'orange'], rarete: 'legendaire' },
        ],
      },
    ],
  },

  // ==================== ANGUILLE ====================
  {
    slug: 'anguille-europeenne', nom_fr: 'Anguille européenne', nom_scientifique: 'Anguilla anguilla', famille: 'Anguillidae',
    image_url: '/fishes/anguille-europeenne.png',
    taille_min_cm: 30, taille_max_cm: 150, poids_max_kg: 6,
    description: "Poisson serpentiforme migrateur, retourne se reproduire dans la mer des Sargasses. Espèce en danger critique.",
    eau: 'douce', habitat: ['riviere', 'etang', 'estuaire'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['ver', 'vif', 'morceau_de_poisson'], saison: ['ete', 'automne'],
    difficulte: 3, rarete: 'rare',
  },

  // ==================== ESTURGEONS ====================
  {
    slug: 'esturgeon-siberien', nom_fr: 'Esturgeon sibérien', nom_scientifique: 'Acipenser baerii', famille: 'Acipenseridae',
    image_url: '/fishes/esturgeon-siberien.png',
    taille_min_cm: 50, taille_max_cm: 200, poids_max_kg: 100,
    description: "Poisson préhistorique au corps couvert de scutelles osseuses. Présent en eaux fermées ornementales.",
    eau: 'douce', habitat: ['lac', 'etang_specialise'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['pellet_esturgeon', 'ver', 'bouillette_specifique'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 4, rarete: 'rare',
    varieties: [
      {
        slug: 'siberien-classique', nom_fr: 'Sibérien classique',
        description: 'Forme standard, robe gris-brun.', rarete: 'rare',
        mutations: [
          { slug: 'albinos', nom_fr: 'Esturgeon albinos', image_url: '/mutations/esturgeon-albinos.png', description: 'Mutation albinos, robe blanche unique.', type_genetique: 'albinos', couleurs: ['blanc', 'rose'], rarete: 'tres_rare' },
          { slug: 'gold', nom_fr: 'Esturgeon gold', image_url: '/mutations/esturgeon-gold.png', description: 'Mutation xanthique, robe dorée.', type_genetique: 'xanthique', couleurs: ['or'], rarete: 'legendaire' },
        ],
      },
    ],
  },
  {
    slug: 'esturgeon-baeri', nom_fr: 'Esturgeon baeri', nom_scientifique: 'Acipenser baerii baerii', famille: 'Acipenseridae',
    image_url: '/fishes/esturgeon-baeri.png',
    taille_min_cm: 50, taille_max_cm: 200, poids_max_kg: 80,
    description: "Sous-espèce du sibérien, très répandu en élevage et en plans d'eau privés.",
    eau: 'douce', habitat: ['lac', 'etang_specialise'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['pellet_esturgeon', 'ver'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 4, rarete: 'rare',
  },
  {
    slug: 'esturgeon-diamant', nom_fr: 'Esturgeon diamant', nom_scientifique: 'Acipenser gueldenstaedtii', famille: 'Acipenseridae',
    image_url: '/fishes/esturgeon-diamant.png',
    taille_min_cm: 60, taille_max_cm: 230, poids_max_kg: 115,
    description: "Aussi appelé esturgeon russe, fournit le célèbre caviar Osciètre. Très prisé en pêche spécialisée.",
    eau: 'douce', habitat: ['lac', 'etang_specialise'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['pellet_esturgeon', 'ver', 'bouillette_specifique'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 5, rarete: 'tres_rare',
  },

  // ==================== GOBIE ====================
  {
    slug: 'gobie', nom_fr: 'Gobie', nom_scientifique: 'Neogobius melanostomus', famille: 'Gobiidae',
    image_url: '/fishes/gobie.png',
    taille_min_cm: 8, taille_max_cm: 25, poids_max_kg: 0.3,
    description: "Petit poisson de fond invasif, originaire de la mer Noire. Espèce considérée comme nuisible.",
    eau: 'douce', habitat: ['fleuve', 'canal', 'port'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['ver', 'asticot', 'micro_leurre'], saison: ['printemps', 'ete', 'automne'],
    difficulte: 1, rarete: 'commun',
  },
];