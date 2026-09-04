import { SignIn, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import AuthLayout from '@/components/layout/AuthLayout'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <PageLoader />
  if (isSignedIn) return <Navigate to="/dashboard" replace />

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your secure documents.">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthLayout>
  )
}
