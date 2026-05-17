# ═══════════════════════════════════════════════════════
# _utils.ps1 — Fonctions utilitaires partagées
# Dot-sourcer apres _config.ps1 : . "$PSScriptRoot\_utils.ps1"
# ═══════════════════════════════════════════════════════

# ── Notification Windows native (balloon tip) ─────────────────────────────────
function Show-Toast {
    param(
        [string]$Title   = "FishDex",
        [string]$Message = "",
        [ValidateSet("Info","Warning","Error")]
        [string]$Type    = "Info"
    )
    try {
        Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop
        $icon    = switch ($Type) {
            "Warning" { [System.Windows.Forms.ToolTipIcon]::Warning }
            "Error"   { [System.Windows.Forms.ToolTipIcon]::Error }
            default   { [System.Windows.Forms.ToolTipIcon]::Info }
        }
        $sysIcon = switch ($Type) {
            "Warning" { [System.Drawing.SystemIcons]::Warning }
            "Error"   { [System.Drawing.SystemIcons]::Error }
            default   { [System.Drawing.SystemIcons]::Information }
        }
        $notify          = New-Object System.Windows.Forms.NotifyIcon
        $notify.Icon     = $sysIcon
        $notify.Visible  = $true
        $notify.ShowBalloonTip($TOAST_DURATION, $Title, $Message, $icon)
        Start-Sleep -Milliseconds ($TOAST_DURATION + 500)
        $notify.Dispose()
    } catch {
        Write-Host "[$Type] $Title — $Message"
    }
}

# ── Dialogue de confirmation ───────────────────────────────────────────────────
function Confirm-Action {
    param(
        [string]$Message = "Confirmer cette action ?",
        [string]$Title   = "Confirmation"
    )
    Add-Type -AssemblyName System.Windows.Forms
    $result = [System.Windows.Forms.MessageBox]::Show(
        $Message, $Title,
        [System.Windows.Forms.MessageBoxButtons]::YesNo,
        [System.Windows.Forms.MessageBoxIcon]::Question
    )
    return $result -eq [System.Windows.Forms.DialogResult]::Yes
}

# ── Saisie texte par popup ────────────────────────────────────────────────────
function Get-UserInput {
    param(
        [string]$Prompt  = "Entrez une valeur :",
        [string]$Title   = "FishDex Stream Deck",
        [string]$Default = ""
    )
    Add-Type -AssemblyName Microsoft.VisualBasic
    $input = [Microsoft.VisualBasic.Interaction]::InputBox($Prompt, $Title, $Default)
    return $input
}

# ── Menu de sélection ─────────────────────────────────────────────────────────
function Show-Menu {
    param(
        [string[]]$Options,
        [string]$Title = "Choisir une option"
    )
    Add-Type -AssemblyName System.Windows.Forms
    $form            = New-Object System.Windows.Forms.Form
    $form.Text       = $Title
    $form.Size       = New-Object System.Drawing.Size(480, 400)
    $form.StartPosition = "CenterScreen"
    $form.BackColor  = [System.Drawing.Color]::FromArgb(10, 15, 20)
    $form.ForeColor  = [System.Drawing.Color]::White

    $listBox         = New-Object System.Windows.Forms.ListBox
    $listBox.Size    = New-Object System.Drawing.Size(440, 300)
    $listBox.Location = New-Object System.Drawing.Point(10, 10)
    $listBox.BackColor = [System.Drawing.Color]::FromArgb(20, 30, 40)
    $listBox.ForeColor = [System.Drawing.Color]::White
    $listBox.Font    = New-Object System.Drawing.Font("Consolas", 10)
    $Options | ForEach-Object { $listBox.Items.Add($_) | Out-Null }

    $btn             = New-Object System.Windows.Forms.Button
    $btn.Text        = "Sélectionner"
    $btn.Size        = New-Object System.Drawing.Size(440, 35)
    $btn.Location    = New-Object System.Drawing.Point(10, 320)
    $btn.BackColor   = [System.Drawing.Color]::FromArgb(34, 211, 238)
    $btn.ForeColor   = [System.Drawing.Color]::Black
    $btn.FlatStyle   = [System.Windows.Forms.FlatStyle]::Flat
    $btn.Add_Click({ $form.Tag = $listBox.SelectedItem; $form.Close() })
    $listBox.Add_DoubleClick({ $form.Tag = $listBox.SelectedItem; $form.Close() })

    $form.Controls.AddRange(@($listBox, $btn))
    $form.ShowDialog() | Out-Null
    return $form.Tag
}

# ── Vérifier qu'une commande existe ──────────────────────────────────────────
function Test-CommandExists {
    param([string]$Command)
    return ($null -ne (Get-Command $Command -ErrorAction SilentlyContinue))
}

# ── Obtenir la branche Git courante ──────────────────────────────────────────
function Get-GitBranch {
    param([string]$Path = $PWD)
    Push-Location $Path
    $branch = & $GIT_EXE rev-parse --abbrev-ref HEAD 2>$null
    Pop-Location
    return $branch
}

# ── Vérifier si on est sur une branche protégée ───────────────────────────────
function Test-ProtectedBranch {
    param([string]$Path = $FISHDEX_PATH)
    $branch = Get-GitBranch -Path $Path
    return $PROTECTED_BRANCHES -contains $branch
}

# ── Ouvrir une URL dans Chrome ────────────────────────────────────────────────
function Open-Chrome {
    param([string[]]$Urls)
    $args = $Urls -join " "
    if (Test-CommandExists $CHROME_EXE) {
        Start-Process $CHROME_EXE $args
    } else {
        Start-Process "msedge" $args -ErrorAction SilentlyContinue
    }
}

# ── Copier du texte dans le presse-papier ─────────────────────────────────────
function Set-Clipboard-Text {
    param([string]$Text)
    $Text | Set-Clipboard
}

# ── Ouvrir Windows Terminal dans un dossier ───────────────────────────────────
function Open-Terminal {
    param(
        [string]$Path    = $FISHDEX_PATH,
        [string]$Command = "",
        [string]$Title   = "FishDex"
    )
    if ($Command) {
        Start-Process $WT_EXE "-d `"$Path`" cmd /k `"$Command`""
    } else {
        Start-Process $WT_EXE "-d `"$Path`""
    }
}

# ── Lire la phase courante du projet ──────────────────────────────────────────
function Get-CurrentPhase {
    if (Test-Path $PHASE_FILE) {
        return (Get-Content $PHASE_FILE -Raw).Trim()
    }
    return "H2"  # défaut
}

# ── Tuer les processus Node sur un port ───────────────────────────────────────
function Stop-NodeOnPort {
    param([int]$Port = 3000)
    $procs = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
             Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $procs) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}
