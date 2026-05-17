# Setup Guide — Stream Deck FishDex

Guide de configuration complet, étape par étape.

---

## 1. Prérequis

### 1.1 Autoriser les scripts PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 1.2 Vérifier les dépendances
```powershell
node --version    # ≥ 18
npm --version     # ≥ 9
git --version     # ≥ 2.40
cursor --version  # ou code --version (VS Code)
```

### 1.3 Installer Claude Code CLI (Page 3)
```bash
npm i -g @anthropic-ai/claude-code
claude --version
```

### 1.4 Tester la configuration de base
```powershell
cd C:\Users\alexy\Desktop\Projets-Code\fishdex
. streamdeck\scripts\_config.ps1
Write-Host "Path : $FISHDEX_PATH"
Write-Host "URL  : $LOCAL_URL"
```

---

## 2. Structure des 3 pages

### PAGE 1 — DEV DAILY (cyan)
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  LAUNCH  │TYPECHECK │  MOBILE  │   DOCS   │          │
│    01    │    02    │    03    │    04    │          │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ RESTART  │  CLEAN   │ SUPABASE │          │ → PAGE 2 │
│    05    │    06    │    07    │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

| # | Bouton | Script | Rôle |
|---|---|---|---|
| 01 | LAUNCH | `01-launch-fishdex.ps1` | Ouvre Cursor + dev server + browser |
| 02 | TYPECHECK | `02-typecheck-lint.ps1` | Lance `tsc --noEmit` + résultat |
| 03 | MOBILE | `03-mobile-preview.ps1` | Chrome en 390px + DevTools |
| 04 | DOCS | `04-open-project-docs.ps1` | MASTER + PROMPTS phase courante |
| 05 | RESTART | `05-restart-dev-server.ps1` | Kill Node + relance dev server |
| 06 | CLEAN | `06-clean-cache.ps1` | Supprime .next + cache |
| 07 | SUPABASE | `07-supabase-studio.ps1` | Ouvre Supabase Dashboard |

### PAGE 2 — GIT & DEPLOY (vert émeraude)
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  STATUS  │  COMMIT  │   PUSH   │  BRANCH  │          │
│    11    │    12    │    13    │    14    │          │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│   DIFF   │  VERCEL  │          │          │ → PAGE 3 │
│    15    │    16    │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

| # | Bouton | Script | Rôle |
|---|---|---|---|
| 11 | GIT STATUS | `11-git-status-dashboard.ps1` | Status + log 7 commits |
| 12 | COMMIT | `12-smart-commit.ps1` | Préfixe auto + message + commit |
| 13 | PUSH | `13-push-watch-vercel.ps1` | Push + ouvre Vercel dashboard |
| 14 | BRANCH | `14-new-branch.ps1` | Nouvelle branche avec préfixe |
| 15 | DIFF | `15-git-diff-viewer.ps1` | Menu diff (staged/unstaged/main) |
| 16 | VERCEL | `16-vercel-analytics.ps1` | Analytics / Deployments / Logs |

### PAGE 3 — CLAUDE / IA (violet)
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  CLAUDE  │ PROMPTS  │  MASTER  │COMPONENT │          │
│    21    │    22    │    23    │    24    │          │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│  DEBUG   │  LAYOUT  │SCREENSHT │  MEMORY  │ → PAGE 1 │
│    25    │    26    │    27    │    28    │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

| # | Bouton | Script | Innovation | Gain/jour |
|---|---|---|---|---|
| 21 | CLAUDE CODE | `21-launch-claude-code.ps1` | Lance `claude` dans FishDex | 5 min |
| 22 | PROMPTS | `22-paste-prompt-menu.ps1` | Menu 10 prompts → presse-papier | 16 min |
| 23 | MASTER | `23-copy-master-context.ps1` | Copie contexte maître/commits | 5 min |
| 24 | COMPONENT | `24-generate-component.ps1` | Prompt composant sur mesure | 10 min |
| 25 | DEBUG | `25-debug-mode.ps1` | Diagnostic auto + launch Claude | 30 min |
| 26 | LAYOUT | `26-pair-programming-layout.ps1` | Arrange fenêtres en 1 clic | 15 min |
| 27 | SCREENSHOT | `27-screenshot-to-claude.ps1` | Screenshot → Claude analyse UI | 15 min |
| 28 | MEMORY | `28-memory-dump.ps1` | Archive contexte horodaté | 20 min |

---

## 3. Configuration dans Stream Deck Software

