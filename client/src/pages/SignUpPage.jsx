import { SignUp, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import AuthLayout from '@/components/layout/AuthLayout'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <PageLoader />
  if (isSignedIn) return <Navigate to="/dashboard" replace />

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start storing and understanding your documents securely."
    >
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthLayout>
  )
}
