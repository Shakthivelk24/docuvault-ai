import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ClerkThemeBridge from './components/ClerkThemeBridge.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Strict Clerk: the app requires a real publishable key. Render a clear,
// actionable message instead of a blank screen when it is missing.
function MissingKeyScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--bg))] p-6">
      <div className="card max-w-lg space-y-4 p-8">
        <h1 className="text-xl font-bold">Clerk key required</h1>
        <p className="text-sm text-muted">
          SecureDocs uses Clerk for authentication. Add your publishable key to
          start the app.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            Copy <code className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-mono text-xs">.env.example</code>{' '}
            to <code className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-mono text-xs">.env.local</code>
          </li>
          <li>
            Set{' '}
            <code className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-mono text-xs">
              VITE_CLERK_PUBLISHABLE_KEY
            </code>{' '}
            from your{' '}
            <a
              href="https://dashboard.clerk.com"
              className="text-brand-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Clerk dashboard
            </a>
          </li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <ThemeProvider>
      {PUBLISHABLE_KEY ? (
        <BrowserRouter>
          <ClerkThemeBridge publishableKey={PUBLISHABLE_KEY}>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ClerkThemeBridge>
        </BrowserRouter>
      ) : (
        <MissingKeyScreen />
      )}
    </ThemeProvider>
  </StrictMode>,
)
