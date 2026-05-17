# ═══════════════════════════════════════════════════════
# 01-launch-fishdex.ps1 — Démarrage complet de l'environnement FishDex
# Stream Deck : Page 1 — bouton LAUNCH
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🚀 Démarrage de l'environnement FishDex..."

# Vérifier les dépendances critiques
if (-not (Test-CommandExists $NPM_EXE)) {
    Show-Toast -Title "Erreur" -Message "npm introuvable. Vérifie l'installation Node.js." -Type "Error"
    exit 1
}

# Ouvrir Cursor sur le projet
Write-Host "📝 Ouverture de Cursor..."
if (Test-CommandExists $CURSOR_EXE) {
    Start-Process $CURSOR_EXE $FISHDEX_PATH
} else {
    # Fallback sur VS Code
    if (Test-CommandExists "code") {
        Start-Process "code" $FISHDEX_PATH
    } else {
        Show-Toast -Title "Avertissement" -Message "Cursor/VS Code introuvable. Ouvre l'éditeur manuellement." -Type "Warning"
    }
}

Start-Sleep -Milliseconds 1500

# Lancer npm run dev dans Windows Terminal
Write-Host "⚡ Démarrage du serveur de développement..."
Open-Terminal -Path $FISHDEX_PATH -Command "npm run dev" -Title "FishDex Dev"

# Attendre que Next.js démarre
Write-Host "⏳ Attente du démarrage Next.js ($DEV_STARTUP_DELAY secondes)..."
Start-Sleep -Seconds $DEV_STARTUP_DELAY

# Ouvrir Chrome avec localhost + Supabase
Write-Host "🌐 Ouverture du navigateur..."
Open-Chrome -Urls @($LOCAL_URL, $SUPABASE_DASHBOARD)

Show-Toast -Title "FishDex" -Message "Environnement prêt ✓ localhost:$DEV_PORT"
Write-Host "✅ Environnement FishDex lancé avec succès"
