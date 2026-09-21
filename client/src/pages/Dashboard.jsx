import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  FileText,
  HardDrive,
  Sparkles,
  Loader2,
  Upload,
  ArrowRight,
  Clock,
  Plus,
  Brain,
  Activity,
  FolderOpen,
  ChevronRight,
} from 'lucide-react'

import StatsCard from '@/components/ui/StatsCard'
import DocumentGrid from '@/components/documents/DocumentGrid'
import UploadModal from '@/components/documents/UploadModal'
import EmptyState from '@/components/ui/EmptyState'

import { useDocuments } from '@/hooks/useDocuments'
import { useDocumentActions } from '@/hooks/useDocumentActions'
import { computeStats } from '@/services/api'
import { formatBytes, timeAgo } from '@/lib/format'

const ACTIVITY_TINTS = {
  upload: 'bg-blue-500/10 text-blue-400 ring-blue-500/10',
  ai: 'bg-brand-500/10 text-brand-400 ring-brand-500/10',
  view: 'bg-slate-500/10 text-slate-400 ring-slate-500/10',
  edit: 'bg-amber-500/10 text-amber-400 ring-amber-500/10',
}

const ACTIVITY_ICONS = {
  upload: Upload,
  ai: Sparkles,
  view: FileText,
  edit: Activity,
}

