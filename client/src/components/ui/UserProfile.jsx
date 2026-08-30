import { useUser } from '@clerk/clerk-react'

/** Small avatar + name/email block. `compact` is used in the sidebar. */
export default function UserProfile({ compact = false }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full skeleton" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-3 w-24 skeleton" />
          <div className="h-2.5 w-32 skeleton" />
        </div>
      </div>
    )
  }

  const name = user?.fullName || user?.username || 'User'
  const email = user?.primaryEmailAddress?.emailAddress || ''
  const initial = (name?.[0] || 'U').toUpperCase()

  return (
    <div className="flex items-center gap-3">
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={name}
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-brand-500/20"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{name}</p>
        {!compact && email && <p className="truncate text-xs text-muted">{email}</p>}
      </div>
    </div>
  )
}
