import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Sparkles,
  Search,
  MessagesSquare,
  Cloud,
  Lock,
  Upload,
  ScanText,
  LineChart,
  ArrowRight,
  Check,
  KeyRound,
  FileText,
  Tag,
} from 'lucide-react'
import LandingNav from '@/components/layout/LandingNav'
import Logo from '@/components/ui/Logo'

/* ------------------------------------------------------------------ */
/*  Signature hero visual: a document being scanned + understood.      */
/* ------------------------------------------------------------------ */
function HeroScan() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Glow */}
      <div className="absolute -inset-6 bg-brand-radial blur-2xl" aria-hidden="true" />

      {/* Document */}
      <div className="relative animate-float rounded-2xl border border-white/10 bg-[rgb(var(--surface))] p-6 shadow-glow">
        {/* scan line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden rounded-2xl">
          <div className="absolute inset-x-6 top-4 h-8 animate-scan rounded-full bg-gradient-to-b from-brand-500/0 via-brand-500/40 to-brand-500/0 blur-[2px]" />
          <div className="absolute inset-x-6 top-4 h-px animate-scan bg-brand-400" />
        </div>

        {/* header row */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <FileText className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="h-3 w-2/3 rounded bg-[rgb(var(--surface-2))]" />
            <div className="mt-1.5 h-2 w-1/3 rounded bg-[rgb(var(--surface-2))]" />
          </div>
        </div>

        {/* text lines */}
        <div className="mt-5 space-y-2.5">
          {['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-10/12', 'w-2/3'].map((w, i) => (
            <div key={i} className={`h-2.5 rounded bg-[rgb(var(--surface-2))] ${w}`} />
          ))}
        </div>

        {/* extracted keywords */}
        <div className="mt-5 flex flex-wrap gap-2">
          {['Encryption', 'AWS', 'IAM', 'Zero Trust'].map((k, i) => (
            <span
              key={k}
              className="chip bg-brand-500/10 font-mono text-brand-500 animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.15}s` }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* Floating "secured" badge */}
      <div className="absolute -right-3 -top-3 flex items-center gap-2 rounded-xl border border-white/10 bg-[rgb(var(--surface))] px-3 py-2 shadow-glow-sm animate-pulse-ring sm:-right-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
          <Lock className="h-4 w-4 text-emerald-500" />
        </span>
        <span className="text-xs font-semibold">Encrypted</span>
      </div>

      {/* Floating AI badge */}
      <div
        className="absolute -bottom-4 -left-3 flex items-center gap-2 rounded-xl border border-white/10 bg-[rgb(var(--surface))] px-3 py-2 shadow-glow-sm animate-fade-in-up sm:-left-6"
        style={{ animationDelay: '1.1s' }}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-semibold">AI Summary ready</p>
          <p className="text-[10px] text-muted">94% confidence · Technical</p>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: Cloud,
    title: 'Secure cloud storage',
    body: 'Every file lands in a private, encrypted store. Access flows only through short-lived, pre-signed URLs.',
    tint: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: Sparkles,
    title: 'Instant AI summaries',
    body: 'Long PDFs and docs distilled into a clear summary the moment processing completes.',
    tint: 'text-brand-500 bg-brand-500/10',
  },
  {
    icon: Tag,
    title: 'Keywords & classification',
    body: 'Automatic keyword extraction and document classification with confidence scoring.',
    tint: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: MessagesSquare,
    title: 'Ask your documents',
    body: 'Chat with any file and get answers grounded in its actual content — no manual scrolling.',
    tint: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: Search,
    title: 'Search & organize',
    body: 'Filter by type or status, sort, favorite, and find any document in seconds.',
    tint: 'text-fuchsia-500 bg-fuchsia-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-grade security',
    body: 'Managed authentication, least-privilege access, and audit logging built in from day one.',
    tint: 'text-red-500 bg-red-500/10',
  },
]

const STEPS = [
  { icon: Upload, title: 'Upload', body: 'Drag & drop PDFs, docs, or images — validated and sent securely.' },
  { icon: Cloud, title: 'Secure storage', body: 'Files are encrypted and stored in a private bucket.' },
  { icon: ScanText, title: 'AI processing', body: 'Text is extracted and analyzed to build summaries and keywords.' },
  { icon: LineChart, title: 'Insights', body: 'Explore summaries, topics, and ask questions in natural language.' },
]

const SECURITY_POINTS = [
  'Private storage with short-lived pre-signed URLs — no public buckets',
  'Encryption in transit (TLS) and at rest',
  'Authentication managed by Clerk — passwords never touch our servers',
  'Least-privilege access and full audit logging',
]

function SectionEyebrow({ children }) {
  return <p className="eyebrow justify-center">{children}</p>
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <LandingNav />

      {/* ---------------------------------------------------------- */}
      {/* Hero */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid [mask-image:radial-gradient(700px_circle_at_50%_0%,black,transparent)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-brand-radial" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in-up">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Secure · AI-powered · Cloud-native
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Your documents.
              <br />
              <span className="text-gradient">Securely stored.</span>
              <br />
              Intelligently managed.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted sm:text-lg">
              SecureDocs stores your files in encrypted cloud storage and uses AI to summarize, tag, and answer
              questions about them — so you find what matters in seconds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/sign-up" className="btn-primary px-6 py-3 text-base">
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#features" className="btn-secondary px-6 py-3 text-base">
                Explore features
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" /> Encrypted by default
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <HeroScan />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Features */}
      {/* ---------------------------------------------------------- */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Features</SectionEyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage documents
          </h2>
          <p className="mt-4 text-muted">
            From secure storage to AI-powered understanding — a complete platform for your files.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.tint}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* How it works */}
      {/* ---------------------------------------------------------- */}
      <section id="how" className="border-y bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              From upload to insight in four steps
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="card h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{s.body}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-muted lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Security */}
      {/* ---------------------------------------------------------- */}
      <section id="security" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" /> Security first
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Built to keep your documents private
            </h2>
            <p className="mt-4 text-muted">
              Security isn't an afterthought. Your files are encrypted, access is tightly scoped, and authentication is
              handled by a dedicated provider — the frontend never stores credentials or tokens.
            </p>
            <ul className="mt-6 space-y-3">
              {SECURITY_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 bg-brand-radial blur-2xl" aria-hidden="true" />
            <div className="card relative space-y-4 p-6 sm:p-8">
              {[
                { icon: Lock, label: 'Encryption', value: 'AES-256 at rest · TLS in transit', tint: 'text-emerald-500 bg-emerald-500/10' },
                { icon: KeyRound, label: 'Authentication', value: 'Managed by Clerk · MFA ready', tint: 'text-brand-500 bg-brand-500/10' },
                { icon: Cloud, label: 'Storage', value: 'Private bucket · pre-signed URLs', tint: 'text-blue-500 bg-blue-500/10' },
                { icon: ShieldCheck, label: 'Access', value: 'Least privilege · audit logged', tint: 'text-amber-500 bg-amber-500/10' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${row.tint}`}>
                    <row.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{row.label}</p>
                    <p className="truncate text-xs text-muted">{row.value}</p>
                  </div>
                  <Check className="ml-auto h-5 w-5 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* AI */}
      {/* ---------------------------------------------------------- */}
      <section id="ai" className="border-y bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
                    <Sparkles className="h-4 w-4 text-white" />
                  </span>
                  <p className="text-sm font-semibold">AI Summary</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  A reference architecture for securing workloads on the cloud — covering identity and access
                  management, network isolation, encryption, and centralized logging, closing with an incident-response
                  runbook.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['AWS', 'IAM', 'KMS', 'VPC', 'Zero Trust'].map((k) => (
                    <span key={k} className="chip bg-brand-500/10 font-mono text-brand-500">
                      {k}
                    </span>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-[rgb(var(--surface-2))] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Classification</span>
                    <span className="font-mono text-xs text-brand-500">94% confidence</span>
                  </div>
                  <p className="mt-1 font-display text-lg font-semibold">Technical Document</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> AI insights
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Understand documents without reading every page
              </h2>
              <p className="mt-4 text-muted">
                SecureDocs reads your documents so you don't have to. Get concise summaries, the key topics that matter,
                and a confidence-scored classification — then ask follow-up questions in plain language.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Concise, accurate summaries of long documents',
                  'Key topics and entities extracted automatically',
                  'Ask questions and get grounded answers',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-500">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* CTA */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center shadow-glow sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid opacity-20" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to secure your documents?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-indigo-100">
              Create your free account and experience secure, AI-powered document management in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/sign-up"
                className="btn inline-flex bg-white px-6 py-3 text-base text-brand-700 hover:bg-indigo-50 active:scale-[0.98]"
              >
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/sign-in"
                className="btn inline-flex border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10 active:scale-[0.98]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Footer */}
      {/* ---------------------------------------------------------- */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-4 text-sm text-muted">
                Secure, AI-powered cloud document management. Store, understand, and find your documents with
                confidence.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold">Product</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li><a href="#features" className="hover:text-[rgb(var(--text))]">Features</a></li>
                  <li><a href="#ai" className="hover:text-[rgb(var(--text))]">AI insights</a></li>
                  <li><a href="#how" className="hover:text-[rgb(var(--text))]">How it works</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold">Security</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li><a href="#security" className="hover:text-[rgb(var(--text))]">Overview</a></li>
                  <li><span className="cursor-default">Encryption</span></li>
                  <li><span className="cursor-default">Compliance</span></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold">Account</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li><Link to="/sign-in" className="hover:text-[rgb(var(--text))]">Sign in</Link></li>
                  <li><Link to="/sign-up" className="hover:text-[rgb(var(--text))]">Get started</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} SecureDocs. All rights reserved.</p>
            <p>Built with React, Tailwind CSS & Clerk.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
