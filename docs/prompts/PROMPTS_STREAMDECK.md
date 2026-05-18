# 🎛️ FishDex — Prompt Claude Code · Stream Deck FishDex

> Prompt unique pour générer tous les scripts PowerShell + icônes + guide de config Stream Deck.
>
> **⚠️ IMPORTANT** : Claude Code va générer les **scripts et la doc**, mais c'est **TOI** qui configures dans Stream Deck Software (drag & drop). Personne ne peut automatiser l'app Elgato.
>
> **Temps total estimé** : 30 min Claude Code + 20 min toi à configurer dans l'app Elgato.

---

## 📋 Avant de lancer ce prompt

**Vérifie que tu as** :
- ✅ Stream Deck Software (Elgato) installé
- ✅ PowerShell 7+ (Windows Terminal recommandé)
- ✅ Cursor installé (sinon adapte le bouton LAUNCH)
- ✅ Chrome installé
- ✅ Git fonctionnel en CLI
- ✅ Le projet FishDex à `C:\Users\alexy\Desktop\Projets-Code\fishdex`

**Pages prévues** :
- Page 1 — Dev Daily (8 boutons)
- Page 2 — Git & Deploy (8 boutons)
- Page 3 — Claude / IA (carte blanche, ~8 boutons selon idées Claude Code)

---

# 🎛️ PROMPT UNIQUE STREAM DECK

---PROMPT---

CONTEXTE — Setup Stream Deck FishDex (workflow productivité)

Mission : générer tous les scripts PowerShell, icônes, et documentation
nécessaires pour configurer un Stream Deck premium pour mon workflow FishDex.

CONTEXTE PROJET :
- Path local : C:\Users\alexy\Desktop\Projets-Code\fishdex
- Repo : github.com/portgas-d-w/FishDex
- Prod : https://fish-dex-six.vercel.app
- Supabase : ivnmzkhuiqseazwibrcc.supabase.co
- Stack : Next.js 15 + TypeScript + Tailwind + Supabase + Vercel
- IDE : Cursor (alternative VS Code)
- Terminal : Windows Terminal (wt.exe)
- OS : Windows 10/11

═══════════════════════════════════════════
ÉTAPE 1 — STRUCTURE DOSSIER À CRÉER
═══════════════════════════════════════════

Crée la structure complète à la racine du repo FishDex :

streamdeck/
├── README.md                      # vue d'ensemble du setup
├── SETUP_GUIDE.md                 # guide configuration Stream Deck Software
├── icons/                         # SVG/PNG des icônes des boutons
│   ├── README.md                  # comment exporter en PNG pour Elgato
│   ├── launch.svg
│   ├── typecheck.svg
│   ├── mobile.svg
│   ├── docs.svg
│   ├── restart.svg
│   ├── clean.svg
│   ├── supabase.svg
│   ├── git-status.svg
│   ├── smart-commit.svg
│   ├── push-vercel.svg
│   ├── new-branch.svg
│   ├── git-diff.svg
│   ├── vercel-analytics.svg
│   ├── claude.svg
│   ├── paste-prompt.svg
│   ├── copy-context.svg
│   ├── generate-component.svg
│   ├── debug.svg
│   └── (autres selon ta créativité Page 3)
└── scripts/
    ├── _config.ps1               # variables globales (paths, URLs)
    ├── _utils.ps1                # fonctions utilitaires partagées
    │
    │ # PAGE 1 — DEV DAILY
    ├── 01-launch-fishdex.ps1
    ├── 02-typecheck-lint.ps1
    ├── 03-mobile-preview.ps1
    ├── 04-open-project-docs.ps1
    ├── 05-restart-dev-server.ps1
    ├── 06-clean-cache.ps1
    ├── 07-supabase-studio.ps1
    │
    │ # PAGE 2 — GIT & DEPLOY
    ├── 11-git-status-dashboard.ps1
    ├── 12-smart-commit.ps1
    ├── 13-push-watch-vercel.ps1
    ├── 14-new-branch.ps1
    ├── 15-git-diff-viewer.ps1
    ├── 16-vercel-analytics.ps1
    │
    │ # PAGE 3 — CLAUDE / IA (carte blanche pour Claude Code)
    ├── 21-launch-claude-code.ps1
    ├── 22-paste-prompt-menu.ps1
    ├── 23-copy-master-context.ps1
    ├── 24-generate-component.ps1
    ├── 25-debug-mode.ps1
    │ # ... ajoute selon tes idées innovantes
    └── (autres scripts Page 3)

