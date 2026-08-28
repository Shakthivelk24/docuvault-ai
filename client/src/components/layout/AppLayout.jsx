import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { registerTokenProvider } from '@/services/api'

/**
 * Shell for all authenticated pages: fixed sidebar (desktop) / drawer (mobile),
 * a sticky top bar, and the routed page content.
 */
export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { getToken } = useAuth()

  // Give the API layer a way to fetch a fresh Clerk token per request.
  // The frontend never persists the token itself.
  useEffect(() => {
    registerTokenProvider(() => getToken())
    return () => registerTokenProvider(null)
  }, [getToken])

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
