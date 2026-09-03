import { useMemo, useState } from 'react'
import { Star, FileText } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import SearchBar from '@/components/ui/SearchBar'
import DocumentGrid from '@/components/documents/DocumentGrid'
import EmptyState from '@/components/ui/EmptyState'
import { useDocuments } from '@/hooks/useDocuments'
import { useDocumentActions } from '@/hooks/useDocumentActions'

export default function Favorites() {
  const { documents, setDocuments, loading, error, reload } = useDocuments()
  const { handlers, dialogs } = useDocumentActions({ setDocuments })
  const [query, setQuery] = useState('')

  const favorites = useMemo(() => {
    const q = query.trim().toLowerCase()
    return documents
      .filter((d) => d.favorite)
      .filter((d) => !q || d.name.toLowerCase().includes(q) || (d.keywords || []).some((k) => k.toLowerCase().includes(q)))
  }, [documents, query])

  return (
    <div>
      <PageHeader title="Favorites" subtitle="Documents you've starred for quick access.">
        {!loading && documents.some((d) => d.favorite) && (
          <SearchBar value={query} onChange={setQuery} placeholder="Search favorites…" className="w-56" />
        )}
      </PageHeader>

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
      ) : !loading && favorites.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Star}
            title={query ? 'No matching favorites' : 'No favorites yet'}
            description={
              query
                ? 'Try a different search term.'
                : 'Tap the star on any document to add it here for quick access.'
            }
          />
        </div>
      ) : (
        <DocumentGrid documents={favorites} loading={loading} handlers={handlers} />
      )}

      {dialogs}
    </div>
  )
}