export default function Dashboard() {
  const { user } = useUser()

  const {
    documents,
    setDocuments,
    loading,
    error,
    reload,
  } = useDocuments()

  const { handlers, dialogs } =
    useDocumentActions({
      setDocuments,
    })

  const [uploadOpen, setUploadOpen] =
    useState(false)

  const stats = useMemo(
    () => computeStats(documents),
    [documents]
  )

  const recent = documents.slice(0, 6)

  // =========================================================
  // ACTIVITY
  // =========================================================

  const activity = useMemo(() => {
    return documents
      .flatMap((document) =>
        (document.activity || []).map(
          (item) => ({
            ...item,
            docName: document.name,
            docId: document.id,
          })
        )
      )
      .sort(
        (a, b) =>
          new Date(b.at) -
          new Date(a.at)
      )
      .slice(0, 6)
  }, [documents])

  // =========================================================
  // USER
  // =========================================================

  const firstName =
    user?.firstName ||
    user?.username ||
    'there'

  // =========================================================
  // AI PROCESSING PERCENTAGE
  // =========================================================

  const processingPercentage =
    stats.totalDocuments > 0
      ? Math.min(
          100,
          Math.round(
            (stats.aiProcessed /
              stats.totalDocuments) *
              100
          )
        )
      : 0

  return (
    <div className="space-y-8 pb-8">

      {/* =====================================================
          WELCOME HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-6 shadow-sm sm:p-8">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-500">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered document management
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {firstName}! 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Manage your documents, analyze files with AI,
              and keep everything organized in one secure place.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">

            <Link
              to="/documents"
              className="btn-secondary justify-center"
            >
              <FolderOpen className="h-4 w-4" />
              View documents
            </Link>

            <button
              className="btn-primary justify-center"
              onClick={() =>
                setUploadOpen(true)
              }
            >
              <Plus className="h-4 w-4" />
              Upload document
            </button>

          </div>
        </div>
      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Overview
            </h2>

            <p className="mt-0.5 text-xs text-muted">
              Your document activity at a glance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatsCard
            label="Total documents"
            value={stats.totalDocuments}
            icon={FileText}
            loading={loading}
          />

          <StatsCard
            label="Storage used"
            value={formatBytes(
              stats.storageBytes
            )}
            icon={HardDrive}
            accent="blue"
            loading={loading}
            hint={`across ${stats.totalDocuments} files`}
          />

          <StatsCard
            label="AI processed"
            value={stats.aiProcessed}
            icon={Sparkles}
            accent="emerald"
            loading={loading}
            hint={
              stats.totalDocuments > 0
                ? `${processingPercentage}% of documents`
                : 'No documents analyzed'
            }
          />

          <StatsCard
            label="In processing"
            value={stats.processing}
            icon={Loader2}
            accent="amber"
            loading={loading}
            hint={
              stats.processing > 0
                ? 'AI analysis in progress'
                : 'Everything is up to date'
            }
          />

        </div>
      </section>


      {/* =====================================================
          AI OVERVIEW
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-brand-500/15 bg-gradient-to-br from-brand-500/[0.08] via-[rgb(var(--surface-1))] to-[rgb(var(--surface-1))]">

        <div className="relative p-5 sm:p-6">

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 ring-1 ring-brand-500/10">
                <Brain className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-semibold">
                  AI document intelligence
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
                  Analyze your documents with AI to
                  generate summaries, key points,
                  keywords, and useful insights.
                </p>
              </div>

            </div>

            <Link
              to="/ai-insights"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-500 transition hover:bg-brand-500/15"
            >
              View AI insights
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {/* AI progress */}
          <div className="relative mt-6">

            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted">
                Documents analyzed
              </span>

              <span className="font-medium">
                {stats.aiProcessed}/
                {stats.totalDocuments}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[rgb(var(--surface-2))]">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-700"
                style={{
                  width: `${processingPercentage}%`,
                }}
              />
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          RECENT DOCUMENTS + ACTIVITY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ===================================================
            RECENT DOCUMENTS
        =================================================== */}

        <section className="xl:col-span-2">

          <div className="mb-4 flex items-end justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Recent documents
              </h2>

              <p className="mt-1 text-xs text-muted">
                Your latest uploaded files
              </p>
            </div>

            <Link
              to="/documents"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-400"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

          </div>


          {error ? (

            <div className="card overflow-hidden">

              <EmptyState
                icon={FileText}
                title="Unable to load documents"
                description={error}
                action={
                  <button
                    className="btn-secondary"
                    onClick={reload}
                  >
                    Try again
                  </button>
                }
              />

            </div>

          ) : !loading &&
            recent.length === 0 ? (

            <div className="card overflow-hidden">

              <EmptyState
                icon={Upload}
                title="No documents yet"
                description="Upload your first document to start organizing and analyzing your files with AI."
                action={
                  <button
                    className="btn-primary"
                    onClick={() =>
                      setUploadOpen(true)
                    }
                  >
                    <Upload className="h-4 w-4" />
                    Upload document
                  </button>
                }
              />

            </div>

          ) : (

            <div className="rounded-2xl">
              <DocumentGrid
                documents={recent}
                loading={loading}
                handlers={handlers}
              />
            </div>

          )}

        </section>


        {/* ===================================================
            RECENT ACTIVITY
        =================================================== */}

        <section>

          <div className="mb-4">

            <h2 className="text-lg font-semibold">
              Recent activity
            </h2>

            <p className="mt-1 text-xs text-muted">
              Latest actions across your documents
            </p>

          </div>


          <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] shadow-sm">

            {loading ? (

              <div className="space-y-4 p-4">

                {Array.from({
                  length: 5,
                }).map((_, i) => (

                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >

                    <div className="h-9 w-9 shrink-0 rounded-xl skeleton" />

                    <div className="min-w-0 flex-1 space-y-2">

                      <div className="h-3 w-2/3 rounded skeleton" />

                      <div className="h-2.5 w-1/2 rounded skeleton" />

                    </div>

                  </div>

                ))}

              </div>

            ) : activity.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(var(--surface-2))] text-muted">

                  <Clock className="h-5 w-5" />

                </div>

                <p className="text-sm font-medium">
                  No activity yet
                </p>

                <p className="mt-1 text-xs text-muted">
                  Your document activity will appear here.
                </p>

              </div>

            ) : (

              <ul className="divide-y divide-[rgb(var(--border))]">

                {activity.map((item, index) => {

                  const ActivityIcon =
                    ACTIVITY_ICONS[
                      item.type
                    ] || Clock

                  const tint =
                    ACTIVITY_TINTS[
                      item.type
                    ] ||
                    ACTIVITY_TINTS.view

                  return (

                    <li key={index}>

                      <Link
                        to={`/documents/${item.docId}`}
                        className="group flex items-start gap-3 p-4 transition-colors hover:bg-[rgb(var(--surface-2))]"
                      >

                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${tint}`}
                        >
                          <ActivityIcon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1">

                          <span className="flex items-center justify-between gap-2">

                            <span className="block truncate text-sm font-medium">
                              {item.label}
                            </span>

                            <ChevronRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />

                          </span>

                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {item.docName}
                          </span>

                          <span className="mt-1 block text-[11px] text-muted/80">
                            {timeAgo(item.at)}
                          </span>

                        </span>

                      </Link>

                    </li>

                  )
                })}

              </ul>

            )}

          </div>

        </section>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold">
            Quick actions
          </h2>

          <p className="mt-1 text-xs text-muted">
            Jump straight into your most common tasks
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <button
            onClick={() =>
              setUploadOpen(true)
            }
            className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
              <Upload className="h-5 w-5" />
            </div>

            <h3 className="text-sm font-semibold">
              Upload document
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted">
              Add a new document to your secure vault.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-500">
              Upload now
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>

          </button>


          <Link
            to="/documents"
            className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:scale-105">
              <FolderOpen className="h-5 w-5" />
            </div>

            <h3 className="text-sm font-semibold">
              Browse documents
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted">
              Search, preview, rename, and manage your files.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-500">
              View documents
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>

          </Link>


          <Link
            to="/ai-insights"
            className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md"
          >

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="text-sm font-semibold">
              AI insights
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted">
              Explore summaries, keywords, and AI-generated insights.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-500">
              Explore insights
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>

          </Link>

        </div>

      </section>


      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      <UploadModal
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
        onUploaded={(doc) =>
          setDocuments((prev) => [
            doc,
            ...prev.filter(
              (d) => d.id !== doc.id
            ),
          ])
        }
      />

      {dialogs}

    </div>
  )
}