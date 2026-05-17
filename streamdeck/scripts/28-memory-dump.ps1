# ═══════════════════════════════════════════════════════
# 28-memory-dump.ps1 — Archive horodatée du contexte courant
# Stream Deck : Page 3 — bouton MEMORY
# Innovation : snapshot du projet à un instant T pour retrouver le contexte
# Gain estimé : 10 min retrouver contexte × 2/jour = 20 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "💾 Sauvegarde du contexte FishDex..."
Set-Location $FISHDEX_PATH

$timestamp  = Get-Date -Format "yyyy-MM-dd_HH-mm"
$dumpDir    = Join-Path $FISHDEX_PATH "docs\snapshots"
$dumpFile   = Join-Path $dumpDir "snapshot_$timestamp.md"

# Créer le dossier si nécessaire
if (-not (Test-Path $dumpDir)) {
    New-Item -ItemType Directory -Path $dumpDir -Force | Out-Null
}

# Collecter les informations
$branch      = Get-GitBranch -Path $FISHDEX_PATH
$lastCommits = & $GIT_EXE log -10 --oneline 2>&1
$status      = & $GIT_EXE status --short 2>&1
$phase       = Get-CurrentPhase

# Demander à l'user ce qu'il faisait
$context = Get-UserInput -Prompt "Que faisais-tu à cet instant ?`n(Décris ta tâche en cours en quelques mots)" -Title "Memory Dump" -Default "Développement FishDex"

# Construire le snapshot
$snapshot = @"
# Snapshot FishDex — $timestamp

## Contexte
- **Phase** : $phase
- **Branche** : $branch
- **Tâche en cours** : $context
- **Date** : $(Get-Date -Format 'dd MMMM yyyy, HH:mm')

## État Git
### Derniers commits
``````
$($lastCommits -join "`n")
``````

### Fichiers modifiés
``````
$(if($status){ $status -join "`n" }else{ "(aucun — répertoire propre)" })
``````

## Notes
> *(À compléter manuellement si besoin)*

---
*Généré automatiquement par Stream Deck FishDex*
"@

$snapshot | Out-File -FilePath $dumpFile -Encoding UTF8

# Copier dans le presse-papier aussi
Set-Clipboard-Text -Text $snapshot

# Ouvrir le fichier dans Cursor
if (Test-CommandExists $CURSOR_EXE) {
    Start-Process $CURSOR_EXE $dumpFile
}

Show-Toast -Title "Memory dump 💾" -Message "Snapshot sauvé : snapshot_$timestamp.md"
Write-Host "✅ Snapshot : $dumpFile"
