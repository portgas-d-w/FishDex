# Stream Deck FishDex 🎣

Setup Stream Deck premium pour le workflow de développement FishDex.
**Gain estimé : 45-75 minutes par jour de développement.**

## Vue d'ensemble

3 pages de boutons couvrant tout le workflow :

| Page | Thème | Couleur | Boutons |
|---|---|---|---|
| Page 1 | Dev Daily | Cyan `#22d3ee` | 7 boutons — lancer, tester, ouvrir |
| Page 2 | Git & Deploy | Émeraude `#34d399` | 6 boutons — committer, pousser, brancher |
| Page 3 | Claude / IA | Violet `#a855f7` | 8 boutons — prompts, debug, context |

## Gain de temps réel

| Action | Avant | Après | Gain/jour |
|---|---|---|---|
| Lancer l'environnement | 2 min | 1 clic | ~4 min |
| Typecheck | 1 min | 1 clic | ~5 min |
| Commit intelligent | 2 min | 30 sec | ~7 min |
| Push + Vercel | 1 min | 1 clic | ~4 min |
| Copier contexte Claude | 1 min | 1 clic | ~5 min |
| Sélectionner un prompt | 3 min | 30 sec | ~10 min |
| **Total estimé** | — | — | **~35-45 min/jour** |

## Structure

```
streamdeck/
├── README.md               ← ce fichier
├── SETUP_GUIDE.md          ← guide de configuration complet
├── icons/                  ← SVG + README conversion PNG
└── scripts/                ← scripts PowerShell
    ├── _config.ps1         ← variables globales (édite ici)
    ├── _utils.ps1          ← fonctions partagées
    ├── 01-07-*.ps1         ← Page 1 : Dev Daily
    ├── 11-16-*.ps1         ← Page 2 : Git & Deploy
    └── 21-28-*.ps1         ← Page 3 : Claude / IA
```

## Prérequis système

- **Stream Deck Software** ≥ 6.x
- **PowerShell** ≥ 5.1 (recommandé : PowerShell 7+)
- **Node.js** ≥ 18 (npm dans le PATH)
- **Git** dans le PATH
- **Cursor** ou VS Code (dans le PATH comme `cursor` ou `code`)
- **Chrome** dans le PATH (ou Edge comme fallback)
- **Claude Code CLI** : `npm i -g @anthropic-ai/claude-code`

## Démarrage rapide

1. Autoriser les scripts PowerShell :
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. Tester le script de config :
   ```powershell
   . streamdeck\scripts\_config.ps1
   Write-Host $FISHDEX_PATH
   ```

3. Lire [SETUP_GUIDE.md](SETUP_GUIDE.md) pour la configuration complète

## Liens

- [SETUP_GUIDE.md](SETUP_GUIDE.md) — guide de configuration étape par étape
- [icons/README.md](icons/README.md) — comment convertir les SVG en PNG
- [Repo GitHub](https://github.com/portgas-d-w/FishDex)
- [Prod](https://fish-dex-six.vercel.app)