═══════════════════════════════════════════
ÉTAPE 2 — _config.ps1 (variables globales)
═══════════════════════════════════════════

Crée scripts/_config.ps1 qui contient toutes les variables réutilisables :

# Chemins
$FISHDEX_PATH = "C:\Users\alexy\Desktop\Projets-Code\fishdex"
$CURSOR_PATH = "cursor" # ou chemin absolu si nécessaire

# URLs
$LOCAL_URL = "http://localhost:3000"
$PROD_URL = "https://fish-dex-six.vercel.app"
$SUPABASE_DASHBOARD = "https://supabase.com/dashboard/project/ivnmzkhuiqseazwibrcc"
$SUPABASE_SQL = "$SUPABASE_DASHBOARD/sql/new"
$VERCEL_DASHBOARD = "https://vercel.com/portgas-d-ws-projects/fish-dex"
$VERCEL_ANALYTICS = "$VERCEL_DASHBOARD/analytics"
$GITHUB_REPO = "https://github.com/portgas-d-w/FishDex"
$CLAUDE_WEB = "https://claude.ai/new"

# Branches Git protégées
$PROTECTED_BRANCHES = @("main", "production")

═══════════════════════════════════════════
ÉTAPE 3 — _utils.ps1 (fonctions partagées)
═══════════════════════════════════════════

Crée scripts/_utils.ps1 avec ces fonctions :

function Show-Toast {
    param(
        [string]$Title,
        [string]$Message,
        [string]$Type = "Info" # Info, Warning, Error
    )
    # Notification Windows native
    Add-Type -AssemblyName System.Windows.Forms
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Information
    $notify.Visible = $true
    $notify.ShowBalloonTip(3000, $Title, $Message, $Type)
}

function Test-CommandExists {
    param([string]$Command)
    return (Get-Command $Command -ErrorAction SilentlyContinue) -ne $null
}

function Get-GitBranch {
    param([string]$Path)
    Push-Location $Path
    $branch = git rev-parse --abbrev-ref HEAD 2>$null
    Pop-Location
    return $branch
}

function Test-ProtectedBranch {
    param([string]$Path)
    $branch = Get-GitBranch -Path $Path
    return $PROTECTED_BRANCHES -contains $branch
}

═══════════════════════════════════════════
ÉTAPE 4 — SCRIPTS PAGE 1 (DEV DAILY)
═══════════════════════════════════════════

Génère les 7 scripts Page 1 selon ces specs :

01-launch-fishdex.ps1
- Ouvre Cursor sur le projet
- Lance npm run dev dans Windows Terminal séparé
- Attend 4 secondes (laisser Next.js démarrer)
- Ouvre Chrome sur localhost:3000
- Ouvre Chrome sur Supabase Dashboard (2e onglet)
- Show-Toast "FishDex" "Environnement prêt"

02-typecheck-lint.ps1
- cd fishdex
- Lance npx tsc --noEmit
- Parse l'output : si 0 erreur → toast vert "TypeScript clean"
- Si erreurs → toast rouge "X erreurs TS" + ouvre Cursor avec le terminal montrant les erreurs

