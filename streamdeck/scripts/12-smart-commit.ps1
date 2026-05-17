# ═══════════════════════════════════════════════════════
# 12-smart-commit.ps1 — Commit intelligent avec préfixe auto
# Stream Deck : Page 2 — bouton COMMIT
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "💾 Smart Commit FishDex..."
Set-Location $FISHDEX_PATH

# Vérifier qu'il y a des fichiers à committer
$staged   = & $GIT_EXE diff --cached --name-only 2>&1
$unstaged = & $GIT_EXE diff --name-only 2>&1
$untracked = & $GIT_EXE ls-files --others --exclude-standard 2>&1

$allFiles = @($staged) + @($unstaged) + @($untracked) | Where-Object { $_ -ne "" }

if ($allFiles.Count -eq 0) {
    Show-Toast -Title "Rien à committer" -Message "Répertoire propre — aucune modification" -Type "Info"
    exit 0
}

# Avertissement si branche protégée
if (Test-ProtectedBranch -Path $FISHDEX_PATH) {
    $branch = Get-GitBranch -Path $FISHDEX_PATH
    $ok = Confirm-Action -Message "⚠️ Tu es sur la branche PROTÉGÉE '$branch'`n`nContinuer quand même ?" -Title "Branche protégée"
    if (-not $ok) { exit 0 }
}

# Détecter automatiquement le type de fichiers modifiés
function Get-CommitPrefix {
    param([string[]]$Files)
    $allChanged = $Files -join " "
    if ($allChanged -match "supabase/|\.sql") { return "feat(db)" }
    if ($allChanged -match "actions/|lib/") { return "feat(api)" }
    if ($allChanged -match "\.tsx|\.css|components/") { return "feat(ui)" }
    if ($allChanged -match "package\.json|package-lock") { return "chore(deps)" }
    if ($allChanged -match "streamdeck/") { return "chore(streamdeck)" }
    if ($allChanged -match "\.md") { return "docs" }
    if ($allChanged -match "test|spec") { return "test" }
    return "chore"
}

$prefix = Get-CommitPrefix -Files $allFiles

# Demander le message
$filesPreview = ($allFiles | Select-Object -First 5) -join ", "
if ($allFiles.Count -gt 5) { $filesPreview += " (+ $($allFiles.Count - 5) autres)" }

$message = Get-UserInput -Prompt "Message du commit :`n`nPréfixe détecté : $prefix`n`nFichiers : $filesPreview`n`nMessage (sans le préfixe) :" -Title "Smart Commit" -Default ""

if ([string]::IsNullOrWhiteSpace($message)) {
    Show-Toast -Title "Annulé" -Message "Commit annulé (message vide)"
    exit 0
}

$fullMessage = "${prefix}: $message"

# Confirmer
$ok = Confirm-Action -Message "Commit à créer :`n`n`"$fullMessage`"`n`nFichiers : $filesPreview`n`nContinuer ?" -Title "Confirmer le commit"
if (-not $ok) { exit 0 }

# Exécuter le commit
& $GIT_EXE add .
$result = & $GIT_EXE commit -m $fullMessage 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit créé : $fullMessage"
    Show-Toast -Title "Commit créé ✅" -Message $fullMessage
} else {
    Write-Host "❌ Erreur : $result"
    Show-Toast -Title "Erreur commit ❌" -Message ($result | Select-Object -Last 1) -Type "Error"
}
