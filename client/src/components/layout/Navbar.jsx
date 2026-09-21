import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  CheckCircle2,
  Upload,
  ArrowRight,
} from 'lucide-react'

import ThemeToggle from '@/components/ui/ThemeToggle'
import { useDismiss } from '@/hooks/useDismiss'
import { timeAgo } from '@/lib/format'

// =========================================================
// MOCK NOTIFICATIONS
// =========================================================

const NOTIFICATIONS = [
  {
    id: 1,
    icon: CheckCircle2,
    tint: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'AI processing completed',
    body: 'AWS Security Architecture.pdf is ready.',
    at: '2026-08-24T09:20:00Z',
  },
  {
    id: 2,
    icon: Sparkles,
    tint: 'text-brand-500',
    bg: 'bg-brand-500/10',
    title: 'New insight available',
    body: '7 keywords extracted from Cloud Security Guidelines.pdf.',
    at: '2026-08-24T08:02:00Z',
  },
  {
    id: 3,
    icon: Upload,
    tint: 'text-blue-500',
    bg: 'bg-blue-500/10',
    title: 'Upload complete',
    body: 'Project Documentation.docx was uploaded.',
    at: '2026-08-23T08:30:00Z',
  },
]

// =========================================================
// NOTIFICATIONS
// =========================================================

function Notifications() {
  const [open, setOpen] = useState(false)

  const close = useCallback(
    () => setOpen(false),
    []
  )

  const ref = useDismiss(close)

  return (
    <div
      ref={ref}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className={[
          'relative flex h-10 w-10 items-center justify-center',
          'rounded-xl text-muted',
          'transition-all duration-200',
          'hover:bg-[rgb(var(--surface-2))]',
          'hover:text-[rgb(var(--text))]',
          open
            ? 'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))]'
            : '',
        ].join(' ')}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px]" />

        {/* Notification indicator */}
        {NOTIFICATIONS.length > 0 && (
          <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-brand-500 ring-2 ring-[rgb(var(--surface))]" />
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 z-50 mt-2
            w-[calc(100vw-2rem)] max-w-sm
            overflow-hidden
            rounded-2xl
            border border-[rgb(var(--border))]
            bg-[rgb(var(--surface-1))]
            shadow-xl
            animate-fade-in
          "
        >

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3.5">

            <div>
              <p className="text-sm font-semibold">
                Notifications
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Recent activity
              </p>
            </div>

            {NOTIFICATIONS.length > 0 && (
              <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] font-medium text-brand-500">
                {NOTIFICATIONS.length} new
              </span>
            )}

          </div>

          {/* Notification list */}
          <ul className="max-h-[380px] overflow-y-auto">

            {NOTIFICATIONS.length === 0 ? (

              <li className="px-5 py-10 text-center">

                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--surface-2))] text-muted">
                  <Bell className="h-5 w-5" />
                </div>

                <p className="text-sm font-medium">
                  You're all caught up
                </p>

                <p className="mt-1 text-xs text-muted">
                  No new notifications.
                </p>

              </li>

            ) : (

              NOTIFICATIONS.map((notification) => {

                const Icon =
                  notification.icon

                return (
                  <li
                    key={notification.id}
                    className="
                      border-b
                      border-[rgb(var(--border))]
                      last:border-0
                    "
                  >
                    <button
                      type="button"
                      className="
                        flex w-full gap-3
                        px-4 py-3.5
                        text-left
                        transition-colors
                        hover:bg-[rgb(var(--surface-2))]
                      "
                    >

                      <span
                        className={`
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-xl
                          ${notification.bg}
                          ${notification.tint}
                        `}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <span className="min-w-0 flex-1">

                        <span className="block text-sm font-medium">
                          {notification.title}
                        </span>

                        <span className="mt-0.5 block text-xs leading-5 text-muted">
                          {notification.body}
                        </span>

                        <span className="mt-1 block text-[11px] text-muted/80">
                          {timeAgo(notification.at)}
                        </span>

                      </span>

                    </button>
                  </li>
                )
              })

            )}

          </ul>

          {/* Footer */}
          {NOTIFICATIONS.length > 0 && (
            <div className="border-t border-[rgb(var(--border))] p-2">

              <button
                type="button"
                className="
                  flex w-full
                  items-center justify-center
                  gap-1.5
                  rounded-xl
                  px-3 py-2
                  text-xs font-medium
                  text-brand-500
                  transition-colors
                  hover:bg-brand-500/10
                "
              >
                View all notifications
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

            </div>
          )}

        </div>
      )}
    </div>
  )
}

// =========================================================
// NAVBAR
// =========================================================

export default function Navbar({
  onMenuClick,
}) {
  const navigate = useNavigate()

  const [query, setQuery] =
    useState('')

  // =======================================================
  // SEARCH
  // =======================================================

  function onSearch(event) {
    event.preventDefault()

    const value = query.trim()

    navigate(
      `/documents${
        value
          ? `?q=${encodeURIComponent(value)}`
          : ''
      }`
    )
  }

  return (
    <header
      className="
        surface sticky top-0 z-30
        flex h-16 items-center
        border-b
        border-[rgb(var(--border))]
        px-3 sm:px-5 lg:px-6
      "
    >

      {/* ===================================================
          LEFT SIDE
      =================================================== */}

      <div className="flex min-w-0 flex-1 items-center gap-2">

        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            text-muted
            transition-colors
            hover:bg-[rgb(var(--surface-2))]
            hover:text-[rgb(var(--text))]
            lg:hidden
          "
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>


        {/* =================================================
            DESKTOP SEARCH
        ================================================= */}

        <form
          onSubmit={onSearch}
          className="
            relative hidden
            w-full max-w-xl
            sm:block
          "
        >

          <Search
            className="
              pointer-events-none
              absolute left-3.5 top-1/2
              h-4 w-4
              -translate-y-1/2
              text-muted
            "
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search documents..."
            className="
              h-10 w-full
              rounded-xl
              border border-transparent
              bg-[rgb(var(--surface-2))]
              pl-10 pr-4
              text-sm
              outline-none
              placeholder:text-muted
              transition-all duration-200
              focus:border-brand-500/30
              focus:bg-[rgb(var(--surface))]
              focus:ring-2
              focus:ring-brand-500/10
            "
            aria-label="Search documents"
          />

        </form>

      </div>


      {/* ===================================================
          RIGHT SIDE
      =================================================== */}

      <div className="ml-2 flex shrink-0 items-center gap-0.5 sm:gap-1">

        {/* Mobile search */}
        <button
          type="button"
          onClick={() =>
            navigate('/documents')
          }
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            text-muted
            transition-colors
            hover:bg-[rgb(var(--surface-2))]
            hover:text-[rgb(var(--text))]
            sm:hidden
          "
          aria-label="Search documents"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>


        {/* Theme */}
        <ThemeToggle />


        {/* Notifications */}
        <Notifications />


        {/* Divider */}
        <div className="mx-1.5 hidden h-6 w-px bg-[rgb(var(--border))] sm:block" />


        {/* User */}
        <div className="flex items-center">

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  'h-9 w-9 ring-2 ring-brand-500/10 transition-shadow hover:ring-brand-500/25',
              },
            }}
          />

        </div>

      </div>

    </header>
  )
}