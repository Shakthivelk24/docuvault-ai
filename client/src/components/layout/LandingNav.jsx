import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import Logo from '@/components/ui/Logo'
import ThemeToggle from '@/components/ui/ThemeToggle'

const LINKS = [
  {
    href: '#features',
    label: 'Features',
  },
  {
    href: '#security',
    label: 'Security',
  },
  {
    href: '#ai',
    label: 'AI',
  },
  {
    href: '#how',
    label: 'About',
  },
]

export default function LandingNav() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => {
    setOpen(false)
  }

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-white/[0.06]
        bg-[rgb(var(--bg))]/80
        backdrop-blur-xl
      "
    >
      <nav
        className="
          mx-auto flex h-[68px]
          max-w-7xl
          items-center
          justify-between
          px-4 sm:px-6 lg:px-8
        "
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={closeMenu}
          className="
            shrink-0
            transition-opacity
            hover:opacity-90
          "
        >
          <Logo />
        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden items-center gap-1 md:flex">

          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                group relative
                rounded-xl
                px-3.5 py-2.5
                text-sm font-medium
                text-muted
                transition-all duration-200
                hover:bg-white/[0.04]
                hover:text-[rgb(var(--text))]
              "
            >
              {link.label}

              {/* Hover underline */}
              <span
                className="
                  absolute
                  bottom-1.5 left-1/2
                  h-0.5 w-0
                  -translate-x-1/2
                  rounded-full
                  bg-brand-500
                  transition-all duration-200
                  group-hover:w-4
                "
              />
            </a>
          ))}

        </div>


        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-2 md:flex">

          <ThemeToggle />

          <Link
            to="/sign-in"
            className="
              rounded-xl
              px-4 py-2.5
              text-sm font-medium
              text-muted
              transition-all duration-200
              hover:bg-white/[0.04]
              hover:text-[rgb(var(--text))]
            "
          >
            Sign in
          </Link>

          <Link
            to="/sign-up"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-brand-500
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-sm
              shadow-brand-500/20
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-brand-400
              hover:shadow-md
              hover:shadow-brand-500/20
            "
          >
            <Sparkles className="h-4 w-4" />

            Get started

            <ArrowRight
              className="
                h-3.5 w-3.5
                transition-transform duration-200
                group-hover:translate-x-0.5
              "
            />
          </Link>

        </div>


        {/* =================================================
            MOBILE ACTIONS
        ================================================= */}

        <div className="flex items-center gap-1 md:hidden">

          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setOpen((value) => !value)
            }
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              text-muted
              transition-all duration-200
              hover:bg-[rgb(var(--surface-2))]
              hover:text-[rgb(var(--text))]
            "
            aria-label={
              open
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

        </div>

      </nav>


      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      {open && (
        <div
          className="
            border-t
            border-white/[0.06]
            bg-[rgb(var(--bg))]/95
            px-4 pb-5 pt-3
            backdrop-blur-xl
            md:hidden
          "
        >

          <div className="mx-auto max-w-7xl">

            {/* Navigation links */}
            <div className="space-y-1">

              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="
                    flex items-center
                    justify-between
                    rounded-xl
                    px-4 py-3
                    text-sm font-medium
                    text-muted
                    transition-colors
                    hover:bg-[rgb(var(--surface-2))]
                    hover:text-[rgb(var(--text))]
                  "
                >
                  {link.label}

                  <ArrowRight className="h-4 w-4 opacity-40" />
                </a>
              ))}

            </div>


            {/* Divider */}
            <div className="my-4 h-px bg-white/[0.06]" />


            {/* Auth actions */}
            <div className="grid grid-cols-2 gap-2">

              <Link
                to="/sign-in"
                onClick={closeMenu}
                className="
                  flex items-center
                  justify-center
                  rounded-xl
                  border border-white/[0.08]
                  bg-white/[0.03]
                  px-4 py-3
                  text-sm font-medium
                  text-[rgb(var(--text))]
                  transition-colors
                  hover:bg-white/[0.06]
                "
              >
                Sign in
              </Link>

              <Link
                to="/sign-up"
                onClick={closeMenu}
                className="
                  group
                  flex items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  bg-brand-500
                  px-4 py-3
                  text-sm font-semibold
                  text-white
                  transition-all
                  hover:bg-brand-400
                "
              >
                Get started

                <ArrowRight
                  className="
                    h-3.5 w-3.5
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </Link>

            </div>

          </div>

        </div>
      )}
    </header>
  )
}