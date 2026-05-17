# ═══════════════════════════════════════════════════════
# _config.ps1 — Variables globales FishDex Stream Deck
# Dot-sourcer en debut de chaque script : . "$PSScriptRoot\_config.ps1"
# ═══════════════════════════════════════════════════════

# Chemins locaux
$FISHDEX_PATH       = "C:\Users\alexy\Desktop\Projets-Code\fishdex"
$STREAMDECK_PATH    = "$FISHDEX_PATH\streamdeck"
$SCRIPTS_PATH       = "$STREAMDECK_PATH\scripts"
$MASTER_FILE        = "$FISHDEX_PATH\MASTER_CONTINUITY_v2.md"
$PHASE_FILE         = "$FISHDEX_PATH\.current_phase"
$PROMPTS_DIR        = "$FISHDEX_PATH\docs\prompts"

# Executables (modifier si chemin absolu nécessaire)
$CURSOR_EXE         = "cursor"
$WT_EXE             = "wt.exe"
$CHROME_EXE         = "chrome"
$NODE_EXE           = "node"
$NPM_EXE            = "npm"
$GIT_EXE            = "git"

# URLs
$LOCAL_URL          = "http://localhost:3000"
$LOCAL_MOBILE       = "http://localhost:3000"
$PROD_URL           = "https://fish-dex-six.vercel.app"
$SUPABASE_DASHBOARD = "https://supabase.com/dashboard/project/ivnmzkhuiqseazwibrcc"
$SUPABASE_SQL       = "$SUPABASE_DASHBOARD/sql/new"
$SUPABASE_TABLES    = "$SUPABASE_DASHBOARD/editor"
$SUPABASE_STORAGE   = "$SUPABASE_DASHBOARD/storage/buckets"
$VERCEL_DASHBOARD   = "https://vercel.com/portgas-d-ws-projects/fish-dex"
$VERCEL_ANALYTICS   = "$VERCEL_DASHBOARD/analytics"
$VERCEL_LOGS        = "$VERCEL_DASHBOARD/logs"
$GITHUB_REPO        = "https://github.com/portgas-d-w/FishDex"
$GITHUB_COMMITS     = "$GITHUB_REPO/commits/main"
$CLAUDE_WEB         = "https://claude.ai/new"

# Git
$PROTECTED_BRANCHES = @("main", "production", "master")
$DEFAULT_BRANCH     = "main"

# Dev server
$DEV_PORT           = 3000
$DEV_STARTUP_DELAY  = 4   # secondes d'attente avant d'ouvrir le browser

# Timeouts (secondes)
$TOAST_DURATION     = 3000  # ms pour les toasts Windows
