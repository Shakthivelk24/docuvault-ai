import LoadingSpinner from './LoadingSpinner'

/**
 * Metric card for dashboards.
 * @param {{ label, value, icon, hint, loading, accent }} props
 */
export default function StatsCard({ label, value, icon: Icon, hint, loading = false, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-500/10 text-brand-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    blue: 'bg-blue-500/10 text-blue-500',
  }
  return (
    <div className="card p-5 transition-shadow hover:shadow-glow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{label}</p>
          {loading ? (
            <div className="mt-2 h-8 w-20 skeleton" />
          ) : (
            <p className="mt-1 font-display text-3xl font-bold tracking-tight">{value}</p>
          )}
          {hint && !loading && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
