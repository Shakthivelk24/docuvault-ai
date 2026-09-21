import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * SecureDocs wordmark.
 *
 * @param {{
 *   to?: string | null,
 *   showText?: boolean,
 *   className?: string,
 *   light?: boolean
 * }} props
 */
export default function Logo({
  to = '/',
  showText = true,
  className = '',
  light = false,
}) {
  const inner = (
    <span
      className={`
        inline-flex
        items-center
        gap-2.5
        ${className}
      `}
    >
      {/* Logo icon */}
      <span
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-brand-gradient
          shadow-glow-sm
        "
      >
        <ShieldCheck
          className="h-5 w-5 text-white"
          aria-hidden="true"
        />
      </span>

      {/* Logo text */}
      {showText && (
        <span
          className={`
            font-display
            text-lg
            font-bold
            tracking-tight
            ${light ? 'text-white' : 'text-[rgb(var(--text))]'}
          `}
        >
          Secure
          <span className="text-gradient">
            Docs
          </span>
        </span>
      )}
    </span>
  )

  // Used when the logo should not be a link
  if (to === null) {
    return inner
  }

  return (
    <Link
      to={to}
      className="
        inline-flex
        rounded-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-500/40
      "
      aria-label="SecureDocs home"
    >
      {inner}
    </Link>
  )
}