# ═══════════════════════════════════════════════════════
# 06-clean-cache.ps1 — Nettoyage des caches de développement
# Stream Deck : Page 1 — bouton CLEAN
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🧹 Nettoyage des caches FishDex..."
Set-Location $FISHDEX_PATH

# Option agressive : supprimer aussi node_modules ?
$aggressive = Confirm-Action -Message "Nettoyage COMPLET (node_modules inclus) ?`n`nNon = nettoyage léger (.next + cache seulement)" -Title "Niveau de nettoyage"

# Arrêter le serveur dev avant
Stop-NodeOnPort -Port $DEV_PORT
Start-Sleep -Milliseconds 500

# Dossiers à toujours nettoyer
$toDelete = @(
    Join-Path $FISHDEX_PATH ".next",
    Join-Path $FISHDEX_PATH "node_modules\.cache",
    Join-Path $FISHDEX_PATH ".turbo"
)

foreach ($dir in $toDelete) {
    if (Test-Path $dir) {
        Write-Host "🗑️ Suppression : $dir"
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
    }
}

if ($aggressive) {
    $nodeModules = Join-Path $FISHDEX_PATH "node_modules"
    if (Test-Path $nodeModules) {
        Write-Host "🗑️ Suppression node_modules..."
        Remove-Item -Recurse -Force $nodeModules
    }
    Write-Host "📦 Réinstallation des dépendances..."
    Show-Toast -Title "Cache nettoyé" -Message "Réinstallation npm en cours..."
    Open-Terminal -Path $FISHDEX_PATH -Command "npm install && npm run dev" -Title "FishDex — Install"
} else {
    Show-Toast -Title "Cache nettoyé 🧹" -Message ".next et cache supprimés — relance le serveur"
    Open-Terminal -Path $FISHDEX_PATH -Command "npm run dev" -Title "FishDex Dev"
}

Write-Host "✅ Nettoyage terminé"
