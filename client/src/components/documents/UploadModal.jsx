import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UploadDropzone from './UploadDropzone'
import api from '@/services/api'
import { useToast } from '@/context/ToastContext'
import { getFileMeta } from '@/lib/fileMeta'
import { formatBytes, fileExtension } from '@/lib/format'

let uid = 0

/**
 * Upload modal with drag-and-drop, per-file progress, cancel, and success/error
 * states. Calls onUploaded(doc) for each successful upload.
 */
export default function UploadModal({ open, onClose, onUploaded }) {
  const toast = useToast()
  const [items, setItems] = useState([])

  // Reset queue when the modal closes.
  useEffect(() => {
    if (!open) setItems([])
  }, [open])

  const uploading = items.some((i) => i.status === 'uploading')
  const pending = items.filter((i) => i.status === 'ready' || i.status === 'error')
  const allDone = items.length > 0 && items.every((i) => i.status === 'success')

  function addFile(file) {
    setItems((prev) => [
      ...prev,
      { id: ++uid, file, progress: 0, status: 'ready', error: null, controller: null },
    ])
  }

  function patch(id, changes) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)))
  }

  function removeItem(id) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id)
      target?.controller?.abort()
      return prev.filter((i) => i.id !== id)
    })
  }

  async function uploadItem(item) {
    const controller = new AbortController()
    patch(item.id, { status: 'uploading', progress: 0, controller, error: null })
    try {
      const doc = await api.uploadDocument(item.file, {
        signal: controller.signal,
        onProgress: (p) => patch(item.id, { progress: p }),
      })
      patch(item.id, { status: 'success', progress: 100, controller: null })
      onUploaded?.(doc)
      return true
    } catch (err) {
      if (err.name === 'AbortError') {
        patch(item.id, { status: 'ready', progress: 0, controller: null })
      } else {
        patch(item.id, { status: 'error', error: err.message, controller: null })
      }
      return false
    }
  }

  async function startUpload() {
    const queue = items.filter((i) => i.status === 'ready' || i.status === 'error')
    const results = await Promise.all(queue.map(uploadItem))
    const ok = results.filter(Boolean).length
    const failed = results.length - ok
    if (ok) toast.success(`${ok} document${ok > 1 ? 's' : ''} uploaded and queued for AI processing.`)
    if (failed) toast.error(`${failed} upload${failed > 1 ? 's' : ''} failed. You can retry.`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload documents" size="lg">
      <UploadDropzone onFileSelected={addFile} onError={(m) => toast.error(m)} disabled={uploading} />

      {items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => {
            const { Icon, tint, bg, label } = getFileMeta(fileExtension(item.file.name))
            return (
              <li key={item.id} className="surface flex items-center gap-3 rounded-xl p-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-5 w-5 ${tint}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium" title={item.file.name}>
                      {item.file.name}
                    </p>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {label} • {formatBytes(item.file.size)}
                    </span>
                  </div>

                  {/* Progress / status line */}
                  {item.status === 'uploading' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgb(var(--surface-2))]">
                        <div
                          className="h-full rounded-full bg-brand-gradient transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="w-9 text-right font-mono text-xs text-muted">{item.progress}%</span>
                    </div>
                  )}
                  {item.status === 'error' && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle className="h-3.5 w-3.5" /> {item.error}
                    </p>
                  )}
                  {item.status === 'success' && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                    </p>
                  )}
                  {item.status === 'ready' && <p className="mt-1 text-xs text-muted">Ready to upload</p>}
                </div>

                {/* Trailing control */}
                <div className="shrink-0">
                  {item.status === 'uploading' ? (
                    <button onClick={() => removeItem(item.id)} className="btn-ghost rounded-lg p-2" aria-label="Cancel upload">
                      <X className="h-4 w-4" />
                    </button>
                  ) : item.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : item.status === 'error' ? (
                    <button onClick={() => uploadItem(item)} className="btn-ghost rounded-lg p-2" aria-label="Retry upload">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={() => removeItem(item.id)} className="btn-ghost rounded-lg p-2" aria-label="Remove file">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button className="btn-ghost" onClick={onClose}>
          {allDone ? 'Close' : 'Cancel'}
        </button>
        {!allDone && (
          <button className="btn-primary" onClick={startUpload} disabled={pending.length === 0 || uploading}>
            {uploading && <LoadingSpinner size={16} className="text-white" />}
            {uploading ? 'Uploading…' : `Upload ${pending.length || ''} file${pending.length === 1 ? '' : 's'}`.trim()}
          </button>
        )}
      </div>
    </Modal>
  )
}
