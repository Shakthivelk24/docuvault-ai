import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import DocumentActionsMenu from './DocumentActionsMenu'
import { getFileMeta } from '@/lib/fileMeta'
import { formatBytes, formatDate } from '@/lib/format'

function Row({ doc, handlers }) {
  const { Icon, tint, bg, label } = getFileMeta(doc.type)
  return (
    <Link
      to={`/documents/${doc.id}`}
      className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[rgb(var(--surface-2))] sm:grid-cols-[auto,minmax(0,2.5fr),1fr,1fr,auto,auto]"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${tint}`} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold" title={doc.name}>
          {doc.name}
        </p>
        <p className="font-mono text-xs text-muted sm:hidden">
          {label} • {formatBytes(doc.size)} • {formatDate(doc.uploadedAt)}
        </p>
      </div>

      <p className="hidden font-mono text-xs text-muted sm:block">{formatBytes(doc.size)}</p>
      <p className="hidden text-xs text-muted sm:block">{formatDate(doc.uploadedAt)}</p>

      <div className="hidden sm:block">
        <StatusBadge status={doc.status} />
      </div>

      <div className="flex items-center gap-0.5" onClick={(e) => e.preventDefault()}>
        {doc.favorite && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
        <DocumentActionsMenu
          onView={() => handlers.onView?.(doc)}
          onDownload={() => handlers.onDownload?.(doc)}
          onRename={() => handlers.onRename?.(doc)}
          onDelete={() => handlers.onDelete?.(doc)}
          onAnalyze={() => handlers.onAnalyze?.(doc)}
        />
      </div>
    </Link>
  )
}

/** List/table view of documents, with loading skeletons. */
export default function DocumentList({ documents, loading, handlers = {} }) {
  return (
    <div className="card overflow-hidden">
      {/* Column headers (desktop) */}
      <div className="hidden grid-cols-[auto,minmax(0,2.5fr),1fr,1fr,auto,auto] gap-3 border-b px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted sm:grid">
        <span className="w-10" />
        <span>Name</span>
        <span>Size</span>
        <span>Uploaded</span>
        <span>Status</span>
        <span className="w-9" />
      </div>

      <div className="divide-y">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="h-10 w-10 shrink-0 skeleton rounded-lg" />
                <div className="h-4 flex-1 skeleton" />
                <div className="hidden h-4 w-20 skeleton sm:block" />
              </div>
            ))
          : documents.map((doc) => <Row key={doc.id} doc={doc} handlers={handlers} />)}
      </div>
    </div>
  )
}