### 3.1 Ajouter un bouton script

1. Ouvre **Elgato Stream Deck Software**
2. Glisse un bouton **"System" → "Open"** sur une case
3. Dans les paramètres du bouton :
   - **App/File** : `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`
   - **Arguments** : `-ExecutionPolicy Bypass -File "C:\Users\alexy\Desktop\Projets-Code\fishdex\streamdeck\scripts\01-launch-fishdex.ps1"`
   - **Start in** : `C:\Users\alexy\Desktop\Projets-Code\fishdex`
4. **Title** : nom court du bouton (ex: `LAUNCH`)
5. **Icon** : importer le PNG converti depuis `streamdeck/icons/`

### 3.2 Convertir les icônes SVG → PNG

```powershell
# Avec Inkscape (méthode recommandée)
cd C:\Users\alexy\Desktop\Projets-Code\fishdex\streamdeck\icons
Get-ChildItem *.svg | ForEach-Object {
    inkscape --export-type=png --export-width=144 --export-height=144 $_.FullName
}
```

Voir [icons/README.md](icons/README.md) pour les alternatives.

---

## 4. Ordre de configuration recommandé

### Phase 1 — Jour 1 : Les 4 boutons critiques
Commence uniquement par ceux-ci, utilise-les pendant 1 semaine :

1. **LAUNCH** (01) — le plus utilisé
2. **TYPECHECK** (02) — rapide feedback
3. **RESTART** (05) — server crash → 1 clic
4. **SUPABASE** (07) — ouvre SQL editor

**Objectif :** ressentir le gain de temps, adapter les chemins si nécessaire.

### Phase 2 — Semaine 2 : Compléter Page 1
- Ajouter MOBILE, DOCS, CLEAN

### Phase 3 — Semaine 3 : Page 2 (Git workflow)
- Commencer par STATUS + COMMIT + PUSH
- Ajouter BRANCH + DIFF + VERCEL ensuite

### Phase 4 — Mois 2 : Page 3 (Claude / IA)
- Commencer par CLAUDE CODE + PROMPTS
- Ajouter les autres selon tes besoins

---

## 5. Profils dynamiques (avancé)

Dans Stream Deck Software → **Preferences → Profiles** :

| Application active | Profil automatique |
|---|---|
| `cursor.exe` | FishDex Dev (Page 1 par défaut) |
| `WindowsTerminal.exe` | FishDex Git (Page 2 par défaut) |
| Chrome sur `claude.ai` | FishDex Claude (Page 3 par défaut) |

**Comment configurer :**
1. Crée 3 profils : "FishDex Dev", "FishDex Git", "FishDex Claude"
2. Pour chaque profil → clic droit → "Switch Profile when active app"
3. Sélectionne l'exécutable correspondant

---

## 6. Fichier `.current_phase`

Le script `04-open-project-docs.ps1` lit ce fichier pour ouvrir le bon fichier PROMPTS :

```
# Créer/mettre à jour le fichier de phase
echo H2 > C:\Users\alexy\Desktop\Projets-Code\fishdex\.current_phase

# Contenu possible : H0, H1, H2, H2.1, H2.2, H3, etc.
```

---

## 7. Troubleshooting

| Problème | Solution |
|---|---|
| "Script ne se lance pas" | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| "Toast n'apparaît pas" | Paramètres Windows → Notifications → Autoriser PowerShell |
| "npm not found" | Ajouter `C:\Program Files\nodejs` au PATH système |
| "cursor not found" | Ouvre Cursor → `Ctrl+Shift+P` → "Shell Command: Install 'cursor' in PATH" |
| "claude not found" | `npm i -g @anthropic-ai/claude-code` puis redémarre le terminal |
| "Chrome not found" | Ajouter Chrome au PATH ou modifier `$CHROME_EXE` dans `_config.ps1` |
| Menu Show-Menu bloque | Fermer via la croix, c'est normal (modal Windows) |

---

## 8. Personnalisation

Tous les chemins et URLs sont dans `streamdeck/scripts/_config.ps1`.
**Modifie uniquement ce fichier** pour adapter à ton environnement.

```powershell
# Exemple : changer l'éditeur
$CURSOR_EXE = "code"  # si tu utilises VS Code à la place

# Exemple : changer le port dev
$DEV_PORT = 3001

# Exemple : ajouter une URL Supabase staging
$SUPABASE_STAGING = "https://supabase.com/dashboard/project/ton-projet-staging"
```
