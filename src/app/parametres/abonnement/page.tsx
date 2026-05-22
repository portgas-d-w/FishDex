import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ChevronLeft, CreditCard, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/stripe/access'
import { PageHeader } from '@/components/shared/PageHeader'
import { TierBadge } from '@/components/abonnement/TierBadge'
import { TiersGrid } from '@/components/abonnement/TiersGrid'
import { PortalButton } from '@/components/abonnement/PortalButton'

export const metadata = {
  title: 'Abonnement',
}

type SearchParams = Promise<{ success?: string; canceled?: string }>

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'stripe_subscription_id, subscription_current_period_end, subscription_cancel_at_period_end, is_developer'
    )
    .eq('id', user.id)
    .single()

  const tier = await getUserTier(user.id)
  const { success, canceled } = await searchParams
  const isDeveloper = !!profile?.is_developer
  const hasStripeSubscription = !!profile?.stripe_subscription_id

  const periodEnd = profile?.subscription_current_period_end
    ? new Date(profile.subscription_current_period_end)
    : null

  return (
    <div
      className="min-h-screen flex flex-col pb-28"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(to bottom, #020c14, #0a1929 40%, #0d1117)',
      }}
    >
      <PageHeader
        leftAction={
          <Link
            href="/parametres"
            aria-label="Retour aux paramètres"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
        }
        icon={<CreditCard size={16} className="text-cyan-400" />}
        title="Abonnement"
        rightAction={<div className="w-10" />}
      />

      <main className="px-4 mt-4 space-y-6">
        {success && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-300">
                Abonnement activé !
              </p>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Profite de tes 7 jours d’essai gratuit. Tu peux annuler à tout
                moment.
              </p>
            </div>
          </div>
        )}

        {canceled && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 flex items-start gap-2">
            <XCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-300">
              Paiement annulé. Tu peux relancer l’essai à tout moment.
            </p>
          </div>
        )}

        <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
            Tier actuel
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <TierBadge tier={tier} />
            {profile?.subscription_cancel_at_period_end && periodEnd && (
              <span className="text-xs text-amber-300">
                Annulation prévue le {periodEnd.toLocaleDateString('fr-FR')}
              </span>
            )}
            {!profile?.subscription_cancel_at_period_end &&
              tier !== 'free' &&
              periodEnd && (
                <span className="text-xs text-slate-400">
                  Renouvellement le {periodEnd.toLocaleDateString('fr-FR')}
                </span>
              )}
          </div>

          {hasStripeSubscription && (
            <div className="mt-4">
              <PortalButton />
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-bold text-white mb-1">Choisis ton offre</h2>
          <p className="text-xs text-slate-400 mb-4">
            Le tier Gratuit reste complet et le restera toujours. Pro et Légende
            ajoutent des outils pour les pêcheurs qui en veulent plus.
          </p>
          <TiersGrid currentTier={tier} isDeveloper={isDeveloper} />
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">Bon à savoir</p>
          <p>• Essai gratuit de 7 jours sans engagement, annulation en 1 clic.</p>
          <p>• Paiement sécurisé par Stripe — aucune donnée bancaire n’est stockée par FishDex.</p>
          <p>• Tes captures et données restent à toi, même si tu annules ton abonnement.</p>
        </section>
      </main>
    </div>
  )
}
