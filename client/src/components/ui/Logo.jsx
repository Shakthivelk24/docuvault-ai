import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * SecureDocs wordmark. Renders as a link unless `to` is null.
 * @param {{ to, showText, className }} props
 */
export default function Logo({ to = '/', showText = true, className = '' }) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow-sm">
        <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Secure<span className="text-gradient">Docs</span>
        </span>
      )}
    </span>
  )

  if (to === null) return inner
  return (
    <Link to={to} className="rounded-xl focus-visible:outline-none" aria-label="SecureDocs home">
      {inner}
    </Link>
  )
}
