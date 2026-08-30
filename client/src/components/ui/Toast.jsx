import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const CONFIG = {
  success: { Icon: CheckCircle2, tint: 'text-emerald-500', ring: 'ring-emerald-500/20' },
  error: { Icon: XCircle, tint: 'text-red-500', ring: 'ring-red-500/20' },
  warning: { Icon: AlertTriangle, tint: 'text-amber-500', ring: 'ring-amber-500/20' },
  info: { Icon: Info, tint: 'text-brand-500', ring: 'ring-brand-500/20' },
}

/** Presentational toast. State/lifecycle live in ToastContext. */
export default function Toast({ toast, onClose }) {
  const { Icon, tint, ring } = CONFIG[toast.type] ?? CONFIG.info
  return (
    <div
      role="status"
      className={`card pointer-events-auto flex w-full max-w-sm items-start gap-3 p-4 ring-1 ${ring} animate-fade-in-up`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tint}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
        <p className="text-sm text-muted">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="btn-ghost -m-1.5 rounded-lg p-1.5"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
