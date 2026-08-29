import { Loader2 } from 'lucide-react'

/** Inline spinner. */
export default function LoadingSpinner({ size = 20, className = '' }) {
  return (
    <Loader2
      className={`animate-spin text-brand-500 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

/** Full-page loader used while auth/session or a whole view is loading. */
export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[rgb(var(--bg))]">
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
          <LoadingSpinner size={26} className="text-white" />
        </div>
      </div>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
