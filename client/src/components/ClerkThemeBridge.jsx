import { ClerkProvider } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@/context/ThemeContext'
import { getClerkAppearance } from '@/lib/clerkAppearance'

/**
 * Connects Clerk with:
 *
 * - React Router navigation
 * - Application light/dark theme
 * - Custom Clerk appearance
 * - Sign-out redirect
 */
export default function ClerkThemeBridge({
  publishableKey,
  children,
}) {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={getClerkAppearance(isDark)}

      // Use React Router instead of full-page navigation.
      routerPush={(to) => navigate(to)}
      routerReplace={(to) =>
        navigate(to, {
          replace: true,
        })
      }

      // Redirect after signing out.
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}