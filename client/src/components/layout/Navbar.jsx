import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { Menu, Search, Bell, Sparkles, CheckCircle2, Upload } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useDismiss } from '@/hooks/useDismiss'
import { timeAgo } from '@/lib/format'

// Mock notifications for the bell dropdown.
const NOTIFICATIONS = [
  {
    id: 1,
    icon: CheckCircle2,
    tint: 'text-emerald-500',
    title: 'AI processing completed',
    body: 'AWS Security Architecture.pdf is ready.',
    at: '2026-08-24T09:20:00Z',
  },
  {
    id: 2,
    icon: Sparkles,
    tint: 'text-brand-500',
    title: 'New insight available',
    body: '7 keywords extracted from Cloud Security Guidelines.pdf.',
    at: '2026-08-24T08:02:00Z',
  },
  {
    id: 3,
    icon: Upload,
    tint: 'text-blue-500',
    title: 'Upload complete',
    body: 'Project Documentation.docx was uploaded.',
    at: '2026-08-23T08:30:00Z',
  },
]

function Notifications() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(close)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost relative rounded-xl p-2.5"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-[rgb(var(--surface))]" />
      </button>

      {open && (
        <div className="card absolute right-0 z-30 mt-2 w-80 overflow-hidden p-0 shadow-soft animate-fade-in">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <span className="chip bg-brand-500/10 text-brand-500">{NOTIFICATIONS.length} new</span>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-[rgb(var(--surface-2))]">
                <n.icon className={`mt-0.5 h-5 w-5 shrink-0 ${n.tint}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="truncate text-xs text-muted">{n.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{timeAgo(n.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Top bar for the authenticated app. */
export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function onSearch(e) {
    e.preventDefault()
    navigate(`/documents${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  return (
    <header className="surface sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
      <button onClick={onMenuClick} className="btn-ghost rounded-xl p-2.5 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      {/* Global search */}
      <form onSubmit={onSearch} className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="input pl-10"
          aria-label="Search documents"
        />
      </form>

      <div className="flex flex-1 items-center justify-end gap-1 sm:flex-none">
        <button
          onClick={() => navigate('/documents')}
          className="btn-ghost rounded-xl p-2.5 sm:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <ThemeToggle />
        <Notifications />
        <div className="ml-1 flex items-center">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: 'h-9 w-9 ring-2 ring-brand-500/20' } }}
          />
        </div>
      </div>
    </header>
  )
}
