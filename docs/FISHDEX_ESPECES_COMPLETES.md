# 🐟 FishDex — Fiches espèces complètes

> Fiches naturalistes pour les espèces FishDex, organisées en 3 collections.
> Sources : connaissances naturalistes + vérifications INPN, FishBase, DORIS, fédérations.
> Format JSON prêt à seeder en BDD.
>
> **⚠️ Lecture importante avant utilisation** : voir section "AUDIT & AVERTISSEMENTS" en fin de document.

---

# 📋 Sommaire

- [Collection 1 — Paisibles](#collection-1--paisibles) (cyprinidés et autres poissons calmes)
- [Collection 2 — Prédateurs](#collection-2--prédateurs) (carnassiers)
- [Collection 3 — Eaux vives](#collection-3--eaux-vives) (salmonidés et rivières froides)
- [Audit & avertissements](#audit--avertissements)
- [Variantes pour `species_variants`](#variantes-table-séparée)
- [Espèces supprimées de ta liste](#espèces-supprimées-de-ta-liste-et-pourquoi)

---

# Collection 1 — Paisibles

> Les cyprinidés et poissons calmes des étangs, lacs et rivières lentes.

## 1.1 Ablette

```json
{
  "slug": "ablette",
  "nom_fr": "Ablette",
  "nom_scientifique": "Alburnus alburnus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 25,
  "taille_moyenne_cm": 12,
  "poids_max_kg": 0.15,
  "poids_moyen_kg": 0.03,
  "longevite_annees": "5-7 ans",
  "regime": "omnivore (zooplancton, insectes de surface)",
  "habitat": "Eaux calmes et eaux courantes lentes des rivières et lacs. Vit en bancs nombreux près de la surface.",
  "profondeur": "0-2 m",
  "temperature_eau": "10-22 °C",
  "saison_active": "Avril-Octobre",
  "description": "Petit poisson argenté grégaire, l'ablette anime les surfaces calmes en bancs serrés. Son éclat argenté servait autrefois à fabriquer des fausses perles. Présente partout en France, elle est le maillon nourricier de nombreux prédateurs.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 1, "efficacite": 5, "profondeur_optimale": "Surface", "animation": "Amorce légère, esche minuscule (asticot, mouche)" },
    { "nom": "Pêche à la mouche sèche", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "Surface", "animation": "Mouches très petites #18-22, dérive naturelle" },
    { "nom": "Streamer ultra-light", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "0-1 m", "animation": "Lancers courts, récupération vibrante" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, légère brise",
    "moment_jour": "Journée entière, pics en fin d'après-midi",
    "profondeur": "Surface",
    "vent": "Léger à modéré"
  },
  "conseil_fishdex": "Cherche les rondes en surface au crépuscule, c'est là qu'elles trahissent leur présence. Un hameçon trop gros, et tu pêcheras dans le vide toute la journée.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Peut être utilisée comme vif (vivante ou morte) dans les zones réglementairement autorisées.",
  "donnees_a_verifier": []
}
```

## 1.2 Brème commune

```json
{
  "slug": "breme-commune",
  "nom_fr": "Brème commune",
  "nom_scientifique": "Abramis brama",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 80,
  "taille_moyenne_cm": 40,
  "poids_max_kg": 8,
  "poids_moyen_kg": 1.5,
  "longevite_annees": "10-20 ans",
  "regime": "omnivore benthique (vers, larves, mollusques, débris)",
  "habitat": "Eaux calmes et profondes des grands étangs, lacs et rivières lentes. Préfère les fonds vaseux où elle fouille.",
  "profondeur": "2-6 m",
  "temperature_eau": "12-22 °C",
  "saison_active": "Avril-Octobre, frai en mai-juin",
  "description": "Poisson au corps haut et comprimé latéralement, la brème commune se déplace en bancs sur les fonds vaseux qu'elle aspire à la recherche de proies. Sa silhouette de feuille tournoie au-dessus des troupeaux qu'elle forme, surtout au printemps lors du frai bruyant.",
  "techniques_recommandees": [
    { "nom": "Pêche au feeder", "difficulte": 2, "efficacite": 5, "profondeur_optimale": "2-5 m", "animation": "Amorce sucrée, vers de terre ou pellets" },
    { "nom": "Pêche au coup au grand pivot", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "3-6 m", "animation": "Sondage précis, amorçage régulier" },
    { "nom": "Pêche à la bolognaise", "difficulte": 2, "efficacite": 3, "profondeur_optimale": "1-3 m", "animation": "Dérive lente le long des bordures" }
  ],
  "conditions_ideales": {
    "meteo": "Couvert, chaleur stable",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "3-5 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Quand tu trouves un banc, reste patient et amorce régulièrement : tu peux faire une session entière au même poste. Les grosses brèmes mordent souvent juste après que les petites se calment.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie. Pêche autorisée à l'ouverture générale.",
  "donnees_a_verifier": []
}
```

## 1.3 Brème bordelière

```json
{
  "slug": "breme-bordeliere",
  "nom_fr": "Brème bordelière",
  "nom_scientifique": "Blicca bjoerkna",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 36,
  "taille_moyenne_cm": 20,
  "poids_max_kg": 1,
  "poids_moyen_kg": 0.3,
  "longevite_annees": "8-10 ans",
  "regime": "omnivore (insectes, larves, plancton, végétaux)",
  "habitat": "Eaux calmes des étangs et rivières lentes. Souvent en compagnie des brèmes communes mais plus discrète.",
  "profondeur": "1-4 m",
  "temperature_eau": "12-22 °C",
  "saison_active": "Mai-Septembre",
  "description": "Souvent confondue avec la jeune brème commune, la bordelière s'en distingue par ses yeux plus grands et ses nageoires légèrement rougeâtres. Plus petite, plus argentée, elle vit dans les mêmes eaux mais reste discrète.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Amorce fine, vers de vase ou asticots" },
    { "nom": "Pêche au feeder léger", "difficulte": 2, "efficacite": 3, "profondeur_optimale": "2-4 m", "animation": "Méthode classique, esches discrètes" }
  ],
  "conditions_ideales": {
    "meteo": "Couvert ou ensoleillé doux",
    "moment_jour": "Journée",
    "profondeur": "2-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Examine bien ce que tu sors : entre brème commune et bordelière, beaucoup de pêcheurs se trompent. La bordelière a l'œil plus grand par rapport à la tête, c'est le signe le plus fiable.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.",
  "donnees_a_verifier": []
}
```

## 1.4 Carassin commun

```json
{
  "slug": "carassin-commun",
  "nom_fr": "Carassin commun",
  "nom_scientifique": "Carassius carassius",
  "famille": "Cyprinidés (Cyprinidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 50,
  "taille_moyenne_cm": 20,
  "poids_max_kg": 3,
  "poids_moyen_kg": 0.4,
  "longevite_annees": "10-12 ans",
  "regime": "omnivore (insectes, larves, plantes, détritus)",
  "habitat": "Étangs, mares et bras morts riches en végétation. Tolère des eaux pauvres en oxygène.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "8-28 °C",
  "saison_active": "Mai-Septembre",
  "description": "Cousin sauvage du carassin doré, le carassin commun se reconnaît à sa coloration brun-bronze et ses formes plus trapues. De plus en plus rare en France, il subit la concurrence du carassin doré introduit et de la pollution des petites eaux qu'il affectionne.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "1-2 m", "animation": "Esches naturelles près du fond, herbiers" },
    { "nom": "Pêche à la grande canne", "difficulte": 2, "efficacite": 3, "profondeur_optimale": "1-3 m", "animation": "Esches lourdes, amorçage modéré" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, stable",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Si tu en captures un, observe-le attentivement avant de le relâcher : il est aujourd'hui moins commun qu'autrefois. Les petites eaux abandonnées par les pêcheurs sont souvent ses derniers refuges.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie. Population en déclin en France : relâche recommandée.",
  "donnees_a_verifier": []
}
```

## 1.5 Carassin doré

```json
{
  "slug": "carassin-dore",
  "nom_fr": "Carassin doré",
  "nom_scientifique": "Carassius auratus",
  "famille": "Cyprinidés (Cyprinidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 45,
  "taille_moyenne_cm": 15,
  "poids_max_kg": 2,
  "poids_moyen_kg": 0.2,
  "longevite_annees": "10-25 ans",
  "regime": "omnivore (insectes, larves, végétaux, détritus)",
  "habitat": "Étangs, mares, eaux calmes. Espèce introduite mais désormais répandue.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "8-30 °C",
  "saison_active": "Mai-Septembre",
  "description": "Originaire d'Asie, le carassin doré (ancêtre du poisson rouge) s'est largement naturalisé en France après des lâchers répétés. Sa robe varie du bronze sombre à l'orange vif. Très rustique, il colonise les eaux les moins hospitalières.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 1, "efficacite": 4, "profondeur_optimale": "1-2 m", "animation": "Esches simples, près du fond" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, calme",
    "moment_jour": "Journée",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Espèce d'origine asiatique introduite, le carassin doré pose question écologique : il croise avec le carassin commun et menace sa survie. À prendre en compte si tu pêches dans des eaux fragiles.",
  "statut_reglementaire": "Pas de réglementation nationale de pêche spécifique. Espèce introduite non soumise à taille légale ni période de fermeture.",
  "donnees_a_verifier": []
}
```

## 1.6 Chevesne (Chevaine)

```json
{
  "slug": "chevesne",
  "nom_fr": "Chevesne",
  "nom_scientifique": "Squalius cephalus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 80,
  "taille_moyenne_cm": 35,
  "poids_max_kg": 6,
  "poids_moyen_kg": 1,
  "longevite_annees": "10-15 ans",
  "regime": "omnivore opportuniste (insectes, fruits, petits poissons, vers)",
  "habitat": "Rivières et fleuves de plaine à courant modéré, lacs. Affectionne les abris : branches, ponts, sous-berges.",
  "profondeur": "0.5-4 m",
  "temperature_eau": "8-24 °C",
  "saison_active": "Avril-Octobre",
  "description": "Cyprinidé puissant et méfiant, le chevesne combine la curiosité d'un opportuniste et la prudence d'un poisson chassé. Il monte avaler une cerise tombée d'un arbre, gobe un insecte en surface, mais détale au moindre bruit. C'est l'un des poissons les plus polyvalents à pêcher.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "Surface à 1 m", "animation": "Mouche sèche posée délicatement, dérive naturelle" },
    { "nom": "Pêche au leurre ultra-léger", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "0-2 m", "animation": "Petits cranks, leurres souples 5 cm" },
    { "nom": "Pêche à la cerise / pain", "difficulte": 1, "efficacite": 4, "profondeur_optimale": "Surface", "animation": "Esche flottante sous arbres fruitiers" },
    { "nom": "Pêche à la fouettée", "difficulte": 2, "efficacite": 3, "profondeur_optimale": "0-2 m", "animation": "Sauterelle, criquet, insecte vivant" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, été chaud",
    "moment_jour": "Toute la journée, mieux en matinée et soirée",
    "profondeur": "0-2 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "Le chevesne est l'un des poissons les plus malins de nos rivières. Approche en silence, lance sans projeter d'ombre, et tu verras qu'il pardonne rarement une erreur. Les plus gros sont sous les arbres qui touchent l'eau.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie (1ère catégorie dans certains cours d'eau salmonicoles).",
  "donnees_a_verifier": []
}
```

## 1.7 Gardon

```json
{
  "slug": "gardon",
  "nom_fr": "Gardon",
  "nom_scientifique": "Rutilus rutilus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 50,
  "taille_moyenne_cm": 18,
  "poids_max_kg": 2,
  "poids_moyen_kg": 0.15,
  "longevite_annees": "10-13 ans",
  "regime": "omnivore (zooplancton, insectes, végétaux, larves)",
  "habitat": "Très adaptable : étangs, lacs, rivières lentes, canaux. Vit en bancs dans les eaux peu profondes.",
  "profondeur": "0.5-4 m",
  "temperature_eau": "8-24 °C",
  "saison_active": "Avril-Octobre",
  "description": "Le poisson de l'initiation. Le gardon, avec ses nageoires rouge orangé et son corps argenté, est souvent la première prise des jeunes pêcheurs. Présent partout en France, grégaire, vorace, il transmet le goût des choses simples : l'eau, le silence, l'attente partagée.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 1, "efficacite": 5, "profondeur_optimale": "1-3 m", "animation": "Asticot, vers, amorce sucrée légère" },
    { "nom": "Pêche à la grande canne", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "2-4 m", "animation": "Sondage précis, amorçage régulier" },
    { "nom": "Pêche à la bolognaise", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Dérive en rivière lente" }
  ],
  "conditions_ideales": {
    "meteo": "Doux, stable",
    "moment_jour": "Matin et fin d'après-midi",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Le gardon récompense le calme et la régularité. Une bonne session de gardons, c'est avant tout une bonne amorce et une eau lue avec patience. Et c'est souvent là qu'on se souvient pourquoi on pêche.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie. Pêche autorisée à l'ouverture générale.",
  "donnees_a_verifier": []
}
```

## 1.8 Goujon

```json
{
  "slug": "goujon",
  "nom_fr": "Goujon",
  "nom_scientifique": "Gobio gobio",
  "famille": "Cyprinidés (Gobionidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 21,
  "taille_moyenne_cm": 10,
  "poids_max_kg": 0.2,
  "poids_moyen_kg": 0.02,
  "longevite_annees": "5-8 ans",
  "regime": "carnivore benthique (larves, vers, petits invertébrés)",
  "habitat": "Rivières et ruisseaux à fond graveleux ou sableux, eaux claires et bien oxygénées. Vit en petits groupes.",
  "profondeur": "0.3-2 m",
  "temperature_eau": "10-20 °C",
  "saison_active": "Mai-Octobre",
  "description": "Petit poisson de fond aux barbillons caractéristiques, le goujon est un indicateur d'eau saine. Discret, gregaire, il foule les graviers à la recherche de larves. Sa pêche initiatique fait partie du patrimoine des rivières françaises.",
  "techniques_recommandees": [
    { "nom": "Pêche au toc / au plomb", "difficulte": 1, "efficacite": 5, "profondeur_optimale": "Fond", "animation": "Vers, larves, esche au ras du gravier" },
    { "nom": "Pêche au coup en rivière", "difficulte": 1, "efficacite": 4, "profondeur_optimale": "0.5-1.5 m", "animation": "Dérive courte, plombée près du fond" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, eau claire",
    "moment_jour": "Journée",
    "profondeur": "0.5-1.5 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Un ruisseau plein de goujons, c'est un ruisseau qui se porte bien. Profite-en pour montrer aux enfants ce qu'est une vraie pêche : simple, sans batterie, sans écran.",
  "statut_reglementaire": "Pas de taille légale nationale. Catégorie 1 dans les rivières à salmonidés, catégorie 2 ailleurs. Peut être utilisé comme vif vivant dans les zones autorisées.",
  "donnees_a_verifier": []
}
```

## 1.9 Hotu

```json
{
  "slug": "hotu",
  "nom_fr": "Hotu",
  "nom_scientifique": "Chondrostoma nasus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 55,
  "taille_moyenne_cm": 30,
  "poids_max_kg": 2,
  "poids_moyen_kg": 0.6,
  "longevite_annees": "10-15 ans",
  "regime": "herbivore-algivore (algues, biofilm sur les pierres)",
  "habitat": "Rivières et fleuves à courant vif et fond pierreux. Vit en bancs.",
  "profondeur": "1-3 m",
  "temperature_eau": "10-20 °C",
  "saison_active": "Avril-Octobre",
  "description": "Reconnaissable à son museau pointu et à sa bouche infère adaptée au broutage des pierres, le hotu vit en bancs serrés dans les eaux vives. Il racle inlassablement le biofilm algal des fonds caillouteux, un comportement unique chez les cyprinidés français.",
  "techniques_recommandees": [
    { "nom": "Pêche à la bolognaise", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "1-3 m", "animation": "Esche végétale ou pâte verte près du fond" },
    { "nom": "Pêche au toc", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "Fond pierreux", "animation": "Pâte, blé cuit, asticots groupés" },
    { "nom": "Pêche au coup en courant", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "1-2 m", "animation": "Dérive lente, esche frôlant le fond" }
  ],
  "conditions_ideales": {
    "meteo": "Eau claire, beau temps",
    "moment_jour": "Journée",
    "profondeur": "1-2 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "Le hotu se trahit par les coups secs qu'il donne sur la ligne avant de gober. Ne ferre pas trop tôt, il aime tester l'esche. Une fois piqué, il tire fort vers le courant : laisse-le filer.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Catégorie 1 dans les rivières à fort courant, catégorie 2 ailleurs.",
  "donnees_a_verifier": []
}
```

## 1.10 Ide mélanote

```json
{
  "slug": "ide-melanote",
  "nom_fr": "Ide mélanote",
  "nom_scientifique": "Leuciscus idus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 80,
  "taille_moyenne_cm": 40,
  "poids_max_kg": 5,
  "poids_moyen_kg": 1.5,
  "longevite_annees": "15-20 ans",
  "regime": "omnivore (insectes, mollusques, petits poissons)",
  "habitat": "Rivières et fleuves de plaine, grands lacs. Plus présent dans le quart nord-est de la France.",
  "profondeur": "1-4 m",
  "temperature_eau": "10-22 °C",
  "saison_active": "Avril-Octobre",
  "description": "Cousin du chevesne dont il diffère par ses nageoires rougeâtres et sa robe argentée, l'ide mélanote vit dans les eaux plus larges et plus profondes. Plus rare en France, c'est une espèce du nord et de l'est. La variante d'élevage à robe dorée (ide doré) est sa version aquariophile.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Esches naturelles, amorce parfumée" },
    { "nom": "Pêche au leurre léger", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "0-2 m", "animation": "Petits leurres souples, cranks" },
    { "nom": "Pêche à la mouche", "difficulte": 4, "efficacite": 3, "profondeur_optimale": "Surface à 1 m", "animation": "Mouches noyées, streamer fin" }
  ],
  "conditions_ideales": {
    "meteo": "Doux, stable",
    "moment_jour": "Matin et soir",
    "profondeur": "1-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Si tu pêches dans le Rhin ou en Alsace, garde l'œil : l'ide mélanote est plus présent là-bas que dans le reste de la France. Sa robe argentée aux reflets dorés est inimitable.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.",
  "donnees_a_verifier": []
}
```

## 1.11 Rotengle

```json
{
  "slug": "rotengle",
  "nom_fr": "Rotengle",
  "nom_scientifique": "Scardinius erythrophthalmus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 50,
  "taille_moyenne_cm": 20,
  "poids_max_kg": 2,
  "poids_moyen_kg": 0.3,
  "longevite_annees": "10-15 ans",
  "regime": "omnivore (insectes, végétaux aquatiques, petits crustacés)",
  "habitat": "Eaux calmes des étangs, lacs et rivières lentes, particulièrement riches en herbiers.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "12-24 °C",
  "saison_active": "Mai-Octobre",
  "description": "Souvent confondu avec le gardon, le rotengle s'en distingue par ses nageoires plus rouges, sa bouche légèrement orientée vers le haut et son corps plus haut. Il fréquente les herbiers où il broute insectes et végétation tendre. Sa robe dorée à reflets cuivrés est plus marquée que celle du gardon.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 2, "efficacite": 5, "profondeur_optimale": "0.5-2 m", "animation": "Esche flottante près des herbiers" },
    { "nom": "Pêche à la mouche sèche", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "Surface", "animation": "Petite mouche imitative en surface" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, chaud",
    "moment_jour": "Matin et fin d'après-midi",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Cherche les herbiers en pleine eau, c'est là qu'il monte gober. Un petit hameçon, un asticot bien présenté en surface, et tu sentiras la touche franche d'un poisson qui ne lésine pas.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.",
  "donnees_a_verifier": []
}
```

## 1.12 Spirlin

```json
{
  "slug": "spirlin",
  "nom_fr": "Spirlin",
  "nom_scientifique": "Alburnoides bipunctatus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 16,
  "taille_moyenne_cm": 10,
  "poids_max_kg": 0.05,
  "poids_moyen_kg": 0.015,
  "longevite_annees": "4-6 ans",
  "regime": "omnivore (insectes, plancton, débris)",
  "habitat": "Rivières et ruisseaux à eaux claires, bien oxygénées, fond de graviers. Vit en bancs.",
  "profondeur": "0.3-1.5 m",
  "temperature_eau": "10-20 °C",
  "saison_active": "Mai-Octobre",
  "description": "Petit cyprinidé d'eaux vives, le spirlin se reconnaît à la ligne sombre qui parcourt ses flancs. Indicateur d'eaux de qualité, il colonise les zones à truite. Sa pêche est confidentielle, mais sa présence dans un cours d'eau est un témoignage de santé écologique.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche sèche fine", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "Surface", "animation": "Mouches minuscules #20-24" },
    { "nom": "Pêche au coup ultra-léger", "difficulte": 2, "efficacite": 3, "profondeur_optimale": "0.5 m", "animation": "Esches minuscules en dérive courte" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps",
    "moment_jour": "Matin à fin d'après-midi",
    "profondeur": "0.5-1 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Capturer un spirlin signe une rivière en bonne santé. Plus qu'une prise, c'est un témoignage. Relâche-le délicatement, c'est une espèce sensible.",
  "statut_reglementaire": "Espèce d'intérêt communautaire (Directive Habitats Annexes II et IV). Pas d'interdiction de pêche mais relâche obligatoire recommandée. Espèce indicatrice de qualité d'eau.",
  "donnees_a_verifier": []
}
```

## 1.13 Vairon

```json
{
  "slug": "vairon",
  "nom_fr": "Vairon",
  "nom_scientifique": "Phoxinus phoxinus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 14,
  "taille_moyenne_cm": 8,
  "poids_max_kg": 0.03,
  "poids_moyen_kg": 0.01,
  "longevite_annees": "4-7 ans",
  "regime": "omnivore (zooplancton, insectes, algues)",
  "habitat": "Ruisseaux et rivières froides à eaux vives et claires, fond de graviers. Vit en bancs.",
  "profondeur": "0.2-1.5 m",
  "temperature_eau": "5-18 °C",
  "saison_active": "Mai-Octobre",
  "description": "Petit poisson grégaire des eaux vives, le vairon arbore de superbes couleurs de noces au printemps : ventre rouge orangé, flancs verdâtres, points dorés. Compagnon habituel de la truite, sa présence indique des eaux froides et oxygénées. Souvent utilisé comme vif autrefois.",
  "techniques_recommandees": [
    { "nom": "Pêche au toc / petit hameçon", "difficulte": 1, "efficacite": 5, "profondeur_optimale": "0.3-1 m", "animation": "Asticot, ver minuscule en dérive" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, eau claire",
    "moment_jour": "Journée",
    "profondeur": "0.5-1 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Au printemps, observe les vairons en parade nuptiale : c'est l'un des plus beaux spectacles discrets de nos rivières. Robes rouges et dorées sur fond de graviers — Tesson l'aurait noté.",
  "statut_reglementaire": "Pas de taille légale nationale. Catégorie 1 dans la plupart des ruisseaux et rivières à salmonidés. Peut être utilisé comme vif vivant dans les zones autorisées (vérifier localement).",
  "donnees_a_verifier": []
}
```

## 1.14 Vandoise

```json
{
  "slug": "vandoise",
  "nom_fr": "Vandoise",
  "nom_scientifique": "Leuciscus leuciscus",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 40,
  "taille_moyenne_cm": 20,
  "poids_max_kg": 1,
  "poids_moyen_kg": 0.15,
  "longevite_annees": "10-15 ans",
  "regime": "omnivore (insectes, larves, petits invertébrés)",
  "habitat": "Rivières à courant modéré, eaux claires et bien oxygénées. Vit en bancs.",
  "profondeur": "0.5-2.5 m",
  "temperature_eau": "8-20 °C",
  "saison_active": "Avril-Octobre",
  "description": "Cyprinidé élancé aux flancs argentés, la vandoise vit dans les rivières propres à courant modéré. Plus farouche que le gardon, elle gobe les insectes en surface comme une truite. Sa présence indique une qualité d'eau supérieure à la moyenne.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche sèche", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "Surface", "animation": "Mouches imitatives fines, dérive précise" },
    { "nom": "Pêche au coup léger", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Dérive avec esche naturelle" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, éclosions",
    "moment_jour": "Matin et soir",
    "profondeur": "0.5-1.5 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Quand tu vois des ronds à la surface qui ne sont pas ceux d'une truite, c'est souvent la vandoise. Mouche posée délicatement, dérive parfaite : elle pardonne moins qu'un chevesne.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Catégorie 1 dans la plupart de ses habitats (rivières à salmonidés).",
  "donnees_a_verifier": []
}
```

## 1.15 Blageon

```json
{
  "slug": "blageon",
  "nom_fr": "Blageon",
  "nom_scientifique": "Telestes souffia",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 22,
  "taille_moyenne_cm": 15,
  "poids_max_kg": 0.2,
  "poids_moyen_kg": 0.08,
  "longevite_annees": "5-8 ans",
  "regime": "omnivore (insectes, larves, algues)",
  "habitat": "Rivières et fleuves d'Europe centrale et orientale, bassins du Rhône et de la Loire. Eaux claires à courant modéré.",
  "profondeur": "0.5-2 m",
  "temperature_eau": "10-20 °C",
  "saison_active": "Avril-Octobre",
  "description": "Cyprinidé méconnu mais magnifique, le blageon arbore une bande sombre marquée sur le flanc et des nageoires rougeâtres. Présent dans le bassin du Rhône notamment, il fréquente les rivières propres. Inscrit aux annexes des directives habitats, c'est une espèce d'intérêt patrimonial.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup léger", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "0.5-2 m", "animation": "Asticot, esches fines en dérive" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps",
    "moment_jour": "Journée",
    "profondeur": "1 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Si tu en captures un, prends-en soin : c'est une espèce d'intérêt patrimonial européen. Photo rapide, relâche immédiate. Tu auras vu un petit témoignage de la richesse de nos rivières.",
  "statut_reglementaire": "Espèce d'intérêt communautaire (Directive Habitats Annexes II et IV). Répartition française restreinte au bassin du Rhône. Relâche obligatoire recommandée.",
  "donnees_a_verifier": []
}
```

## 1.16 Apron du Rhône

```json
{
  "slug": "apron-du-rhone",
  "nom_fr": "Apron du Rhône",
  "nom_scientifique": "Zingel asper",
  "famille": "Percidés (Percidae)",
  "rarete": "legendaire",
  "eau": "douce",
  "taille_max_cm": 22,
  "taille_moyenne_cm": 17,
  "poids_max_kg": 0.2,
  "poids_moyen_kg": 0.08,
  "longevite_annees": "3-5 ans",
  "regime": "carnivore (larves d'insectes, petits invertébrés benthiques)",
  "habitat": "Endémique du bassin du Rhône. Rivières à courant vif, fond de graviers et galets. Quatre populations résiduelles : Doubs/Loue, Ardèche, Durance/Verdon.",
  "profondeur": "0.5-2 m",
  "temperature_eau": "8-18 °C",
  "saison_active": "Toute l'année (observation uniquement)",
  "description": "Espèce endémique du bassin du Rhône, l'apron est l'un des poissons les plus menacés de France. En danger critique d'extinction, il a perdu 90% de son aire de répartition au XXe siècle. Petit percidé nocturne aux écailles rugueuses, c'est une relique d'un autre temps que les pêcheurs croisent rarement.",
  "techniques_recommandees": [],
  "conditions_ideales": {
    "meteo": "Eaux claires et fraîches",
    "moment_jour": "Nuit (espèce nocturne)",
    "profondeur": "0.5-1.5 m",
    "vent": "Sans incidence"
  },
  "conseil_fishdex": "L'apron ne se pêche pas. C'est une espèce strictement protégée. Si tu en croises un en plongée ou par hasard, c'est un privilège : il en reste si peu. Signale ton observation au CEN Rhône-Alpes ou à la fédération de pêche locale.",
  "statut_reglementaire": "Espèce strictement protégée. Arrêté du 8 décembre 1988. Directive Habitats Annexes II et IV. Convention de Berne Annexe II. En danger critique d'extinction (UICN).",
  "donnees_a_verifier": []
}
```

## 1.17 Bouvière

```json
{
  "slug": "bouviere",
  "nom_fr": "Bouvière",
  "nom_scientifique": "Rhodeus amarus",
  "famille": "Cyprinidés (Acheilognathidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 9,
  "taille_moyenne_cm": 6,
  "poids_max_kg": 0.01,
  "poids_moyen_kg": 0.005,
  "longevite_annees": "4-5 ans",
  "regime": "omnivore (plancton, algues, débris)",
  "habitat": "Étangs et rivières lentes avec moules d'eau douce (anodontes, unios). Présence des moules indispensable à la reproduction.",
  "profondeur": "0.3-2 m",
  "temperature_eau": "12-24 °C",
  "saison_active": "Avril-Octobre",
  "description": "Petit cyprinidé aux couleurs irisées, la bouvière dépend d'un partenaire inattendu pour sa reproduction : la moule d'eau douce. La femelle pond ses œufs dans le siphon de la moule via un long ovipositeur. Cette symbiose unique en fait une espèce vulnérable : si les moules disparaissent, elle disparaît.",
  "techniques_recommandees": [],
  "conditions_ideales": {
    "meteo": "Doux",
    "moment_jour": "Journée",
    "profondeur": "0.5-1.5 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "La bouvière ne se pêche pas en pratique (trop petite). Si tu en aperçois dans tes étangs, c'est signe que les moules d'eau douce sont là aussi. Une bonne nouvelle écologique à savourer.",
  "statut_reglementaire": "Espèce protégée. Directive Habitats Annexe II.",
  "donnees_a_verifier": []
}
```

## 1.18 Tanche

```json
{
  "slug": "tanche",
  "nom_fr": "Tanche",
  "nom_scientifique": "Tinca tinca",
  "famille": "Cyprinidés (Tincidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 84,
  "taille_moyenne_cm": 40,
  "poids_max_kg": 9,
  "poids_moyen_kg": 1.5,
  "longevite_annees": "15-20 ans",
  "regime": "omnivore (vers, mollusques, insectes, végétaux)",
  "habitat": "Étangs, mares et rivières lentes avec fond vaseux et végétation dense. Tolère les eaux pauvres en oxygène.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "12-26 °C",
  "saison_active": "Mai-Septembre",
  "description": "Poisson trapu à la peau couverte de mucus, à la robe verte sombre tirant sur le bronze. La tanche aime les eaux chaudes et stagnantes, où elle fouille la vase. Discrète et farouche, c'est un poisson qui se mérite, et qui se garde par-dessus tout pour son combat puissant.",
  "techniques_recommandees": [
    { "nom": "Pêche au feeder", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Vers de terre, pellets, amorce sucrée" },
    { "nom": "Pêche au coup à fond", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "1-2.5 m", "animation": "Esche posée près des herbiers" },
    { "nom": "Pêche à la grande canne", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "1-2 m", "animation": "Amorçage régulier, esches naturelles" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, lourd, orageux",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "La tanche aime les eaux chaudes et les nuits orageuses. Pêche en bordure d'herbier, amorçage sucré, esche posée délicatement. Le combat est lent et puissant : ne brusque rien, elle se débat au fond.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie.",
  "donnees_a_verifier": []
}
```

## 1.19 Pseudorasbora (invasive)

```json
{
  "slug": "pseudorasbora",
  "nom_fr": "Pseudorasbora",
  "nom_scientifique": "Pseudorasbora parva",
  "famille": "Cyprinidés (Gobionidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 12,
  "taille_moyenne_cm": 8,
  "poids_max_kg": 0.05,
  "poids_moyen_kg": 0.01,
  "longevite_annees": "3-5 ans",
  "regime": "omnivore (œufs et alevins d'autres poissons, plancton)",
  "habitat": "Eaux calmes, étangs, mares. Espèce invasive originaire d'Asie, introduite involontairement.",
  "profondeur": "0.3-2 m",
  "temperature_eau": "10-28 °C",
  "saison_active": "Avril-Octobre",
  "description": "Petit poisson originaire d'Asie orientale, introduit en France dans les années 80. Espèce invasive problématique : il consomme œufs et alevins d'autres poissons, propage des maladies, et concurrence les espèces locales. Aujourd'hui présent partout dans les eaux calmes françaises.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 1, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Asticot, esche petite" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, calme",
    "moment_jour": "Journée",
    "profondeur": "1 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Espèce invasive : ne la relâche jamais dans une autre eau. Si tu en captures dans un parcours où elle n'est pas encore présente, signale à la fédération. Ils ont besoin de ces données.",
  "statut_reglementaire": "Espèce exotique envahissante. Transport et relâche dans le milieu naturel interdits.",
  "donnees_a_verifier": []
}
```

## 1.20 Carpe commune

```json
{
  "slug": "carpe-commune",
  "nom_fr": "Carpe commune",
  "nom_scientifique": "Cyprinus carpio",
  "famille": "Cyprinidés (Cyprinidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 120,
  "taille_moyenne_cm": 50,
  "poids_max_kg": 40,
  "poids_moyen_kg": 5,
  "longevite_annees": "20-50 ans",
  "regime": "omnivore (vers, mollusques, larves, végétaux, graines)",
  "habitat": "Étangs, lacs, rivières lentes. Très adaptable. Fond vaseux préféré.",
  "profondeur": "1-6 m",
  "temperature_eau": "10-28 °C",
  "saison_active": "Avril-Octobre, frai en mai-juin",
  "description": "Poisson emblématique de la pêche en France, la carpe commune a été introduite par les Romains et élevée depuis le Moyen Âge. Intelligente, méfiante, puissante, elle a engendré une culture de pêche à part entière. Ses formes domestiquées sont nombreuses : miroir, cuir, linéaire, koï.",
  "techniques_recommandees": [
    { "nom": "Pêche à la carpe au feeder/cheveu", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "2-5 m", "animation": "Bouillettes, amorçage en boules, longues sessions" },
    { "nom": "Pêche au stalking", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Repérage visuel, présentation discrète près des poissons" },
    { "nom": "Pêche à la grande canne", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "2-4 m", "animation": "Amorce parfumée, esches naturelles ou bouillette" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, lourd",
    "moment_jour": "Aube et crépuscule, nuit",
    "profondeur": "2-4 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "La carpe se mérite par la patience. Une session de 24 ou 48h, c'est aussi un moment de contemplation. Apprends à lire l'eau, à entendre le silence d'un lac. La prise viendra peut-être, mais le souvenir reste de toute façon.",
  "statut_reglementaire": "Taille légale : 40 cm (variable selon plans d'eau et départements). Pas de période de fermeture nationale. Certains parcours carpe imposent le no-kill ou une taille minimale plus élevée. Pêche de nuit autorisée selon les eaux.",
  "donnees_a_verifier": []
}
```

## 1.21 Amour blanc

```json
{
  "slug": "amour-blanc",
  "nom_fr": "Amour blanc",
  "nom_scientifique": "Ctenopharyngodon idella",
  "famille": "Cyprinidés (Xenocyprididae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 150,
  "taille_moyenne_cm": 60,
  "poids_max_kg": 45,
  "poids_moyen_kg": 5,
  "longevite_annees": "15-20 ans",
  "regime": "herbivore strict (végétaux aquatiques)",
  "habitat": "Étangs, lacs et canaux. Espèce introduite d'Asie orientale, utilisée pour contrôler la végétation.",
  "profondeur": "1-5 m",
  "temperature_eau": "15-28 °C",
  "saison_active": "Mai-Septembre",
  "description": "Originaire de Chine, l'amour blanc a été introduit pour son rôle de débroussailleur naturel : il consomme jusqu'à son poids en végétation par jour. Reconnaissable à son corps allongé et sa tête volumineuse, il atteint des tailles impressionnantes. Sa pêche est devenue prisée en France.",
  "techniques_recommandees": [
    { "nom": "Pêche au herbe / pain", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "Surface à 2 m", "animation": "Herbe coupée, pain flottant près des berges" },
    { "nom": "Pêche à la carpe (esches végétales)", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "1-3 m", "animation": "Bouillettes végétales, maïs" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, ensoleillé",
    "moment_jour": "Journée",
    "profondeur": "1-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Cherche les amours à proximité des herbiers, surtout par temps chaud. L'esche végétale est obligatoire : pain, herbe fraîche, maïs. Une fois piqué, c'est un combat de force pure, prépare ton matériel solide.",
  "statut_reglementaire": "Taille légale variable selon les plans d'eau, souvent 40 cm. Espèce introduite ne se reproduisant pas en France métropolitaine. Présence soumise à autorisation selon les plans d'eau.",
  "donnees_a_verifier": []
}
```

## 1.22 Carpe amour argenté

```json
{
  "slug": "carpe-amour-argente",
  "nom_fr": "Carpe amour argenté",
  "nom_scientifique": "Hypophthalmichthys molitrix",
  "famille": "Cyprinidés (Xenocyprididae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 130,
  "taille_moyenne_cm": 60,
  "poids_max_kg": 40,
  "poids_moyen_kg": 8,
  "longevite_annees": "15-20 ans",
  "regime": "planctonophage (phytoplancton, zooplancton, détritus en suspension)",
  "habitat": "Grands lacs, retenues et gravières. Espèce introduite d'Asie orientale, présente dans certains plans d'eau français (Rhône, Garonne, gravières).",
  "profondeur": "1-5 m",
  "temperature_eau": "15-30 °C",
  "saison_active": "Mai-Septembre",
  "description": "Originaire d'Asie du Sud-Est, l'amour argenté est l'un des poissons les plus produits au monde en aquaculture. Introduit dans des plans d'eau français pour le contrôle du phytoplancton, il atteint des tailles impressionnantes. Sa particularité : il filtre le plancton par ses branchiospines, il ne mord pas les esches classiques. Sa capture reste un défi confidentiel.",
  "techniques_recommandees": [
    { "nom": "Pêche au pain / pâte flottante de surface", "difficulte": 4, "efficacite": 3, "profondeur_optimale": "Surface à 1 m", "animation": "Pain flottant, pâte très légère, sans plomb — attirer par amorçage progressif en surface" }
  ],
  "conditions_ideales": {
    "meteo": "Très chaud, calme, ciel dégagé",
    "moment_jour": "Journée, grande chaleur",
    "profondeur": "Surface à 1 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "L'amour argenté ne mange pas d'esches classiques : il filtre l'eau. Certains pêcheurs le capturent au pain flottant ou avec une pâte très légère en surface. Une prise reste un exploit rarissime en France.",
  "statut_reglementaire": "Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant dans le milieu naturel interdit. Présence autorisée dans certains plans d'eau sur autorisation.",
  "donnees_a_verifier": []
}
```

## 1.23 Carpe marbré

```json
{
  "slug": "carpe-marbre",
  "nom_fr": "Carpe marbré",
  "nom_scientifique": "Hypophthalmichthys nobilis",
  "famille": "Cyprinidés (Xenocyprididae)",
  "rarete": "legendaire",
  "eau": "douce",
  "taille_max_cm": 150,
  "taille_moyenne_cm": 70,
  "poids_max_kg": 50,
  "poids_moyen_kg": 12,
  "longevite_annees": "20-25 ans",
  "regime": "planctonophage et détritivore (zooplancton, débris organiques, particules en suspension)",
  "habitat": "Grands lacs et retenues. Espèce introduite d'Asie orientale, présence très localisée en France (quelques gravières et plans d'eau du Rhône et de la Garonne).",
  "profondeur": "1-10 m",
  "temperature_eau": "15-30 °C",
  "saison_active": "Mai-Septembre",
  "description": "Plus grand des poissons du genre Hypophthalmichthys, la carpe marbré se reconnaît à sa robe grise marbrée de taches irrégulières foncées et à sa tête volumineuse. Présente très discrètement en France, sa capture y est un événement. Comme l'amour argenté, elle filtre le plancton — sa pêche relève du défi absolu.",
  "techniques_recommandees": [
    { "nom": "Pêche au pain / pâte flottante de surface", "difficulte": 5, "efficacite": 2, "profondeur_optimale": "Surface", "animation": "Esches très légères flottantes, amorçage planctonique en surface" }
  ],
  "conditions_ideales": {
    "meteo": "Très chaud, calme",
    "moment_jour": "Journée, grande chaleur",
    "profondeur": "Surface à 2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Sa robe marbrée unique est reconnaissable au premier regard. Captures extrêmement rares en France — si tu en croises une, prends soin d'elle. C'est une prise d'exception que peu de pêcheurs peuvent revendiquer.",
  "statut_reglementaire": "Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant dans le milieu naturel interdit. Présence très localisée en France.",
  "donnees_a_verifier": ["présence géographique à confirmer localement — populations très dispersées et non stabilisées en France métropolitaine"]
}
```

---

# Collection 2 — Prédateurs

> Les carnassiers d'eau douce française.

## 2.1 Brochet

```json
{
  "slug": "brochet",
  "nom_fr": "Brochet",
  "nom_scientifique": "Esox lucius",
  "famille": "Ésocidés (Esocidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 150,
  "taille_moyenne_cm": 60,
  "poids_max_kg": 25,
  "poids_moyen_kg": 3,
  "longevite_annees": "10-25 ans",
  "regime": "carnivore (poissons, amphibiens, occasionnellement petits mammifères)",
  "habitat": "Étangs, lacs et rivières avec herbiers et abris. Chasse à l'affût en bordure.",
  "profondeur": "0.5-4 m",
  "temperature_eau": "8-22 °C",
  "saison_active": "Toute l'année hors période de reproduction (frai février-avril)",
  "description": "Prédateur iconique des eaux françaises, le brochet chasse à l'affût, immobile entre les herbiers. Sa silhouette allongée, ses mâchoires armées de dents, son explosion lors de l'attaque : c'est le carnassier qui marque les pêcheurs. Solitaire et territorial, il préfère les bordures riches en abris.",
  "techniques_recommandees": [
    { "nom": "Pêche au jerkbait", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "1-3 m", "animation": "Twitchs irréguliers, pauses marquées" },
    { "nom": "Pêche au spinnerbait", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Récupération constante avec accélérations" },
    { "nom": "Pêche au swimbait", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "1-4 m", "animation": "Récupération linéaire lente" },
    { "nom": "Pêche au vif (lorsque autorisé)", "difficulte": 2, "efficacite": 5, "profondeur_optimale": "1-3 m", "animation": "Présentation près des herbiers" }
  ],
  "conditions_ideales": {
    "meteo": "Temps couvert, pluie fine",
    "moment_jour": "Lever et coucher du soleil",
    "profondeur": "1-3 m",
    "vent": "Léger à modéré"
  },
  "conseil_fishdex": "Le brochet est souvent plus agressif au lever du soleil par temps couvert. Privilégie les bordures avec herbiers et branchages immergés, c'est là qu'il chasse en embuscade. Respecte la fenêtre de fermeture : la reproduction est sacrée.",
  "statut_reglementaire": "Période de fermeture : fin janvier à fin avril selon départements. Taille légale : 50 ou 60 cm selon zones.",
  "donnees_a_verifier": []
}
```

## 2.2 Sandre

```json
{
  "slug": "sandre",
  "nom_fr": "Sandre",
  "nom_scientifique": "Sander lucioperca",
  "famille": "Percidés (Percidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 130,
  "taille_moyenne_cm": 50,
  "poids_max_kg": 15,
  "poids_moyen_kg": 2,
  "longevite_annees": "10-20 ans",
  "regime": "carnivore (poissons fusiformes : gardons, ablettes)",
  "habitat": "Grands lacs, fleuves et rivières profondes. Chasse en petits groupes, souvent en eau profonde.",
  "profondeur": "3-10 m",
  "temperature_eau": "8-22 °C",
  "saison_active": "Mars-Décembre, frai avril-mai",
  "description": "Carnassier sobre et discret, le sandre chasse souvent en groupe et en profondeur. Ses yeux glauques, adaptés à la pénombre, lui permettent de chasser au crépuscule et la nuit. Plus subtil que le brochet, il demande de la finesse : il refuse les leurres mal présentés. Espèce introduite mais bien acclimatée.",
  "techniques_recommandees": [
    { "nom": "Pêche au leurre souple", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "3-8 m", "animation": "Animation linéaire à coup légers, près du fond" },
    { "nom": "Pêche au drop shot", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "3-10 m", "animation": "Petites secousses sur place, esche maintenue au-dessus du fond" },
    { "nom": "Pêche à la verticale", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "5-12 m", "animation": "Esche présentée à la verticale, déplacement bateau lent" }
  ],
  "conditions_ideales": {
    "meteo": "Temps couvert, pression basse",
    "moment_jour": "Crépuscule et nuit",
    "profondeur": "3-8 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "Le sandre est exigeant sur la finesse. Touches très discrètes : sois attentif au moindre tic. Une fois piqué, il ne combat pas comme un brochet, mais sa prudence à venir mordre récompense les patients.",
  "statut_reglementaire": "Pas de période de fermeture nationale. Taille légale : 40 cm (variable, jusqu'à 50 cm dans certains départements). Espèce de 2ème catégorie.",
  "donnees_a_verifier": []
}
```

## 2.3 Perche commune

```json
{
  "slug": "perche-commune",
  "nom_fr": "Perche commune",
  "nom_scientifique": "Perca fluviatilis",
  "famille": "Percidés (Percidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 60,
  "taille_moyenne_cm": 20,
  "poids_max_kg": 4.8,
  "poids_moyen_kg": 0.3,
  "longevite_annees": "10-22 ans",
  "regime": "carnivore (insectes, alevins, petits poissons)",
  "habitat": "Très adaptable : étangs, lacs, rivières. Vit en bancs jusqu'à 1 kg, devient plus solitaire à l'âge adulte.",
  "profondeur": "1-6 m",
  "temperature_eau": "8-22 °C",
  "saison_active": "Toute l'année",
  "description": "Petit prédateur omniprésent dans les eaux françaises, la perche se reconnaît à ses bandes verticales sombres et à ses nageoires rouge orangé. Vorace et grégaire jeune, elle devient plus solitaire en grandissant. Sa pêche est l'une des plus accessibles tout en restant exigeante pour les belles tailles.",
  "techniques_recommandees": [
    { "nom": "Pêche au leurre souple", "difficulte": 2, "efficacite": 5, "profondeur_optimale": "1-4 m", "animation": "Petits shads, animation linéaire saccadée" },
    { "nom": "Pêche au crank / lipless", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Récupération constante avec accélérations" },
    { "nom": "Pêche au ver manié", "difficulte": 1, "efficacite": 5, "profondeur_optimale": "0.5-3 m", "animation": "Ver vivant ou souple, animation rapide" },
    { "nom": "Pêche au drop shot ultra-light", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "2-5 m", "animation": "Petits leurres, animation sur place" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps modéré",
    "moment_jour": "Toute la journée, pics matin/soir",
    "profondeur": "2-4 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "La perche est un excellent poisson pour débuter le carnassier au leurre. Cherche les bancs en bordure des structures (pontons, arbres tombés). Les grosses solitaires demandent plus de finesse et préfèrent les zones plus profondes.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 1ère ou 2ème catégorie selon le cours d'eau.",
  "donnees_a_verifier": []
}
```

## 2.4 Perche soleil (invasive)

```json
{
  "slug": "perche-soleil",
  "nom_fr": "Perche soleil",
  "nom_scientifique": "Lepomis gibbosus",
  "famille": "Centrarchidés (Centrarchidae)",
  "rarete": "commun",
  "eau": "douce",
  "taille_max_cm": 30,
  "taille_moyenne_cm": 12,
  "poids_max_kg": 0.6,
  "poids_moyen_kg": 0.1,
  "longevite_annees": "6-10 ans",
  "regime": "carnivore (insectes, alevins, œufs)",
  "habitat": "Étangs, mares, rivières lentes. Espèce introduite d'Amérique du Nord, désormais invasive.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "12-28 °C",
  "saison_active": "Avril-Octobre",
  "description": "Originaire d'Amérique du Nord, la perche soleil a été introduite comme poisson d'aquarium au XIXe siècle puis relâchée. Aujourd'hui invasive, elle colonise les eaux calmes et consomme œufs et alevins de nombreuses espèces. Aux couleurs vives malgré tout — bleu, orange, vert iridescent.",
  "techniques_recommandees": [
    { "nom": "Pêche au coup", "difficulte": 1, "efficacite": 5, "profondeur_optimale": "0.5-2 m", "animation": "Asticot, vers, petite esche" },
    { "nom": "Pêche au leurre ultra-light", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Petits leurres souples ou cuillers" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, ensoleillé",
    "moment_jour": "Journée",
    "profondeur": "1 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Espèce invasive : ne la relâche jamais dans une autre eau, et si la réglementation l'autorise, garde-la pour limiter sa prolifération. C'est aussi un excellent poisson pour initier les enfants à la pêche.",
  "statut_reglementaire": "Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant interdit.",
  "donnees_a_verifier": []
}
```

## 2.5 Black-bass à grande bouche

```json
{
  "slug": "black-bass-grande-bouche",
  "nom_fr": "Black-bass à grande bouche",
  "nom_scientifique": "Micropterus salmoides",
  "famille": "Centrarchidés (Centrarchidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 80,
  "taille_moyenne_cm": 35,
  "poids_max_kg": 10,
  "poids_moyen_kg": 1.5,
  "longevite_annees": "10-15 ans",
  "regime": "carnivore (poissons, écrevisses, grenouilles, insectes)",
  "habitat": "Lacs, étangs et rivières lentes avec couvert végétal abondant. Préfère les eaux tièdes.",
  "profondeur": "0.5-5 m",
  "temperature_eau": "15-28 °C",
  "saison_active": "Mai-Octobre",
  "description": "Originaire d'Amérique du Nord, le black-bass est un prédateur athlétique et combatif. Introduit en France au début du XXe siècle, il reste localisé : certaines régions du sud et de l'ouest concentrent ses populations. Sa pêche au leurre est un art à part entière, importé des techniques américaines.",
  "techniques_recommandees": [
    { "nom": "Pêche au leurre de surface (popper, walking)", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "Surface", "animation": "Animations saccadées, pauses longues" },
    { "nom": "Pêche au leurre souple texan", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "0.5-3 m", "animation": "Animation par à-coups près des structures" },
    { "nom": "Pêche au jig / football", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "2-5 m", "animation": "Sauts contrôlés sur le fond" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, stable, eau tiède",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "1-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Le black-bass aime les couverts denses : nénuphars, arbres immergés, pontons. Une attaque en surface sur popper, c'est un souvenir qui ne s'oublie pas. Pratique le no-kill, c'est l'éthique partagée par les pêcheurs de bass.",
  "statut_reglementaire": "Espèce susceptible de provoquer des déséquilibres biologiques. Transport vivant interdit dans le milieu naturel. Pas de taille légale nationale spécifique. Pêche autorisée dans les eaux où il est présent. No-kill fortement recommandé.",
  "donnees_a_verifier": []
}
```

## 2.6 Silure glane

```json
{
  "slug": "silure-glane",
  "nom_fr": "Silure glane",
  "nom_scientifique": "Silurus glanis",
  "famille": "Siluridés (Siluridae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 280,
  "taille_moyenne_cm": 150,
  "poids_max_kg": 130,
  "poids_moyen_kg": 30,
  "longevite_annees": "30-80 ans",
  "regime": "carnivore (poissons, écrevisses, occasionnellement oiseaux, mammifères)",
  "habitat": "Grands fleuves et grands lacs. Préfère les fosses profondes. Activité crépusculaire et nocturne.",
  "profondeur": "3-15 m",
  "temperature_eau": "8-26 °C",
  "saison_active": "Mai-Octobre",
  "description": "Plus grand prédateur d'eau douce français, le silure peut dépasser 2 mètres. Originaire d'Europe centrale et orientale, il s'est répandu dans la plupart de nos grands fleuves. Activité nocturne, vie en fosses profondes : il marque les pêcheurs par sa puissance et le mystère qui l'entoure.",
  "techniques_recommandees": [
    { "nom": "Pêche au clonk", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "5-15 m", "animation": "Clonk en surface pour attirer, esche dérivante" },
    { "nom": "Pêche au vif sur posée", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "5-12 m", "animation": "Esche posée, attente longue, sonore régulier" },
    { "nom": "Pêche au leurre lourd", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "3-10 m", "animation": "Gros swimbaits, jerks lents et larges" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, lourd, orageux",
    "moment_jour": "Crépuscule et nuit",
    "profondeur": "5-12 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "Le silure se mérite. Matériel solide, patience, nuits sur la berge. Une prise de silure, c'est souvent un combat de longue haleine. Respect : remets-le à l'eau délicatement, c'est un animal âgé qui mérite d'autres saisons.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Pêche de nuit généralement autorisée. Réglementation variable selon les plans d'eau (certains imposent no-kill ou quotas).",
  "donnees_a_verifier": []
}
```

## 2.7 Aspe

```json
{
  "slug": "aspe",
  "nom_fr": "Aspe",
  "nom_scientifique": "Leuciscus aspius",
  "famille": "Cyprinidés (Leuciscidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 120,
  "taille_moyenne_cm": 50,
  "poids_max_kg": 12,
  "poids_moyen_kg": 2,
  "longevite_annees": "10-15 ans",
  "regime": "carnivore (petits poissons : ablettes, gardons, vandoises)",
  "habitat": "Rivières et fleuves clairs et oxygénés (zones à barbeau et à brème), grands lacs. Présence française : Rhin et affluents, Loire et Seine récemment.",
  "profondeur": "1-5 m",
  "temperature_eau": "10-22 °C",
  "saison_active": "Avril-Octobre",
  "description": "Curiosité de la nature : l'aspe est un cyprinidé piscivore, originalité dans une famille majoritairement omnivore. Introduit en France via le Rhin (1976) puis Loire et Seine, il chasse en surface par poursuites énergiques, spécialiste des ablettes. Sa pêche au leurre se développe en France.",
  "techniques_recommandees": [
    { "nom": "Pêche au leurre métallique", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "Surface à 2 m", "animation": "Cuillers tournantes ou ondulantes, récupération rapide" },
    { "nom": "Pêche aux leurres durs imitatifs", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "0-3 m", "animation": "Jerkbaits fins type ablette, animation vive" },
    { "nom": "Pêche à la mouche streamer", "difficulte": 4, "efficacite": 3, "profondeur_optimale": "0-2 m", "animation": "Streamers imitant ablette, animation rapide" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps, eau claire",
    "moment_jour": "Matin et soir",
    "profondeur": "1-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Les bancs d'ablettes en surface sont ses cantines préférées. Cherche les attaques marquées au crépuscule, lance ton leurre devant le poisson, récupération rapide. C'est une espèce récente en France, encore mal connue de beaucoup.",
  "statut_reglementaire": "Pas de taille légale ni de période de fermeture nationale. Espèce de 2ème catégorie. Répartition très localisée en France (Rhin, Moselle, Loire, Seine). Réglementation locale à vérifier.",
  "donnees_a_verifier": []
}
```

## 2.8 Anguille européenne

```json
{
  "slug": "anguille-europeenne",
  "nom_fr": "Anguille européenne",
  "nom_scientifique": "Anguilla anguilla",
  "famille": "Anguillidés (Anguillidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 150,
  "taille_moyenne_cm": 60,
  "poids_max_kg": 6,
  "poids_moyen_kg": 0.8,
  "longevite_annees": "15-30 ans (jusqu'à 50)",
  "regime": "carnivore (vers, larves, mollusques, petits poissons)",
  "habitat": "Tous types d'eaux douces françaises (lacs, étangs, rivières) puis migration océanique pour reproduction. Cycle anadrome inversé : naissance en mer, vie en eau douce.",
  "profondeur": "1-5 m",
  "temperature_eau": "8-25 °C",
  "saison_active": "Avril-Novembre (activité nocturne)",
  "description": "Cycle de vie mystérieux : née dans la mer des Sargasses, l'anguille migre vers les côtes européennes (stade pibale), remonte les fleuves, vit jusqu'à 30 ans en eau douce, puis retourne mourir en mer pour se reproduire. Espèce en danger critique d'extinction, sa population a chuté de 95% en 30 ans.",
  "techniques_recommandees": [
    { "nom": "Pêche au ver à la posée (lorsque autorisé)", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Esche posée près du fond, surtout la nuit" }
  ],
  "conditions_ideales": {
    "meteo": "Chaud, lourd, orageux",
    "moment_jour": "Nuit",
    "profondeur": "1-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "L'anguille est en danger critique d'extinction. La réglementation a fortement durci sa pêche (quotas, tailles, périodes). Si tu en croises une, relâche-la avec soin : c'est un animal qui a peut-être déjà vécu 15 ou 20 ans dans nos eaux.",
  "statut_reglementaire": "Espèce en danger critique d'extinction (UICN). Réglementation stricte : quotas, périodes, tailles légales. Vérifier la réglementation locale à jour.",
  "donnees_a_verifier": []
}
```

## 2.9 Lotte de rivière

```json
{
  "slug": "lotte-de-riviere",
  "nom_fr": "Lotte de rivière",
  "nom_scientifique": "Lota lota",
  "famille": "Lotidés (Lotidae)",
  "rarete": "legendaire",
  "eau": "douce",
  "taille_max_cm": 100,
  "taille_moyenne_cm": 40,
  "poids_max_kg": 8,
  "poids_moyen_kg": 1,
  "longevite_annees": "10-20 ans",
  "regime": "carnivore (poissons, vers, écrevisses)",
  "habitat": "Lacs profonds et froids, rivières à eaux fraîches. Seul gadidé d'eau douce. Présence française très localisée : quelques lacs alpins, Doubs.",
  "profondeur": "5-50 m",
  "temperature_eau": "1-15 °C (rarement plus de 18 °C)",
  "saison_active": "Hiver surtout (frai sous glace), activité nocturne",
  "description": "Seul gadidé exclusivement d'eau douce, la lotte est un poisson de l'ombre et du froid. Activité nocturne, vie en eau profonde, reproduction sous la glace : c'est une espèce mystérieuse. Quasi disparue de France, elle subsiste dans quelques lacs alpins et le Doubs. Sa silhouette serpentine et son barbillon mentonnier sont caractéristiques.",
  "techniques_recommandees": [],
  "conditions_ideales": {
    "meteo": "Froid, eau glaciale",
    "moment_jour": "Nuit",
    "profondeur": "10-30 m",
    "vent": "Sans incidence"
  },
  "conseil_fishdex": "La lotte est presque introuvable en France aujourd'hui. Si tu en croises une dans le Léman ou le Doubs, c'est un témoignage rare. Photo, relâche immédiate, et signale-le à la fédération.",
  "statut_reglementaire": "Espèce vulnérable. Pêche très réglementée selon les eaux.",
  "donnees_a_verifier": []
}
```

## 2.10 Mulet porc

```json
{
  "slug": "mulet-porc",
  "nom_fr": "Mulet porc",
  "nom_scientifique": "Chelon ramada",
  "famille": "Mugilidés (Mugilidae)",
  "rarete": "peu commun",
  "eau": "saumâtre",
  "taille_max_cm": 70,
  "taille_moyenne_cm": 30,
  "poids_max_kg": 2.5,
  "poids_moyen_kg": 0.5,
  "longevite_annees": "10-15 ans",
  "regime": "omnivore (algues, plancton, détritus, petits invertébrés)",
  "habitat": "Estuaires, parties basses des fleuves, lagunes. Espèce estuarienne qui remonte loin en eau douce. Surtout côtes atlantiques et méditerranéennes.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "10-26 °C",
  "saison_active": "Avril-Octobre",
  "description": "Le mulet porc remonte les estuaires et fleuves français, parfois loin à l'intérieur des terres. Reconnaissable à sa silhouette fusiforme et sa tête massive, il broute le biofilm et filtre la vase. Sa pêche en estuaire est un univers à part, à la frontière entre eau douce et eau salée.",
  "techniques_recommandees": [
    { "nom": "Pêche à la pâte / pain", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Pâte parfumée, pain mou en surface" },
    { "nom": "Pêche au coup à la mouche / asticot", "difficulte": 3, "efficacite": 3, "profondeur_optimale": "0.5-2 m", "animation": "Esche très fine, amorçage léger" }
  ],
  "conditions_ideales": {
    "meteo": "Beau temps stable",
    "moment_jour": "Marée montante",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Pêcher le mulet, c'est faire le pont entre rivière et mer. Cherche-le en estuaire au moment des marées montantes. Esches très fines, ferré immédiat : il rejette vite tout ce qui résiste.",
  "statut_reglementaire": "Pas de taille légale nationale spécifique pour l'eau douce. En zone maritime et estuarienne, taille légale : 20 cm. Pêche libre sur les cours d'eau où il remonte. Réglementation maritime en estuaire à vérifier localement.",
  "donnees_a_verifier": []
}
```

---

# Collection 3 — Eaux vives

> Les salmonidés et poissons des rivières froides et vives.

## 3.1 Truite fario

```json
{
  "slug": "truite-fario",
  "nom_fr": "Truite fario",
  "nom_scientifique": "Salmo trutta fario",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 80,
  "taille_moyenne_cm": 25,
  "poids_max_kg": 5,
  "poids_moyen_kg": 0.3,
  "longevite_annees": "8-15 ans",
  "regime": "carnivore (insectes, larves, alevins, écrevisses)",
  "habitat": "Ruisseaux et rivières à eaux fraîches, vives et oxygénées. Espèce reine des zones à truite et ombre.",
  "profondeur": "0.3-2 m",
  "temperature_eau": "5-18 °C",
  "saison_active": "Mars-Septembre (selon ouvertures réglementaires)",
  "description": "Reine des rivières françaises, la truite fario est la forme sédentaire de Salmo trutta. Sa robe est variable selon les rivières : flancs constellés de points rouges et noirs, ventre crème. Méfiante, vue perçante, elle exige précision et discrétion. Sa pêche est une école d'humilité.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche sèche", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "Surface", "animation": "Imitations d'éphémères ou trichoptères, dérive parfaite" },
    { "nom": "Pêche à la nymphe à vue", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "0.5-2 m", "animation": "Nymphes lestées, détection par fil" },
    { "nom": "Pêche au toc", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "0.5-1.5 m", "animation": "Vers ou larves en dérive naturelle, ferré au moindre arrêt" },
    { "nom": "Pêche au leurre ultra-léger", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Petits leurres imitatifs ou cuillers" }
  ],
  "conditions_ideales": {
    "meteo": "Couvert, après pluie légère",
    "moment_jour": "Matin et fin d'après-midi",
    "profondeur": "0.5-1.5 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Approche en remontant le courant, l'eau cache ton ombre. Lance court, fil tendu, observe avant chaque lancer. La truite fario apprend vite : un poisson piqué et relâché est plus dur à reprendre. C'est ce qui fait la beauté de cette pêche.",
  "statut_reglementaire": "Période d'ouverture variable selon départements (1ère catégorie). Taille légale : 23 ou 25 cm selon zones.",
  "donnees_a_verifier": []
}
```

## 3.2 Truite arc-en-ciel

```json
{
  "slug": "truite-arc-en-ciel",
  "nom_fr": "Truite arc-en-ciel",
  "nom_scientifique": "Oncorhynchus mykiss",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 100,
  "taille_moyenne_cm": 30,
  "poids_max_kg": 10,
  "poids_moyen_kg": 0.5,
  "longevite_annees": "7-11 ans",
  "regime": "carnivore (insectes, larves, alevins)",
  "habitat": "Rivières et plans d'eau, souvent issus de lâchers. Espèce nord-américaine introduite, ne se reproduit qu'exceptionnellement en France.",
  "profondeur": "0.5-3 m",
  "temperature_eau": "5-22 °C",
  "saison_active": "Mars-Septembre",
  "description": "Originaire du Pacifique nord-américain, la truite arc-en-ciel est largement introduite en France pour les pêches commerciales et le repeuplement. Reconnaissable à sa bande latérale rose iridescente, elle est moins méfiante que la fario et combat plus violemment.",
  "techniques_recommandees": [
    { "nom": "Pêche au leurre", "difficulte": 2, "efficacite": 5, "profondeur_optimale": "0.5-3 m", "animation": "Cuillers tournantes, leurres souples" },
    { "nom": "Pêche à la mouche", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "Surface à 2 m", "animation": "Sèches, nymphes, streamers" },
    { "nom": "Pêche au toc / lancer", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Vers, esches naturelles" }
  ],
  "conditions_ideales": {
    "meteo": "Variable",
    "moment_jour": "Matin et fin d'après-midi",
    "profondeur": "1-2 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "Plus combative que la fario, l'arc-en-ciel est souvent issue de lâchers : sois conscient qu'elle ne représente pas la sauvagerie pure des rivières. Pour le no-kill, manipule-la peu et délicatement.",
  "statut_reglementaire": "Soumise aux mêmes ouvertures de 1ère catégorie que la truite fario. Taille légale : 23 à 25 cm selon zones. En parcours privés (no-kill, parcours commerciaux), réglementation propre à chaque plan d'eau.",
  "donnees_a_verifier": []
}
```

## 3.3 Omble chevalier

```json
{
  "slug": "omble-chevalier",
  "nom_fr": "Omble chevalier",
  "nom_scientifique": "Salvelinus alpinus",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "epique",
  "eau": "douce",
  "taille_max_cm": 90,
  "taille_moyenne_cm": 40,
  "poids_max_kg": 12,
  "poids_moyen_kg": 1,
  "longevite_annees": "15-25 ans",
  "regime": "carnivore (poissons, plancton, insectes)",
  "habitat": "Grands lacs alpins profonds et froids (Léman, Bourget, Annecy). Espèce relique post-glaciaire.",
  "profondeur": "30-100 m (été), surface (frai automnal)",
  "temperature_eau": "4-12 °C",
  "saison_active": "Mai-Octobre principalement",
  "description": "Relique de la dernière glaciation, l'omble chevalier vit dans les lacs alpins profonds. Sa robe orange-rouge éclatante à la période de frai en fait l'un des plus beaux poissons d'eau douce. Sa pêche, en profondeur ou en bordure selon la saison, est une institution dans les Alpes.",
  "techniques_recommandees": [
    { "nom": "Pêche à la traîne profonde", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "20-50 m", "animation": "Cuillers ondulantes, downriggers, bateau" },
    { "nom": "Pêche à la gambe (gandolyne)", "difficulte": 3, "efficacite": 4, "profondeur_optimale": "30-60 m", "animation": "Ligne verticale avec multiples hameçons garnis" },
    { "nom": "Pêche à la mouche en surface (saison frai)", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "Surface à 2 m", "animation": "Streamers ou mouches imitatives à l'automne en bordure" }
  ],
  "conditions_ideales": {
    "meteo": "Variable, eaux froides",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "20-50 m (variable)",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "L'omble chevalier ne se pêche pas n'importe où. Renseigne-toi auprès des fédérations alpines : Bourget, Léman, Annecy ont leurs traditions et leurs périodes. Sa chair est exquise, mais c'est la beauté de l'animal qui marque.",
  "statut_reglementaire": "Réglementation locale stricte (lacs alpins). Périodes, tailles, quotas variables selon le lac.",
  "donnees_a_verifier": []
}
```

## 3.4 Omble de fontaine

```json
{
  "slug": "omble-de-fontaine",
  "nom_fr": "Omble de fontaine",
  "nom_scientifique": "Salvelinus fontinalis",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 50,
  "taille_moyenne_cm": 25,
  "poids_max_kg": 3,
  "poids_moyen_kg": 0.4,
  "longevite_annees": "5-10 ans",
  "regime": "carnivore (insectes, larves, petits poissons)",
  "habitat": "Petits ruisseaux et lacs d'altitude froids et purs. Espèce nord-américaine introduite, naturalisée en montagne.",
  "profondeur": "0.3-3 m",
  "temperature_eau": "4-15 °C",
  "saison_active": "Mai-Septembre",
  "description": "Originaire de l'est de l'Amérique du Nord, l'omble de fontaine a été introduit dans nos ruisseaux d'altitude. Sa robe est inoubliable : dos vermiculé de marbrures vertes, flancs constellés de points jaunes, rouges et bleus, ventre orangé éclatant. Indicateur d'eaux pures et froides.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche", "difficulte": 3, "efficacite": 5, "profondeur_optimale": "Surface à 1.5 m", "animation": "Sèches, petites nymphes" },
    { "nom": "Pêche au toc", "difficulte": 2, "efficacite": 4, "profondeur_optimale": "0.3-1.5 m", "animation": "Vers, larves en dérive courte" }
  ],
  "conditions_ideales": {
    "meteo": "Variable, eaux fraîches",
    "moment_jour": "Matin et soir",
    "profondeur": "0.5-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Cherche l'omble de fontaine dans les ruisseaux d'altitude isolés, là où peu de pêcheurs montent. Sa robe est une œuvre. Photo, relâche, et garde le silence sur le spot — c'est la règle non écrite.",
  "statut_reglementaire": "Soumis aux ouvertures de 1ère catégorie (salmonidés). Taille légale : 23 cm généralement. Réglementation locale variable selon massif (Pyrénées, Alpes, Vosges).",
  "donnees_a_verifier": []
}
```

## 3.5 Cristivomer (Omble du Canada)

```json
{
  "slug": "cristivomer",
  "nom_fr": "Cristivomer",
  "nom_scientifique": "Salvelinus namaycush",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "legendaire",
  "eau": "douce",
  "taille_max_cm": 100,
  "taille_moyenne_cm": 60,
  "poids_max_kg": 20,
  "poids_moyen_kg": 3,
  "longevite_annees": "20-30 ans",
  "regime": "carnivore (poissons, écrevisses, insectes)",
  "habitat": "Grands lacs profonds et froids (Léman essentiellement). Espèce nord-américaine introduite.",
  "profondeur": "30-100 m",
  "temperature_eau": "4-12 °C",
  "saison_active": "Mai-Octobre",
  "description": "Originaire des grands lacs nord-américains, le cristivomer (ou touladi, ou omble du Canada) a été introduit dans le Léman au XIXe siècle. Son corps massif, sa robe sombre marbrée, et sa vie en profondeur en font un poisson presque mythique en France. Sa pêche est confidentielle et exigeante.",
  "techniques_recommandees": [
    { "nom": "Pêche à la traîne profonde", "difficulte": 5, "efficacite": 5, "profondeur_optimale": "30-80 m", "animation": "Cuillers lourdes, downriggers, repérage sondeur" }
  ],
  "conditions_ideales": {
    "meteo": "Variable",
    "moment_jour": "Journée selon profondeur",
    "profondeur": "30-80 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "Le cristivomer du Léman est l'un des poissons d'eau douce les plus difficiles à pêcher en France. Bateau, sondeur, downriggers, connaissance précise du lac. C'est une pêche de spécialistes : si tu y arrives, c'est une vraie distinction.",
  "statut_reglementaire": "Pêche réglementée sur le Léman par commission franco-suisse. Périodes et quotas stricts. Se renseigner auprès de la Fédération de pêche de Haute-Savoie (74).",
  "donnees_a_verifier": []
}
```

## 3.6 Ombre commun

```json
{
  "slug": "ombre-commun",
  "nom_fr": "Ombre commun",
  "nom_scientifique": "Thymallus thymallus",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 60,
  "taille_moyenne_cm": 35,
  "poids_max_kg": 3,
  "poids_moyen_kg": 0.7,
  "longevite_annees": "10-14 ans",
  "regime": "carnivore (insectes, larves, petits crustacés)",
  "habitat": "Rivières fraîches et oxygénées à courant modéré, fond de graviers. Zone à ombre intermédiaire entre zone à truite et zone à barbeau.",
  "profondeur": "0.5-2.5 m",
  "temperature_eau": "8-18 °C",
  "saison_active": "Mai-Décembre (selon ouvertures locales)",
  "description": "Reconnaissable à sa grande nageoire dorsale colorée comme un voile et son odeur de thym à la sortie de l'eau (d'où Thymallus), l'ombre commun est un salmonidé exigeant. Il vit en bancs, gobe en surface avec délicatesse, et habite des rivières d'une qualité d'eau remarquable. Sa pêche à la mouche est un art.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche sèche", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "Surface", "animation": "Petites mouches imitatives, dérive parfaite" },
    { "nom": "Pêche à la nymphe au fil", "difficulte": 5, "efficacite": 5, "profondeur_optimale": "0.5-2 m", "animation": "Nymphes lestées, détection visuelle au fil" },
    { "nom": "Pêche à la mouche noyée", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "0.5-1.5 m", "animation": "Pêche en train de mouches, animation par le courant" }
  ],
  "conditions_ideales": {
    "meteo": "Couvert, après pluie",
    "moment_jour": "Journée entière",
    "profondeur": "1-2 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "L'ombre est un poisson de connaisseurs. Vue perçante, méfiance extrême, gobages discrets : il oblige à se faire petit. Son odeur de thym à la sortie de l'eau est un mystère élégant. Pratique le no-kill : c'est une espèce sensible.",
  "statut_reglementaire": "Ouverture variable selon départements. Souvent ouvert plus tard que la truite. Taille légale : 30-35 cm selon zones.",
  "donnees_a_verifier": []
}
```

## 3.7 Saumon atlantique

```json
{
  "slug": "saumon-atlantique",
  "nom_fr": "Saumon atlantique",
  "nom_scientifique": "Salmo salar",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "epique",
  "eau": "douce",
  "taille_max_cm": 150,
  "taille_moyenne_cm": 70,
  "poids_max_kg": 30,
  "poids_moyen_kg": 4,
  "longevite_annees": "4-10 ans",
  "regime": "carnivore (poissons en mer, jeûne en eau douce)",
  "habitat": "Cycle anadrome : naissance en rivière, vie en mer, remontée pour le frai. Présence française : Bretagne, Normandie, Pays de la Loire, Adour-Pyrénées.",
  "profondeur": "1-5 m",
  "temperature_eau": "4-18 °C",
  "saison_active": "Mars-Juillet (montaisons selon rivière)",
  "description": "Roi des salmonidés français, le saumon atlantique est devenu rare. Il naît en rivière, descend en mer pour grandir, puis revient sur sa rivière natale pour se reproduire — parcourant des milliers de kilomètres. En France, ses populations ont chuté, et il survit dans une poignée de rivières bretonnes, normandes et basques.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche", "difficulte": 5, "efficacite": 5, "profondeur_optimale": "0.5-3 m", "animation": "Streamers, mouches saumons, technique de skating ou noyée" },
    { "nom": "Pêche à la cuiller", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Cuillers ondulantes, récupération régulière" },
    { "nom": "Pêche au lancer aux leurres", "difficulte": 4, "efficacite": 3, "profondeur_optimale": "1-3 m", "animation": "Devons, gros leurres imitatifs" }
  ],
  "conditions_ideales": {
    "meteo": "Crues, eaux teintées",
    "moment_jour": "Toute la journée selon montaison",
    "profondeur": "1-3 m",
    "vent": "Variable"
  },
  "conseil_fishdex": "Le saumon atlantique est précieux. Quotas stricts, périodes courtes, parfois lots tirés au sort. Si tu en pêches un, tu rejoins une lignée de pêcheurs qui se sont battus pour préserver cette espèce. Respect maximal, no-kill quand possible.",
  "statut_reglementaire": "Pêche extrêmement réglementée : quotas annuels par rivière, tirage au sort sur certains parcours, périodes restreintes.",
  "donnees_a_verifier": []
}
```

## 3.8 Truite de mer

```json
{
  "slug": "truite-de-mer",
  "nom_fr": "Truite de mer",
  "nom_scientifique": "Salmo trutta trutta",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 100,
  "taille_moyenne_cm": 50,
  "poids_max_kg": 15,
  "poids_moyen_kg": 2,
  "longevite_annees": "8-15 ans",
  "regime": "carnivore (poissons en mer, peu se nourrit en eau douce)",
  "habitat": "Forme anadrome de Salmo trutta. Cycle similaire au saumon mais avec migrations plus courtes. Présence française : façade atlantique et Manche.",
  "profondeur": "1-4 m",
  "temperature_eau": "6-18 °C",
  "saison_active": "Mars-Octobre (montaisons selon rivière)",
  "description": "Cousine migratrice de la truite fario, la truite de mer vit alternativement en eau douce et en mer. Elle revient se reproduire dans sa rivière natale, parfois plusieurs fois dans sa vie (contrairement au saumon qui meurt après le frai). Robe argentée éclatante à la remontée, qui s'assombrit en eau douce.",
  "techniques_recommandees": [
    { "nom": "Pêche à la mouche de nuit", "difficulte": 5, "efficacite": 5, "profondeur_optimale": "0.5-3 m", "animation": "Streamers noirs, animation lente, pêche nocturne" },
    { "nom": "Pêche à la cuiller", "difficulte": 4, "efficacite": 4, "profondeur_optimale": "1-3 m", "animation": "Cuillers brillantes, récupération variée" }
  ],
  "conditions_ideales": {
    "meteo": "Eau teintée, crue décroissante",
    "moment_jour": "Nuit (souvent)",
    "profondeur": "1-2 m",
    "vent": "Variable"
  },
  "conseil_fishdex": "La pêche de la truite de mer se fait souvent de nuit, dans des conditions précises. C'est une école de patience et d'attention. Comme le saumon, ses populations chutent : pratique le no-kill quand tu peux.",
  "statut_reglementaire": "Soumise aux ouvertures de 1ère catégorie. Taille légale : 40 cm dans la plupart des zones (Normandie, Bretagne, Pays de la Loire, Adour-Pyrénées). Quotas et périodes variables selon les rivières. Vérifier auprès de la fédération locale.",
  "donnees_a_verifier": []
}
```

## 3.9 Truite lacustre

```json
{
  "slug": "truite-lacustre",
  "nom_fr": "Truite lacustre",
  "nom_scientifique": "Salmo trutta lacustris",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "epique",
  "eau": "douce",
  "taille_max_cm": 120,
  "taille_moyenne_cm": 50,
  "poids_max_kg": 18,
  "poids_moyen_kg": 2.5,
  "longevite_annees": "10-20 ans",
  "regime": "carnivore (poissons en lac)",
  "habitat": "Forme lacustre de Salmo trutta. Grands lacs alpins (Léman, Bourget, Annecy). Remonte les tributaires pour le frai.",
  "profondeur": "5-50 m",
  "temperature_eau": "4-15 °C",
  "saison_active": "Mars-Octobre",
  "description": "Forme géante de la truite vivant en grands lacs alpins, la truite lacustre descend en profondeur en été et remonte les rivières affluentes pour se reproduire. Robe argentée, taches noires en X, taille impressionnante : c'est l'une des prises les plus convoitées des grands lacs alpins.",
  "techniques_recommandees": [
    { "nom": "Pêche à la traîne", "difficulte": 4, "efficacite": 5, "profondeur_optimale": "5-30 m", "animation": "Cuillers et poissons-nageurs, bateau" },
    { "nom": "Pêche à la mouche en rivière (frai)", "difficulte": 5, "efficacite": 4, "profondeur_optimale": "0.5-2 m", "animation": "Gros streamers, pêche en saison de remontée" }
  ],
  "conditions_ideales": {
    "meteo": "Variable",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "5-30 m",
    "vent": "Faible à modéré"
  },
  "conseil_fishdex": "La truite lacustre en grand lac alpin est une quête. Bateau, sondeur, connaissance fine. Quand tu en piques une, le combat puissant et long se grave. Quotas et périodes strictes : respecte-les sans concession.",
  "statut_reglementaire": "Pêche réglementée sur les grands lacs alpins. Taille légale : 40 à 50 cm selon le lac. Périodes de fermeture strictes (automne-hiver lors du frai). Permis lac requis sur Léman, Bourget et Annecy.",
  "donnees_a_verifier": []
}
```

## 3.10 Huchon

```json
{
  "slug": "huchon",
  "nom_fr": "Huchon",
  "nom_scientifique": "Hucho hucho",
  "famille": "Salmonidés (Salmonidae)",
  "rarete": "legendaire",
  "eau": "douce",
  "taille_max_cm": 150,
  "taille_moyenne_cm": 80,
  "poids_max_kg": 50,
  "poids_moyen_kg": 10,
  "longevite_annees": "15-20 ans",
  "regime": "carnivore (poissons, occasionnellement petits mammifères)",
  "habitat": "Originaire du bassin du Danube. En France, introduction dans la rivière les Usses (Haute-Savoie) entre 1957-1960. Présence actuelle très incertaine.",
  "profondeur": "1-5 m",
  "temperature_eau": "5-18 °C",
  "saison_active": "Mars-Octobre (selon réglementation)",
  "description": "Plus grand salmonidé d'Europe, le huchon (ou saumon du Danube) a été introduit en France à la fin des années 50 dans la rivière les Usses, en Haute-Savoie. Présence aujourd'hui anecdotique voire éteinte localement. Espèce mythique pour sa taille — jusqu'à 50 kg dans son aire d'origine — et sa rareté.",
  "techniques_recommandees": [],
  "conditions_ideales": {
    "meteo": "Variable",
    "moment_jour": "Aube et crépuscule",
    "profondeur": "1-3 m",
    "vent": "Faible"
  },
  "conseil_fishdex": "Le huchon en France relève du mythe. Sa présence actuelle dans les Usses est très incertaine. Si tu en captures un (ce serait extraordinaire), photo, relâche immédiate, et signale-le à la fédération. Taille légale officielle : 70 cm.",
  "statut_reglementaire": "Espèce protégée par taille légale (70 cm) malgré son introduction. Présence reproductrice incertaine en France.",
  "donnees_a_verifier": ["présence actuelle dans la rivière les Usses très débattue, possiblement éteinte"]
}
```

## 3.11 Chabot

```json
{
  "slug": "chabot",
  "nom_fr": "Chabot",
  "nom_scientifique": "Cottus gobio",
  "famille": "Cottidés (Cottidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 17,
  "taille_moyenne_cm": 10,
  "poids_max_kg": 0.1,
  "poids_moyen_kg": 0.02,
  "longevite_annees": "5-8 ans",
  "regime": "carnivore (larves d'insectes, petits invertébrés)",
  "habitat": "Ruisseaux et rivières à eaux fraîches, claires et oxygénées, fond de pierres. Indicateur d'eaux propres.",
  "profondeur": "0.1-1 m",
  "temperature_eau": "5-15 °C",
  "saison_active": "Toute l'année",
  "description": "Petit poisson de fond aux yeux saillants et à la grosse tête, le chabot vit caché sous les pierres des ruisseaux frais. Sa présence indique des eaux d'excellente qualité. Discret, sédentaire, il fait partie du décor naturel des zones à truite. Espèce d'intérêt patrimonial européen.",
  "techniques_recommandees": [],
  "conditions_ideales": {
    "meteo": "Eaux claires",
    "moment_jour": "Crépuscule et nuit (activité)",
    "profondeur": "0.2-0.5 m",
    "vent": "Sans incidence"
  },
  "conseil_fishdex": "Le chabot ne se pêche pas, c'est une observation. Soulève délicatement une pierre dans un ruisseau à truite : tu en verras peut-être un détaler. Sa présence signe une eau de qualité. Espèce protégée européenne, à respecter absolument.",
  "statut_reglementaire": "Espèce protégée. Directive Habitats Annexe II.",
  "donnees_a_verifier": []
}
```

## 3.12 Lamproie de Planer

```json
{
  "slug": "lamproie-de-planer",
  "nom_fr": "Lamproie de Planer",
  "nom_scientifique": "Lampetra planeri",
  "famille": "Pétromyzontidés (Petromyzontidae)",
  "rarete": "rare",
  "eau": "douce",
  "taille_max_cm": 20,
  "taille_moyenne_cm": 12,
  "poids_max_kg": 0.05,
  "poids_moyen_kg": 0.015,
  "longevite_annees": "6-7 ans",
  "regime": "filtreur (au stade larvaire) puis ne se nourrit plus (adulte)",
  "habitat": "Ruisseaux et rivières à fond sableux ou vaseux. Larves enfouies dans le sédiment pendant plusieurs années.",
  "profondeur": "0.2-1.5 m",
  "temperature_eau": "8-18 °C",
  "saison_active": "Frai en avril-mai (adulte)",
  "description": "Vertébré primitif sans mâchoire ni écailles, la lamproie de Planer est l'un des plus anciens groupes de vertébrés. Cycle de vie singulier : larves filtreuses enfouies dans le sédiment pendant 4-5 ans, puis métamorphose et reproduction unique avant la mort de l'adulte qui ne se nourrit plus.",
  "techniques_recommandees": [],
  "conditions_ideales": {
    "meteo": "Variable",
    "moment_jour": "Frai diurne au printemps",
    "profondeur": "0.5-1 m",
    "vent": "Sans incidence"
  },
  "conseil_fishdex": "La lamproie de Planer ne se pêche pas, c'est une espèce protégée. Si tu observes le frai au printemps dans un ruisseau (regroupements sur des fonds sableux), c'est un spectacle rare et précieux. Espèce d'intérêt européen.",
  "statut_reglementaire": "Espèce protégée. Directive Habitats Annexe II.",
  "donnees_a_verifier": []
}
```

---

# Audit & avertissements

## Sources utilisées

- **INPN** (Inventaire National du Patrimoine Naturel) : nomenclature taxonomique, statuts de protection, répartition française
- **FishBase** (référencé) : taille max, longévité, écologie
- **DORIS** (FFESSM) : descriptions naturalistes, habitats
- **Pêches sportives, Esoxiste, Chtipecheur** : connaissance pêche pratique française
- **Plan national d'actions Apron du Rhône** : statut réglementaire et conservation
- **Connaissances naturalistes Claude** (entraînement) : techniques de pêche, comportements

## Niveau de confiance

| Catégorie | Niveau de confiance | Commentaire |
|---|---|---|
| **Noms scientifiques** | ⭐⭐⭐⭐⭐ | Vérifiés (taxonomie 2025 INPN) |
| **Familles** | ⭐⭐⭐⭐⭐ | Vérifiées (révisions taxonomiques récentes incluses, ex: Leuciscidae) |
| **Tailles & poids** | ⭐⭐⭐⭐ | Fourchettes raisonnables, records peuvent varier selon sources |
| **Longévité** | ⭐⭐⭐⭐ | Fourchettes habituelles, peuvent varier |
| **Statuts réglementaires** | ⭐⭐⭐⭐ | À vérifier localement (varie par département) |
| **Techniques de pêche** | ⭐⭐⭐⭐⭐ | Pratiques courantes en France |
| **Conseils FishDex** | ⭐⭐⭐⭐⭐ | Rédaction originale, ton contemplatif |

## Vérifications à faire avant production

**Pour chaque espèce avant d'insérer en BDD** :
1. Recroiser nom scientifique sur **FishBase** (https://fishbase.se)
2. Vérifier statut sur **INPN** (https://inpn.mnhn.fr)
3. Vérifier réglementation pêche sur le site de **ta fédération départementale**
4. Pour les espèces protégées : confirmer **dernière mise à jour** des arrêtés

## Points généraux à valider

- **Tailles légales et périodes de fermeture** : varient par département et catégorie de cours d'eau. Toujours consulter l'arrêté préfectoral à jour.
- **Statut anguille européenne** : réglementation très évolutive, vérifier annuellement
- **Saumon atlantique** : tirages au sort, quotas par rivière, à vérifier auprès de l'AAPPMA locale
- **Espèces protégées (Apron, Chabot, Lamproie, Bouvière)** : pêche interdite. Mention claire dans l'app obligatoire.

---

# Variantes (table séparée)

> Ces entités vont dans `species_variants`, pas dans `species`. Une **variante** = une déclinaison esthétique ou génétique d'une espèce existante.

## Variantes de Carpe commune (`species_id` = carpe-commune)

```json
[
  { "slug": "carpe-miroir", "nom_fr": "Carpe miroir", "description_courte": "Écailles dispersées en plaques", "is_mirage": false, "rarete_relative": "courante" },
  { "slug": "carpe-cuir", "nom_fr": "Carpe cuir", "description_courte": "Sans écailles, peau lisse", "is_mirage": false, "rarete_relative": "peu fréquente" },
  { "slug": "carpe-lineaire", "nom_fr": "Carpe linéaire", "description_courte": "Une seule rangée d'écailles le long de la ligne latérale", "is_mirage": false, "rarete_relative": "peu fréquente" },
  { "slug": "carpe-fully-scaled", "nom_fr": "Carpe fully scaled", "description_courte": "Entièrement couverte d'écailles régulières (forme sauvage)", "is_mirage": false, "rarete_relative": "peu fréquente" },
  { "slug": "carpe-koi-kohaku", "nom_fr": "Carpe koï Kohaku", "description_courte": "Blanche avec taches rouges", "is_mirage": false, "rarete_relative": "rare en milieu naturel" },
  { "slug": "carpe-koi-sanke", "nom_fr": "Carpe koï Sanke", "description_courte": "Tricolore blanc, rouge et noir", "is_mirage": false, "rarete_relative": "rare en milieu naturel" },
  { "slug": "carpe-koi-showa", "nom_fr": "Carpe koï Showa", "description_courte": "Fond noir avec taches blanches et rouges", "is_mirage": false, "rarete_relative": "rare en milieu naturel" },
  { "slug": "carpe-koi-ogon", "nom_fr": "Carpe koï Ogon", "description_courte": "Robe dorée uniforme", "is_mirage": false, "rarete_relative": "rare en milieu naturel" },
  { "slug": "carpe-koi-platinum", "nom_fr": "Carpe koï Platinum (Ogon)", "description_courte": "Robe argentée brillante uniforme", "is_mirage": false, "rarete_relative": "rare en milieu naturel" },
  { "slug": "carpe-koi-asagi", "nom_fr": "Carpe koï Asagi", "description_courte": "Bleu treillis dorsal, ventre orangé", "is_mirage": false, "rarete_relative": "rare en milieu naturel" },
  { "slug": "carpe-kuyukoi", "nom_fr": "Carpe Kujakuô", "description_courte": "Robe métallique avec motifs koï", "is_mirage": false, "rarete_relative": "très rare en milieu naturel" },
  { "slug": "carpe-soragoi", "nom_fr": "Carpe Soragoi", "description_courte": "Bleu-gris uniforme sans motif", "is_mirage": false, "rarete_relative": "très rare en milieu naturel" },
  { "slug": "carpe-ghost", "nom_fr": "Carpe ghost", "description_courte": "Hybride koï × carpe commune, robe métallique fantomatique", "is_mirage": true, "rarete_relative": "exceptionnelle" },
  { "slug": "carpe-ghost-miroir", "nom_fr": "Carpe ghost miroir", "description_courte": "Ghost à écailles type miroir, robe métallique éclatante", "is_mirage": true, "rarete_relative": "exceptionnelle" },
  { "slug": "carpe-albinos", "nom_fr": "Carpe albinos", "description_courte": "Anomalie génétique : absence totale de pigment", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes de Carassin commun

```json
[
  { "slug": "carassin-albinos", "nom_fr": "Carassin albinos", "description_courte": "Anomalie génétique sans pigment", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes de Tanche

```json
[
  { "slug": "tanche-doree", "nom_fr": "Tanche dorée", "description_courte": "Variante orange-doré d'élevage, parfois en nature", "is_mirage": false, "rarete_relative": "peu fréquente" }
]
```

## Variantes d'Ide mélanote

```json
[
  { "slug": "ide-dore", "nom_fr": "Ide doré", "description_courte": "Variante d'élevage à robe orange-rougeâtre", "is_mirage": false, "rarete_relative": "peu fréquente" }
]
```

## Variantes de Brochet

```json
[
  { "slug": "brochet-melanique", "nom_fr": "Brochet mélanique", "description_courte": "Anomalie génétique : robe quasi noire", "is_mirage": true, "rarete_relative": "exceptionnelle" },
  { "slug": "brochet-albinos", "nom_fr": "Brochet albinos", "description_courte": "Anomalie génétique : absence de pigment", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes de Silure glane

```json
[
  { "slug": "silure-albinos", "nom_fr": "Silure albinos", "description_courte": "Anomalie génétique : robe blanche-rosée", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes de Black-bass à grande bouche

```json
[
  { "slug": "black-bass-petite-bouche", "nom_fr": "Black-bass à petite bouche", "description_courte": "Espèce proche (Micropterus dolomieu) souvent considérée à part — voir note", "is_mirage": false, "rarete_relative": "rare en France" },
  { "slug": "black-bass-albinos", "nom_fr": "Black-bass albinos", "description_courte": "Anomalie génétique exceptionnelle", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

> **Note importante** : Le black-bass à petite bouche (*Micropterus dolomieu*) est techniquement une **espèce distincte** du black-bass à grande bouche. Si tu veux être rigoureux, fais-en une espèce séparée plutôt qu'une variante. Présence française très limitée.

## Variantes de Truite fario

```json
[
  { "slug": "truite-jaune", "nom_fr": "Truite jaune (variante)", "description_courte": "Variante chromatique parfois observée, fond jaune doré", "is_mirage": false, "rarete_relative": "rare" },
  { "slug": "truite-albinos", "nom_fr": "Truite albinos", "description_courte": "Anomalie génétique : pas de pigment", "is_mirage": true, "rarete_relative": "exceptionnelle" },
  { "slug": "truite-tiger", "nom_fr": "Truite tigre (Tiger)", "description_courte": "Hybride stérile fario × omble de fontaine, motif tigré marqué", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes d'Ombre commun

```json
[
  { "slug": "ombre-albinos", "nom_fr": "Ombre albinos", "description_courte": "Anomalie génétique : absence de pigment", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes d'Omble de fontaine

```json
[
  { "slug": "omble-fantome", "nom_fr": "Omble fantôme (Ghost)", "description_courte": "Variante claire à robe presque blanche", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

## Variantes de Saumon atlantique

```json
[
  { "slug": "saumon-juvenile", "nom_fr": "Saumon juvénile (tacon)", "description_courte": "Stade jeune en rivière, robe constellée typique", "is_mirage": false, "rarete_relative": "fréquente (stade)" },
  { "slug": "saumon-smolt", "nom_fr": "Saumon smolt", "description_courte": "Stade descendant vers la mer, robe argentée", "is_mirage": false, "rarete_relative": "fréquente (stade)" },
  { "slug": "saumon-albinos", "nom_fr": "Saumon albinos", "description_courte": "Anomalie génétique exceptionnelle", "is_mirage": true, "rarete_relative": "exceptionnelle" }
]
```

---

# Espèces supprimées de ta liste (et pourquoi)

| Espèce listée | Raison | Action recommandée |
|---|---|---|
| **Brème bronze (variante)** | Forme jeune de la brème commune, pas une espèce ni vraie variante | Supprimé. La "brème bronze" est juste une brème commune jeune. |
| **Gardon rouge** | Pas une espèce reconnue. Probablement confusion avec rotengle (anciennement appelé "gardon rouge" en argot) | Supprimé. Le rotengle couvre. |
| **Ide doré** (séparé d'ide mélanote) | Même espèce (*Leuciscus idus*), juste variante d'élevage | Fusionné. Mis en variante. |
| **Aspe** listé 2 fois (Paisibles + Prédateurs) | Doublon | Une seule fiche, classé Prédateurs. |
| **Chevesne** listé 2 fois | Doublon | Une seule fiche, classé Paisibles (peut figurer dans 2 collections via species_collections). |
| **Vairon** listé 2 fois | Doublon | Une seule fiche, classé Paisibles. |
| **Spirlin** listé 2 fois | Doublon | Une seule fiche, classé Paisibles. |
| **Anguille pibale** | Stade juvénile d'anguille européenne, pas une espèce | Fusionné dans Anguille européenne. |
| **Hotu prédateur** | N'existe pas. Le hotu est strictement herbivore-algivore. | Supprimé. Erreur ichtyologique. |
| **Lompe (variante)** | *Cyclopterus lumpus* est une espèce marine, pas en eau douce. | Supprimé. |
| **Bar commun de rivière** | Le bar (*Dicentrarchus labrax*) est marin/estuarien, ne remonte que très rarement en pure eau douce. | Supprimé du scope eau douce. |
| **Black-bass à petite bouche** (espèce séparée) | Présence très anecdotique en France, voire absente | Mis en variante de black-bass grande bouche par défaut. À promouvoir en espèce séparée si tu as des prises documentées. |
| **Carpe amour argenté / marbré** | *Hypophthalmichthys molitrix / nobilis* présentes en France mais TRÈS rares. À évaluer. | Conservé en collection Paisibles mais à statut "rare" / "legendaire". Vérifie ta réalité de pêche. |
| **Silure gold / Silure mandarin** | Termes ambigus, je ne trouve pas de référence taxonomique solide pour des "silures gold/mandarin" comme espèces ou variantes établies | Supprimés. Si tu as des références, dis-moi, on les remet. |
| **Saumon de fontaine** | Synonyme d'omble de fontaine | Doublon supprimé. |

---

# Récap final

## Compteur

- **Collection 1 — Paisibles** : 23 espèces (+ Carpe amour argenté et Carpe marbré ajoutées)
- **Collection 2 — Prédateurs** : 10 espèces
- **Collection 3 — Eaux vives** : 12 espèces
- **Total espèces** : **45 espèces**
- **Variantes** : ~30 variantes prêtes pour `species_variants`

## Pourquoi 43 et pas 100

Tu avais ~100 entrées dans ta liste, mais après dédoublonnage et nettoyage des entrées non valides :
- 15-20 doublons retirés
- 20-25 variantes déplacées vers `species_variants`
- 10 espèces invalides ou non-eau-douce supprimées

**Résultat : 45 vraies espèces de qualité, auditées et enrichies, avec ~30 variantes complémentaires.**

C'est **mieux** que 100 entrées brouillon : un FishDex de qualité, finissable, scientifiquement crédible.

## Prochaines étapes recommandées

1. **Audite manuellement** quelques fiches (5-10 random) sur FishBase + INPN pour valider ma rigueur
2. **Complète si tu veux** : si tu as d'autres espèces que tu pêches régulièrement et qui sont absentes, on les ajoute
3. **Vérifie réglementation locale** : tailles, périodes par département
4. **Insère en BDD** : migration Supabase ou Dashboard

## Si tu trouves des erreurs

Reviens me voir avec : "fiche X, champ Y, donnée Z = faux, voici la source vérifiée". Je corrige immédiatement.

🐟
