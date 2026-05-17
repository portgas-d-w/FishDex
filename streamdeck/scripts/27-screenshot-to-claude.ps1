# ═══════════════════════════════════════════════════════
# 27-screenshot-to-claude.ps1 — Screenshot → Claude Web pour analyse visuelle
# Stream Deck : Page 3 — bouton SCREENSHOT
# Innovation : capture l'écran et ouvre Claude pour analyse UI
# Gain estimé : 5 min/analyse × 3/jour = 15 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "📸 Capture d'écran → Claude..."

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Choisir la zone à capturer
$options = @(
    "Écran entier"
    "Fenêtre active (Alt+PrintScreen)"
    "Zone sélectionnée (Snipping Tool)"
)

$choice = Show-Menu -Options $options -Title "Zone à capturer"
if (-not $choice) { exit 0 }

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$screenshotPath = [System.IO.Path]::GetTempPath() + "fishdex_screenshot_$timestamp.png"

switch ($choice) {
    "Écran entier" {
        # Prendre un screenshot de l'écran principal
        $screen  = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
        $bitmap  = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
        $bitmap.Save($screenshotPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $graphics.Dispose(); $bitmap.Dispose()
        Write-Host "✅ Screenshot capturé : $screenshotPath"
    }
    "Fenêtre active*" {
        # Utiliser PrintScreen via SendKeys
        Start-Sleep -Milliseconds 300
        [System.Windows.Forms.SendKeys]::SendWait("%{PRTSC}")
        Start-Sleep -Milliseconds 500
        # Sauvegarder depuis le presse-papier
        $img = [System.Windows.Forms.Clipboard]::GetImage()
        if ($img) {
            $img.Save($screenshotPath)
            Write-Host "✅ Fenêtre active capturée"
        } else {
            Show-Toast -Title "Erreur" -Message "Aucune image dans le presse-papier" -Type "Error"
            exit 1
        }
    }
    "Zone sélectionnée*" {
        # Ouvrir Snipping Tool
        Start-Process "SnippingTool.exe" -ErrorAction SilentlyContinue
        Show-Toast -Title "Snipping Tool" -Message "Sélectionne la zone, puis reviens ici"
        Start-Sleep -Seconds 5
        # Tenter de récupérer depuis le presse-papier
        $img = [System.Windows.Forms.Clipboard]::GetImage()
        if ($img) {
            $img.Save($screenshotPath)
        } else {
            Show-Toast -Title "Annulé" -Message "Aucune capture dans le presse-papier"
            exit 0
        }
    }
}

# Ouvrir le fichier dans l'explorateur pour drag & drop vers Claude
Start-Process "explorer.exe" "/select,`"$screenshotPath`""

# Générer un prompt d'analyse visuelle
$analysisPrompt = @"
Voici un screenshot de l'interface FishDex. Analyse visuellement :

1. **Cohérence UI** : le design correspond-il aux conventions FishDex (glassmorphism, cyan-400, fond #0a0f14) ?
2. **Problèmes visuels** : espacement, alignement, contraste, lisibilité
3. **Mobile-first** : l'interface est-elle adaptée au mobile ?
4. **Suggestions** : 3 améliorations prioritaires avec le code Tailwind correspondant
"@

Set-Clipboard-Text -Text $analysisPrompt

# Ouvrir Claude web
Open-Chrome -Urls @($CLAUDE_WEB)

Show-Toast -Title "Screenshot prêt 📸" -Message "1. Drag & drop l'image vers Claude`n2. Colle le prompt (Ctrl+V)"
Write-Host "✅ Screenshot : $screenshotPath"
Write-Host "📋 Prompt d'analyse copié — colle dans Claude après l'image"
