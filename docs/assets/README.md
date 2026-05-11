# Assets visuels FishDex

Ce dossier contient les 127 assets visuels du projet, organisés par catégorie et renommés en kebab-case.

## Structure

```
docs/assets/
├── mockups/              Écrans UI de l'application
│   ├── home/             Page Home : session active, spot, FishFeed
│   ├── fishdex/          Encyclopédie : grille, détails espèces, techniques
│   ├── aquarium/         Collection de captures : liste, détails
│   ├── sessions/         Sessions : formulaire, live, historique, fin
│   ├── profil/           Profil, paramètres, XP/niveau
│   ├── capture/          Scanner IA, résultat poisson révélé
│   ├── onboarding/       Splash screens, carousel d'intro
│   ├── auth/             (vide — à compléter)
│   └── modals/           Popups : mirage, nouvelle espèce
├── backgrounds/          Images de fond utilisables dans l'UI
│   ├── aquatique/        Surfaces d'eau, vues sous-marines
│   ├── nature/           Paysages de lacs et rivières
│   ├── textures/         Verre, glassmorphism, cuir, ciel
│   └── ambiances/        Photos avec pêcheurs, moments de pêche
├── icones-logos/         Icônes et logos
│   ├── logo-fishdex/     Logo officiel (lentille + carpe)
│   ├── app-icon/         Icône de l'application
│   ├── nav/              Icônes de navigation (carnet, fishfeed)
│   ├── ui/               Icônes UI génériques (caméra, trophée, hameçon...)
│   └── raretés/          Icône Mirage (rareté suprême)
└── vision-board/         Documents de conception et inspiration
    ├── concepts/          Wireframes, flows, specs fonctionnelles (43 docs)
    ├── direction-artistique/ Design system, motion, audio, raretés (13 docs)
    └── moodboards/        Visions d'ensemble multi-device (1 doc)
```

## Conventions de nommage

Format : `[type]-[sujet]-[variante].[ext]`

- Tout en minuscules, tirets entre les mots (kebab-case)
- Pas d'espaces, pas d'accents
- Suffixes `-v1`, `-v2` pour les variantes d'un même sujet

**Préfixes par type :**

| Préfixe | Usage |
|---------|-------|
| `background-` | Image de fond (nature, texture, aquatique) |
| `ambiance-` | Photo avec pêcheur ou moment de pêche |
| `icon-ui-` | Icône d'interface générique |
| `icon-nav-` | Icône de navigation |
| `icon-app-` | Icône d'application / splash |
| `icon-rarete-` | Icône d'une rareté de poisson |
| `logo-fishdex-` | Variante du logo officiel |
| `home-` | Mockup page Home |
| `fishdex-` | Mockup page FishDex |
| `aquarium-` | Mockup page Aquarium |
| `sessions-` | Mockup page Sessions |
| `profil-` | Mockup page Profil |
| `capture-` | Mockup écran Capture |
| `onboarding-` | Mockup écran Onboarding |
| `modals-` | Mockup modal/popup |
| `concept-` | Document de conception (vision board) |
| `moodboard-` | Planche d'inspiration |

## Utilisation dans le code

```tsx
// Mockup de référence
import heroImg from '@/docs/assets/mockups/fishdex/fishdex-detail-brochet-rare.png'

// Background
<div style={{ backgroundImage: `url('/docs/assets/backgrounds/ambiances/ambiance-pecheur-lever-soleil-brume-doree.png')` }} />

// Référence dans un prompt Claude
// "Utilise docs/assets/mockups/sessions/sessions-active-live-timer-meteo.png
//  comme référence pour la phase Sessions live"
```

## Fichiers sources

Les fichiers originaux (noms UUID) sont conservés dans `docs/image en vrac/` tant que le dossier `docs/assets/` n'est pas validé en production.
