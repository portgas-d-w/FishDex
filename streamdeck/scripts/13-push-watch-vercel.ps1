# ═══════════════════════════════════════════════════════
# 13-push-watch-vercel.ps1 — Push + surveillance Vercel
# Stream Deck : Page 2 — bouton PUSH
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🚀 Push vers GitHub + Vercel..."
Set-Location $FISHDEX_PATH

# Vérifier les fichiers non commités
$uncommitted = & $GIT_EXE status --short 2>&1 | Where-Object { $_ -ne "" }
if ($uncommitted) {
    $files = $uncommitted -join "`n"
    $ok = Confirm-Action -Message "⚠️ Fichiers non commités :`n$files`n`nPousser quand même (ils ne seront PAS inclus) ?" -Title "Fichiers non commités"
    if (-not $ok) { exit 0 }
}

$branch = Get-GitBranch -Path $FISHDEX_PATH

# Avertissement branche protégée
if (Test-ProtectedBranch -Path $FISHDEX_PATH) {
    $ok = Confirm-Action -Message "⚠️ Push vers '$branch' (branche protégée) ?`n`nCela déclenchera un déploiement Vercel en PRODUCTION." -Title "Push production"
    if (-not $ok) { exit 0 }
}

# Push
Write-Host "📤 git push origin $branch..."
$result = & $GIT_EXE push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push réussi"
    Show-Toast -Title "Push réussi 🚀" -Message "Build Vercel en cours..."

    # Ouvrir Vercel dashboard pour surveiller le build
    Start-Sleep -Seconds 2
    Open-Chrome -Urls @($VERCEL_DASHBOARD)
} else {
    $errorMsg = $result | Select-Object -Last 2
    Write-Host "❌ Erreur push : $errorMsg"

    # Erreur courante : pas d'upstream
    if ($result -match "no upstream|set-upstream") {
        Show-Toast -Title "Pas d'upstream ❌" -Message "Lance : git push -u origin $branch" -Type "Error"
        Open-Terminal -Path $FISHDEX_PATH -Command "git push -u origin $branch"
    } elseif ($result -match "rejected") {
        Show-Toast -Title "Push rejeté ❌" -Message "Fais d'abord git pull pour synchroniser" -Type "Error"
    } else {
        Show-Toast -Title "Erreur push ❌" -Message ($result | Select-Object -Last 1) -Type "Error"
    }
}
