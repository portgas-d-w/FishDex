import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'alexy101099@gmail.com'

async function generateCodesAction(formData: FormData) {
  'use server'
  const count = Math.min(parseInt(String(formData.get('count') ?? '5')) || 5, 50)
  const note = String(formData.get('note') ?? '').trim()

  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const codes: string[] = []

  for (let i = 0; i < count; i++) {
    let suffix = ''
    for (let j = 0; j < 6; j++) {
      suffix += CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    codes.push(`FISH-${suffix}`)
  }

  const admin = createAdminClient()
  await admin.from('beta_invites').insert(codes.map(code => ({ code, note })))
  revalidatePath('/admin/codes')
}

export default async function AdminCodesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) notFound()

  const admin = createAdminClient()

  const { data: codes } = await admin
    .from('beta_invites')
    .select('*')
    .order('created_at', { ascending: false })

  const allCodes = codes ?? []

  // Récupérer les emails des utilisateurs ayant utilisé un code
  const userIds = allCodes
    .filter(c => c.used_by_user_id)
    .map(c => c.used_by_user_id as string)

  const userEmails: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 200 })
    for (const u of users) {
      if (userIds.includes(u.id)) {
        userEmails[u.id] = u.email ?? u.id
      }
    }
  }

  const available = allCodes.filter(c => !c.used_at).length
  const used = allCodes.filter(c => c.used_at).length

  return (
    <div className="min-h-screen bg-[#0a0f14] px-4 pt-12 pb-32 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-1">Codes d&apos;invitation</h1>
      <p className="text-white/40 text-sm mb-8">Gestion de l&apos;accès bêta fermée</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total', value: allCodes.length },
          { label: 'Disponibles', value: available },
          { label: 'Utilisés', value: used },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Formulaire de génération */}
      <form action={generateCodesAction} className="flex gap-3 mb-8 items-end flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40">Nombre</label>
          <input
            name="count"
            type="number"
            min={1}
            max={50}
            defaultValue={5}
            className="w-24 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-48">
          <label className="text-xs text-white/40">Note (optionnel)</label>
          <input
            name="note"
            type="text"
            placeholder="Pour qui / où distribué"
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-colors whitespace-nowrap"
        >
          Générer des codes
        </button>
      </form>

      {/* Liste des codes */}
      <div className="space-y-2">
        {allCodes.map((c) => {
          const isUsed = !!c.used_at
          const userEmail = c.used_by_user_id
            ? (userEmails[c.used_by_user_id] ?? c.used_by_user_id)
            : null

          return (
            <div
              key={c.id}
              className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
                isUsed
                  ? 'bg-white/5 border-white/5 opacity-60'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-mono text-sm text-white tracking-wider">{c.code}</span>
                {c.note && (
                  <span className="text-xs text-white/40 truncate">{c.note}</span>
                )}
              </div>

              <div className="text-right shrink-0">
                {isUsed ? (
                  <>
                    <span className="text-xs text-red-400 font-medium">Utilisé</span>
                    {userEmail && (
                      <p className="text-xs text-white/30 mt-0.5">{userEmail}</p>
                    )}
                    <p className="text-xs text-white/20 mt-0.5">
                      {new Date(c.used_at).toLocaleDateString('fr-FR')}
                    </p>
                  </>
                ) : (
                  <span className="text-xs text-green-400 font-medium">Disponible</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
