import { ClerkProvider } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { getClerkAppearance } from '@/lib/clerkAppearance'

/**
 * Wraps ClerkProvider so Clerk uses React Router for navigation and picks up
 * the current light/dark appearance.
 */
export default function ClerkThemeBridge({ publishableKey, children }) {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={getClerkAppearance(isDark)}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
