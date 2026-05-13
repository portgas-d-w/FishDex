# 🐟 FishDex — Templates de prompts pour les fiches espèces

> Templates ChatGPT/Claude pour générer le contenu éditorial des fiches espèces.
> Toujours vérifier manuellement avant intégration en BDD.

## 📍 Emplacement dans le projet

Ce document reste dans `docs/SPECIES_CONTENT_TEMPLATES.md` pour référence.
Le contenu généré (les fiches d'espèces complètes) sera versé directement dans la BDD via les migrations Supabase.

## 🔧 Quand utiliser ces prompts

- En H2.5 : pour générer le contenu de 50 nouvelles espèces ajoutées (passage de 57 → ~110).
- En H3 : pour enrichir les fiches existantes manquant de détails techniques.
- Plus tard : à chaque ajout d'espèce communautaire (H4+).

## ⚠️ Règles de vérification obligatoires

Avant d'insérer en BDD, **toujours vérifier** :

1. **Nom scientifique exact** (vérifier sur FishBase ou GBIF, jamais faire confiance à l'IA)
2. **Présence en France** (certaines espèces nord-américaines ou asiatiques ne sont pas en France)
3. **Statut réglementaire** (espèces protégées, mailles, périodes de fermeture)
4. **Cohérence biologique** (régime alimentaire, habitat, profondeur cohérents avec les sources scientifiques)
5. **Pas d'invention** : une espèce inventée par l'IA = donnée toxique en BDD

## 🛠️ Process recommandé

1. Tu prends UNE espèce à la fois.
2. Tu utilises le **Template 1** pour générer la fiche complète.
3. Tu vérifies sur FishBase ou Wikipédia FR (5 minutes).
4. Tu corriges les erreurs manuellement.
5. Tu insères en BDD via migration ou Supabase Dashboard.

**Estimation** : 15-20 minutes par espèce (génération + vérif + correction).
Pour 50 espèces : 12-17h de travail réparti.

---

# 📋 Template 1 — Fiche espèce complète

**À utiliser dans ChatGPT (ou Claude) pour générer toute la fiche d'une espèce.**

## Prompt à copier-coller :

```
Tu es naturaliste expert des poissons d'eau douce français. Tu rédiges 
pour FishDex, une app premium contemplative pour pêcheurs. Tu n'inventes 
JAMAIS de données. Si tu n'es pas certain à 100%, tu indiques "à vérifier" 
explicitement.

ESPÈCE À DOCUMENTER : [NOM DE L'ESPÈCE EN FRANÇAIS]

Tu vas me renvoyer une fiche structurée au format JSON avec EXACTEMENT 
ces champs (rien d'autre, pas de texte avant ni après) :

{
  "slug": "string (kebab-case sans accents)",
  "nom_fr": "string (nom commun français)",
  "nom_scientifique": "string (genre + espèce en italique latin)",
  "famille": "string (nom de la famille en français)",
  "rarete": "commun | peu commun | rare | epique | legendaire",
  "eau": "douce | saumâtre | marine",
  "taille_max_cm": "number (en cm, taille record connue)",
  "taille_moyenne_cm": "number (taille moyenne adulte)",
  "poids_max_kg": "number (en kg, poids record connu)",
  "poids_moyen_kg": "number (poids moyen adulte)",
  "longevite_annees": "string (ex: '5-8 ans')",
  "regime": "string (insectivore, carnivore, omnivore, herbivore...)",
  "habitat": "string (description courte 1-2 phrases)",
  "profondeur": "string (ex: '1-3 m')",
  "temperature_eau": "string (ex: '8-16 °C')",
  "saison_active": "string (mois favorables, ex: 'Mars-Juin, Sept-Nov')",
  "description": "string (3-4 phrases, ton contemplatif, vulgarisation)",
  "techniques_recommandees": [
    {
      "nom": "string (ex: 'Jerkbait')",
      "difficulte": "number (1-5)",
      "efficacite": "number (1-5)",
      "profondeur_optimale": "string",
      "animation": "string (1 phrase)"
    }
  ] (3 à 5 techniques),
  "conditions_ideales": {
    "meteo": "string",
    "moment_jour": "string",
    "profondeur": "string",
    "vent": "string"
  },
  "conseil_fishdex": "string (2 phrases, ton éditorial chaleureux, 
                     comme un vieux pêcheur qui partage son expérience)",
  "variantes": [
    {
      "nom": "string (ex: 'Truite albinos')",
      "is_mirage": "boolean",
      "description": "string (1 phrase)"
    }
  ] (laisser vide [] si pas de variantes connues),
  "donnees_a_verifier": [
    "string (liste des points où tu n'es pas 100% certain)"
  ]
}

EXIGENCES :
- Ton naturaliste, sobre, jamais "fun fact" infantilisant
- Données françaises uniquement (espèces présentes en France métropolitaine)
- Pas de superlatifs marketing ("incroyable", "magnifique", "exceptionnel")
- Si la rareté est "mirage", c'est une VARIANTE, pas une espèce à part
- Pour techniques_recommandees : si l'espèce ne se pêche pas couramment, 
  mettre une liste vide []
```

## Exemple d'output attendu

Pour "Brochet" :

```json
{
  "slug": "brochet",
  "nom_fr": "Brochet",
  "nom_scientifique": "Esox lucius",
  "famille": "Esocidés",
  "rarete": "peu commun",
  "eau": "douce",
  "taille_max_cm": 130,
  "taille_moyenne_cm": 60,
  "poids_max_kg": 18,
  "poids_moyen_kg": 3,
  "longevite_annees": "10-15 ans",
  "regime": "carnivore",
  "habitat": "Lacs, étangs et rivières lentes. Apprécie les zones avec herbiers, branchages immergés et bordures riches en abris.",
  "profondeur": "1-3 m près des bordures",
  "temperature_eau": "8-16 °C",
  "saison_active": "Mars-Juin, Sept-Novembre",
  "description": "Prédateur emblématique des eaux douces françaises, le brochet chasse à l'affût. Sa silhouette allongée et sa mâchoire armée de dents en font un carnassier redouté. Solitaire et territorial, il préfère les zones calmes proches des herbiers.",
  "techniques_recommandees": [
    {
      "nom": "Jerkbait",
      "difficulte": 3,
      "efficacite": 5,
      "profondeur_optimale": "1-3 m",
      "animation": "Twitch et pauses irrégulières"
    },
    {
      "nom": "Spinnerbait",
      "difficulte": 2,
      "efficacite": 4,
      "profondeur_optimale": "0.5-2 m",
      "animation": "Récupération constante avec accélérations"
    },
    {
      "nom": "Swimbait",
      "difficulte": 3,
      "efficacite": 4,
      "profondeur_optimale": "1-4 m",
      "animation": "Récupération linéaire lente"
    }
  ],
  "conditions_ideales": {
    "meteo": "Temps couvert, pluie fine",
    "moment_jour": "Lever et coucher du soleil",
    "profondeur": "1-3 m",
    "vent": "Léger à modéré"
  },
  "conseil_fishdex": "Les brochets sont souvent plus agressifs au lever du soleil par temps couvert. Privilégie les bordures avec herbiers et branchages immergés, c'est là qu'ils chassent en embuscade.",
  "variantes": [
    {
      "nom": "Brochet mélanique",
      "is_mirage": true,
      "description": "Variante rare au pigmentation très sombre, presque noire"
    },
    {
      "nom": "Brochet albinos",
      "is_mirage": true,
      "description": "Variante extrêmement rare dépourvue de pigmentation"
    }
  ],
  "donnees_a_verifier": []
}
```

---

# 📋 Template 2 — Vérification rapide d'une espèce existante

**À utiliser pour auditer une fiche existante en BDD.**

## Prompt :

```
Voici une fiche d'espèce existante dans la base FishDex. 

[COLLER LE JSON DE LA FICHE]

Audit cette fiche selon ces critères :
1. Le nom scientifique est-il correct ? (vérifier sur FishBase)
2. Les données biologiques (taille, poids, longévité) sont-elles 
   cohérentes avec les sources scientifiques ?
3. Le régime alimentaire est-il exact ?
4. L'habitat décrit est-il valable en France métropolitaine ?
5. Les techniques de pêche recommandées sont-elles les plus efficaces 
   pour cette espèce en France ?

Pour chaque critère, indique :
- ✅ OK
- ⚠️ À ajuster : [proposition de correction]
- ❌ Erreur : [proposition de correction]

À la fin, fournis le JSON corrigé si nécessaire.
```

---

# 📋 Template 3 — Génération des variantes d'une espèce

**À utiliser pour les espèces avec variantes (koï, truite, brochet, etc.).**

## Prompt :

```
ESPÈCE : [NOM DE L'ESPÈCE]

Liste-moi toutes les variantes connues et reconnues de cette espèce 
en France ou pêchées par des Français.

Pour chaque variante, fournis au format JSON :

{
  "variantes": [
    {
      "slug": "string (kebab-case)",
      "nom_fr": "string",
      "description_courte": "string (1 phrase)",
      "description_visuelle": "string (1 phrase sur les couleurs/motifs)",
      "is_mirage": "boolean (TRUE si génétiquement ultra-rare comme 
                   albinos, mélanique, tigré ; FALSE si variante 
                   esthétique normale comme miroir, cuir, koï standard)",
      "rarete_relative": "courante | peu fréquente | rare | exceptionnelle"
    }
  ],
  "notes": "string (commentaire général sur les variantes de cette espèce)"
}

RÈGLES :
- Les variantes is_mirage:true sont des anomalies génétiques rares 
  (albinos, mélanique, tigré, doré naturel...)
- Les variantes is_mirage:false sont des variantes esthétiques connues 
  (carpe miroir, koï kohaku, truite marbrée...)
- Pas d'invention. Si tu n'es pas sûr, dis-le.
```

## Exemple d'usage pour la carpe koï

```
ESPÈCE : Carpe Koï
```

Réponse attendue (extrait) :

```json
{
  "variantes": [
    {
      "slug": "kohaku",
      "nom_fr": "Kohaku",
      "description_courte": "La plus classique des koï",
      "description_visuelle": "Robe blanche immaculée avec taches rouges",
      "is_mirage": false,
      "rarete_relative": "courante"
    },
    {
      "slug": "sanke",
      "nom_fr": "Sanke",
      "description_courte": "Tricolore traditionnelle",
      "description_visuelle": "Blanc, rouge et noir équilibrés",
      "is_mirage": false,
      "rarete_relative": "courante"
    },
    {
      "slug": "showa",
      "nom_fr": "Showa",
      "description_courte": "À dominante noire",
      "description_visuelle": "Fond noir avec taches blanches et rouges",
      "is_mirage": false,
      "rarete_relative": "peu fréquente"
    }
    // ... et ainsi de suite
  ],
  "notes": "La carpe koï est une variété sélectionnée de Cyprinus carpio. 
            Plus de 100 variétés sont reconnues officiellement. Les 
            variantes mirage seraient des koï présentant des anomalies 
            génétiques (très rares en captivité contrôlée)."
}
```

---

# 📋 Template 4 — Conseils FishDex éditoriaux uniquement

**À utiliser pour générer rapidement des "conseils FishDex" pour les espèces.**

Plus court, moins de friction. Pour quand tu veux juste enrichir la zone "Conseil FishDex" sans tout refaire.

## Prompt :

```
ESPÈCE : [NOM]

Génère 3 versions du "Conseil FishDex" pour cette espèce.

Format souhaité :
- Ton : comme un vieux pêcheur qui transmet son expérience à un débutant
- Contenu : 2 phrases maximum, conseil pratique et observation naturaliste
- À éviter : ton commercial, exclamations, conseil trop générique

Renvoie au format :

{
  "conseils": [
    "phrase 1",
    "phrase 2",
    "phrase 3"
  ]
}
```

---

# 🎯 Workflow type pour H2.5 (50 espèces à ajouter)

**Plan de travail estimé : 15-20 heures de travail effectif**

## Phase A — Préparation (1h)

1. Établir la **liste finale des 50 espèces** à ajouter (3 collections : Paisibles / Prédateurs / Eaux vives).
2. Créer un fichier `species-to-add.txt` avec la liste.
3. Préparer un Google Sheet avec colonnes : nom, statut (à faire / fait / vérifié), notes.

## Phase B — Génération (8-10h)

1. Pour chaque espèce :
   - Lancer Template 1 dans ChatGPT/Claude
   - Copier le JSON renvoyé
   - Sauvegarder dans un fichier `species-data/[slug].json`
2. Reste à un rythme de **6-8 espèces par session** pour éviter la lassitude.

## Phase C — Vérification (4-6h)

1. Pour chaque espèce générée :
   - Ouvrir FishBase (https://fishbase.se) et Wikipédia FR
   - Vérifier le nom scientifique
   - Vérifier les tailles/poids/longévité
   - Vérifier la présence en France
   - Corriger le JSON si erreur

## Phase D — Variantes (2-3h)

1. Pour les espèces à variantes connues (carpe, koï, truite, brochet, etc.) :
   - Lancer Template 3
   - Sauvegarder dans `species-data/[slug]-variants.json`

## Phase E — Intégration BDD (1-2h)

1. Créer une migration Supabase qui :
   - Insère les 50 nouvelles espèces dans `species`
   - Insère les variantes dans `species_variants`
   - Lie chaque espèce à ses collections via `species_collections` avec numéro dex
2. Tester en local que les fiches s'affichent correctement.

## Phase F — Visuel placeholder (1h)

1. Pour chaque espèce sans illustration : composant `SpeciesPlaceholder` se charge automatiquement.
2. Pas besoin de générer 50 illustrations IA maintenant.

---

# 📝 Notes importantes

## Sur les hallucinations IA

ChatGPT et Claude **inventent parfois des espèces** ou des données. Exemple réel : "Cottus zebra" — n'existe pas. Le vrai chabot est *Cottus gobio*.

**Toujours vérifier** :
- Nom scientifique sur FishBase
- Taille/poids sur sources scientifiques
- Présence géographique sur INPN ou GBIF

## Sur le temps réel

Ne sous-estime pas. 15-20 minutes par espèce avec vérif. **Ne pas faire 50 espèces en 1 weekend** sous peine d'erreurs en cascade. Étale sur 2-3 semaines.

## Sur les sources fiables

- **FishBase** : https://fishbase.se — Référence mondiale ichtyologie
- **INPN** : https://inpn.mnhn.fr — Inventaire National du Patrimoine Naturel français
- **FNPF** : https://federationpeche.fr — Fédération Nationale Pêche France (techniques)
- **GBIF** : https://www.gbif.org — Données géographiques de présence

## Quand l'IA n'est pas sûre

Le champ `donnees_a_verifier` du Template 1 sert exactement à ça. Si l'IA dit "à vérifier sur la longévité", tu vérifies. Si elle dit "rien à vérifier", **vérifie quand même** au moins le nom scientifique et la taille max.
