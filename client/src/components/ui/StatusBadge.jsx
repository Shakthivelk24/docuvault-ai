import { CheckCircle2, Loader2, XCircle, Circle } from 'lucide-react'

// Processing status pill (Completed / Processing / Failed).
const STATUS = {
  completed: {
    Icon: CheckCircle2,
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-500',
    spin: false,
  },
  processing: {
    Icon: Loader2,
    label: 'Processing',
    className: 'bg-amber-500/10 text-amber-500',
    spin: true,
  },
  failed: {
    Icon: XCircle,
    label: 'Failed',
    className: 'bg-red-500/10 text-red-500',
    spin: false,
  },
}

export default function StatusBadge({ status, className = '' }) {
  const cfg = STATUS[status] ?? {
    Icon: Circle,
    label: status || 'Unknown',
    className: 'bg-slate-500/10 text-slate-400',
    spin: false,
  }
  const { Icon } = cfg
  return (
    <span className={`chip ${cfg.className} ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${cfg.spin ? 'animate-spin' : ''}`} aria-hidden="true" />
      {cfg.label}
    </span>
  )
}
