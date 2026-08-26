import { Link } from 'react-router-dom'
import { Sparkles, Star, Clock } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import DocumentActionsMenu from './DocumentActionsMenu'
import { getFileMeta } from '@/lib/fileMeta'
import { formatBytes, formatDate } from '@/lib/format'

/**
 * Grid card for a single document.
 * @param {{ document, onView, onDownload, onRename, onDelete, onAnalyze, onToggleFavorite }} props
 */
export default function DocumentCard({
  document: doc,
  onView,
  onDownload,
  onRename,
  onDelete,
  onAnalyze,
  onToggleFavorite,
}) {
  const { Icon, tint, bg, label } = getFileMeta(doc.type)
  const aiDone = doc.status === 'completed'

  return (
    <Link
      to={`/documents/${doc.id}`}
      className="card group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-6 w-6 ${tint}`} aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite?.(doc)
            }}
            className="btn-ghost rounded-lg p-2"
            aria-label={doc.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`h-4 w-4 ${doc.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <DocumentActionsMenu
            onView={() => onView?.(doc)}
            onDownload={() => onDownload?.(doc)}
            onRename={() => onRename?.(doc)}
            onDelete={() => onDelete?.(doc)}
            onAnalyze={() => onAnalyze?.(doc)}
          />
        </div>
      </div>

      <h3 className="mt-4 line-clamp-2 font-semibold leading-snug" title={doc.name}>
        {doc.name}
      </h3>

      <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted">
        <span className="font-semibold">{label}</span>
        <span aria-hidden="true">•</span>
        <span>{formatBytes(doc.size)}</span>
      </p>

      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
        <Clock className="h-3.5 w-3.5" />
        {formatDate(doc.uploadedAt)}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4">
        <StatusBadge status={doc.status} />
        {aiDone && (
          <span className="chip bg-brand-500/10 text-brand-500">
            <Sparkles className="h-3.5 w-3.5" />
            AI ready
          </span>
        )}
      </div>
    </Link>
  )
}
