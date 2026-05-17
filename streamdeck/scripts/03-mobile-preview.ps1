# ═══════════════════════════════════════════════════════
# 03-mobile-preview.ps1 — Prévisualisation mobile iPhone 14 Pro
# Stream Deck : Page 1 — bouton MOBILE
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "📱 Ouverture de la prévisualisation mobile..."

# Vérifier que le serveur dev tourne
$portActive = Get-NetTCPConnection -LocalPort $DEV_PORT -ErrorAction SilentlyContinue
if (-not $portActive) {
    Show-Toast -Title "Avertissement" -Message "Serveur dev non détecté sur :$DEV_PORT — Lance d'abord le script 01" -Type "Warning"
}

# Ouvrir Chrome en format mobile (390×844 = iPhone 14 Pro)
# --window-size ouvre à 390px de large, DevTools s'ouvre automatiquement
# L'utilisateur bascule ensuite en mode "device emulation" (1 clic)
$chromeArgs = @(
    "--new-window",
    "--window-size=390,950",
    "--auto-open-devtools-for-tabs",
    $LOCAL_MOBILE
)

if (Test-CommandExists $CHROME_EXE) {
    Start-Process $CHROME_EXE ($chromeArgs -join " ")
} else {
    # Fallback sans args DevTools
    Open-Chrome -Urls @($LOCAL_MOBILE)
    Show-Toast -Title "Mobile Preview" -Message "Chrome non trouvé dans PATH — ouverture sans DevTools" -Type "Warning"
    exit 0
}

Show-Toast -Title "Mobile Preview 📱" -Message "Dans DevTools : Ctrl+Shift+M pour le mode mobile"
Write-Host "✅ Chrome ouvert en mode compact — Active Device Emulation dans DevTools (Ctrl+Shift+M)"
