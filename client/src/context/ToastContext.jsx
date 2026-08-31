import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Toast from '@/components/ui/Toast'

const ToastContext = createContext(undefined)

/**
 * App-wide toast notifications.
 * Usage:  const toast = useToast(); toast.success('Saved')
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = ++idRef.current
      const duration = opts.duration ?? 4200
      setToasts((list) => [...list, { id, type, message, title: opts.title }])
      if (duration !== Infinity) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (message, opts) => push('success', message, opts),
      error: (message, opts) => push('error', message, opts),
      info: (message, opts) => push('info', message, opts),
      warning: (message, opts) => push('warning', message, opts),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:right-0 sm:top-0 sm:items-end sm:p-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
