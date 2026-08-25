import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, User } from 'lucide-react'
import api from '@/services/api'
import { sampleQuestions } from '@/data/mockData'

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function Bubble({ role, children }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser ? 'bg-[rgb(var(--surface-2))]' : 'bg-brand-gradient'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-white" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-brand-gradient text-white'
            : 'rounded-tl-sm surface-2 text-[rgb(var(--text))]'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Chat-style Q&A over a single document. AI responses are mocked via api.askAI.
 * @param {{ documentId, documentName }} props
 */
export default function AIChat({ documentId, documentName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  async function ask(question) {
    const q = question.trim()
    if (!q || thinking) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: q }])
    setThinking(true)
    try {
      const { answer } = await api.askAI(documentId, q)
      setMessages((m) => [...m, { role: 'assistant', content: answer }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `Sorry — I couldn't answer that. ${err.message}`, error: true },
      ])
    } finally {
      setThinking(false)
    }
  }

  return (
    <section className="card flex h-[32rem] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold leading-tight">Ask AI about this document</h2>
          <p className="truncate text-xs text-muted">{documentName}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && !thinking ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10">
              <Sparkles className="h-6 w-6 text-brand-500" />
            </div>
            <p className="mt-3 text-sm font-medium">Ask anything about this document</p>
            <p className="mt-1 text-xs text-muted">Get answers grounded in the document's content.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="chip surface text-muted transition-colors hover:border-brand-500/50 hover:text-brand-500"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content}
              </Bubble>
            ))}
            {thinking && (
              <Bubble role="assistant">
                <TypingDots />
              </Bubble>
            )}
          </>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="input"
          aria-label="Ask a question about this document"
        />
        <button type="submit" className="btn-primary shrink-0 px-3.5" disabled={!input.trim() || thinking} aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  )
}
