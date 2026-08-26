import { useCallback, useState } from 'react'
import { MoreVertical, Eye, Download, Pencil, Trash2, Sparkles } from 'lucide-react'
import { useDismiss } from '@/hooks/useDismiss'

/**
 * The "•••" actions menu shared by document cards and rows.
 * @param {{ onView, onDownload, onRename, onDelete, onAnalyze }} props
 */
export default function DocumentActionsMenu({ onView, onDownload, onRename, onDelete, onAnalyze }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(close)

  const run = (fn) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    close()
    fn?.()
  }

  const items = [
    { label: 'View', icon: Eye, onClick: onView },
    { label: 'Download', icon: Download, onClick: onDownload },
    { label: 'Analyze with AI', icon: Sparkles, onClick: onAnalyze },
    { label: 'Rename', icon: Pencil, onClick: onRename },
    { label: 'Delete', icon: Trash2, onClick: onDelete, danger: true },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="btn-ghost rounded-lg p-2"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="card absolute right-0 z-30 mt-1.5 w-48 overflow-hidden p-1.5 shadow-soft animate-fade-in"
        >
          {items.map((it) => (
            <button
              key={it.label}
              role="menuitem"
              onClick={run(it.onClick)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[rgb(var(--surface-2))] ${
                it.danger ? 'text-red-500 hover:bg-red-500/10' : ''
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
