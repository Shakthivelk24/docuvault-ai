import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import LoadingSpinner from './LoadingSpinner'

/**
 * Confirmation dialog for destructive or important actions.
 * @param {{ open, onClose, onConfirm, title, message, confirmLabel, variant, loading }} props
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}) {
  const isDanger = variant === 'danger'
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex items-start gap-4">
        {isDanger && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{title}</h2>
          {message && <p className="mt-1.5 text-sm text-muted">{message}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={isDanger ? 'btn-danger' : 'btn-primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <LoadingSpinner size={16} className="text-white" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
