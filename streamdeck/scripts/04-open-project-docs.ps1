# ═══════════════════════════════════════════════════════
# 04-open-project-docs.ps1 — Ouverture des docs selon la phase courante
# Stream Deck : Page 1 — bouton DOCS
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "📚 Ouverture de la documentation projet..."

# Lire la phase courante
$phase = Get-CurrentPhase
Write-Host "Phase détectée : $phase"

# Fichiers à ouvrir
$files = @($MASTER_FILE)

# Ajouter le fichier prompts de la phase
$promptFile = Join-Path $PROMPTS_DIR "PROMPTS_$phase.md"
if (Test-Path $promptFile) {
    $files += $promptFile
    Write-Host "📄 Prompt trouvé : PROMPTS_$phase.md"
} else {
    # Chercher le dernier fichier prompts disponible
    $latestPrompt = Get-ChildItem $PROMPTS_DIR -Filter "PROMPTS_*.md" |
                    Sort-Object Name -Descending |
                    Select-Object -First 1
    if ($latestPrompt) {
        $files += $latestPrompt.FullName
        Write-Host "📄 Dernier prompt disponible : $($latestPrompt.Name)"
    }
}

# Ouvrir avec Cursor
if (Test-CommandExists $CURSOR_EXE) {
    $fileArgs = ($files | ForEach-Object { "`"$_`"" }) -join " "
    Start-Process $CURSOR_EXE $fileArgs
    Show-Toast -Title "Docs $phase" -Message "MASTER_CONTINUITY + PROMPTS_$phase ouverts dans Cursor"
} else {
    # Fallback : ouvrir avec notepad
    $files | ForEach-Object {
        if (Test-Path $_) { Start-Process "notepad.exe" "`"$_`"" }
    }
    Show-Toast -Title "Docs ouverts" -Message "Cursor introuvable — ouvert avec Notepad" -Type "Warning"
}
