import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBetaSignups, getBetaInvites, generateBetaInvites } from '@/app/actions/beta'
import { GenerateInvitesButton } from '@/components/beta/GenerateInvitesButton'

const ADMIN_EMAIL = 'alexy101099@gmail.com'

export default async function BetaAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const [signups, invites] = await Promise.all([
    getBetaSignups(ADMIN_EMAIL),
    getBetaInvites(ADMIN_EMAIL),
  ])

  const pendingCount  = signups.filter(s => s.status === 'pending').length
  const unusedInvites = invites.filter(i => !i.used_at)
  const usedInvites   = invites.filter(i => i.used_at)

  return (
    <div className="min-h-screen bg-[#0a0f14] px-4 pt-12 pb-32">
      <h1 className="text-2xl font-black text-white mb-1">Admin bêta</h1>
      <p className="text-white/40 text-sm mb-8">{signups.length} candidatures · {unusedInvites.length} codes dispo</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'En attente', value: pendingCount, color: 'text-amber-400' },
          { label: 'Codes dispo', value: unusedInvites.length, color: 'text-cyan-400' },
          { label: 'Utilisateurs bêta', value: usedInvites.length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Générer des codes */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Générer des codes</p>
        <GenerateInvitesButton adminEmail={ADMIN_EMAIL} />
        {unusedInvites.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {unusedInvites.map(i => (
              <div key={i.id} className="flex items-center justify-between">
                <code className="text-sm font-mono text-cyan-400 bg-cyan-400/8 px-2 py-0.5 rounded">{i.code}</code>
                <span className="text-[10px] text-white/25">
                  {i.email ?? 'Non attribué'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidatures */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
          Candidatures ({signups.length})
        </p>
        <div className="space-y-3">
          {signups.map(s => (
            <div key={s.id} className="rounded-xl bg-white/4 border border-white/8 p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-white">{s.email}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  s.status === 'pending'  ? 'text-amber-400 bg-amber-400/8 border-amber-400/20' :
                  s.status === 'approved' ? 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20' :
                  'text-red-400 bg-red-400/8 border-red-400/20'
                }`}>{s.status}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-white/40">
                {s.type_eau && <span>{s.type_eau}</span>}
                {s.frequence && <span>{s.frequence}</span>}
                {s.especes?.length > 0 && <span>{s.especes.join(', ')}</span>}
              </div>
              {s.message && (
                <p className="text-xs text-white/35 mt-1.5 italic">&ldquo;{s.message}&rdquo;</p>
              )}
              <p className="text-[10px] text-white/20 mt-1.5">
                {new Date(s.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          {signups.length === 0 && (
            <p className="text-sm text-white/25 italic">Aucune candidature pour l&apos;instant</p>
          )}
        </div>
      </div>
    </div>
  )
}
