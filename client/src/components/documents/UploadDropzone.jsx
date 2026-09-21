import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

import {
  ALLOWED_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
} from '@/services/api'

import { formatBytes } from '@/lib/format'


// =========================================================
// FILE VALIDATION
// =========================================================

/**
 * Validate a file against the allowed types and size.
 *
 * Returns:
 * - error string when invalid
 * - null when valid
 */
export function validateFile(file) {
  if (!file) {
    return 'Please select a file.'
  }

  const ext = file.name
    .split('.')
    .pop()
    ?.toLowerCase()

  if (
    !ext ||
    !ALLOWED_EXTENSIONS.includes(ext)
  ) {
    return `"${file.name}" isn't a supported type. Use PDF, DOCX, TXT, PNG, or JPG.`
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return `"${file.name}" is ${formatBytes(
      file.size
    )}. The maximum is ${MAX_UPLOAD_MB} MB.`
  }

  return null
}


// =========================================================
// UPLOAD DROPZONE
// =========================================================

export default function UploadDropzone({
  onFileSelected,
  onError,
  disabled = false,
}) {
  const [dragging, setDragging] =
    useState(false)

  const inputRef =
    useRef(null)


  // =======================================================
  // HANDLE FILE
  // =======================================================

  const handleFiles = useCallback(
    (fileList) => {
      if (disabled) {
        return
      }

      const file = fileList?.[0]

      if (!file) {
        return
      }

      const error =
        validateFile(file)

      if (error) {
        onError?.(error)
        return
      }

      onFileSelected?.(file)
    },
    [
      disabled,
      onFileSelected,
      onError,
    ]
  )


  // =======================================================
  // DROP
  // =======================================================

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      setDragging(false)

      if (disabled) {
        return
      }

      handleFiles(
        event.dataTransfer.files
      )
    },
    [
      disabled,
      handleFiles,
    ]
  )


  // =======================================================
  // DRAG OVER
  // =======================================================

  const onDragOver = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (!disabled) {
        setDragging(true)
      }
    },
    [disabled]
  )


  // =======================================================
  // DRAG LEAVE
  // =======================================================

  const onDragLeave = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      setDragging(false)
    },
    []
  )


  // =======================================================
  // OPEN FILE PICKER
  // =======================================================

  const openFilePicker = useCallback(
    () => {
      if (disabled) {
        return
      }

      inputRef.current?.click()
    },
    [disabled]
  )


  // =======================================================
  // KEYBOARD
  // =======================================================

  const handleKeyDown =
    useCallback(
      (event) => {
        if (disabled) {
          return
        }

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault()
          openFilePicker()
        }
      },
      [
        disabled,
        openFilePicker,
      ]
    )


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload a document"
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        // Base
        'group',
        'flex',
        'cursor-pointer',
        'flex-col',
        'items-center',
        'justify-center',
        'rounded-2xl',
        'border-2',
        'border-dashed',

        // IMPORTANT:
        // Explicit surface + text for light/dark themes
        'bg-[rgb(var(--surface-1))]',
        'text-[rgb(var(--text))]',

        // Spacing
        'px-6',
        'py-12',
        'text-center',

        // Animation
        'transition-all',
        'duration-200',

        // Normal / dragging state
        dragging
          ? [
              'border-brand-500',
              'bg-brand-500/5',
              'shadow-sm',
            ].join(' ')
          : [
              'border-[rgb(var(--border))]',
              'hover:border-brand-500/50',
              'hover:bg-[rgb(var(--surface-2))]',
            ].join(' '),

        // Disabled
        disabled
          ? [
              'pointer-events-none',
              'cursor-not-allowed',
              'opacity-60',
            ].join(' ')
          : '',

        // Focus
        !disabled
          ? [
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-brand-500/20',
            ].join(' ')
          : '',
      ].join(' ')}
    >

      {/* ===================================================
       * HIDDEN FILE INPUT
       * =================================================== */}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(
            event.target.files
          )

          // Allow selecting the same
          // file again.
          event.target.value = ''
        }}
      />


      {/* ===================================================
       * UPLOAD ICON
       * =================================================== */}

      <div
        className={[
          'flex',
          'h-14',
          'w-14',
          'items-center',
          'justify-center',
          'rounded-2xl',
          'transition-all',
          'duration-200',

          dragging
            ? [
                'scale-110',
                'bg-brand-gradient',
                'shadow-lg',
              ].join(' ')
            : [
                'bg-brand-500/10',
                'group-hover:scale-105',
              ].join(' '),
        ].join(' ')}
      >

        <UploadCloud
          className={[
            'h-7',
            'w-7',
            'transition-colors',

            dragging
              ? 'text-white'
              : 'text-brand-500',
          ].join(' ')}
        />

      </div>


      {/* ===================================================
       * TITLE
       * =================================================== */}

      <p
        className="
          mt-4
          text-sm
          font-semibold
          text-[rgb(var(--text))]
        "
      >
        {dragging
          ? 'Drop to upload'
          : 'Drag and drop your file here'}
      </p>


      {/* ===================================================
       * BROWSE TEXT
       * =================================================== */}

      <p
        className="
          mt-1
          text-sm
          text-muted
        "
      >
        or{' '}

        <span
          className="
            font-medium
            text-brand-500
          "
        >
          browse files
        </span>{' '}

        to upload
      </p>


      {/* ===================================================
       * SUPPORTED FILES
       * =================================================== */}

      <p
        className="
          mt-4
          font-mono
          text-xs
          text-muted
        "
      >
        PDF, DOCX, TXT, PNG, JPG
        {' · '}
        Max {MAX_UPLOAD_MB} MB
      </p>

    </div>
  )
}