import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Pencil,
  Trash2,
  Sparkles,
  Star,
  FileText,
  Clock,
  HardDrive,
  Calendar,
  User,
  Layers,
  Eye,
  ExternalLink,
} from 'lucide-react'
import { useDocument } from '@/hooks/useDocuments'
import api from '@/services/api'
import { useToast } from '@/context/ToastContext'
import { getFileMeta } from '@/lib/fileMeta'
import { formatBytes, formatDateTime, timeAgo } from '@/lib/format'
import StatusBadge from '@/components/ui/StatusBadge'
import AISummary from '@/components/ai/AISummary'
import AIChat from '@/components/ai/AIChat'
import EmptyState from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import RenameDialog from '@/components/documents/RenameDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const ACTIVITY_TINTS = {
  upload: 'bg-blue-500/10 text-blue-500',
  ai: 'bg-brand-500/10 text-brand-500',
  view: 'bg-slate-500/10 text-slate-400',
  edit: 'bg-amber-500/10 text-amber-500',
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <span className="text-right text-sm font-medium">{children}</span>
    </div>
  )
}

export default function DocumentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { document: doc, setDocument, loading, error, reload } = useDocument(id)

  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewText, setPreviewText] = useState('')
  const [previewLoading, setPreviewLoading] = useState(true)
  const [previewError, setPreviewError] = useState(null)

  useEffect(() => {
    if (!doc) return undefined

    let active = true
    setPreviewLoading(true)
    setPreviewError(null)
    setPreviewUrl(null)
    setPreviewText('')

    api.getPreviewUrl(doc.id)
      .then(async ({ previewUrl: url }) => {
        if (!active) return
        setPreviewUrl(url)
        if (doc.type === 'txt' && url) {
          const response = await fetch(url)
          if (!response.ok) throw new Error('Unable to load the text preview.')
          setPreviewText(await response.text())
        } else if (doc.type === 'txt') {
          setPreviewText(doc.summary || 'No text preview is available for this document.')
        }
      })
      .catch((err) => {
        if (active) setPreviewError(err.message)
      })
      .finally(() => {
        if (active) setPreviewLoading(false)
      })

    return () => {
      active = false
    }
  }, [doc])

  if (loading) return <PageLoader />

  if (error || !doc) {
    return (
      <div className="card">
        <EmptyState
          icon={FileText}
          title="Document not found"
          description={error || 'This document may have been deleted or moved.'}
          action={
            <div className="flex gap-2">
              <Link to="/documents" className="btn-secondary">
                Back to documents
              </Link>
              {error && (
                <button className="btn-primary" onClick={reload}>
                  Try again
                </button>
              )}
            </div>
          }
        />
      </div>
    )
  }

  const { Icon, tint, bg, label } = getFileMeta(doc.type)

  async function handleDownload() {
    try {
      const url = previewUrl || (await api.getPreviewUrl(doc.id)).previewUrl
      if (!url) throw new Error('The original file is not available yet.')
      const link = document.createElement('a')
      link.href = url
      link.download = doc.name
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.click()
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleRename(name) {
    setBusy(true)
    try {
      const updated = await api.renameDocument(doc.id, name)
      setDocument((d) => ({ ...d, name: updated.name, modifiedAt: updated.modifiedAt }))
      toast.success('Document renamed.')
      setRenameOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await api.deleteDocument(doc.id)
      toast.success(`“${doc.name}” deleted.`)
      navigate('/documents')
    } catch (err) {
      toast.error(err.message)
      setBusy(false)
    }
  }

  async function handleFavorite() {
    const next = !doc.favorite
    setDocument((d) => ({ ...d, favorite: next }))
    try {
      await api.toggleFavorite(doc.id, next)
    } catch (err) {
      setDocument((d) => ({ ...d, favorite: !next }))
      toast.error(err.message)
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true)
    try {
      const insights = await api.getAISummary(doc.id)
      setDocument((d) => ({
        ...d,
        status: 'completed',
        summary: insights.summary,
        keywords: insights.keywords,
        classification: insights.classification,
      }))
      toast.success('AI analysis complete.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <Link to="/documents" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-[rgb(var(--text))]">
        <ArrowLeft className="h-4 w-4" />
        Back to documents
      </Link>

      {/* Header */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
              <Icon className={`h-7 w-7 ${tint}`} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl" title={doc.name}>
                  {doc.name}
                </h1>
                <button
                  onClick={handleFavorite}
                  className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:text-amber-400"
                  aria-label={doc.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`h-5 w-5 ${doc.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={doc.status} />
                <span className="chip surface-2 text-muted font-mono">
                  {label} • {formatBytes(doc.size)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2 border-t pt-5">
          <button className="btn-primary" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            className="btn-secondary"
            onClick={handleAnalyze}
            disabled={analyzing || doc.status === 'processing'}
          >
            <Sparkles className="h-4 w-4" />
            {doc.status === 'completed' ? 'Re-analyze' : 'Analyze with AI'}
          </button>
          <button className="btn-secondary" onClick={() => setRenameOpen(true)}>
            <Pencil className="h-4 w-4" />
            Rename
          </button>
          <button className="btn-ghost text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-brand-500" />
                <h2 className="text-base font-semibold">File preview</h2>
              </div>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost px-2 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open original
                </a>
              )}
            </div>
            <div className="min-h-90 bg-[rgb(var(--surface-2))] p-3 sm:p-5">
              {previewLoading ? (
                <div className="flex min-h-80 items-center justify-center text-sm text-muted">
                  Loading preview...
                </div>
              ) : previewError ? (
                <div className="flex min-h-80 items-center justify-center text-sm text-muted">
                  {previewError}
                </div>
              ) : doc.type === 'pdf' && previewUrl ? (
                <iframe src={previewUrl} title={`Preview of ${doc.name}`} className="h-140 w-full rounded-lg bg-white" />
              ) : ['png', 'jpg', 'jpeg'].includes(doc.type) && previewUrl ? (
                <img src={previewUrl} alt={doc.name} className="mx-auto max-h-140 max-w-full rounded-lg object-contain" />
              ) : doc.type === 'txt' ? (
                <pre className="min-h-80 whitespace-pre-wrap rounded-lg bg-white p-5 text-sm leading-6 text-slate-700 dark:bg-ink-900 dark:text-slate-200">
                  {previewText}
                </pre>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center gap-2 text-center text-sm text-muted">
                  <FileText className="h-8 w-8" />
                  <p>Preview this file in a new tab or download it to open locally.</p>
                </div>
              )}
            </div>
          </section>
          <AISummary
            summary={doc.summary}
            keywords={doc.keywords}
            classification={doc.classification}
            status={doc.status}
            loading={analyzing}
            onAnalyze={handleAnalyze}
          />
          <AIChat documentId={doc.id} documentName={doc.name} />
        </div>

        {/* Sidebar: info + activity */}
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-2 text-base font-semibold">Document info</h2>
            <div className="divide-y">
              <InfoRow icon={FileText} label="Type">
                {label}
              </InfoRow>
              <InfoRow icon={HardDrive} label="Size">
                {formatBytes(doc.size)}
              </InfoRow>
              {doc.pages != null && (
                <InfoRow icon={Layers} label="Pages">
                  {doc.pages}
                </InfoRow>
              )}
              <InfoRow icon={Calendar} label="Uploaded">
                {formatDateTime(doc.uploadedAt)}
              </InfoRow>
              <InfoRow icon={Clock} label="Last modified">
                {formatDateTime(doc.modifiedAt)}
              </InfoRow>
              <InfoRow icon={User} label="Owner">
                {doc.owner}
              </InfoRow>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-base font-semibold">Activity log</h2>
            {doc.activity?.length ? (
              <ol className="relative space-y-4 border-l pl-5">
                {[...doc.activity].reverse().map((a, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-[27px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-[rgb(var(--surface))] ${
                        ACTIVITY_TINTS[a.type] || ACTIVITY_TINTS.view
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                    </span>
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted" title={formatDateTime(a.at)}>
                      {timeAgo(a.at)}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">No activity recorded yet.</p>
            )}
          </section>
        </div>
      </div>

      <RenameDialog
        open={renameOpen}
        document={doc}
        onClose={() => setRenameOpen(false)}
        onSubmit={handleRename}
        loading={busy}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete document?"
        message={`“${doc.name}” will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={busy}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
