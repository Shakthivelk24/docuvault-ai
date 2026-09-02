import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { FileText, HardDrive, Sparkles, Loader2, Upload, ArrowRight, Clock } from 'lucide-react'
import StatsCard from '@/components/ui/StatsCard'
import DocumentGrid from '@/components/documents/DocumentGrid'
import UploadModal from '@/components/documents/UploadModal'
import EmptyState from '@/components/ui/EmptyState'
import { useDocuments } from '@/hooks/useDocuments'
import { useDocumentActions } from '@/hooks/useDocumentActions'
import { computeStats } from '@/services/api'
import { formatBytes, timeAgo } from '@/lib/format'

const ACTIVITY_TINTS = {
  upload: 'bg-blue-500/10 text-blue-500',
  ai: 'bg-brand-500/10 text-brand-500',
  view: 'bg-slate-500/10 text-slate-400',
  edit: 'bg-amber-500/10 text-amber-500',
}

export default function Dashboard() {
  const { user } = useUser()
  const { documents, setDocuments, loading, error, reload } = useDocuments()
  const { handlers, dialogs } = useDocumentActions({ setDocuments })
  const [uploadOpen, setUploadOpen] = useState(false)

  const stats = useMemo(() => computeStats(documents), [documents])
  const recent = documents.slice(0, 6)

  // Aggregate the latest activity across all documents.
  const activity = useMemo(() => {
    return documents
      .flatMap((d) => (d.activity || []).map((a) => ({ ...a, docName: d.name, docId: d.id })))
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 6)
  }, [documents])

  const firstName = user?.firstName || user?.username || 'there'

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Welcome back, {firstName}! <span className="align-middle">👋</span>
          </h1>
          <p className="mt-1 text-sm text-muted">Here's what's happening with your documents.</p>
        </div>
        <button className="btn-primary" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total documents" value={stats.totalDocuments} icon={FileText} loading={loading} />
        <StatsCard
          label="Storage used"
          value={formatBytes(stats.storageBytes)}
          icon={HardDrive}
          accent="blue"
          loading={loading}
          hint={`across ${stats.totalDocuments} files`}
        />
        <StatsCard label="AI processed" value={stats.aiProcessed} icon={Sparkles} accent="emerald" loading={loading} />
        <StatsCard label="In processing" value={stats.processing} icon={Loader2} accent="amber" loading={loading} />
      </div>

      {/* Recent documents + activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent documents</h2>
            <Link to="/documents" className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:gap-1.5">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {error ? (
            <div className="card">
              <EmptyState
                icon={FileText}
                title="Unable to load documents"
                description={error}
                action={
                  <button className="btn-secondary" onClick={reload}>
                    Try again
                  </button>
                }
              />
            </div>
          ) : !loading && recent.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={Upload}
                title="No documents yet"
                description="Upload your first document to see it analyzed by AI."
                action={
                  <button className="btn-primary" onClick={() => setUploadOpen(true)}>
                    <Upload className="h-4 w-4" /> Upload document
                  </button>
                }
              />
            </div>
          ) : (
            <DocumentGrid documents={recent} loading={loading} handlers={handlers} />
          )}
        </div>

        {/* Activity */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
          <div className="card p-2">
            {loading ? (
              <div className="space-y-3 p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 skeleton rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-2/3 skeleton" />
                      <div className="h-2.5 w-1/3 skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="p-4 text-sm text-muted">No activity yet.</p>
            ) : (
              <ul>
                {activity.map((a, i) => (
                  <li key={i}>
                    <Link
                      to={`/documents/${a.docId}`}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[rgb(var(--surface-2))]"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          ACTIVITY_TINTS[a.type] || ACTIVITY_TINTS.view
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{a.label}</span>
                        <span className="block truncate text-xs text-muted">{a.docName}</span>
                        <span className="block text-[11px] text-muted">{timeAgo(a.at)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(doc) => setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)])}
      />
      {dialogs}
    </div>
  )
}
