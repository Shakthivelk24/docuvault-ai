import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Upload, FileText, LayoutGrid, List, FileType, Image as ImageIcon, Filter, ArrowDownUp, SlidersHorizontal } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import SearchBar from '@/components/ui/SearchBar'
import FilterDropdown from '@/components/ui/FilterDropdown'
import DocumentGrid from '@/components/documents/DocumentGrid'
import DocumentList from '@/components/documents/DocumentList'
import EmptyState from '@/components/ui/EmptyState'
import UploadModal from '@/components/documents/UploadModal'
import { useDocuments } from '@/hooks/useDocuments'
import { useDocumentActions } from '@/hooks/useDocumentActions'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'docx', label: 'DOCX', icon: FileType },
  { value: 'image', label: 'Images', icon: ImageIcon },
  { value: 'txt', label: 'TXT', icon: FileText },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'size', label: 'Largest first' },
]

const IMAGE_TYPES = ['png', 'jpg', 'jpeg']

export default function Documents() {
  const { documents, setDocuments, loading, error, reload } = useDocuments()
  const { handlers, dialogs } = useDocumentActions({ setDocuments })

  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [uploadOpen, setUploadOpen] = useState(false)

  // Keep the query in sync when navigated to from the top-bar search.
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function handleQuery(value) {
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = [...documents]
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.keywords || []).some((k) => k.toLowerCase().includes(q)),
      )
    }
    if (type !== 'all') {
      list = list.filter((d) => (type === 'image' ? IMAGE_TYPES.includes(d.type) : d.type === type))
    }
    if (status !== 'all') {
      list = list.filter((d) => d.status === status)
    }
    list.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.uploadedAt) - new Date(b.uploadedAt)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return (b.size || 0) - (a.size || 0)
        default:
          return new Date(b.uploadedAt) - new Date(a.uploadedAt)
      }
    })
    return list
  }, [documents, query, type, status, sort])

  const hasFilters = query || type !== 'all' || status !== 'all'

  function clearFilters() {
    handleQuery('')
    setType('all')
    setStatus('all')
  }

  return (
    <div>
      <PageHeader title="Documents" subtitle={`${documents.length} documents in your secure vault`}>
        <button className="btn-primary" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </PageHeader>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchBar
            value={query}
            onChange={handleQuery}
            placeholder="Search by name or keyword…"
            className="lg:max-w-md lg:flex-1"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown label="Type" value={type} options={TYPE_OPTIONS} onChange={setType} icon={Filter} />
            <FilterDropdown label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} icon={SlidersHorizontal} />
            <FilterDropdown label="Sort" value={sort} options={SORT_OPTIONS} onChange={setSort} icon={ArrowDownUp} />

            {/* View toggle */}
            <div className="surface flex items-center gap-1 rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`rounded-lg p-1.5 transition-colors ${
                  view === 'grid' ? 'bg-brand-500/10 text-brand-500' : 'text-muted hover:text-[rgb(var(--text))]'
                }`}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`rounded-lg p-1.5 transition-colors ${
                  view === 'list' ? 'bg-brand-500/10 text-brand-500' : 'text-muted hover:text-[rgb(var(--text))]'
                }`}
                aria-label="List view"
                aria-pressed={view === 'list'}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!loading && (
          <p className="text-xs text-muted">
            Showing {filtered.length} of {documents.length}
            {hasFilters && (
              <button onClick={clearFilters} className="ml-2 font-medium text-brand-500 hover:underline">
                Clear filters
              </button>
            )}
          </p>
        )}
      </div>

      {/* Content */}
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
      ) : !loading && filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={hasFilters ? Filter : Upload}
            title={hasFilters ? 'No matching documents' : 'No documents yet'}
            description={
              hasFilters
                ? 'Try adjusting your search or filters to find what you’re looking for.'
                : 'Upload your first document to get started with AI-powered insights.'
            }
            action={
              hasFilters ? (
                <button className="btn-secondary" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : (
                <button className="btn-primary" onClick={() => setUploadOpen(true)}>
                  <Upload className="h-4 w-4" /> Upload document
                </button>
              )
            }
          />
        </div>
      ) : view === 'grid' ? (
        <DocumentGrid documents={filtered} loading={loading} handlers={handlers} />
      ) : (
        <DocumentList documents={filtered} loading={loading} handlers={handlers} />
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(doc) => setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)])}
      />
      {dialogs}
    </div>
  )
}
