import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from '@/services/api'
import { formatBytes } from '@/lib/format'

/** Validate a file against the allowed types and size. Returns an error string or null. */
export function validateFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return `"${file.name}" isn't a supported type. Use PDF, DOCX, TXT, PNG, or JPG.`
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `"${file.name}" is ${formatBytes(file.size)}. The maximum is ${MAX_UPLOAD_MB} MB.`
  }
  return null
}

/**
 * Drag-and-drop zone + file browser. Calls onFileSelected(file) with a valid file
 * or onError(message) when validation fails.
 */
export default function UploadDropzone({ onFileSelected, onError, disabled }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0]
      if (!file) return
      const error = validateFile(file)
      if (error) {
        onError?.(error)
        return
      }
      onFileSelected?.(file)
    },
    [onFileSelected, onError],
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [disabled, handleFiles],
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      aria-disabled={disabled}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
        dragging
          ? 'border-brand-500 bg-brand-500/5'
          : 'border-[rgb(var(--border))] hover:border-brand-500/50 hover:bg-[rgb(var(--surface-2))]'
      } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform ${
          dragging ? 'scale-110 bg-brand-gradient' : 'bg-brand-500/10'
        }`}
      >
        <UploadCloud className={`h-7 w-7 ${dragging ? 'text-white' : 'text-brand-500'}`} />
      </div>
      <p className="mt-4 text-sm font-semibold">
        {dragging ? 'Drop to upload' : 'Drag and drop your file here'}
      </p>
      <p className="mt-1 text-sm text-muted">
        or <span className="font-medium text-brand-500">browse files</span> to upload
      </p>
      <p className="mt-4 font-mono text-xs text-muted">PDF, DOCX, TXT, PNG, JPG · Max {MAX_UPLOAD_MB} MB</p>
    </div>
  )
}
