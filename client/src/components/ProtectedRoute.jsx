import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/ui/LoadingSpinner'

/**
 * Gate for authenticated app pages.
 * - While Clerk loads its session, show a full-page loader.
 * - If signed out, redirect to /sign-in (remembering where they were headed).
 */
export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) return <PageLoader label="Checking your session…" />
  if (!isSignedIn) return <Navigate to="/sign-in" replace state={{ from: location }} />

  return children
}
