import DocumentCard from './DocumentCard'

/** Responsive grid of document cards, with loading skeletons. */
export default function DocumentGrid({ documents, loading, handlers = {} }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="h-12 w-12 skeleton rounded-xl" />
            <div className="mt-4 h-4 w-3/4 skeleton" />
            <div className="mt-2 h-3 w-1/3 skeleton" />
            <div className="mt-4 h-6 w-24 skeleton rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} {...handlers} />
      ))}
    </div>
  )
}
