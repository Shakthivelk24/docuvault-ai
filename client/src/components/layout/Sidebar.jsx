import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'
import { LayoutDashboard, FileText, Sparkles, Star, Settings, LogOut, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import UserProfile from '@/components/ui/UserProfile'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles },
  { to: '/favorites', label: 'Favorites', icon: Star },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />
          )}
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          {label}
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { signOut } = useClerk()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        {onNavigate && (
          <button onClick={onNavigate} className="btn-ghost rounded-lg p-2 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t p-3">
        <div className="rounded-xl p-2">
          <UserProfile />
        </div>
        <button
          onClick={() => signOut()}
          className="nav-item mt-1 w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )
}

/**
 * Fixed sidebar on desktop, slide-in drawer on mobile.
 */
export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    onClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* Desktop */}
      <aside className="surface fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
        <aside
          className={`surface fixed inset-y-0 left-0 z-50 w-72 border-r transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-label="Navigation menu"
        >
          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>
    </>
  )
}
