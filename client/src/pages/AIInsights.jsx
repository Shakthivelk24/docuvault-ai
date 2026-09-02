import { useMemo, useState, useEffect } from 'react'
import { Sparkles, FileCheck2, Loader2, Gauge, ChevronRight, ScanText } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import StatsCard from '@/components/ui/StatsCard'
import AISummary from '@/components/ai/AISummary'
import AIChat from '@/components/ai/AIChat'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'
import { useDocuments } from '@/hooks/useDocuments'
import { getFileMeta } from '@/lib/fileMeta'
import { timeAgo } from '@/lib/format'

export default function AIInsights() {
  const { documents, loading, error, reload } = useDocuments()
  const [selectedId, setSelectedId] = useState(null)

  const analyzed = useMemo(
    () => documents.filter((d) => d.status === 'completed' && d.summary),
    [documents],
  )
  const processing = useMemo(() => documents.filter((d) => d.status === 'processing'), [documents])

  const avgConfidence = useMemo(() => {
    const withClass = analyzed.filter((d) => d.classification)
    if (!withClass.length) return 0
    const sum = withClass.reduce((acc, d) => acc + d.classification.confidence, 0)
    return Math.round((sum / withClass.length) * 100)
  }, [analyzed])

  // Default the explorer to the first analyzed document.
  useEffect(() => {
    if (!selectedId && analyzed.length) setSelectedId(analyzed[0].id)
  }, [analyzed, selectedId])

  const selected = analyzed.find((d) => d.id === selectedId) || null

  return (
    <div>
      <PageHeader title="AI Insights" subtitle="Summaries, key topics, and answers extracted from your documents." />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total AI analyses" value={analyzed.length} icon={Sparkles} loading={loading} />
        <StatsCard label="Documents analyzed" value={analyzed.length} icon={FileCheck2} accent="emerald" loading={loading} />
        <StatsCard label="Processing queue" value={processing.length} icon={Loader2} accent="amber" loading={loading} />
        <StatsCard
          label="Avg. confidence"
          value={`${avgConfidence}%`}
          icon={Gauge}
          accent="blue"
          loading={loading}
          hint="across classifications"
        />
      </div>

      {error ? (
        <div className="card mt-6">
          <EmptyState
            icon={Sparkles}
            title="Unable to load insights"
            description={error}
            action={
              <button className="btn-secondary" onClick={reload}>
                Try again
              </button>
            }
          />
        </div>
      ) : !loading && analyzed.length === 0 ? (
        <div className="card mt-6">
          <EmptyState
            icon={ScanText}
            title="No insights yet"
            description="Once your documents finish AI processing, their summaries and topics will appear here."
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Document picker */}
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Analyzed documents</h2>
            <div className="card overflow-hidden">
              {loading ? (
                <div className="divide-y">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5">
                      <div className="h-9 w-9 skeleton rounded-lg" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-3/4 skeleton" />
                        <div className="h-2.5 w-1/3 skeleton" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="divide-y">
                  {analyzed.map((d) => {
                    const { Icon, tint, bg } = getFileMeta(d.type)
                    const active = d.id === selectedId
                    return (
                      <li key={d.id}>
                        <button
                          onClick={() => setSelectedId(d.id)}
                          className={`flex w-full items-center gap-3 p-3.5 text-left transition-colors ${
                            active ? 'bg-brand-500/10' : 'hover:bg-[rgb(var(--surface-2))]'
                          }`}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                            <Icon className={`h-4 w-4 ${tint}`} aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-sm font-medium ${active ? 'text-brand-500' : ''}`} title={d.name}>
                              {d.name}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {d.classification?.label || 'Document'} • {timeAgo(d.modifiedAt)}
                            </p>
                          </div>
                          <ChevronRight className={`h-4 w-4 shrink-0 ${active ? 'text-brand-500' : 'text-muted'}`} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {processing.length > 0 && (
              <div className="card mt-4 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing queue
                </p>
                <ul className="space-y-2">
                  {processing.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm">{d.name}</span>
                      <StatusBadge status={d.status} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Selected document insights + chat */}
          <div className="space-y-6 lg:col-span-2">
            {selected ? (
              <>
                <AISummary
                  summary={selected.summary}
                  keywords={selected.keywords}
                  classification={selected.classification}
                  status={selected.status}
                />
                <AIChat documentId={selected.id} documentName={selected.name} />
              </>
            ) : (
              <div className="card">
                <EmptyState icon={Sparkles} title="Select a document" description="Choose a document to view its AI insights and ask questions." />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
