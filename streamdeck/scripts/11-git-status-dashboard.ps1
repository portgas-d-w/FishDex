# ═══════════════════════════════════════════════════════
# 11-git-status-dashboard.ps1 — Dashboard Git complet
# Stream Deck : Page 2 — bouton GIT STATUS
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "📊 Ouverture du dashboard Git..."
Set-Location $FISHDEX_PATH

$branch     = Get-GitBranch -Path $FISHDEX_PATH
$isProtected = Test-ProtectedBranch -Path $FISHDEX_PATH

# Construire le rapport Git
$status  = & $GIT_EXE status --short 2>&1
$log     = & $GIT_EXE log -7 --oneline 2>&1
$stash   = & $GIT_EXE stash list 2>&1

$report  = @"
════════════════════════════════════
  FISHDEX — GIT DASHBOARD
════════════════════════════════════
Branche : $branch $(if($isProtected){"⚠️ PROTÉGÉE"}else{""})
Date    : $(Get-Date -Format 'dd/MM/yyyy HH:mm')

── FICHIERS MODIFIÉS ────────────────
$(if($status){ $status }else{ "(répertoire propre)" })

── 7 DERNIERS COMMITS ───────────────
$($log -join "`n")

── STASH ────────────────────────────
$(if($stash){ $stash }else{ "(aucun stash)" })
════════════════════════════════════
"@

# Afficher dans Windows Terminal
$tempFile = [System.IO.Path]::GetTempPath() + "fishdex_git_status.txt"
$report | Out-File -FilePath $tempFile -Encoding UTF8

Open-Terminal -Path $FISHDEX_PATH -Command "type `"$tempFile`" && git status" -Title "Git Dashboard"

if ($isProtected) {
    Show-Toast -Title "Git ⚠️" -Message "Branche $branch est PROTÉGÉE" -Type "Warning"
} else {
    Show-Toast -Title "Git Dashboard 📊" -Message "Branche : $branch"
}
