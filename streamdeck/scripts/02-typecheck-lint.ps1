# ═══════════════════════════════════════════════════════
# 02-typecheck-lint.ps1 — Vérification TypeScript
# Stream Deck : Page 1 — bouton TYPECHECK
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🔍 Lancement du typecheck TypeScript..."
Set-Location $FISHDEX_PATH

# Capturer la sortie de tsc
$output = & npx tsc --noEmit 2>&1
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0 -and $output -eq "") {
    # Succès
    Write-Host "✅ TypeScript : aucune erreur"
    Show-Toast -Title "TypeScript ✅" -Message "Aucune erreur de type détectée"
} else {
    # Compter les erreurs
    $errors = $output | Where-Object { $_ -match "error TS" }
    $errorCount = $errors.Count

    Write-Host "❌ TypeScript : $errorCount erreur(s) détectée(s)"
    Write-Host $output

    # Afficher les erreurs dans Windows Terminal
    $errorText = $output -join "`n"
    $tempFile  = [System.IO.Path]::GetTempFileName() + ".txt"
    $errorText | Out-File -FilePath $tempFile -Encoding UTF8

    Show-Toast -Title "TypeScript ❌" -Message "$errorCount erreur(s) — Ouvre le terminal" -Type "Error"

    # Ouvrir les erreurs dans le terminal
    Open-Terminal -Path $FISHDEX_PATH -Command "npx tsc --noEmit"
}
