import { useMemo, useState, useEffect } from 'react'
import {
  Sparkles,
  FileCheck2,
  Loader2,
  Gauge,
  ChevronRight,
  ScanText,
} from 'lucide-react'

import PageHeader from '@/components/ui/PageHeader'
import StatsCard from '@/components/ui/StatsCard'
import AISummary from '@/components/ai/AISummary'
import AIChat from '@/components/ai/AIChat'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

import { api } from '@/services/api'
import { getFileMeta } from '@/lib/fileMeta'
import { timeAgo } from '@/lib/format'


export default function AIInsights() {

  /* ============================================================
     STATE
     ============================================================ */

  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)


  /* ============================================================
     LOAD AI INSIGHTS
     ============================================================ */

  const loadInsights = async () => {

    try {

      setLoading(true)
      setError(null)

      const data =
        await api.getAIInsights()

      console.log(
        'AI Insights API response:',
        data
      )

      setInsights(data)

    } catch (err) {

      console.error(
        'Failed to load AI insights:',
        err
      )

      setError(
        err.message ||
        'Unable to load AI insights.'
      )

    } finally {

      setLoading(false)

    }
  }


  /* ============================================================
     INITIAL LOAD
     ============================================================ */

  useEffect(() => {

    loadInsights()

  }, [])


  /* ============================================================
     ANALYZED DOCUMENTS
     ============================================================ */

  const analyzed = useMemo(() => {

    if (!insights?.analyses) {
      return []
    }

    return insights.analyses

  }, [insights])


  /* ============================================================
     PROCESSING DOCUMENTS
     ============================================================ */

  const processing = useMemo(() => {

    if (!insights?.processing) {
      return []
    }

    return insights.processing

  }, [insights])


  /* ============================================================
     FAILED DOCUMENTS
     ============================================================ */

  const failed = useMemo(() => {

    if (!insights?.failed) {
      return []
    }

    return insights.failed

  }, [insights])


  /* ============================================================
     STATISTICS
     ============================================================ */

  const stats = insights?.stats || {}


  const totalAIAnalyses =
    stats.totalAIAnalyses ??
    analyzed.length


  const documentsAnalyzed =
    stats.documentsAnalyzed ??
    analyzed.length


  const processingQueue =
    stats.processingQueue ??
    processing.length


  const averageConfidence =
    stats.averageConfidence


  /* ============================================================
     SELECTED DOCUMENT
     ============================================================ */

  useEffect(() => {

    if (
      !selectedId &&
      analyzed.length > 0
    ) {

      setSelectedId(
        analyzed[0].id
      )

    }

  }, [
    analyzed,
    selectedId,
  ])


  /* ============================================================
     KEEP SELECTED DOCUMENT VALID
     ============================================================ */

  useEffect(() => {

    if (
      selectedId &&
      analyzed.length > 0 &&
      !analyzed.some(
        (doc) =>
          doc.id === selectedId
      )
    ) {

      setSelectedId(
        analyzed[0].id
      )

    }

  }, [
    analyzed,
    selectedId,
  ])


  /* ============================================================
     SELECTED DOCUMENT
     ============================================================ */

  const selected =
    analyzed.find(
      (doc) =>
        doc.id === selectedId
    ) || null


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <div>

      <PageHeader
        title="AI Insights"
        subtitle="Summaries, key topics, and answers extracted from your documents."
      />


      {/* ========================================================
          STATS
          ======================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          label="Total AI analyses"
          value={totalAIAnalyses}
          icon={Sparkles}
          loading={loading}
        />


        <StatsCard
          label="Documents analyzed"
          value={documentsAnalyzed}
          icon={FileCheck2}
          accent="emerald"
          loading={loading}
        />


        <StatsCard
          label="Processing queue"
          value={processingQueue}
          icon={Loader2}
          accent="amber"
          loading={loading}
        />


        <StatsCard
          label="Avg. confidence"
          value={
            averageConfidence !== null &&
            averageConfidence !== undefined
              ? `${Math.round(
                  averageConfidence * 100
                )}%`
              : '—'
          }
          icon={Gauge}
          accent="blue"
          loading={loading}
          hint={
            averageConfidence !== null &&
            averageConfidence !== undefined
              ? 'across classifications'
              : 'Not available'
          }
        />

      </div>


      {/* ========================================================
          ERROR
          ======================================================== */}

      {error ? (

        <div className="card mt-6">

          <EmptyState
            icon={Sparkles}
            title="Unable to load insights"
            description={error}
            action={
              <button
                className="btn-secondary"
                onClick={loadInsights}
              >
                Try again
              </button>
            }
          />

        </div>

      ) : !loading &&
        analyzed.length === 0 ? (

        /* ======================================================
           EMPTY STATE
           ====================================================== */

        <div className="card mt-6">

          <EmptyState
            icon={ScanText}
            title="No insights yet"
            description="Once your documents finish AI processing, their summaries and topics will appear here."
          />

        </div>

      ) : (

        /* ======================================================
           MAIN CONTENT
           ====================================================== */

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">


          {/* ==================================================
             DOCUMENT PICKER
             ================================================== */}

          <div className="lg:col-span-1">

            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Analyzed documents
            </h2>


            <div className="card overflow-hidden">

              {loading ? (

                /* ------------------------------------------------
                   LOADING SKELETON
                   ------------------------------------------------ */

                <div className="divide-y">

                  {Array.from({
                    length: 5,
                  }).map((_, i) => (

                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5"
                    >

                      <div className="h-9 w-9 skeleton rounded-lg" />

                      <div className="flex-1 space-y-1.5">

                        <div className="h-3.5 w-3/4 skeleton" />

                        <div className="h-2.5 w-1/3 skeleton" />

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                /* ------------------------------------------------
                   DOCUMENT LIST
                   ------------------------------------------------ */

                <ul className="divide-y">

                  {analyzed.map((d) => {

                    const {
                      Icon,
                      tint,
                      bg,
                    } =
                      getFileMeta(
                        d.contentType ||
                        d.name
                          ?.split('.')
                          .pop()
                      )


                    const active =
                      d.id === selectedId


                    const analysis =
                      d.analysis ||
                      {}


                    return (

                      <li
                        key={d.id}
                      >

                        <button
                          onClick={() =>
                            setSelectedId(
                              d.id
                            )
                          }
                          className={`flex w-full items-center gap-3 p-3.5 text-left transition-colors ${
                            active
                              ? 'bg-brand-500/10'
                              : 'hover:bg-[rgb(var(--surface-2))]'
                          }`}
                        >

                          {/* File icon */}

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}
                          >

                            <Icon
                              className={`h-4 w-4 ${tint}`}
                              aria-hidden="true"
                            />

                          </div>


                          {/* Document information */}

                          <div className="min-w-0 flex-1">

                            <p
                              className={`truncate text-sm font-medium ${
                                active
                                  ? 'text-brand-500'
                                  : ''
                              }`}
                              title={d.name}
                            >
                              {d.name}
                            </p>


                            <p className="truncate text-xs text-muted">

                              {analysis.documentType ||
                                'Document'}

                              {' • '}

                              {d.aiAnalyzedAt
                                ? timeAgo(
                                    d.aiAnalyzedAt
                                  )
                                : 'Recently analyzed'}

                            </p>

                          </div>


                          {/* Arrow */}

                          <ChevronRight
                            className={`h-4 w-4 shrink-0 ${
                              active
                                ? 'text-brand-500'
                                : 'text-muted'
                            }`}
                          />

                        </button>

                      </li>

                    )

                  })}

                </ul>

              )}

            </div>


            {/* ==================================================
               PROCESSING QUEUE
               ================================================== */}

            {processing.length > 0 && (

              <div className="card mt-4 p-4">

                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">

                  <Loader2 className="h-3.5 w-3.5 animate-spin" />

                  Processing queue

                </p>


                <ul className="space-y-2">

                  {processing.map((d) => (

                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-2"
                    >

                      <span className="truncate text-sm">
                        {d.name}
                      </span>


                      <StatusBadge
                        status={
                          d.aiStatus ||
                          'PROCESSING'
                        }
                      />

                    </li>

                  ))}

                </ul>

              </div>

            )}


            {/* ==================================================
               FAILED ANALYSES
               ================================================== */}

            {failed.length > 0 && (

              <div className="card mt-4 p-4">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Failed analyses
                </p>


                <ul className="space-y-2">

                  {failed.map((d) => (

                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-2"
                    >

                      <span className="truncate text-sm">
                        {d.name}
                      </span>


                      <StatusBadge
                        status="FAILED"
                      />

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>


          {/* ==================================================
             SELECTED DOCUMENT
             ================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {selected ? (

              <>

                {/* ----------------------------------------------
                   AI SUMMARY
                   ---------------------------------------------- */}

                <AISummary
                  summary={
                    selected.analysis?.summary ||
                    'No summary available.'
                  }

                  keywords={
                    selected.analysis?.keywords ||
                    []
                  }

                  classification={{
                    label:
                      selected.analysis
                        ?.documentType ||
                      'Document',

                    confidence:
                      null,
                  }}

                  status={
                    selected.aiStatus ||
                    'COMPLETED'
                  }
                />


                {/* ----------------------------------------------
                   AI CHAT
                   ---------------------------------------------- */}

                <AIChat
                  documentId={
                    selected.id
                  }

                  documentName={
                    selected.name
                  }
                />

              </>

            ) : (

              <div className="card">

                <EmptyState
                  icon={Sparkles}
                  title="Select a document"
                  description="Choose a document to view its AI insights and ask questions."
                />

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  )
}