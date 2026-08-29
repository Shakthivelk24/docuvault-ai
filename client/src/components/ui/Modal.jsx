import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useDismiss } from '@/hooks/useDismiss'

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

/**
 * Accessible modal shell (backdrop + panel). Closes on Escape or backdrop click.
 * Reused by ConfirmDialog and UploadModal.
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const ref = useDismiss(onClose)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-slate-950/60 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`card relative z-10 w-full ${SIZES[size]} animate-fade-in-up rounded-b-none p-6 sm:rounded-2xl`}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="btn-ghost -m-2 rounded-lg p-2" aria-label="Close dialog">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  )
}
