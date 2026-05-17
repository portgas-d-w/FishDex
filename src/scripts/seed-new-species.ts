/**
 * seed-new-species.ts
 * Ajoute ~50 nouvelles espèces à la BDD FishDex et les assigne aux collections.
 * Idempotent : vérifie l'existence par slug avant INSERT.
 *
 * Usage : npx tsx src/scripts/seed-new-species.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type NewSpecies = {
  slug: string
  nom_fr: string
  nom_scientifique: string
  famille: string
  numero_dex: number
  eau: 'douce' | 'salee' | 'saumatre'
  rarete: 'commun' | 'rare' | 'epique' | 'legendaire' | 'mirage'
  taille_min_cm?: number
  taille_max_cm?: number
  poids_max_kg?: number
  description?: string
  habitat?: string[]
  regime?: 'carnivore' | 'omnivore' | 'herbivore'
  profondeur?: 'surface' | 'moyenne' | 'fond'
  techniques?: string[]
  saison?: string[]
  difficulte?: number
  taille_legale_cm?: number
  is_hidden_in_dex?: boolean
  collections: string[]  // slugs des collections
}

// ══════════════════════════════════════════════════════
// NOUVELLES ESPÈCES (~50)
// ══════════════════════════════════════════════════════
const NEW_SPECIES: NewSpecies[] = [

  // ══════════════
  // 🐟 PAISIBLES — Nouveaux Communs
  // ══════════════
  {
    slug: 'nase', numero_dex: 58,
    nom_fr: 'Nase commun', nom_scientifique: 'Chondrostoma nasus', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'commun', difficulte: 2,
    taille_min_cm: 20, taille_max_cm: 45, poids_max_kg: 1.5,
    description: "Cyprinidé gratteur de fond, reconnaissable à sa bouche en forme de faucille. Vit en bancs dans les rivières courantes à fond graveleux.",
    habitat: ['riviere', 'torrent'], regime: 'herbivore', profondeur: 'fond',
    techniques: ['asticot', 'vers', 'pain'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['paisibles'],
  },
  {
    slug: 'spirlin', numero_dex: 59,
    nom_fr: 'Spirlin', nom_scientifique: 'Alburnoides bipunctatus', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'commun', difficulte: 1,
    taille_min_cm: 8, taille_max_cm: 15, poids_max_kg: 0.05,
    description: "Petit cyprinidé vif à deux lignes latérales bien marquées. Indicateur de bonne qualité d'eau.",
    habitat: ['riviere', 'torrent'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['asticot', 'mouche'],
    saison: ['printemps', 'ete'],
    collections: ['paisibles', 'eaux-vives'],
  },
  {
    slug: 'bouviere', numero_dex: 60,
    nom_fr: 'Bouvière', nom_scientifique: 'Rhodeus amarus', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'commun', difficulte: 1,
    taille_min_cm: 5, taille_max_cm: 9, poids_max_kg: 0.02,
    description: "Minuscule cyprinidé aux reflets irisés. Parasite fascinant des moules d'eau douce pour pondre ses œufs.",
    habitat: ['lac', 'etang', 'canal'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['asticot', 'pinkie'],
    saison: ['printemps', 'ete'],
    collections: ['paisibles'],
  },
  {
    slug: 'poisson-chat', numero_dex: 61,
    nom_fr: 'Poisson-chat', nom_scientifique: 'Ameiurus melas', famille: 'Ictaluridae',
    eau: 'douce', rarete: 'commun', difficulte: 1,
    taille_min_cm: 10, taille_max_cm: 35, poids_max_kg: 0.8,
    description: "Espèce introduite d'Amérique du Nord, reconnaissable à ses 8 barbillons. Espèce invasive tolérante à la pollution.",
    habitat: ['etang', 'canal', 'lac'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['vers', 'asticot', 'pellet'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['paisibles'],
  },
  {
    slug: 'vandoise', numero_dex: 62,
    nom_fr: 'Vandoise', nom_scientifique: 'Leuciscus leuciscus', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'commun', difficulte: 2,
    taille_min_cm: 15, taille_max_cm: 30, poids_max_kg: 0.3,
    description: "Cyprinidé argenté élancé des eaux courantes. Vif et méfiant, il chasse les insectes en surface.",
    habitat: ['riviere', 'torrent'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['mouche', 'asticot', 'cuiller'],
    saison: ['printemps', 'ete'],
    collections: ['paisibles', 'eaux-vives'],
  },
  {
    slug: 'loche-franche', numero_dex: 63,
    nom_fr: 'Loche franche', nom_scientifique: 'Barbatula barbatula', famille: 'Nemacheilidae',
    eau: 'douce', rarete: 'commun', difficulte: 2,
    taille_min_cm: 8, taille_max_cm: 18, poids_max_kg: 0.08,
    description: "Petit poisson benthique à l'aspect serpentiforme, avec 6 barbillons. Indicateur de bonne qualité d'eau.",
    habitat: ['riviere', 'torrent'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'vers'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'chabot', numero_dex: 64,
    nom_fr: 'Chabot commun', nom_scientifique: 'Cottus gobio', famille: 'Cottidae',
    eau: 'douce', rarete: 'commun', difficulte: 3,
    taille_min_cm: 6, taille_max_cm: 15, poids_max_kg: 0.05,
    description: "Petit poisson cryptique aux grandes nageoires pectorales. Caché sous les pierres dans les eaux froides et oxygénées.",
    habitat: ['torrent', 'riviere'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['asticot', 'vers'],
    saison: ['printemps', 'automne', 'hiver'],
    collections: ['eaux-vives'],
  },

  // ══════════════
  // Nouveaux Rares
  // ══════════════
  {
    slug: 'carpe-herbivore', numero_dex: 65,
    nom_fr: 'Carpe herbivore', nom_scientifique: 'Ctenopharyngodon idella', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'rare', difficulte: 3,
    taille_min_cm: 30, taille_max_cm: 120, poids_max_kg: 40,
    description: "Géant des eaux douces, introduite comme herbicide biologique. Sa bouche sans barbillons la distingue de la carpe commune.",
    habitat: ['etang', 'lac', 'fleuve'], regime: 'herbivore', profondeur: 'moyenne',
    techniques: ['maïs', 'pellet', 'aliment-vegetal'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['paisibles'],
  },
  {
    slug: 'carassin-argente', numero_dex: 66,
    nom_fr: 'Carassin argenté', nom_scientifique: 'Carassius gibelio', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'rare', difficulte: 2,
    taille_min_cm: 15, taille_max_cm: 45, poids_max_kg: 1.5,
    description: "Cousin envahissant du carassin, à la livrée argentée. Espèce très résistante, capable de reproduction parthénogénétique.",
    habitat: ['etang', 'lac', 'canal'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'maïs', 'pellet'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['paisibles'],
  },
  {
    slug: 'hotu', numero_dex: 67,
    nom_fr: 'Hotu', nom_scientifique: 'Chondrostoma nasus', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'rare', difficulte: 3,
    taille_min_cm: 25, taille_max_cm: 60, poids_max_kg: 3,
    description: "Grand cyprinidé gratteur peu connu, cousin du nase. Bouche caractéristique en biseau pour racler les algues sur les pierres.",
    habitat: ['riviere', 'fleuve'], regime: 'herbivore', profondeur: 'fond',
    techniques: ['asticot', 'vers', 'pain'],
    saison: ['printemps', 'ete'],
    collections: ['paisibles', 'eaux-vives'],
  },
  {
    slug: 'toxostome', numero_dex: 68,
    nom_fr: 'Toxostome', nom_scientifique: 'Parachondrostoma toxostoma', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'rare', difficulte: 4,
    taille_min_cm: 15, taille_max_cm: 35, poids_max_kg: 0.5,
    description: "Espèce endémique des rivières du sud de la France, en déclin. Reconnaissable à sa bouche arquée en forme de 'toxo'.",
    habitat: ['riviere'], regime: 'herbivore', profondeur: 'fond',
    techniques: ['asticot'],
    saison: ['printemps', 'ete'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'soufie', numero_dex: 69,
    nom_fr: 'Soufie', nom_scientifique: 'Leuciscus souffia', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'rare', difficulte: 3,
    taille_min_cm: 10, taille_max_cm: 22, poids_max_kg: 0.15,
    description: "Petit cyprinidé des torrents alpins, aux flancs argentés et dorés. Indicateur de la pureté des eaux de montagne.",
    habitat: ['torrent', 'riviere'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'mouche'],
    saison: ['printemps', 'ete'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'black-bass-petite-bouche', numero_dex: 70,
    nom_fr: 'Black-bass à petite bouche', nom_scientifique: 'Micropterus dolomieu', famille: 'Centrarchidae',
    eau: 'douce', rarete: 'rare', difficulte: 3,
    taille_min_cm: 20, taille_max_cm: 50, poids_max_kg: 2.5,
    description: "Cousin du black-bass, préférant les eaux claires et courantes. Combattant acharné, très apprécié en pêche sportive.",
    habitat: ['riviere', 'lac'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['leurre', 'streamer', 'jig'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['predateurs'],
  },
  {
    slug: 'omble-fontaine', numero_dex: 71,
    nom_fr: 'Omble de fontaine', nom_scientifique: 'Salvelinus fontinalis', famille: 'Salmonidae',
    eau: 'douce', rarete: 'rare', difficulte: 3, taille_legale_cm: 23,
    taille_min_cm: 15, taille_max_cm: 65, poids_max_kg: 3,
    description: "Salmonidé nord-américain introduit en Europe, aux taches rouges cerclées de bleu caractéristiques. Prospère dans les eaux froides.",
    habitat: ['torrent', 'lac-altitude'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['mouche', 'cuiller', 'vermi'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'lavaret', numero_dex: 72,
    nom_fr: 'Lavaret', nom_scientifique: 'Coregonus lavaretus', famille: 'Salmonidae',
    eau: 'douce', rarete: 'rare', difficulte: 4,
    taille_min_cm: 25, taille_max_cm: 60, poids_max_kg: 2.5,
    description: "Corégone des grands lacs alpins, fin et argenté. Pêché traditionnellement au filet, rare à la ligne.",
    habitat: ['lac', 'lac-altitude'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'vers', 'mouche'],
    saison: ['automne', 'hiver', 'printemps'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'grande-alose', numero_dex: 73,
    nom_fr: 'Grande alose', nom_scientifique: 'Alosa alosa', famille: 'Clupeidae',
    eau: 'douce', rarete: 'rare', difficulte: 4, taille_legale_cm: 30,
    taille_min_cm: 30, taille_max_cm: 75, poids_max_kg: 3,
    description: "Migrateur anadrôme spectaculaire remontant les grands fleuves pour frayer. Pêche en période de migration au primtemps.",
    habitat: ['fleuve', 'estuaire'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['cuiller', 'devon', 'mouche'],
    saison: ['printemps'],
    collections: ['predateurs'],
  },
  {
    slug: 'alose-feinte', numero_dex: 74,
    nom_fr: 'Alose feinte', nom_scientifique: 'Alosa fallax', famille: 'Clupeidae',
    eau: 'douce', rarete: 'rare', difficulte: 4,
    taille_min_cm: 20, taille_max_cm: 55, poids_max_kg: 1.5,
    description: "Plus petite que la grande alose, elle remonte également les fleuves côtiers. Protégée dans de nombreux pays.",
    habitat: ['fleuve', 'estuaire'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['cuiller', 'devon'],
    saison: ['printemps'],
    collections: ['predateurs'],
  },

  // ══════════════
  // Nouveaux Épiques
  // ══════════════
  {
    slug: 'saumon-atlantique', numero_dex: 75,
    nom_fr: 'Saumon atlantique', nom_scientifique: 'Salmo salar', famille: 'Salmonidae',
    eau: 'douce', rarete: 'epique', difficulte: 5, taille_legale_cm: 50,
    taille_min_cm: 40, taille_max_cm: 150, poids_max_kg: 45,
    description: "Le roi des rivières. Migrateur légendaire remontant les torrents pour frayer. Sa capture reste l'un des moments les plus mémorables de la pêche.",
    habitat: ['fleuve', 'riviere', 'torrent'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['mouche', 'devon', 'cuiller'],
    saison: ['printemps', 'automne'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'truite-de-mer', numero_dex: 76,
    nom_fr: 'Truite de mer', nom_scientifique: 'Salmo trutta trutta', famille: 'Salmonidae',
    eau: 'douce', rarete: 'epique', difficulte: 5, taille_legale_cm: 50,
    taille_min_cm: 35, taille_max_cm: 110, poids_max_kg: 15,
    description: "Forme migratrice de la truite fario, argentée et puissante. Remonte en automne pour frayer dans les rivières de son enfance.",
    habitat: ['fleuve', 'riviere'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['mouche', 'cuiller', 'devon'],
    saison: ['automne', 'hiver'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'truite-lac', numero_dex: 77,
    nom_fr: 'Truite de lac', nom_scientifique: 'Salmo trutta lacustris', famille: 'Salmonidae',
    eau: 'douce', rarete: 'epique', difficulte: 4, taille_legale_cm: 35,
    taille_min_cm: 30, taille_max_cm: 90, poids_max_kg: 10,
    description: "Forme lacustre de la truite brune, vivant en profondeur dans les grands lacs. Pêche en dérivante en hiver.",
    habitat: ['lac', 'lac-altitude'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['cuiller', 'leurre', 'vif'],
    saison: ['automne', 'hiver', 'printemps'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'huchon', numero_dex: 78,
    nom_fr: 'Huchon du Danube', nom_scientifique: 'Hucho hucho', famille: 'Salmonidae',
    eau: 'douce', rarete: 'epique', difficulte: 5,
    taille_min_cm: 50, taille_max_cm: 150, poids_max_kg: 55,
    description: "Le géant des Salmonidés européens. Prédateur apex des grandes rivières alpines, il peut dépasser 1 mètre. Espèce protégée très rare.",
    habitat: ['fleuve', 'riviere'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['devon', 'cuiller', 'streamer'],
    saison: ['printemps', 'automne'],
    collections: ['eaux-vives', 'predateurs'],
  },
  {
    slug: 'omble-chevalier', numero_dex: 79,
    nom_fr: 'Omble chevalier', nom_scientifique: 'Salvelinus alpinus', famille: 'Salmonidae',
    eau: 'douce', rarete: 'epique', difficulte: 4,
    taille_min_cm: 20, taille_max_cm: 80, poids_max_kg: 6,
    description: "Seigneur des lacs alpins profonds. Ses flancs parsemés de taches roses luminescentes en font l'un des plus beaux poissons d'eau douce.",
    habitat: ['lac-altitude', 'lac'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['cuiller', 'mouche', 'vif'],
    saison: ['printemps', 'automne', 'hiver'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'eperlan', numero_dex: 80,
    nom_fr: 'Éperlan', nom_scientifique: 'Osmerus eperlanus', famille: 'Osmeridae',
    eau: 'douce', rarete: 'epique', difficulte: 3,
    taille_min_cm: 10, taille_max_cm: 30, poids_max_kg: 0.2,
    description: "Petit salmonidé à l'odeur caractéristique de concombre frais. Vit en bancs dans les estuaires et lacs, remonte les rivières pour frayer.",
    habitat: ['estuaire', 'lac', 'fleuve'], regime: 'carnivore', profondeur: 'surface',
    techniques: ['devon', 'cuiller', 'toc'],
    saison: ['hiver', 'printemps'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'barbeau-meridional', numero_dex: 81,
    nom_fr: 'Barbeau méridional', nom_scientifique: 'Barbus meridionalis', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'epique', difficulte: 4,
    taille_min_cm: 15, taille_max_cm: 40, poids_max_kg: 1.2,
    description: "Cousin méditerranéen du barbeau fluviatile, plus trapu et tacheté. Espèce protégée des rivières pyrénéennes et provençales.",
    habitat: ['torrent', 'riviere'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'vers'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'perche-fluviatile', numero_dex: 82,
    nom_fr: 'Perche fluviatile', nom_scientifique: 'Perca fluviatilis f. rivularis', famille: 'Percidae',
    eau: 'douce', rarete: 'epique', difficulte: 3,
    taille_min_cm: 20, taille_max_cm: 50, poids_max_kg: 2.5,
    description: "Forme de grande rivière de la perche commune, aux rayures plus marquées et à la croissance plus rapide. Combat vigoureux.",
    habitat: ['riviere', 'fleuve'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['leurre', 'jig', 'vif'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['predateurs'],
  },
  {
    slug: 'sandre-dore', numero_dex: 83,
    nom_fr: 'Sandre doré', nom_scientifique: 'Sander vitreus', famille: 'Percidae',
    eau: 'douce', rarete: 'epique', difficulte: 4,
    taille_min_cm: 25, taille_max_cm: 80, poids_max_kg: 8,
    description: "Espèce nord-américaine introduite en quelques plans d'eau européens. Plus résistant au courant que le sandre européen.",
    habitat: ['lac', 'fleuve'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['leurre', 'jig', 'vif'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['predateurs'],
  },
  {
    slug: 'corégone-palee', numero_dex: 84,
    nom_fr: 'Corégone palée', nom_scientifique: 'Coregonus palaea', famille: 'Salmonidae',
    eau: 'douce', rarete: 'epique', difficulte: 4,
    taille_min_cm: 20, taille_max_cm: 50, poids_max_kg: 1.5,
    description: "Corégone endémique du lac Léman. Argenté et fin, il vit en eaux profondes et remonte la nuit. Pêche nocturne en dérivante.",
    habitat: ['lac'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['asticot', 'vers', 'mouche'],
    saison: ['automne', 'hiver'],
    collections: ['eaux-vives'],
  },
  {
    slug: 'lamproie-fluviatile', numero_dex: 85,
    nom_fr: 'Lamproie fluviatile', nom_scientifique: 'Lampetra fluviatilis', famille: 'Petromyzontidae',
    eau: 'douce', rarete: 'epique', difficulte: 5,
    taille_min_cm: 25, taille_max_cm: 50, poids_max_kg: 0.15,
    description: "Poisson primitif sans mâchoire, parasite des salmonidés. Sa capture involontaire reste un événement rare et mémorable.",
    habitat: ['fleuve', 'riviere'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['vers'],
    saison: ['automne', 'hiver', 'printemps'],
    collections: ['eaux-vives'],
  },

  // ══════════════
  // Nouveaux Légendaires
  // ══════════════
  {
    slug: 'esturgeon-europeen', numero_dex: 86,
    nom_fr: 'Esturgeon européen', nom_scientifique: 'Acipenser sturio', famille: 'Acipenseridae',
    eau: 'douce', rarete: 'legendaire', difficulte: 5,
    taille_min_cm: 80, taille_max_cm: 350, poids_max_kg: 200,
    description: "Le plus ancien vertébré survivant d'Europe, quasi-éteint à l'état sauvage. Sa rencontre dans la Garonne est un miracle de la nature.",
    habitat: ['fleuve', 'estuaire'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['vers', 'asticot'],
    saison: ['printemps', 'automne'],
    collections: ['paisibles'],
  },
  {
    slug: 'silure-wels-record', numero_dex: 87,
    nom_fr: 'Silure record', nom_scientifique: 'Silurus glanis f. grandis', famille: 'Siluridae',
    eau: 'douce', rarete: 'legendaire', difficulte: 5,
    taille_min_cm: 150, taille_max_cm: 300, poids_max_kg: 150,
    description: "Le monstre des fleuves européens. À cette taille, le silure est un prédateur apex capable de gober des oiseaux aquatiques. Une rencontre qui change une vie.",
    habitat: ['fleuve', 'lac'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['vif', 'wurm', 'clonk'],
    saison: ['ete', 'printemps'],
    collections: ['predateurs'],
  },
  {
    slug: 'brochet-trophee', numero_dex: 88,
    nom_fr: 'Brochet trophée', nom_scientifique: 'Esox lucius f. maximus', famille: 'Esocidae',
    eau: 'douce', rarete: 'legendaire', difficulte: 5, taille_legale_cm: 60,
    taille_min_cm: 80, taille_max_cm: 140, poids_max_kg: 25,
    description: "Le Saint-Graal du carnassier européen. Au-delà de 10 kg, chaque brochet est une femelle dominante gardienne de son territoire.",
    habitat: ['lac', 'fleuve', 'etang'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['leurre', 'jerkbait', 'vif'],
    saison: ['automne', 'hiver', 'printemps'],
    collections: ['predateurs'],
  },
  {
    slug: 'carpe-commune-record', numero_dex: 89,
    nom_fr: 'Carpe record', nom_scientifique: 'Cyprinus carpio f. robustus', famille: 'Cyprinidae',
    eau: 'douce', rarete: 'legendaire', difficulte: 5,
    taille_min_cm: 70, taille_max_cm: 130, poids_max_kg: 50,
    description: "À ce stade, la carpe a survécu à des décennies de pression de pêche. Souvent connue par nom dans les plans d'eau privés. Un être d'exception.",
    habitat: ['lac', 'etang'], regime: 'omnivore', profondeur: 'fond',
    techniques: ['bouillette', 'pellet', 'maïs'],
    saison: ['printemps', 'ete', 'automne'],
    collections: ['paisibles'],
  },
  {
    slug: 'sandre-geant', numero_dex: 90,
    nom_fr: 'Sandre géant', nom_scientifique: 'Sander lucioperca f. maximus', famille: 'Percidae',
    eau: 'douce', rarete: 'legendaire', difficulte: 5, taille_legale_cm: 50,
    taille_min_cm: 70, taille_max_cm: 110, poids_max_kg: 15,
    description: "Le sandre de légende, rare au-delà de 10 kg. Chasseur nocturne des grands fonds des lacs et barrages alpins.",
    habitat: ['lac', 'fleuve'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['leurre', 'jig', 'vif'],
    saison: ['printemps', 'automne', 'hiver'],
    collections: ['predateurs'],
  },
  {
    slug: 'saumon-roi', numero_dex: 91,
    nom_fr: 'Saumon royal', nom_scientifique: 'Oncorhynchus tshawytscha', famille: 'Salmonidae',
    eau: 'douce', rarete: 'legendaire', difficulte: 5,
    taille_min_cm: 60, taille_max_cm: 150, poids_max_kg: 60,
    description: "Le plus grand des saumons du Pacifique. Présent dans quelques rivières françaises introduites, sa capture représente un événement mondial.",
    habitat: ['fleuve', 'riviere'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['devon', 'cuiller', 'streamer'],
    saison: ['printemps', 'automne'],
    collections: ['eaux-vives'],
  },

  // ══════════════
  // Nouveaux Mirages (cachés jusqu'à capture)
  // ══════════════
  {
    slug: 'brochet-albinos', numero_dex: 92,
    nom_fr: 'Brochet albinos', nom_scientifique: 'Esox lucius var. albinos', famille: 'Esocidae',
    eau: 'douce', rarete: 'mirage', difficulte: 5,
    taille_min_cm: 50, taille_max_cm: 120, poids_max_kg: 15,
    description: "Le fantôme des lacs. Un brochet albinos est un accident génétique rarissime — sa rencontre dans la nature est quasi-mythique.",
    habitat: ['lac', 'etang', 'fleuve'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['leurre', 'vif'],
    saison: ['automne', 'hiver', 'printemps'],
    is_hidden_in_dex: true,
    collections: ['predateurs'],
  },
  {
    slug: 'perche-albinos', numero_dex: 93,
    nom_fr: 'Perche albinos', nom_scientifique: 'Perca fluviatilis var. albinos', famille: 'Percidae',
    eau: 'douce', rarete: 'mirage', difficulte: 5,
    taille_min_cm: 15, taille_max_cm: 50, poids_max_kg: 2,
    description: "Banc blanc parmi les rayures vertes. La perche albinos est une anomalie spectrale qui fascine les pêcheurs depuis toujours.",
    habitat: ['lac', 'riviere'], regime: 'carnivore', profondeur: 'moyenne',
    techniques: ['leurre', 'jig'],
    saison: ['printemps', 'ete', 'automne'],
    is_hidden_in_dex: true,
    collections: ['predateurs'],
  },
  {
    slug: 'saumon-atlantique-albinos', numero_dex: 94,
    nom_fr: 'Saumon atlantique albinos', nom_scientifique: 'Salmo salar var. albinos', famille: 'Salmonidae',
    eau: 'douce', rarete: 'mirage', difficulte: 5,
    taille_min_cm: 60, taille_max_cm: 130, poids_max_kg: 30,
    description: "La rareté absolue : un saumon albinos remontant sa rivière natale. Un événement survenant peut-être une fois par siècle.",
    habitat: ['fleuve', 'riviere', 'torrent'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['mouche', 'devon'],
    saison: ['printemps', 'automne'],
    is_hidden_in_dex: true,
    collections: ['eaux-vives'],
  },
  {
    slug: 'grande-alose-albinos', numero_dex: 95,
    nom_fr: 'Grande alose albinos', nom_scientifique: 'Alosa alosa var. albinos', famille: 'Clupeidae',
    eau: 'douce', rarete: 'mirage', difficulte: 5,
    taille_min_cm: 30, taille_max_cm: 70, poids_max_kg: 2.5,
    description: "L'alose est déjà rare — sa forme albinos est une vision de l'autre monde, surgissant des profondeurs du fleuve comme un éclair de lumière.",
    habitat: ['fleuve', 'estuaire'], regime: 'omnivore', profondeur: 'surface',
    techniques: ['cuiller', 'devon'],
    saison: ['printemps'],
    is_hidden_in_dex: true,
    collections: ['paisibles'],
  },
  {
    slug: 'sandre-albinos', numero_dex: 96,
    nom_fr: 'Sandre albinos', nom_scientifique: 'Sander lucioperca var. albinos', famille: 'Percidae',
    eau: 'douce', rarete: 'mirage', difficulte: 5,
    taille_min_cm: 40, taille_max_cm: 90, poids_max_kg: 10,
    description: "Le sandre des rêves : blanc comme un marbre d'albâtre, ses yeux roses luisent dans l'obscurité des fonds. Un être hors du temps.",
    habitat: ['lac', 'fleuve'], regime: 'carnivore', profondeur: 'fond',
    techniques: ['leurre', 'jig', 'vif'],
    saison: ['printemps', 'automne', 'hiver'],
    is_hidden_in_dex: true,
    collections: ['predateurs'],
  },
]

// ══════════════════════════════════════════════════════
// EXÉCUTION
// ══════════════════════════════════════════════════════
async function main() {
  console.log(`🐟 Seeding ${NEW_SPECIES.length} nouvelles espèces...`)

  // Récupérer les slugs existants pour idempotence
  const { data: existingSlugs } = await supabase
    .from('species')
    .select('slug')
  const existing = new Set((existingSlugs ?? []).map(s => s.slug))

  // Récupérer les IDs de collections
  const { data: colls } = await supabase.from('collections').select('id, slug')
  const collMap = Object.fromEntries((colls ?? []).map(c => [c.slug, c.id]))

  let inserted = 0
  let skipped  = 0
  const collLinks: { species_id: string; collection_id: string }[] = []

  for (const sp of NEW_SPECIES) {
    const { collections: spColls, ...speciesData } = sp

    if (existing.has(sp.slug)) {
      console.log(`  ⏭️  Skip (existe déjà) : ${sp.nom_fr}`)
      skipped++

      // Récupérer l'ID pour lier quand même les collections
      const { data: existingSpecies } = await supabase
        .from('species')
        .select('id')
        .eq('slug', sp.slug)
        .single()
      if (existingSpecies) {
        for (const collSlug of spColls) {
          const cid = collMap[collSlug]
          if (cid) collLinks.push({ species_id: existingSpecies.id, collection_id: cid })
        }
      }
      continue
    }

    const insertData = {
      ...speciesData,
      is_hidden_in_dex: sp.is_hidden_in_dex ?? false,
    }

    const { data: newSpecies, error } = await supabase
      .from('species')
      .insert(insertData)
      .select('id')
      .single()

    if (error) {
      console.error(`  ❌ Erreur ${sp.nom_fr}: ${error.message}`)
      continue
    }

    console.log(`  ✅ Inséré : ${sp.nom_fr} (${sp.rarete})`)
    inserted++

    for (const collSlug of spColls) {
      const cid = collMap[collSlug]
      if (cid) collLinks.push({ species_id: newSpecies.id, collection_id: cid })
    }
  }

  // Upsert des liens collections
  if (collLinks.length > 0) {
    const { error: linkError } = await supabase
      .from('species_collections')
      .upsert(collLinks, { onConflict: 'species_id,collection_id' })
    if (linkError) {
      console.error('❌ Erreur liens collections:', linkError.message)
    } else {
      console.log(`\n🔗 ${collLinks.length} liens espèces↔collections upsertés`)
    }
  }

  // Résumé final
  const { data: summary } = await supabase
    .from('species_collections')
    .select('collection_id, collections(slug, emoji, nom), species(is_hidden_in_dex)')

  const byCol: Record<string, { visible: number; mirages: number; emoji: string }> = {}
  for (const row of summary ?? []) {
    const col = (row.collections as unknown as { slug: string; emoji: string; nom: string } | null)
    const sp  = (row.species as unknown as { is_hidden_in_dex: boolean } | null)
    if (!col) continue
    if (!byCol[col.slug]) byCol[col.slug] = { visible: 0, mirages: 0, emoji: col.emoji }
    if (sp?.is_hidden_in_dex) byCol[col.slug].mirages++
    else                       byCol[col.slug].visible++
  }

  console.log('\n════════════════════════════════════')
  console.log('📊 RÉSUMÉ COLLECTIONS')
  for (const [slug, stats] of Object.entries(byCol)) {
    console.log(`  ${stats.emoji} ${slug.padEnd(12)} : ${stats.visible} visible · ${stats.mirages} Mirages`)
  }
  console.log(`\n✅ ${inserted} espèces insérées, ${skipped} ignorées (déjà présentes)`)
  console.log('════════════════════════════════════')
}

main().catch(err => { console.error(err); process.exit(1) })
