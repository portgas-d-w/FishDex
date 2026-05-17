# ═══════════════════════════════════════════════════════
# 05-restart-dev-server.ps1 — Redémarrage du serveur Next.js
# Stream Deck : Page 1 — bouton RESTART
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🔄 Redémarrage du serveur de développement..."

# Tuer les processus Node sur le port 3000
Write-Host "⏹️ Arrêt des processus sur le port $DEV_PORT..."
Stop-NodeOnPort -Port $DEV_PORT

# Attendre que le port se libère
Start-Sleep -Seconds 1

# Vérifier que le port est bien libéré
$stillRunning = Get-NetTCPConnection -LocalPort $DEV_PORT -ErrorAction SilentlyContinue
if ($stillRunning) {
    # Force kill tous les processus node
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Relancer npm run dev dans Windows Terminal
Write-Host "⚡ Relancement de npm run dev..."
Open-Terminal -Path $FISHDEX_PATH -Command "npm run dev" -Title "FishDex Dev"

Show-Toast -Title "Serveur redémarré 🔄" -Message "Next.js relancé sur localhost:$DEV_PORT"
Write-Host "✅ Serveur redémarré"
