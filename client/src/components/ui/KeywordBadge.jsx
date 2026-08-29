/** A single keyword/topic pill. */
export default function KeywordBadge({ children, onClick }) {
  const base =
    'chip bg-brand-500/10 text-brand-500 font-mono text-[11px] tracking-tight'
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} transition-colors hover:bg-brand-500/20`}>
        {children}
      </button>
    )
  }
  return <span className={base}>{children}</span>
}
