import { useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/useAuth'

function formatJoinDate(value?: string) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function AccountPage() {
  const { session } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const user = session?.user
  const displayName: string =
    user?.user_metadata?.display_name?.toString().trim() ||
    user?.user_metadata?.full_name?.toString().trim() ||
    user?.email?.split('@')[0] ||
    'Private Guest'

  const initials = useMemo(() => {
    const parts = displayName
      .split(' ')
      .map((part: string) => part.trim())
      .filter(Boolean)

    if (parts.length === 0) return 'JG'

    return parts
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase() ?? '')
      .join('')
  }, [displayName])

  const provider =
    user?.app_metadata?.providers?.[0] ??
    user?.app_metadata?.provider ??
    'email'

  const handleSignOut = async () => {
    setError(null)
    setIsSigningOut(true)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to sign out right now',
      )
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="page-container relative">
      <div className="px-6 pt-14 pb-5 border-b border-white/10 shrink-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-jin-red-vivid mb-2">
          Account Center
        </p>
        <h1 className="font-display text-4xl font-light text-jin-cream">
          Your <em className="text-jin-red-vivid">Profile</em>
        </h1>
        <p className="text-xs text-jin-muted mt-1">
          Manage your private access to the guide.
        </p>
      </div>

      <div className="scroll-area px-4 pt-5 space-y-4">
        <div className="card mx-0! p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-jin-red/15 border border-jin-red/30 flex items-center justify-center shrink-0">
              <span className="font-display text-2xl text-jin-cream">
                {initials}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-jin-gold mb-1">
                Private Member
              </p>
              <h2 className="font-display text-3xl leading-none text-jin-cream truncate">
                {displayName}
              </h2>
              <p className="text-sm text-jin-muted mt-2 truncate">
                {user?.email ?? 'No email available'}
              </p>
            </div>
          </div>
        </div>

        <div className="card mx-0! p-5 space-y-4">
          <div>
            <p className="section-label mb-1">Display Name</p>
            <p className="text-sm text-jin-cream">{displayName}</p>
          </div>

          <div className="h-px bg-white/6" />

          <div>
            <p className="section-label mb-1">Email</p>
            <p className="text-sm text-jin-cream break-all">
              {user?.email ?? '—'}
            </p>
          </div>

          <div className="h-px bg-white/6" />

          <div>
            <p className="section-label mb-1">Member Since</p>
            <p className="text-sm text-jin-cream">
              {formatJoinDate(user?.created_at)}
            </p>
          </div>

          <div className="h-px bg-white/6" />

          <div>
            <p className="section-label mb-1">Sign-in Method</p>
            <p className="text-sm text-jin-cream capitalize">
              {String(provider)}
            </p>
          </div>
        </div>

        <div className="card mx-0! p-5">
          <p className="section-label mb-2">House Notes</p>
          <p className="text-sm leading-relaxed text-jin-muted">
            You are signed into the private Jinchelin archive. Your account
            keeps your access ready whenever a new dish is served.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-jin-red/30 bg-jin-red/10 px-4 py-3">
            <p className="text-jin-blush text-xs">{error}</p>
          </div>
        )}

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full rounded-2xl border border-jin-red/35 bg-jin-red/10 px-4 py-4 text-xs font-medium uppercase tracking-[0.2em] text-jin-cream transition-colors duration-200 hover:bg-jin-red/20 active:bg-jin-red/25 disabled:opacity-50"
        >
          {isSigningOut ? 'Signing out...' : 'Log Out'}
        </button>

        <div className="h-4" />
      </div>
    </div>
  )
}
