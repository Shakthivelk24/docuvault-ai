import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Sparkles,
  Search,
  Lock,
  ArrowRight,
} from 'lucide-react'

import Logo from '@/components/ui/Logo'

const HIGHLIGHTS = [
  {
    icon: Lock,
    title: 'Private by default',
    text: 'Documents live in a private store, encrypted at rest and in transit.',
  },
  {
    icon: Sparkles,
    title: 'Understood by AI',
    text: 'Automatic summaries, keywords, and classification on every upload.',
  },
  {
    icon: Search,
    title: 'Find anything fast',
    text: 'Search across names and extracted content in one place.',
  },
]

/**
 * Two-column shell for the sign-in / sign-up pages.
 *
 * Left:
 * Brand story and product highlights.
 *
 * Right:
 * Clerk authentication widget.
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =================================================
            BRAND PANEL
        ================================================= */}

        <div
          className="
            relative
            hidden
            overflow-hidden
            bg-ink-950
            lg:flex
            lg:flex-col
            lg:justify-between
            lg:p-10
            xl:p-12
          "
        >

          {/* Background glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-96
              w-96
              rounded-full
              bg-brand-500/15
              blur-3xl
            "
            aria-hidden="true"
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              -left-32
              h-96
              w-96
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
            aria-hidden="true"
          />

          {/* Background effects */}
          <div
            className="absolute inset-0 bg-brand-radial"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-grid-lines bg-grid opacity-30"
            aria-hidden="true"
          />

          {/* =================================================
              BRAND LOGO
          ================================================= */}

          <div className="relative z-10">
            <Logo light />
          </div>

          {/* =================================================
              BRAND CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-10
              my-auto
              max-w-xl
              space-y-7
              py-10
            "
          >

            {/* Eyebrow */}
            <div>

              <span className="eyebrow">
                <ShieldCheck className="h-4 w-4" />

                Secure document intelligence
              </span>

              <h2
                className="
                  mt-5
                  font-display
                  text-3xl
                  font-bold
                  leading-[1.12]
                  tracking-tight
                  text-white
                  xl:text-4xl
                "
              >
                Your documents,
                <br />

                <span className="text-brand-300">
                  securely stored
                </span>

                <br />

                and intelligently managed.
              </h2>

              <p
                className="
                  mt-5
                  max-w-lg
                  text-sm
                  leading-6
                  text-slate-400
                "
              >
                SecureDocs combines secure cloud storage
                with AI-powered document intelligence,
                helping you organize, understand, and
                manage your files effortlessly.
              </p>

            </div>

            {/* =================================================
                HIGHLIGHTS
            ================================================= */}

            <div className="space-y-3">

              {HIGHLIGHTS.map((highlight) => {

                const Icon = highlight.icon

                return (
                  <div
                    key={highlight.title}
                    className="
                      group
                      flex
                      gap-4
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-white/[0.03]
                      p-4
                      transition-all
                      duration-200
                      hover:border-white/[0.10]
                      hover:bg-white/[0.05]
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-brand-500/10
                        text-brand-300
                        ring-1
                        ring-brand-500/10
                        transition-transform
                        duration-200
                        group-hover:scale-105
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-white">
                        {highlight.title}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-5
                          text-slate-400
                        "
                      >
                        {highlight.text}
                      </p>

                    </div>

                  </div>
                )
              })}

            </div>

            {/* Product link */}
            <Link
              to="/"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-slate-400
                transition-colors
                hover:text-white
              "
            >
              Explore SecureDocs

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              />
            </Link>

          </div>

          {/* =================================================
              SECURITY FOOTER
          ================================================= */}

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[0.06]" />

              <p
                className="
                  shrink-0
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Encrypted · Access-controlled · Audit-logged
              </p>

              <div className="h-px flex-1 bg-white/[0.06]" />

            </div>

          </div>

        </div>

        {/* =================================================
            FORM PANEL
        ================================================= */}

        <div
          className="
            flex
            min-h-screen
            flex-col
            items-center
            justify-center
            bg-[rgb(var(--bg))]
            px-4
            py-8
            sm:px-6
            sm:py-10
            lg:px-10
            xl:px-16
          "
        >

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div
              className="
                mb-8
                flex
                justify-center
                lg:hidden
              "
            >
              <Logo />
            </div>

            {/* Form header */}
            <div className="mb-5">

              <h1
                className="
                  font-display
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                "
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  className="
                    mt-2
                    text-sm
                    leading-5
                    text-muted
                  "
                >
                  {subtitle}
                </p>
              )}

            </div>

            {/* Clerk form */}
            <div className="w-full">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <p
                className="
                  mt-5
                  text-center
                  text-sm
                  leading-5
                  text-muted
                "
              >
                {footer}
              </p>
            )}

            {/* Back to home */}
            <div className="mt-5 flex justify-center">

              <Link
                to="/"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-muted
                  transition-colors
                  hover:bg-[rgb(var(--surface-2))]
                  hover:text-brand-500
                "
              >
                <span
                  className="
                    transition-transform
                    group-hover:-translate-x-0.5
                  "
                >
                  ←
                </span>

                Back to home
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}