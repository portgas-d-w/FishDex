# ═══════════════════════════════════════════════════════
# 14-new-branch.ps1 — Création de branche avec préfixe auto
# Stream Deck : Page 2 — bouton BRANCH
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🌿 Création d'une nouvelle branche..."
Set-Location $FISHDEX_PATH

$currentBranch = Get-GitBranch -Path $FISHDEX_PATH

$rawName = Get-UserInput -Prompt "Nom de la branche :`n`nExemples : feat-sessions-h3, fix-timer-bug, chore-cleanup`n`n(Le préfixe feat/, fix/, chore/ sera ajouté automatiquement)" -Title "Nouvelle branche" -Default "feat-"

if ([string]::IsNullOrWhiteSpace($rawName)) {
    Show-Toast -Title "Annulé" -Message "Création de branche annulée"
    exit 0
}

# Normaliser le nom (lowercase, tirets)
$rawName = $rawName.ToLower() -replace '\s+', '-' -replace '[^a-z0-9\-/]', ''

# Appliquer le préfixe si absent
$branchName = if ($rawName -match '^(feat|fix|chore|docs|refactor|test|hotfix)/') {
    $rawName
} elseif ($rawName -match '^feat-') {
    $rawName -replace '^feat-', 'feat/'
} elseif ($rawName -match '^fix-') {
    $rawName -replace '^fix-', 'fix/'
} elseif ($rawName -match '^chore-') {
    $rawName -replace '^chore-', 'chore/'
} elseif ($rawName -match '^docs-') {
    $rawName -replace '^docs-', 'docs/'
} else {
    "feat/$rawName"
}

$ok = Confirm-Action -Message "Créer la branche :`n`n  $branchName`n`n(depuis : $currentBranch)" -Title "Nouvelle branche"
if (-not $ok) { exit 0 }

# Créer et basculer sur la branche
$result = & $GIT_EXE checkout -b $branchName 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Branche créée : $branchName"
    Show-Toast -Title "Branche créée 🌿" -Message $branchName
} else {
    Write-Host "❌ Erreur : $result"
    Show-Toast -Title "Erreur ❌" -Message ($result | Select-Object -Last 1) -Type "Error"
}
