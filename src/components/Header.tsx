import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavLinks } from './NavLinks'
import { UserMenu } from './UserMenu'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { username: string; avatar_url: string | null } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors shrink-0"
        >
          FishDex
        </Link>

        {/* Navigation (desktop uniquement — mobile via BottomNav) */}
        <div className="hidden md:block">
          <NavLinks />
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3 shrink-0">
          {user && profile ? (
            <UserMenu username={profile.username} avatarUrl={profile.avatar_url} />
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm font-medium text-teal-400 border border-teal-500/50 hover:bg-teal-500/10 rounded-lg transition-colors"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
