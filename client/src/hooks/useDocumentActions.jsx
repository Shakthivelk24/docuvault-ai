import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import { useToast } from '@/context/ToastContext'
import RenameDialog from '@/components/documents/RenameDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

/**
 * Encapsulates the document actions shared by list views (view, download,
 * analyze, rename, delete, favorite) plus the rename/delete dialogs.
 *
 * Returns `handlers` to spread into DocumentGrid/DocumentList and `dialogs`
 * to render once per page.
 */
export function useDocumentActions({ setDocuments, onAfterDelete } = {}) {
  const navigate = useNavigate()
  const toast = useToast()
  const [renameTarget, setRenameTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const mapDocs = (fn) => setDocuments?.((prev) => prev.map(fn))

  const handlers = {
    onView: (doc) => navigate(`/documents/${doc.id}`),
    onAnalyze: (doc) => navigate(`/documents/${doc.id}`),
    onDownload: (doc) => toast.info(`Preparing “${doc.name}” for download…`),
    onRename: (doc) => setRenameTarget(doc),
    onDelete: (doc) => setDeleteTarget(doc),
    onToggleFavorite: async (doc) => {
      const next = !doc.favorite
      mapDocs((d) => (d.id === doc.id ? { ...d, favorite: next } : d)) // optimistic
      try {
        await api.toggleFavorite(doc.id, next)
        toast.success(next ? `Added “${doc.name}” to favorites.` : `Removed “${doc.name}” from favorites.`)
      } catch (err) {
        mapDocs((d) => (d.id === doc.id ? { ...d, favorite: doc.favorite } : d)) // revert
        toast.error(err.message)
      }
    },
  }

  async function confirmRename(name) {
    setBusy(true)
    try {
      const updated = await api.renameDocument(renameTarget.id, name)
      mapDocs((d) => (d.id === updated.id ? { ...d, name: updated.name, modifiedAt: updated.modifiedAt } : d))
      toast.success('Document renamed.')
      setRenameTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function confirmDelete() {
    setBusy(true)
    try {
      await api.deleteDocument(deleteTarget.id)
      setDocuments?.((prev) => prev.filter((d) => d.id !== deleteTarget.id))
      toast.success(`“${deleteTarget.name}” deleted.`)
      onAfterDelete?.(deleteTarget)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const dialogs = (
    <>
      <RenameDialog
        open={!!renameTarget}
        document={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={confirmRename}
        loading={busy}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete document?"
        message={deleteTarget ? `“${deleteTarget.name}” will be permanently removed. This can't be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={busy}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  )

  return { handlers, dialogs }
}
