# ═══════════════════════════════════════════════════════
# 23-copy-master-context.ps1 — Copie le contexte maître dans le presse-papier
# Stream Deck : Page 3 — bouton MASTER
# Gain estimé : 1 min/copie × 5/jour = 5 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "📋 Copie du contexte maître FishDex..."

$options = @(
    "MASTER_CONTINUITY_v2.md (contexte complet)"
    "Résumé derniers commits (git log -10)"
    "Structure src/ (arbre de fichiers)"
    "Les 3 combinés (contexte maximum)"
)

$choice = Show-Menu -Options $options -Title "Contexte à copier"

if (-not $choice) { exit 0 }

$content = ""

switch -Wildcard ($choice) {
    "*MASTER*" {
        if (Test-Path $MASTER_FILE) {
            $content = Get-Content $MASTER_FILE -Raw -Encoding UTF8
            $lines = ($content -split "`n").Count
            Write-Host "📄 MASTER ($lines lignes)"
        } else {
            Show-Toast -Title "Fichier introuvable" -Message "MASTER_CONTINUITY_v2.md absent" -Type "Error"
            exit 1
        }
    }
    "*commits*" {
        Push-Location $FISHDEX_PATH
        $log = & $GIT_EXE log -10 --oneline 2>&1
        Pop-Location
        $content = "# Derniers commits FishDex`n`n$($log -join "`n")"
    }
    "*Structure*" {
        Push-Location $FISHDEX_PATH
        $tree = & cmd /c "tree src /F /A" 2>&1
        Pop-Location
        $content = "# Structure src/ FishDex`n`n``````$($tree -join "`n")``````"
    }
    "*combinés*" {
        Push-Location $FISHDEX_PATH
        $log  = & $GIT_EXE log -10 --oneline 2>&1
        $tree = & cmd /c "tree src /F /A" 2>&1
        Pop-Location
        $master  = if (Test-Path $MASTER_FILE) { Get-Content $MASTER_FILE -Raw } else { "" }
        $content = "$master`n`n---`n`n# Derniers commits`n$($log -join "`n")`n`n---`n`n# Structure src/`n``````$($tree -join "`n")``````"
    }
}

if ($content) {
    Set-Clipboard-Text -Text $content
    $chars = $content.Length
    Show-Toast -Title "Contexte copié 📋" -Message "$chars caractères — Colle dans Claude (Ctrl+V)"
    Write-Host "✅ $chars caractères dans le presse-papier"
} else {
    Show-Toast -Title "Rien à copier" -Message "Contenu vide" -Type "Warning"
}
