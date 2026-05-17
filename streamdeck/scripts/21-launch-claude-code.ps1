# ═══════════════════════════════════════════════════════
# 21-launch-claude-code.ps1 — Lancer Claude Code dans le projet
# Stream Deck : Page 3 — bouton CLAUDE CODE
# Gain estimé : 30 sec/ouverture × 10/jour = 5 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🤖 Lancement de Claude Code..."

if (-not (Test-CommandExists "claude")) {
    Show-Toast -Title "Claude Code ❌" -Message "CLI 'claude' introuvable — Installe : npm i -g @anthropic-ai/claude-code" -Type "Error"
    Open-Chrome -Urls @("https://docs.anthropic.com/claude-code")
    exit 1
}

# Ouvrir Windows Terminal avec Claude Code dans le projet
Open-Terminal -Path $FISHDEX_PATH -Command "claude" -Title "Claude Code — FishDex"

Show-Toast -Title "Claude Code 🤖" -Message "Prêt dans FishDex — tape ta demande"
Write-Host "✅ Claude Code lancé dans $FISHDEX_PATH"
