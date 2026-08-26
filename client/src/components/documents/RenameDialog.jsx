import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

/** Small dialog to rename a document. */
export default function RenameDialog({ open, onClose, document: doc, onSubmit, loading }) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (doc) setName(doc.name)
  }, [doc])

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed && trimmed !== doc?.name) onSubmit(trimmed)
    else onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Rename document" size="sm">
      <form onSubmit={submit}>
        <label htmlFor="doc-name" className="mb-1.5 block text-sm font-medium">
          Document name
        </label>
        <input
          id="doc-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Enter a new name"
        />
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading || !name.trim()}>
            {loading && <LoadingSpinner size={16} className="text-white" />}
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
