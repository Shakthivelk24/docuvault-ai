// Small pure formatting helpers shared across the app.

/** Human-readable file size from bytes. */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes < 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/** e.g. "Aug 24, 2026" */
export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** e.g. "Aug 24, 2026 · 3:41 PM" */
export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return `${formatDate(value)} · ${d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}

/** Relative time like "3h ago", "2d ago". */
export function timeAgo(value) {
  if (!value) return ''
  const d = new Date(value).getTime()
  const diff = Date.now() - d
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(value)
}

/** Upper-case file extension from a filename ("report.PDF" -> "PDF"). */
export function fileExtension(name = '') {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop().toUpperCase() : ''
}

/** Truncate a string with an ellipsis. */
export function truncate(str = '', max = 40) {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str
}
