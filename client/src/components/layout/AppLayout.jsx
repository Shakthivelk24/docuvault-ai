import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

import Sidebar from './Sidebar'
import Navbar from './Navbar'

import { registerTokenProvider } from '@/services/api'

/**
 * Shell for all authenticated pages.
 *
 * Desktop:
 * - Fixed sidebar
 * - Sticky top navbar
 *
 * Mobile:
 * - Slide-in sidebar drawer
 * - Sticky top navbar
 *
 * The Clerk token provider is registered here so the
 * API layer can request a fresh token whenever needed.
 */
export default function AppLayout() {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false)

  const {
    getToken,
  } = useAuth()


  // =========================================================
  // CLERK TOKEN PROVIDER
  // =========================================================

  useEffect(() => {
    registerTokenProvider(
      () => getToken()
    )

    return () => {
      registerTokenProvider(null)
    }
  }, [getToken])


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        overflow-x-hidden
        bg-[rgb(var(--bg))]
        text-[rgb(var(--text))]
      "
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        open={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />


      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

      <div
        className="
          min-h-screen
          lg:pl-64
        "
      >

        {/* ===================================================
            TOP NAVBAR
        =================================================== */}

        <Navbar
          onMenuClick={() =>
            setMenuOpen(true)
          }
        />


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-8
          "
        >
          <div
            className="
              animate-fade-in
            "
          >
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  )
}