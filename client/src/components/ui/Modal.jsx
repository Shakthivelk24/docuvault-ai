import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useDismiss } from '@/hooks/useDismiss'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * Accessible modal shell.
 *
 * - Closes on Escape
 * - Closes when clicking the backdrop
 * - Locks body scrolling while open
 * - Supports Light and Dark themes
 * - Reused by ConfirmDialog and UploadModal
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  // =======================================================
  // LOCK BODY SCROLL
  // =======================================================

  useEffect(() => {
    if (!open) return

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])


  // =======================================================
  // DISMISS HANDLER
  // =======================================================

  const ref = useDismiss(onClose)


  // =======================================================
  // CLOSED
  // =======================================================

  if (!open) {
    return null
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[90]
        flex
        items-end
        justify-center
        p-0
        sm:items-center
        sm:p-4
      "
    >

      {/* ===================================================
       * BACKDROP
       * =================================================== */}

      <div
        className="
          absolute
          inset-0
          animate-fade-in
          bg-slate-950/15
          backdrop-blur-[2px]
          dark:bg-slate-950/60
          dark:backdrop-blur-sm
        "
        aria-hidden="true"
      />


      {/* ===================================================
       * MODAL PANEL
       * =================================================== */}

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'relative',
          'z-10',
          'w-full',

          // Size
          SIZES[size] || SIZES.md,

          // Surface
          'overflow-hidden',
          'rounded-b-none',
          'rounded-t-2xl',
          'border',
          'border-[rgb(var(--border))]',
          'bg-[rgb(var(--surface-1))]',
          'text-[rgb(var(--text))]',

          // Shadow
          'shadow-2xl',

          // Animation
          'animate-fade-in-up',

          // Padding
          'p-6',

          // Desktop
          'sm:rounded-2xl',
        ].join(' ')}
      >

        {/* =================================================
         * HEADER
         * ================================================= */}

        {title && (
          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <h2
              className="
                min-w-0
                text-lg
                font-semibold
                text-[rgb(var(--text))]
              "
            >
              {title}
            </h2>


            <button
              type="button"
              onClick={onClose}
              className="
                btn-ghost
                -m-2
                rounded-lg
                p-2
                text-muted
                transition-colors
                hover:bg-[rgb(var(--surface-2))]
                hover:text-[rgb(var(--text))]
                focus:outline-none
                focus:ring-2
                focus:ring-brand-500/20
              "
              aria-label="Close dialog"
            >
              <X
                className="
                  h-5
                  w-5
                "
              />
            </button>

          </div>
        )}


        {/* =================================================
         * CONTENT
         * ================================================= */}

        <div
          className="
            text-[rgb(var(--text))]
          "
        >
          {children}
        </div>


        {/* =================================================
         * FOOTER
         * ================================================= */}

        {footer && (
          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[rgb(var(--border))]
              pt-5
              sm:flex-row
              sm:justify-end
            "
          >
            {footer}
          </div>
        )}

      </div>

    </div>
  )
}