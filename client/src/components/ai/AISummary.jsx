import {
  Sparkles,
  FileText,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react'


export default function AISummary({
  summary,
  keywords = [],
  classification,
  status,
  keyPoints = [],
  insights = [],
}) {

  return (
    <div className="card overflow-hidden">

      {/* ============================================================
          HEADER
          ============================================================ */}

      <div className="flex items-center justify-between border-b border-[rgb(var(--border))] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">

            <Sparkles
              className="h-5 w-5 text-brand-500"
              aria-hidden="true"
            />

          </div>

          <div>

            <h2 className="text-base font-semibold">
              AI Summary
            </h2>

            <p className="text-xs text-muted">
              Generated from your document
            </p>

          </div>

        </div>


        {status && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600">

            <CheckCircle2
              className="h-3.5 w-3.5"
            />

            {status === 'COMPLETED'
              ? 'AI Complete'
              : status}

          </span>
        )}

      </div>


      {/* ============================================================
          CONTENT
          ============================================================ */}

      <div className="space-y-6 p-5">


        {/* ==========================================================
            SUMMARY
            ========================================================== */}

        <section>

          <h3 className="mb-2 text-sm font-semibold">
            Summary
          </h3>

          <p className="text-sm leading-6 text-muted">
            {summary ||
              'No summary available.'}
          </p>

        </section>


        {/* ==========================================================
            DOCUMENT TYPE
            ========================================================== */}

        {classification?.label && (

          <section>

            <h3 className="mb-2 text-sm font-semibold">
              Document Type
            </h3>

            <div className="flex items-center gap-2">

              <FileText
                className="h-4 w-4 text-brand-500"
              />

              <span className="rounded-lg bg-[rgb(var(--surface-2))] px-3 py-1.5 text-sm font-medium">
                {classification.label}
              </span>

            </div>

          </section>

        )}


        {/* ==========================================================
            KEY POINTS
            ========================================================== */}

        {keyPoints.length > 0 && (

          <section>

            <h3 className="mb-3 text-sm font-semibold">
              Key Points
            </h3>

            <ul className="space-y-2.5">

              {keyPoints.map(
                (point, index) => (

                  <li
                    key={`${point}-${index}`}
                    className="flex gap-3 text-sm leading-6"
                  >

                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />

                    <span className="text-muted">
                      {point}
                    </span>

                  </li>

                )
              )}

            </ul>

          </section>

        )}


        {/* ==========================================================
            KEYWORDS
            ========================================================== */}

        {keywords.length > 0 && (

          <section>

            <h3 className="mb-3 text-sm font-semibold">
              Keywords
            </h3>

            <div className="flex flex-wrap gap-2">

              {keywords.map(
                (keyword, index) => (

                  <span
                    key={`${keyword}-${index}`}
                    className="rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-500"
                  >
                    {keyword}
                  </span>

                )
              )}

            </div>

          </section>

        )}


        {/* ==========================================================
            INSIGHTS
            ========================================================== */}

        {insights.length > 0 && (

          <section>

            <div className="mb-3 flex items-center gap-2">

              <Lightbulb
                className="h-4 w-4 text-amber-500"
              />

              <h3 className="text-sm font-semibold">
                AI Insights
              </h3>

            </div>


            <div className="space-y-3">

              {insights.map(
                (insight, index) => (

                  <div
                    key={`${insight}-${index}`}
                    className="rounded-xl bg-[rgb(var(--surface-2))] p-3.5"
                  >

                    <p className="text-sm leading-6 text-muted">
                      {insight}
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

        )}

      </div>

    </div>
  )
}