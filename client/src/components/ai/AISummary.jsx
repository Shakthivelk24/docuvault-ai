import { Sparkles, Loader2, AlertCircle, Tag, ScanText } from 'lucide-react'
import KeywordBadge from '@/components/ui/KeywordBadge'

function Skeleton() {
  return (
    <div className="space-y-2.5">
      <div className="h-3.5 w-full skeleton" />
      <div className="h-3.5 w-11/12 skeleton" />
      <div className="h-3.5 w-4/5 skeleton" />
    </div>
  )
}

/**
 * AI insights panel: summary, classification, and keywords.
 * @param {{ summary, keywords, classification, loading, status, onAnalyze, onKeywordClick }} props
 */
export default function AISummary({
  summary,
  keywords = [],
  classification,
  loading = false,
  status,
  onAnalyze,
  onKeywordClick,
}) {
  const confidencePct = classification ? Math.round(classification.confidence * 100) : 0

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-base font-semibold">AI Summary</h2>
      </div>

      {loading ? (
        <Skeleton />
      ) : status === 'processing' ? (
        <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 p-4 text-sm text-amber-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Analysis in progress. Insights will appear here shortly.</p>
        </div>
      ) : status === 'failed' || !summary ? (
        <div className="flex flex-col items-start gap-3 rounded-xl bg-[rgb(var(--surface-2))] p-4">
          <p className="flex items-center gap-2 text-sm text-muted">
            {status === 'failed' ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" /> AI processing failed for this document.
              </>
            ) : (
              <>
                <ScanText className="h-4 w-4" /> This document hasn't been analyzed yet.
              </>
            )}
          </p>
          {onAnalyze && (
            <button onClick={onAnalyze} className="btn-primary">
              <Sparkles className="h-4 w-4" />
              {status === 'failed' ? 'Retry analysis' : 'Analyze with AI'}
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-muted">{summary}</p>

          {classification && (
            <div className="mt-5 rounded-xl bg-[rgb(var(--surface-2))] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Classification</span>
                <span className="font-mono text-xs text-brand-500">{confidencePct}% confidence</span>
              </div>
              <p className="mt-1 font-display text-lg font-semibold">{classification.label}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${confidencePct}%` }} />
              </div>
            </div>
          )}

          {keywords.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <Tag className="h-3.5 w-3.5" /> Key topics
              </p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <KeywordBadge key={kw} onClick={onKeywordClick ? () => onKeywordClick(kw) : undefined}>
                    {kw}
                  </KeywordBadge>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
