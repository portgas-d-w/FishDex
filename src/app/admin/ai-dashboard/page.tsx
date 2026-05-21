import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { KillSwitchButton } from '@/components/admin/KillSwitchButton'

const ADMIN_EMAIL = 'alexy101099@gmail.com'
const BUDGET_EUR  = 20
const ALERT_RATIO = 0.9

type SpeciesCount = { id: string; nom_fr: string; count: number }

export default async function AiDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const admin = createAdminClient()

  // ── Kill switch ────────────────────────────────────────────────────────────
  const { data: killRow } = await admin
    .from('app_settings')
    .select('value')
    .eq('key', 'claude_vision_enabled')
    .single()
  const claudeEnabled = killRow?.value !== 'false'

  // ── Coûts mensuels ────────────────────────────────────────────────────────
  const now           = new Date()
  const firstDay      = new Date(now.getFullYear(), now.getMonth(), 1)
  const daysInMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysElapsed   = now.getDate()

  const { data: monthLogs } = await admin
    .from('ai_scan_logs')
    .select('cost_eur, model_used')
    .gte('created_at', firstDay.toISOString())

  const monthlyCost    = (monthLogs ?? []).reduce((s, r) => s + Number(r.cost_eur), 0)
  const totalScans     = monthLogs?.length ?? 0
  const avgDailyCost   = daysElapsed > 0 ? monthlyCost / daysElapsed : 0
  const projectedCost  = avgDailyCost * daysInMonth
  const claudeScans    = (monthLogs ?? []).filter(r => r.model_used === 'claude').length
  const inatScans      = (monthLogs ?? []).filter(r => r.model_used === 'inaturalist').length

  const isOverBudget        = monthlyCost    >= BUDGET_EUR * ALERT_RATIO
  const isProjectedOverBudget = projectedCost >= BUDGET_EUR * ALERT_RATIO

  // ── Taux validation / correction ──────────────────────────────────────────
  const { count: totalTraining } = await admin
    .from('ai_training_data')
    .select('id', { count: 'exact', head: true })

  const { count: correctedCount } = await admin
    .from('ai_training_data')
    .select('id', { count: 'exact', head: true })
    .eq('user_corrected', true)

  const total         = totalTraining ?? 0
  const corrected     = correctedCount ?? 0
  const validationRate = total ? Math.round(((total - corrected) / total) * 100) : 0
  const correctionRate = total ? Math.round((corrected / total) * 100) : 0

  // ── Top 10 espèces difficiles (les plus souvent corrigées) ────────────────
  const { data: correctedRows } = await admin
    .from('ai_training_data')
    .select('species_id_validated, species:species_id_validated(nom_fr)')
    .eq('user_corrected', true)

  const difficultMap = new Map<string, SpeciesCount>()
  for (const row of correctedRows ?? []) {
    const id  = row.species_id_validated as string
    const sp  = Array.isArray(row.species) ? row.species[0] : row.species
    const nom = (sp as { nom_fr: string } | null)?.nom_fr ?? 'Inconnue'
    const cur = difficultMap.get(id)
    if (cur) cur.count++
    else difficultMap.set(id, { id, nom_fr: nom, count: 1 })
  }
  const difficultSpecies = [...difficultMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ── Top 10 espèces sous-représentées ─────────────────────────────────────
  const { data: allTrainingRows } = await admin
    .from('ai_training_data')
    .select('species_id_validated, species:species_id_validated(nom_fr)')
    .eq('is_usable_for_training', true)

  const representedMap = new Map<string, SpeciesCount>()
  for (const row of allTrainingRows ?? []) {
    const id  = row.species_id_validated as string
    const sp  = Array.isArray(row.species) ? row.species[0] : row.species
    const nom = (sp as { nom_fr: string } | null)?.nom_fr ?? 'Inconnue'
    const cur = representedMap.get(id)
    if (cur) cur.count++
    else representedMap.set(id, { id, nom_fr: nom, count: 1 })
  }

  const { data: allSpecies } = await admin.from('species').select('id, nom_fr')
  for (const sp of allSpecies ?? []) {
    if (!representedMap.has(sp.id)) representedMap.set(sp.id, { id: sp.id, nom_fr: sp.nom_fr, count: 0 })
  }

  const underrepresented = [...representedMap.values()]
    .sort((a, b) => a.count - b.count)
    .slice(0, 10)

  // ── UI ────────────────────────────────────────────────────────────────────
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0a0f14] px-4 pt-12 pb-32">
      <h1 className="text-2xl font-black text-white mb-1">Dashboard IA</h1>
      <p className="text-white/40 text-sm mb-8">Monitoring Claude Vision — {monthLabel}</p>

      {/* Kill switch */}
      <div className={`rounded-2xl border p-5 mb-5 ${claudeEnabled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase mb-1">Claude Vision</p>
            <p className={`text-lg font-black ${claudeEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
              {claudeEnabled ? 'Activé' : 'Désactivé'}
            </p>
          </div>
          <KillSwitchButton enabled={claudeEnabled} />
        </div>
      </div>

      {/* Alerte budget */}
      {(isOverBudget || isProjectedOverBudget) && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-5 flex items-start gap-3">
          <span className="text-red-400 mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-bold text-red-400">Alerte budget</p>
            <p className="text-xs text-red-300/70 mt-0.5">
              {isOverBudget
                ? `Coût mensuel actuel ${monthlyCost.toFixed(2)} € ≥ ${Math.round(ALERT_RATIO * 100)}% du budget (${BUDGET_EUR} €)`
                : `Projection fin de mois ${projectedCost.toFixed(2)} € dépasse le budget (${BUDGET_EUR} €)`}
            </p>
          </div>
        </div>
      )}

      {/* Coûts */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Coût mensuel',     value: `${monthlyCost.toFixed(3)} €`,   color: isOverBudget ? 'text-red-400' : 'text-cyan-400' },
          { label: 'Projection mois',  value: `${projectedCost.toFixed(3)} €`, color: isProjectedOverBudget ? 'text-amber-400' : 'text-white' },
          { label: 'Moy. quotidienne', value: `${(avgDailyCost * 100).toFixed(2)} ¢`, color: 'text-white/60' },
          { label: 'Scans ce mois',    value: totalScans,                        color: 'text-cyan-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Budget progress */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">Budget {monthLabel}</p>
          <p className="text-xs text-white/40">{monthlyCost.toFixed(2)} € / {BUDGET_EUR} €</p>
        </div>
        <div className="h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-red-400' : 'bg-cyan-400/70'}`}
            style={{ width: `${Math.min((monthlyCost / BUDGET_EUR) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-[9px] text-white/20">0 €</p>
          <p className="text-[9px] text-amber-400/60">Alerte {BUDGET_EUR * ALERT_RATIO} €</p>
          <p className="text-[9px] text-white/20">{BUDGET_EUR} €</p>
        </div>
      </div>

      {/* Répartition modèles */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
        <p className="text-[10px] font-semibold tracking-widest text-cyan-400 uppercase mb-4">Répartition modèles (mois en cours)</p>
        <div className="flex gap-4 mb-3">
          <div className="flex-1 text-center">
            <p className="text-2xl font-black text-violet-400">{claudeScans}</p>
            <p className="text-[10px] text-white/30 mt-0.5">Claude (payant)</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-black text-emerald-400">{inatScans}</p>
            <p className="text-[10px] text-white/30 mt-0.5">iNaturalist (gratuit)</p>
          </div>
        </div>
        {totalScans > 0 && (
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-400/70"
              style={{ width: `${Math.round((claudeScans / totalScans) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Taux */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-white/5 border border-white/8 p-4 text-center">
          <p className="text-3xl font-black text-emerald-400">{validationRate}%</p>
          <p className="text-[9px] text-white/30 mt-1.5 leading-tight">
            Taux de validation<br />(1ère suggestion acceptée)
          </p>
          <p className="text-[9px] text-white/20 mt-1">{total - corrected} / {total}</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/8 p-4 text-center">
          <p className="text-3xl font-black text-amber-400">{correctionRate}%</p>
          <p className="text-[9px] text-white/30 mt-1.5 leading-tight">
            Taux de correction<br />(autre espèce choisie)
          </p>
          <p className="text-[9px] text-white/20 mt-1">{corrected} / {total}</p>
        </div>
      </div>

      {/* Top 10 difficiles */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
        <p className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase mb-3">
          Top 10 — Difficiles à identifier
        </p>
        {difficultSpecies.length === 0 ? (
          <p className="text-sm text-white/25 italic">Aucune correction enregistrée</p>
        ) : (
          <div className="space-y-2">
            {difficultSpecies.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/20 w-4 font-mono tabular-nums">{i + 1}</span>
                  <p className="text-sm text-white/70">{s.nom_fr}</p>
                </div>
                <span className="text-xs font-bold text-amber-400">{s.count} corr.</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 10 sous-représentées */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase mb-3">
          Top 10 — Dataset insuffisant
        </p>
        {underrepresented.length === 0 ? (
          <p className="text-sm text-white/25 italic">Toutes les espèces ont des données</p>
        ) : (
          <div className="space-y-2">
            {underrepresented.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/20 w-4 font-mono tabular-nums">{i + 1}</span>
                  <p className="text-sm text-white/70">{s.nom_fr}</p>
                </div>
                <span className={`text-xs font-bold ${s.count === 0 ? 'text-red-400' : 'text-white/40'}`}>
                  {s.count} photo{s.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
