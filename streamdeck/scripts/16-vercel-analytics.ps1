# ═══════════════════════════════════════════════════════
# 16-vercel-analytics.ps1 — Dashboard Vercel complet
# Stream Deck : Page 2 — bouton VERCEL
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "📈 Ouverture du dashboard Vercel..."

$options = @(
    "Analytics (trafic & Web Vitals)"
    "Deployments (historique builds)"
    "Logs (runtime)"
    "Prod en direct"
)

$choice = Show-Menu -Options $options -Title "Vercel — Quelle section ?"

$url = switch ($choice) {
    "Analytics (trafic & Web Vitals)" { $VERCEL_ANALYTICS }
    "Deployments (historique builds)"  { "$VERCEL_DASHBOARD/deployments" }
    "Logs (runtime)"                   { $VERCEL_LOGS }
    "Prod en direct"                   { $PROD_URL }
    default                            { $VERCEL_DASHBOARD }
}

if ($url) {
    Open-Chrome -Urls @($url)
    Show-Toast -Title "Vercel 📈" -Message $choice
    Write-Host "✅ Ouvert : $url"
}
