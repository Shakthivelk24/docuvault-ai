import { Link } from 'react-router-dom'
import { ShieldCheck, Sparkles, Search, Lock } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const HIGHLIGHTS = [
  { icon: Lock, title: 'Private by default', text: 'Documents live in a private store, encrypted at rest and in transit.' },
  { icon: Sparkles, title: 'Understood by AI', text: 'Automatic summaries, keywords, and classification on every upload.' },
  { icon: Search, title: 'Find anything fast', text: 'Search across names and extracted content in one place.' },
]

/**
 * Two-column shell for the sign-in / sign-up pages.
 * Left: brand story. Right: the Clerk widget (passed as children).
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-brand-radial" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-lines bg-grid opacity-40" aria-hidden="true" />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative space-y-8">
          <div>
            <span className="eyebrow">
              <ShieldCheck className="h-4 w-4" /> Secure document intelligence
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
              Your documents, securely stored and intelligently managed.
            </h2>
          </div>
          <ul className="space-y-5">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300">
                  <h.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{h.title}</p>
                  <p className="text-sm text-slate-400">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-xs text-slate-500">
          Encrypted · Access-controlled · Audit-logged
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-[rgb(var(--bg))] px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          </div>

          <div className="card p-6 sm:p-8">{children}</div>

          {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
          <p className="mt-6 text-center text-xs text-muted">
            <Link to="/" className="hover:text-brand-500">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
