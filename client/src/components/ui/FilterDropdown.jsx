import { useCallback, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useDismiss } from '@/hooks/useDismiss'

/**
 * Generic single-select dropdown used for filters and sorting.
 * @param {{ label, value, options: {value,label}[], onChange, icon }} props
 */
export default function FilterDropdown({ label, value, options, onChange, icon: Icon }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(close)

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-secondary"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <span className="text-muted">{label}:</span>
        <span className="max-w-[9rem] truncate">{selected?.label ?? 'All'}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="card absolute right-0 z-30 mt-2 min-w-[12rem] overflow-hidden p-1.5 shadow-soft animate-fade-in"
        >
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value)
                    close()
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[rgb(var(--surface-2))] ${
                    active ? 'text-brand-500' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {opt.icon && <opt.icon className="h-4 w-4" />}
                    {opt.label}
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
