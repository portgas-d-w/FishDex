# ═══════════════════════════════════════════════════════
# 25-debug-mode.ps1 — Mode debug assisté par Claude Code
# Stream Deck : Page 3 — bouton DEBUG
# Gain estimé : 15 min/session debug × 2/jour = 30 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🐛 Mode debug FishDex..."
Set-Location $FISHDEX_PATH

# Collecter le contexte de debug automatiquement
$branch     = Get-GitBranch -Path $FISHDEX_PATH
$lastCommits = & $GIT_EXE log -5 --oneline 2>&1
$tsErrors   = & npx tsc --noEmit 2>&1
$tsOk       = ($LASTEXITCODE -eq 0)

# Construire le prompt de debug
$tsSection = if ($tsOk) {
    "TypeScript : aucune erreur (propre)"
} else {
    "TypeScript ERREURS :`n$($tsErrors -join "`n")"
}

$prompt = @"
Mode DEBUG FishDex — $(Get-Date -Format 'dd/MM/yyyy HH:mm')

**Contexte automatique :**
- Branche : $branch
- Derniers commits :
$($lastCommits -join "`n")
- $tsSection

**Analyse demandée :**
1. Identifie les risques ou bugs potentiels dans les dernières modifications
2. Si des erreurs TypeScript : explique chacune et propose la correction
3. Vérifie la cohérence entre les server actions et les appels client
4. Signale tout pattern qui pourrait causer des régressions
5. Propose un plan d'action priorisé (P1/P2/P3)

Commence par lire les fichiers modifiés dans les 3 derniers commits.
"@

Set-Clipboard-Text -Text $prompt

# Option : lancer Claude Code directement avec le prompt
if (Test-CommandExists "claude") {
    $launch = Confirm-Action -Message "Lancer Claude Code avec ce prompt de debug ?" -Title "Debug Mode"
    if ($launch) {
        # Écrire le prompt dans un fichier temporaire et passer à claude
        $tempPrompt = [System.IO.Path]::GetTempFileName() + ".txt"
        $prompt | Out-File -FilePath $tempPrompt -Encoding UTF8

        Show-Toast -Title "Debug mode 🐛" -Message "Claude Code ouvert — analyse en cours..."
        Open-Terminal -Path $FISHDEX_PATH -Command "claude `"$(Get-Content $tempPrompt -Raw)`"" -Title "Debug — FishDex"
    } else {
        Show-Toast -Title "Prompt debug copié 🐛" -Message "Colle dans Claude Code (Ctrl+V)"
    }
} else {
    Show-Toast -Title "Prompt debug copié 🐛" -Message "Colle dans Claude ou Claude Code"
    Open-Chrome -Urls @($CLAUDE_WEB)
}