03-mobile-preview.ps1
- Lance Chrome avec args : --auto-open-devtools-for-tabs --window-size=400,900
- URL : localhost:3000
- Inject JS pour forcer viewport iPhone 14 Pro (390×844) via DevTools Protocol si possible
- Sinon : juste ouvrir DevTools, tu switch manuellement au mode mobile (1 clic)

04-open-project-docs.ps1
- Ouvre Cursor en mode "fichier multi-onglets" :
  * MASTER_CONTINUITY.md
  * docs/prompts/PROMPTS_H0.md (ou PROMPTS_H1.md selon phase actuelle)
- Pour identifier la phase actuelle, lit le fichier .current_phase à la racine
  (toi tu mets à jour ce fichier manuellement : H0, H1, H2, etc.)

05-restart-dev-server.ps1
- Kill tous les processus Node sur port 3000 : Stop-Process -Name node -Force
- Attend 1 seconde
- Lance npm run dev dans Windows Terminal
- Show-Toast "Server restarted"

06-clean-cache.ps1
- cd fishdex
- Supprime .next/, node_modules/.cache, .turbo si présent
- Affiche un confirm avant si node_modules/ doit aussi être nuké (option agressive)
- Si oui : npm install
- Sinon : npm run dev
- Show-Toast "Cache cleaned"

07-supabase-studio.ps1
- Ouvre Chrome direct sur l'URL SQL Editor Supabase

═══════════════════════════════════════════
ÉTAPE 5 — SCRIPTS PAGE 2 (GIT & DEPLOY)
═══════════════════════════════════════════

11-git-status-dashboard.ps1
- cd fishdex
- Lance dans une popup PowerShell :
  * git status --short
  * git log -5 --oneline
  * git branch --show-current
- Bonus : ouvre VS Code Source Control panel

12-smart-commit.ps1
- cd fishdex
- Vérifie si la branche actuelle est protégée (main/production) → warning
- Récupère les fichiers modifiés (git diff --name-only)
- Détermine le préfixe automatique :
  * .sql ou supabase/ → "feat(db)"
  * .tsx ou .css → "feat(ui)"
  * actions/ → "feat(api)"
  * package.json → "chore(deps)"
  * .md → "docs"
  * Autre → "chore"
- Popup InputBox demande le message
- Si user OK : git add . && git commit -m "${prefix}: ${message}"
- Affiche commit créé

