# ═══════════════════════════════════════════════════════
# 24-generate-component.ps1 — Génération de composant via prompt Claude
# Stream Deck : Page 3 — bouton COMPONENT
# Gain estimé : 10 min/composant × 3/semaine = 30 min/semaine
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

Write-Host "🧩 Génération de composant FishDex..."

# Informations du composant
$compName = Get-UserInput -Prompt "Nom du composant (ex: SessionCard, CatchBadge)" -Title "Nouveau composant" -Default ""
if ([string]::IsNullOrWhiteSpace($compName)) { exit 0 }

$types = @("Card (glassmorphism)", "Form (inputs + submit)", "Modal (overlay)", "Badge (inline)", "Page section", "Server component", "Client component")
$compType = Show-Menu -Options $types -Title "Type de composant"
if (-not $compType) { exit 0 }

$role = Get-UserInput -Prompt "Rôle / description fonctionnelle du composant :" -Title "Rôle du composant" -Default ""

# Générer le prompt Claude Code
$prompt = @"
Génère un composant React TypeScript pour FishDex selon ces specs :

**Nom** : $compName
**Type** : $compType
**Rôle** : $role

**Conventions FishDex OBLIGATOIRES** :
- Style : glassmorphism (bg-white/5, backdrop-blur-md, border border-white/10, rounded-2xl)
- Titres section : text-xs font-semibold tracking-widest text-cyan-400 uppercase
- Valeurs principales : text-white font-semibold
- Valeurs secondaires : text-white/60 text-sm
- Fonds : bg-[#0a0f14]
- Icônes : lucide-react UNIQUEMENT (jamais d'emoji dans les boutons/icônes UI)
- Pas de commentaires sauf si logique non-obvie
- TypeScript strict, pas de any implicite
- Si Client Component : 'use client' en première ligne

**À livrer** :
1. Le fichier composant complet (src/components/[dossier]/$compName.tsx)
2. Les types Props si nécessaires
3. Exemple d'utilisation
4. Si props de données : exemple de requête Supabase compatible
"@

Set-Clipboard-Text -Text $prompt

Show-Toast -Title "Prompt prêt 🧩" -Message "$compName — Colle dans Claude Code"
Write-Host "✅ Prompt pour '$compName' copié dans le presse-papier"
Write-Host ""
Write-Host "--- PROMPT ---"
Write-Host $prompt

# Ouvrir Claude Code
$openClaude = Confirm-Action -Message "Ouvrir Claude Code maintenant ?" -Title "Lancer Claude Code"
if ($openClaude) {
    if (Test-CommandExists "claude") {
        Open-Terminal -Path $FISHDEX_PATH -Command "claude" -Title "Claude — $compName"
    } else {
        Open-Chrome -Urls @($CLAUDE_WEB)
    }
}
