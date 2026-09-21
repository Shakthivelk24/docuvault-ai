import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Star,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

import Logo from '@/components/ui/Logo'
import UserProfile from '@/components/ui/UserProfile'

export const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/documents',
    label: 'Documents',
    icon: FileText,
  },
  {
    to: '/ai-insights',
    label: 'AI Insights',
    icon: Sparkles,
  },
  {
    to: '/favorites',
    label: 'Favorites',
    icon: Star,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
]

// =========================================================
// NAV ITEM
// =========================================================

function NavItem({
  to,
  label,
  icon: Icon,
  onNavigate,
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `
          group
          relative
          flex
          h-11
          items-center
          gap-3
          rounded-xl
          px-3
          text-sm
          font-medium
          transition-all
          duration-200
          ${
            isActive
              ? 'bg-brand-500/10 text-brand-500'
              : 'text-muted hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]'
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator */}
          {isActive && (
            <span
              className="
                absolute
                left-0
                top-1/2
                h-6
                w-1
                -translate-y-1/2
                rounded-r-full
                bg-brand-500
              "
            />
          )}

          {/* Icon */}
          <span
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              transition-all
              duration-200
              ${
                isActive
                  ? 'bg-brand-500/10 text-brand-500'
                  : 'text-muted group-hover:bg-[rgb(var(--surface-1))] group-hover:text-[rgb(var(--text))]'
              }
            `}
          >
            <Icon
              className="h-[17px] w-[17px]"
              strokeWidth={isActive ? 2.2 : 1.8}
              aria-hidden="true"
            />
          </span>

          {/* Label */}
          <span className="flex-1">
            {label}
          </span>

          {/* Active arrow */}
          {isActive && (
            <ChevronRight
              className="
                h-4
                w-4
                shrink-0
                text-brand-500/60
              "
            />
          )}
        </>
      )}
    </NavLink>
  )
}

// =========================================================
// SIDEBAR CONTENT
// =========================================================

function SidebarContent({
  onNavigate,
}) {
  const { signOut } = useClerk()

  return (
    <div className="flex h-full flex-col">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          h-16
          shrink-0
          items-center
          justify-between
          border-b
          border-[rgb(var(--border))]
          px-4
          lg:px-5
        "
      >

        <Logo />

        {/* Mobile close button */}
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-muted
              transition-colors
              hover:bg-[rgb(var(--surface-2))]
              hover:text-[rgb(var(--text))]
              lg:hidden
            "
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}

      </div>


      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
        "
        aria-label="Main navigation"
      >

        <p
          className="
            mb-2
            px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-muted/70
          "
        >
          Workspace
        </p>

        <div className="space-y-1">

          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              onNavigate={onNavigate}
            />
          ))}

        </div>

      </nav>


      {/* ===================================================
          BOTTOM AREA
      =================================================== */}

      <div
        className="
          shrink-0
          border-t
          border-[rgb(var(--border))]
          p-3
        "
      >

        {/* Security status */}
        <div
          className="
            mb-3
            flex
            items-center
            gap-2.5
            rounded-xl
            border
            border-emerald-500/10
            bg-emerald-500/[0.05]
            px-3
            py-2.5
          "
        >

          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-emerald-500/10
              text-emerald-500
            "
          >
            <ShieldCheck className="h-4 w-4" />
          </div>

          <div className="min-w-0">

            <p className="text-xs font-medium">
              Secure storage
            </p>

            <p className="text-[10px] text-muted">
              Your files are protected
            </p>

          </div>

        </div>


        {/* User profile */}
        <div
          className="
            rounded-xl
            border
            border-transparent
            p-1
            transition-colors
            hover:border-[rgb(var(--border))]
            hover:bg-[rgb(var(--surface-2))]
          "
        >
          <UserProfile />
        </div>


        {/* Sign out */}
        <button
          type="button"
          onClick={() => signOut()}
          className="
            group
            mt-2
            flex
            h-10
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            text-sm
            font-medium
            text-red-500/80
            transition-all
            duration-200
            hover:bg-red-500/10
            hover:text-red-500
          "
        >

          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              transition-colors
              group-hover:bg-red-500/10
            "
          >
            <LogOut
              className="h-[17px] w-[17px]"
              aria-hidden="true"
            />
          </span>

          <span>
            Sign out
          </span>

        </button>

      </div>

    </div>
  )
}

// =========================================================
// SIDEBAR
// =========================================================

/**
 * Fixed sidebar on desktop,
 * slide-in drawer on mobile.
 */
export default function Sidebar({
  open,
  onClose,
}) {
  const { pathname } = useLocation()

  // Close mobile drawer whenever route changes.
  useEffect(() => {
    onClose?.()

    // The callback is intentionally excluded because
    // the drawer should react only to route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* ===================================================
          DESKTOP SIDEBAR
      =================================================== */}

      <aside
        className="
          surface
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          border-r
          border-[rgb(var(--border))]
          lg:block
        "
      >
        <SidebarContent />
      </aside>


      {/* ===================================================
          MOBILE DRAWER
      =================================================== */}

      <div
        className={`
          lg:hidden
          ${open ? '' : 'pointer-events-none'}
        `}
      >

        {/* Backdrop */}
        <div
          className={`
            fixed
            inset-0
            z-40
            bg-slate-950/60
            backdrop-blur-sm
            transition-opacity
            duration-300
            ${
              open
                ? 'opacity-100'
                : 'opacity-0'
            }
          `}
          onClick={onClose}
          aria-hidden="true"
        />


        {/* Drawer */}
        <aside
          className={`
            surface
            fixed
            inset-y-0
            left-0
            z-50
            w-[280px]
            border-r
            border-[rgb(var(--border))]
            shadow-2xl
            transition-transform
            duration-300
            ease-out
            ${
              open
                ? 'translate-x-0'
                : '-translate-x-full'
            }
          `}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >

          <SidebarContent
            onNavigate={onClose}
          />

        </aside>

      </div>
    </>
  )
}