13-push-watch-vercel.ps1
- cd fishdex
- Check : pas de fichiers non commités (sinon warning)
- git push
- Si succès : ouvre Chrome sur Vercel Dashboard pour suivre le build
- Show-Toast "Pushed, building..."
- Si erreur (rejected, pas d'upstream) : message clair

14-new-branch.ps1
- Popup demande nom branche
- Préfixe auto selon type :
  * Si user tape "fix-xxx" → "fix/xxx"
  * Si user tape "feat-xxx" → "feat/xxx"
  * Sinon "feat/xxx"
- git checkout -b $branchName
- Show-Toast "Branch $branchName créée"

15-git-diff-viewer.ps1
- Ouvre Cursor avec le panel Source Control ouvert
- Alternative : ouvre cmd git diff dans Windows Terminal full-screen

16-vercel-analytics.ps1
- Ouvre Chrome direct sur la page analytics Vercel

═══════════════════════════════════════════
ÉTAPE 6 — PAGE 3 (CLAUDE / IA — CARTE BLANCHE)
═══════════════════════════════════════════

⚠️ POUR CETTE PAGE, J'AI BESOIN QUE TU RÉFLÉCHISSES.

Le user m'a dit : "j'ai créé une page Claude dans mon stream deck il a le champ libre dedans".

Tu as carte blanche pour designer 6-8 boutons innovants qui accélèrent
massivement le workflow Claude Code + Claude (web) + IA dans le contexte FishDex.

Réflexions à mener :
- Quelles actions Claude Code je fais 10×/jour ?
- Quels prompts récurrents je tape (audit, debug, génération composant) ?
- Comment lancer Claude Code dans le bon contexte projet ?
- Comment copier rapidement le master ou un prompt dans le presse-papier ?
- Comment switcher entre Claude web et Claude Code ?
- Comment gérer plusieurs sessions Claude en parallèle ?
- Comment exporter une conversation Claude pour archive ?

Mes idées de base (à compléter / améliorer / remplacer) :

21-launch-claude-code.ps1
- Ouvre Windows Terminal dans le dossier fishdex
- Lance `claude` (le CLI Claude Code)

22-paste-prompt-menu.ps1
- Ouvre une popup menu avec 5-10 prompts pré-écrits
- User choisit un prompt → copié dans le presse-papier
- Toast "Prompt copié, colle dans Claude Code"

Liste de prompts à proposer dans le menu :
- "Audit code récent + propose améliorations"
- "Lis MASTER_CONTINUITY.md et dis-moi où on en est"
- "Vérifie qu'il n'y a pas de dette technique"
- "Génère un composant React selon conventions FishDex"
- "Lis les derniers commits et fais un changelog"
- "Vérifie ARCHITECTURE.md à jour avec le code"
- "Audit sécurité RLS Supabase"

23-copy-master-context.ps1
- Lit le contenu de MASTER_CONTINUITY.md
- Le copie dans le presse-papier
- Toast "Master copié, colle dans nouvelle conv Claude (web)"

24-generate-component.ps1
- Popup demande nom du composant + type (Card, Form, Modal, etc.)
- Génère un prompt Claude Code pré-rempli
- Copie le prompt dans le presse-papier
- Ouvre Claude Code dans terminal
- Toast "Prompt prêt à coller"

25-debug-mode.ps1
- Lance Claude Code avec un prompt diagnostic auto :
  "Lis les 10 derniers commits, lance npx tsc --noEmit, identifie 
   d'éventuels bugs ou code smells, propose un plan d'action"

INNOVATIONS BIENVENUES (carte blanche) :
- Bouton "switch context" qui sauvegarde l'état actuel et propose
  d'attaquer une autre H selon le master
- Bouton "memory dump" qui sauvegarde la conversation Claude actuelle
  dans un fichier .md horodaté
- Bouton "pair programming" qui split l'écran : Cursor + Claude Code
  + browser localhost en disposition triple
- Bouton "screenshot to Claude" qui prend un screenshot Windows et
  l'ouvre dans Claude (web) directement pour analyse visuelle
- Toute autre idée brillante que tu as

Pour chaque bouton Page 3 que tu crées :
1. Nom du bouton
2. Description (rôle exact)
3. Script PowerShell complet
4. Icône suggérée (description ou emoji)
5. Gain de temps réel estimé

═══════════════════════════════════════════
ÉTAPE 7 — ICÔNES SVG
═══════════════════════════════════════════

Génère 1 fichier SVG par bouton dans streamdeck/icons/.
Style cohérent :
- Format : 144×144px (taille native Stream Deck)
- Style : flat, minimaliste, monochrome cyan #22d3ee sur fond noir #0a0f14
- Inspiration : Lucide icons (cohérent avec FishDex app)
- Lisible à petite taille

Pour chaque icône :
- Symbole central simple
- Texte court en dessous (max 1 mot, optionnel)
- Couleur dominante : cyan pour Page 1, vert émeraude #34d399 pour Page 2, violet #a855f7 pour Page 3

Crée aussi icons/README.md expliquant :
- Comment exporter le SVG en PNG 144×144 pour Stream Deck
- Outils recommandés (Figma export, ou ligne de commande avec rsvg-convert ou Inkscape)
- Conventions de nommage

═══════════════════════════════════════════
ÉTAPE 8 — SETUP_GUIDE.md (le doc le plus important pour toi)
═══════════════════════════════════════════

Crée streamdeck/SETUP_GUIDE.md avec :

1. PRÉREQUIS
- Stream Deck Software installé
- PowerShell 7+ (recommandé)
- Configuration PowerShell pour autoriser les scripts :
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

2. STRUCTURE DES 3 PAGES (vue d'ensemble visuelle)
Représentation ASCII des 3 pages avec boutons placés :

PAGE 1 — DEV DAILY
┌──────┬──────┬──────┬──────┬──────┐
│LAUNCH│ TYPE │MOBILE│ DOCS │ NEXT │
│      │CHECK │      │      │ PAGE │
├──────┼──────┼──────┼──────┼──────┤
│RESTART│CLEAN│SUPA- │  →   │      │
│      │CACHE│ BASE │      │      │
└──────┴──────┴──────┴──────┴──────┘

(Pareil pour Page 2 et Page 3)

3. CONFIGURATION ÉTAPE PAR ÉTAPE
Pour chaque bouton :
- Capture d'écran de l'app Stream Deck Software (ou description précise)
- Action à choisir : "Open" → "System" → script
- Path absolu du script .ps1
- Icône à uploader (chemin vers le PNG converti)
- Titre du bouton (texte court)

4. ORDRE DE CONFIGURATION RECOMMANDÉ
Phase 1 (jour 1) : configurer LES 4 boutons CRITIQUES de Page 1
- LAUNCH, TYPECHECK, RESTART, SUPABASE
- Utiliser pendant 1 semaine
- Confirmer qu'ils marchent

Phase 2 (semaine 2) : compléter Page 1
Phase 3 (semaine 3) : configurer Page 2 (Git workflow)
Phase 4 (mois 2) : configurer Page 3 (Claude IA)

5. PROFILS DYNAMIQUES (avancé)
Configuration "Profile per application" :
- Stream Deck affiche Page 1 automatiquement quand Cursor est actif
- Page 2 quand le terminal est actif
- Page 3 quand le navigateur sur Claude.ai est actif

6. TROUBLESHOOTING
- "Script ne se lance pas" → vérifier ExecutionPolicy
- "Toast n'apparaît pas" → vérifier permissions notifications Windows
- "npm not found" → vérifier PATH système
- "Cursor not found" → ajouter au PATH ou utiliser chemin absolu

═══════════════════════════════════════════
ÉTAPE 9 — README.md (vue d'ensemble)
═══════════════════════════════════════════

Crée streamdeck/README.md avec :
- But du Stream Deck FishDex
- Vue d'ensemble des 3 pages
- Estimation gain de temps total (5-15 min par jour, soit ~1h/semaine)
- Liens vers SETUP_GUIDE.md et icons/README.md
- Liste des dépendances système
- Mainteneur : toi

═══════════════════════════════════════════
ÉTAPE 10 — TESTS DES SCRIPTS
═══════════════════════════════════════════

Pour chaque script :
1. Vérifie qu'il s'exécute sans erreur en standalone (PowerShell)
2. Vérifie les chemins et URLs
3. Vérifie la gestion d'erreur (que se passe-t-il si Cursor pas installé ?)
4. Affiche un message d'info clair en début d'exécution

═══════════════════════════════════════════
ÉTAPE 11 — COMMIT
═══════════════════════════════════════════

Multiple commits si possible :
1. "chore(streamdeck): setup folder structure"
2. "feat(streamdeck): scripts page 1 dev daily"
3. "feat(streamdeck): scripts page 2 git deploy"
4. "feat(streamdeck): scripts page 3 claude ai workflow"
5. "docs(streamdeck): setup guide and icons documentation"

═══════════════════════════════════════════
RÈGLES STRICTES
═══════════════════════════════════════════

⚠️ Scripts PowerShell doivent être robustes (gestion erreurs, paths)
⚠️ Toujours dot-source _config.ps1 et _utils.ps1 en début de script
⚠️ Notifications Windows non-intrusives, jamais bloquantes
⚠️ Ne JAMAIS générer un script qui fait des modifications destructives
   sans confirmation (suppression fichiers, force push, etc.)
⚠️ Tous les chemins en variables (jamais hardcodé dans plusieurs scripts)
⚠️ Code commenté en français (cohérent avec le projet)
⚠️ Le guide SETUP_GUIDE.md est le LIVRABLE PRINCIPAL pour l'user
⚠️ Pour Page 3, soit créatif mais RESTE PROFESSIONNEL (pas de gadgets)

═══════════════════════════════════════════
LIVRABLE FINAL ATTENDU
═══════════════════════════════════════════

À la fin de cette exécution, je dois avoir :
1. ✅ Dossier streamdeck/ complet à la racine du repo
2. ✅ ~20 scripts PowerShell fonctionnels (testés en standalone)
3. ✅ ~20 icônes SVG cohérentes
4. ✅ SETUP_GUIDE.md exhaustif et illustré
5. ✅ Plan d'action en 4 phases pour configurer progressivement
6. ✅ Page 3 designée par toi avec créativité (au moins 5 boutons innovants)

Commence par l'ÉTAPE 1, montre-moi la structure de dossier créée.
Puis avance étape par étape, je te laisse autonomie sur Page 3.

---PROMPT---

---

# 📝 Comment utiliser ce prompt

**1.** Ouvre Claude Code dans le repo FishDex

**2.** Copie tout le bloc entre les marqueurs `---PROMPT---` ci-dessus

**3.** Colle dans Claude Code et envoie

**4.** Claude Code va :
- Créer la structure `streamdeck/`
- Générer ~20 scripts PowerShell
- Créer ~20 icônes SVG
- Écrire SETUP_GUIDE.md détaillé
- Proposer ses idées innovantes pour la Page 3 Claude

**5.** Après que Claude Code a fini :
- Lis SETUP_GUIDE.md
- Suis le **Plan d'action en 4 phases**
- Commence par configurer **4 boutons critiques Page 1** (jour 1)
- Élargis progressivement

---

# ⚠️ Ce que Claude Code ne peut PAS faire

- ❌ **Configurer automatiquement** les boutons dans l'app Elgato Stream Deck Software
- ❌ Convertir SVG → PNG automatiquement (tu devras le faire avec Figma, Inkscape, ou un outil en ligne)
- ❌ Tester les boutons Stream Deck physiquement (tu testes toi)

**Ce que Claude Code FAIT** :
- ✅ Tous les scripts PowerShell qui font le travail
- ✅ Toutes les icônes vectorielles cohérentes
- ✅ Le guide pour que TU configures rapidement dans l'app
- ✅ Tests des scripts en standalone

---

# 🎯 Plan d'action recommandé après livraison Claude Code

**Semaine 1 — 4 boutons critiques**

Configure UNIQUEMENT ces 4 boutons sur Page 1 :
1. LAUNCH FISHDEX (le plus utile)
2. TYPECHECK
3. SUPABASE STUDIO
4. RESTART DEV SERVER

Utilise pendant 1 semaine. Note quelles autres actions tu fais 5+ fois par jour.

**Semaine 2-3 — Compléter Page 1 + commencer Page 2**

Si tu en sens le besoin, ajoute les autres de Page 1, puis attaque Page 2 Git/Deploy.

**Mois 2 — Page 3 Claude IA**

Quand tu auras un workflow Claude Code stable, configure Page 3.

---

# 💡 Pièges à éviter

- ❌ **Ne configure pas tout le premier jour** : tu vas mettre 4h, en utiliser 2, frustration.
- ❌ **Ne mets pas de boutons gadget** "Spotify Play/Pause" : useless pour productivité
- ❌ **Ne pas oublier de tester chaque script en standalone** avant de l'assigner au Stream Deck
- ❌ **Ne pas ignorer SETUP_GUIDE.md** : c'est le mode d'emploi, pas optionnel

Bon setup. Quand c'est en place, tu vas gagner sérieusement en confort et fluidité de dev. 🎛️
