# ═══════════════════════════════════════════════════════
# 07-supabase-studio.ps1 — Ouverture de l'interface Supabase
# Stream Deck : Page 1 — bouton SUPABASE
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🗄️ Ouverture de Supabase Studio..."

# Demander quelle section ouvrir
$options = @(
    "SQL Editor (requêtes)"
    "Table Editor (données)"
    "Storage (fichiers)"
    "Dashboard général"
)

$choice = Show-Menu -Options $options -Title "Supabase — Quelle section ?"

$url = switch ($choice) {
    "SQL Editor (requêtes)"  { $SUPABASE_SQL }
    "Table Editor (données)" { $SUPABASE_TABLES }
    "Storage (fichiers)"     { $SUPABASE_STORAGE }
    default                  { $SUPABASE_DASHBOARD }
}

if ($url) {
    Open-Chrome -Urls @($url)
    Show-Toast -Title "Supabase 🗄️" -Message "Ouverture de : $choice"
    Write-Host "✅ Supabase ouvert : $url"
} else {
    Write-Host "Annulé par l'utilisateur"
}
