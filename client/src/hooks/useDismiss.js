import { useEffect, useRef } from 'react'

/**
 * Returns a ref to attach to a menu/dialog container. Calls `onDismiss` when the
 * user clicks outside of it or presses Escape.
 */
export function useDismiss(onDismiss) {
  const ref = useRef(null)
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onDismiss()
    }
    function onKey(e) {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [onDismiss])
  return ref
}
