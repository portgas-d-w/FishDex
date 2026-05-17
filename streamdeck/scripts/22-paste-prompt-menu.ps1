# ═══════════════════════════════════════════════════════
# 22-paste-prompt-menu.ps1 — Menu de prompts pré-écrits pour Claude
# Stream Deck : Page 3 — bouton PROMPTS
# Gain estimé : 2 min/prompt × 8/jour = 16 min/jour
# ═══════════════════════════════════════════════════════
. "$PSScriptRoot\_config.ps1"
. "$PSScriptRoot\_utils.ps1"

$prompts = [ordered]@{
    "🔍 Audit code récent"             = "Lis les 5 derniers commits avec `git log -5 --oneline`, puis fais un audit du code modifié : qualité, patterns, dettes techniques potentielles. Propose des améliorations concrètes."
    "📍 Où en est FishDex ?"           = "Lis MASTER_CONTINUITY_v2.md et dis-moi où en est le projet FishDex : quelle phase, quelles fonctionnalités terminées, quels chantiers ouverts, et quelle est la prochaine priorité logique."
    "🔒 Audit sécurité RLS Supabase"   = "Vérifie toutes les politiques RLS dans supabase/migrations/. Pour chaque table, confirme que les policies owner-only sont correctes, qu'il n'y a pas de failles d'accès. Signale tout ce qui semble permissif."
    "🧩 Génère un composant FishDex"   = "Je veux créer un nouveau composant React pour FishDex. Lis d'abord src/components/ pour comprendre les conventions (glassmorphism, bg-white/5, text-cyan-400, etc.). Demande-moi le nom et le rôle du composant, puis génère-le en respectant scrupuleusement les conventions visuelles du projet."
    "📋 Changelog derniers commits"    = "Lis les 10 derniers commits avec `git log -10 --oneline` et génère un changelog structuré en markdown avec sections : Features, Fixes, Chores. Format professionnel, une ligne par item."
    "🏗️ Vérifie la dette technique"   = "Lance `npx tsc --noEmit`, puis liste et analyse : composants trop longs (>200 lignes), props types manquants, any implicites, imports inutilisés, patterns incohérents. Priorise les dettes par impact."
    "📐 Architecture à jour ?"         = "Compare ARCHITECTURE.md avec le code actuel dans src/. Identifie les sections obsolètes, les patterns qui ont évolué, les composants mentionnés qui n'existent plus ou vice-versa. Propose une mise à jour."
    "🐛 Mode debug"                    = "Quelque chose ne fonctionne pas. Lis les derniers commits, vérifie les logs d'erreur TypeScript, inspecte les server actions récentes. Identifie les suspects potentiels et propose un plan de debug structuré."
    "⚡ Optimisation performance"      = "Analyse les pages principales (/, /sessions, /fishdex, /aquarium) en termes de performance Next.js : trop de requêtes Supabase, données refetchées inutilement, composants client là où server suffit. Donne 3-5 optimisations prioritaires."
    "🎨 Cohérence UI FishDex"         = "Audite la cohérence visuelle entre tous les composants : glassmorphism (bg-white/5, backdrop-blur-md, border-white/10), couleurs (cyan-400, white/60, #0a0f14), tailles de texte. Signale les incohérences et propose des corrections."
}

$choice = Show-Menu -Options ($prompts.Keys | ForEach-Object { $_ }) -Title "Prompts Claude — FishDex"

if (-not $choice -or $choice -eq "") {
    Write-Host "Annulé"
    exit 0
}

$prompt = $prompts[$choice]
Set-Clipboard-Text -Text $prompt

Show-Toast -Title "Prompt copié 📋" -Message "Colle dans Claude Code ou Claude web (Ctrl+V)"
Write-Host "✅ Prompt copié : $choice"
Write-Host ""
Write-Host $prompt
