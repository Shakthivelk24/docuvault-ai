import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Upload,
  FileText,
  LayoutGrid,
  List,
  FileType,
  Image as ImageIcon,
  Filter,
  ArrowDownUp,
  SlidersHorizontal,
  X,
  Sparkles,
} from 'lucide-react'

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
  {
    value: 'all',
    label: 'All types',
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: FileText,
  },
  {
    value: 'docx',
    label: 'DOCX',
    icon: FileType,
  },
  {
    value: 'image',
    label: 'Images',
    icon: ImageIcon,
  },
  {
    value: 'txt',
    label: 'TXT',
    icon: FileText,
  },
]

const STATUS_OPTIONS = [
  {
    value: 'all',
    label: 'All statuses',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'processing',
    label: 'Processing',
  },
  {
    value: 'failed',
    label: 'Failed',
  },
]

const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest first',
  },
  {
    value: 'oldest',
    label: 'Oldest first',
  },
  {
    value: 'name',
    label: 'Name (A–Z)',
  },
  {
    value: 'size',
    label: 'Largest first',
  },
]

const IMAGE_TYPES = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
]

// =========================================================
// DOCUMENTS PAGE
// =========================================================

export default function Documents() {
  const {
    documents,
    setDocuments,
    loading,
    error,
    reload,
  } = useDocuments()

  const {
    handlers,
    dialogs,
  } = useDocumentActions({
    setDocuments,
  })

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const [
    query,
    setQuery,
  ] = useState(
    searchParams.get('q') || ''
  )

  const [
    type,
    setType,
  ] = useState('all')

  const [
    status,
    setStatus,
  ] = useState('all')

  const [
    sort,
    setSort,
  ] = useState('newest')

  const [
    view,
    setView,
  ] = useState('grid')

  const [
    uploadOpen,
    setUploadOpen,
  ] = useState(false)


  // =========================================================
  // SYNC SEARCH PARAM
  // =========================================================

  useEffect(() => {
    const q =
      searchParams.get('q') || ''

    setQuery(q)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])


  // =========================================================
  // SEARCH
  // =========================================================

  function handleQuery(value) {
    setQuery(value)

    const next =
      new URLSearchParams(
        searchParams
      )

    if (value.trim()) {
      next.set(
        'q',
        value
      )
    } else {
      next.delete('q')
    }

    setSearchParams(
      next,
      {
        replace: true,
      }
    )
  }


  // =========================================================
  // FILTERING + SORTING
  // =========================================================

  const filtered = useMemo(() => {
    let list = [...documents]

    const q =
      query
        .trim()
        .toLowerCase()

    // Search
    if (q) {
      list = list.filter(
        (document) =>
          document.name
            ?.toLowerCase()
            .includes(q) ||

          (document.keywords || [])
            .some((keyword) =>
              keyword
                .toLowerCase()
                .includes(q)
            )
      )
    }

    // Type
    if (type !== 'all') {
      list = list.filter(
        (document) =>
          type === 'image'
            ? IMAGE_TYPES.includes(
                document.type
              )
            : document.type === type
      )
    }

    // Status
    if (status !== 'all') {
      list = list.filter(
        (document) =>
          document.status === status
      )
    }

    // Sort
    list.sort(
      (a, b) => {
        switch (sort) {
          case 'oldest':
            return (
              new Date(
                a.uploadedAt
              ) -
              new Date(
                b.uploadedAt
              )
            )

          case 'name':
            return (
              a.name || ''
            ).localeCompare(
              b.name || ''
            )

          case 'size':
            return (
              b.size || 0
            ) - (
              a.size || 0
            )

          case 'newest':
          default:
            return (
              new Date(
                b.uploadedAt
              ) -
              new Date(
                a.uploadedAt
              )
            )
        }
      }
    )

    return list
  }, [
    documents,
    query,
    type,
    status,
    sort,
  ])


  // =========================================================
  // ACTIVE FILTERS
  // =========================================================

  const hasSearch =
    query.trim().length > 0

  const hasTypeFilter =
    type !== 'all'

  const hasStatusFilter =
    status !== 'all'

  const hasFilters =
    hasSearch ||
    hasTypeFilter ||
    hasStatusFilter


  const filterCount = [
    hasSearch,
    hasTypeFilter,
    hasStatusFilter,
  ].filter(Boolean).length


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function clearFilters() {
    handleQuery('')
    setType('all')
    setStatus('all')
  }


  // =========================================================
  // TYPE LABEL
  // =========================================================

  function getTypeLabel() {
    return (
      TYPE_OPTIONS.find(
        (option) =>
          option.value === type
      )?.label || 'All types'
    )
  }


  // =========================================================
  // STATUS LABEL
  // =========================================================

  function getStatusLabel() {
    return (
      STATUS_OPTIONS.find(
        (option) =>
          option.value === status
      )?.label || 'All statuses'
    )
  }


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="pb-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        title="Documents"
        subtitle={
          loading
            ? 'Loading your secure vault...'
            : `${documents.length} ${
                documents.length === 1
                  ? 'document'
                  : 'documents'
              } in your secure vault`
        }
      >

        <button
          type="button"
          className="
            btn-primary
            h-10
            rounded-xl
            px-4
            shadow-sm
          "
          onClick={() =>
            setUploadOpen(true)
          }
        >
          <Upload className="h-4 w-4" />

          <span className="hidden sm:inline">
            Upload document
          </span>

          <span className="sm:hidden">
            Upload
          </span>
        </button>

      </PageHeader>


      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          border-[rgb(var(--border))]
          bg-[rgb(var(--surface-1))]
          p-3
          shadow-sm
        "
      >

        {/* Search + controls */}
        <div
          className="
            flex
            flex-col
            gap-3
            lg:flex-row
            lg:items-center
          "
        >

          {/* Search */}
          <div className="min-w-0 flex-1">

            <SearchBar
              value={query}
              onChange={handleQuery}
              placeholder="Search documents by name or keyword..."
              className="w-full"
            />

          </div>


          {/* Filters */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            <FilterDropdown
              label="Type"
              value={type}
              options={TYPE_OPTIONS}
              onChange={setType}
              icon={Filter}
            />

            <FilterDropdown
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={setStatus}
              icon={SlidersHorizontal}
            />

            <FilterDropdown
              label="Sort"
              value={sort}
              options={SORT_OPTIONS}
              onChange={setSort}
              icon={ArrowDownUp}
            />


            {/* View toggle */}
            <div
              className="
                flex
                h-10
                items-center
                gap-1
                rounded-xl
                border
                border-[rgb(var(--border))]
                bg-[rgb(var(--surface-2))]
                p-1
              "
            >

              <button
                type="button"
                onClick={() =>
                  setView('grid')
                }
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  transition-all
                  ${
                    view === 'grid'
                      ? 'bg-[rgb(var(--surface-1))] text-brand-500 shadow-sm'
                      : 'text-muted hover:text-[rgb(var(--text))]'
                  }
                `}
                aria-label="Grid view"
                aria-pressed={
                  view === 'grid'
                }
              >
                <LayoutGrid className="h-4 w-4" />
              </button>


              <button
                type="button"
                onClick={() =>
                  setView('list')
                }
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  transition-all
                  ${
                    view === 'list'
                      ? 'bg-[rgb(var(--surface-1))] text-brand-500 shadow-sm'
                      : 'text-muted hover:text-[rgb(var(--text))]'
                  }
                `}
                aria-label="List view"
                aria-pressed={
                  view === 'list'
                }
              >
                <List className="h-4 w-4" />
              </button>

            </div>

          </div>

        </div>


        {/* ===================================================
            RESULT SUMMARY
        =================================================== */}

        {!loading && (
          <div
            className="
              mt-3
              flex
              flex-col
              gap-2
              border-t
              border-[rgb(var(--border))]
              pt-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <p className="text-xs text-muted">
                Showing
                <span className="mx-1 font-semibold text-[rgb(var(--text))]">
                  {filtered.length}
                </span>
                of
                <span className="mx-1 font-semibold text-[rgb(var(--text))]">
                  {documents.length}
                </span>
                documents
              </p>


              {/* Filter count */}
              {filterCount > 0 && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-brand-500/10
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium
                    text-brand-500
                  "
                >
                  <Filter className="h-3 w-3" />

                  {filterCount}
                  {filterCount === 1
                    ? ' filter'
                    : ' filters'}
                </span>
              )}

            </div>


            {/* Clear */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  text-muted
                  transition-colors
                  hover:text-brand-500
                "
              >
                <X className="h-3.5 w-3.5" />

                Clear filters
              </button>
            )}

          </div>
        )}

      </div>


      {/* =====================================================
          ACTIVE FILTER CHIPS
      ===================================================== */}

      {hasFilters && !loading && (
        <div
          className="
            mb-5
            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <span className="text-xs text-muted">
            Active:
          </span>


          {hasSearch && (
            <button
              type="button"
              onClick={() =>
                handleQuery('')
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-brand-500/20
                bg-brand-500/10
                px-2.5
                py-1
                text-[11px]
                font-medium
                text-brand-500
                transition-colors
                hover:bg-brand-500/15
              "
            >
              Search: "{query}"

              <X className="h-3 w-3" />
            </button>
          )}


          {hasTypeFilter && (
            <button
              type="button"
              onClick={() =>
                setType('all')
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[rgb(var(--border))]
                bg-[rgb(var(--surface-2))]
                px-2.5
                py-1
                text-[11px]
                font-medium
                text-[rgb(var(--text))]
                transition-colors
                hover:border-brand-500/30
              "
            >
              {getTypeLabel()}

              <X className="h-3 w-3 text-muted" />
            </button>
          )}


          {hasStatusFilter && (
            <button
              type="button"
              onClick={() =>
                setStatus('all')
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[rgb(var(--border))]
                bg-[rgb(var(--surface-2))]
                px-2.5
                py-1
                text-[11px]
                font-medium
                text-[rgb(var(--text))]
                transition-colors
                hover:border-brand-500/30
              "
            >
              {getStatusLabel()}

              <X className="h-3 w-3 text-muted" />
            </button>
          )}

        </div>
      )}


      {/* =====================================================
          CONTENT
      ===================================================== */}

      {error ? (

        <div className="card">

          <EmptyState
            icon={FileText}
            title="Unable to load documents"
            description={error}
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={reload}
              >
                Try again
              </button>
            }
          />

        </div>

      ) : !loading &&
        filtered.length === 0 ? (

        <div
          className="
            card
            overflow-hidden
          "
        >

          <EmptyState
            icon={
              hasFilters
                ? Filter
                : Upload
            }
            title={
              hasFilters
                ? 'No matching documents'
                : 'No documents yet'
            }
            description={
              hasFilters
                ? 'Try adjusting your search or filters to find what you’re looking for.'
                : 'Upload your first document to get started with AI-powered insights.'
            }
            action={
              hasFilters ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={
                    clearFilters
                  }
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    setUploadOpen(
                      true
                    )
                  }
                >
                  <Upload className="h-4 w-4" />

                  Upload document
                </button>
              )
            }
          />

        </div>

      ) : view === 'grid' ? (

        <DocumentGrid
          documents={filtered}
          loading={loading}
          handlers={handlers}
        />

      ) : (

        <DocumentList
          documents={filtered}
          loading={loading}
          handlers={handlers}
        />

      )}


      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      <UploadModal
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
        onUploaded={(document) =>
          setDocuments((previous) => [
            document,
            ...previous.filter(
              (item) =>
                item.id !==
                document.id
            ),
          ])
        }
      />

      {dialogs}

    </div>
  )
}