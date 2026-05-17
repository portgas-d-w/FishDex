# ═══════════════════════════════════════════════════════
# 15-git-diff-viewer.ps1 — Visualisation des modifications
# Stream Deck : Page 2 — bouton DIFF
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🔍 Ouverture du diff Git..."
Set-Location $FISHDEX_PATH

$options = @(
    "Modifications non commitées (git diff)"
    "Modifications stagées (git diff --cached)"
    "Diff avec main (git diff main)"
    "Historique visuels dans Cursor/VSCode"
)

$choice = Show-Menu -Options $options -Title "Git Diff — Quelle vue ?"

switch ($choice) {
    "Modifications non commitées (git diff)" {
        Open-Terminal -Path $FISHDEX_PATH -Command "git diff --stat && git diff" -Title "Git Diff"
    }
    "Modifications stagées (git diff --cached)" {
        Open-Terminal -Path $FISHDEX_PATH -Command "git diff --cached --stat && git diff --cached" -Title "Git Diff Staged"
    }
    "Diff avec main (git diff main)" {
        Open-Terminal -Path $FISHDEX_PATH -Command "git diff main --stat && git diff main" -Title "Git Diff vs main"
    }
    "Historique visuels dans Cursor/VSCode" {
        if (Test-CommandExists $CURSOR_EXE) {
            # Ouvrir Cursor et activer Source Control (raccourci Ctrl+Shift+G)
            Start-Process $CURSOR_EXE $FISHDEX_PATH
            Show-Toast -Title "Cursor ouvert" -Message "Ctrl+Shift+G pour le panneau Source Control"
        }
    }
}

Show-Toast -Title "Git Diff 🔍" -Message $choice
