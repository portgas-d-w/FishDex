# ═══════════════════════════════════════════════════════
# 26-pair-programming-layout.ps1 — Disposition triple écran optimale
# Stream Deck : Page 3 — bouton LAYOUT
# Innovation : arrange Cursor + Claude Code + Browser en 1 clic
# Gain estimé : 3 min/setup × 5/jour = 15 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🖥️ Configuration du layout pair programming..."

Add-Type -AssemblyName System.Windows.Forms

# Dimensions de l'écran principal
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$w = $screen.Width
$h = $screen.Height

Write-Host "Résolution détectée : ${w}×${h}"

# Choisir le layout
$layouts = @(
    "50/50 : Cursor gauche | Browser droite (recommandé)"
    "33/33/33 : Cursor | Terminal Claude | Browser"
    "60/40 : Cursor large | Browser compact"
    "Plein écran Cursor (focus code)"
)

$choice = Show-Menu -Options $layouts -Title "Layout pair programming"
if (-not $choice) { exit 0 }

# Fonction pour positionner une fenêtre (nécessite pinvoke)
$code = @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@
Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue

# Ouvrir les applications selon le layout choisi
switch -Wildcard ($choice) {
    "*50/50*" {
        # Cursor à gauche
        if (Test-CommandExists $CURSOR_EXE) { Start-Process $CURSOR_EXE $FISHDEX_PATH }
        Start-Sleep -Seconds 1
        # Browser à droite
        Open-Chrome -Urls @($LOCAL_URL)
        Show-Toast -Title "Layout 50/50 🖥️" -Message "Arrange manuellement : Cursor gauche, Browser droite"
    }
    "*33/33/33*" {
        if (Test-CommandExists $CURSOR_EXE) { Start-Process $CURSOR_EXE $FISHDEX_PATH }
        Open-Terminal -Path $FISHDEX_PATH -Command "claude" -Title "Claude Code"
        Start-Sleep -Milliseconds 800
        Open-Chrome -Urls @($LOCAL_URL)
        Show-Toast -Title "Layout triple 🖥️" -Message "3 fenêtres ouvertes — arrange avec Windows Snap"
    }
    "*60/40*" {
        if (Test-CommandExists $CURSOR_EXE) { Start-Process $CURSOR_EXE $FISHDEX_PATH }
        Open-Chrome -Urls @($LOCAL_URL)
        Show-Toast -Title "Layout 60/40 🖥️" -Message "Cursor large + Browser compact"
    }
    "*Plein écran*" {
        if (Test-CommandExists $CURSOR_EXE) {
            Start-Process $CURSOR_EXE $FISHDEX_PATH
            Show-Toast -Title "Focus code 🖥️" -Message "Cursor en plein écran — Win+↑ pour maximiser"
        }
    }
}

Write-Host "💡 Astuce : Win+← / Win+→ pour Snap, Win+↑ pour maximiser"
