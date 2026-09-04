import { useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import {
  User as UserIcon,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  Sun,
  Moon,
  ExternalLink,
  KeyRound,
  Mail,
  Trash2,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'

function Section({ icon: Icon, title, description, children, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-500/10 text-brand-500',
    red: 'bg-red-500/10 text-red-500',
  }
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </section>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-gradient' : 'bg-[rgb(var(--border))]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const { user } = useUser()
  const { openUserProfile, signOut } = useClerk()
  const { theme, setTheme } = useTheme()
  const toast = useToast()

  const [notifications, setNotifications] = useState({
    email: true,
    aiComplete: true,
    weekly: false,
  })

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const name = user?.fullName || user?.username || 'User'
  const email = user?.primaryEmailAddress?.emailAddress || ''
  const initial = (name?.[0] || 'U').toUpperCase()

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await user?.delete()
      toast.success('Your account has been deleted.')
      await signOut({ redirectUrl: '/' })
    } catch (err) {
      toast.error(err.message || 'Could not delete your account. Please try again.')
      setDeleting(false)
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your profile, security, and preferences." />

      <div className="space-y-6">
        {/* Profile */}
        <Section icon={UserIcon} title="Profile" description="Your account details are managed securely by Clerk.">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={name} className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500/20" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-lg font-semibold text-white">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold">{name}</p>
                {email && (
                  <p className="flex items-center gap-1.5 text-sm text-muted">
                    <Mail className="h-3.5 w-3.5" /> {email}
                  </p>
                )}
              </div>
            </div>
            <button className="btn-secondary shrink-0" onClick={() => openUserProfile()}>
              Manage account
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </Section>

        {/* Security */}
        <Section icon={ShieldCheck} title="Security" description="Passwords, two-factor authentication, and active sessions.">
          <div className="space-y-3">
            <div className="surface-2 flex items-center justify-between gap-4 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-muted" />
                <div>
                  <p className="text-sm font-medium">Password &amp; 2FA</p>
                  <p className="text-xs text-muted">Update your password or enable multi-factor authentication.</p>
                </div>
              </div>
              <button className="btn-ghost shrink-0" onClick={() => openUserProfile()}>
                Manage
              </button>
            </div>
            <p className="text-xs text-muted">
              SecureDocs never stores your password or authentication tokens. Sessions are handled by Clerk and secured
              with short-lived tokens.
            </p>
          </div>
        </Section>

        {/* Preferences */}
        <Section icon={SlidersHorizontal} title="Preferences" description="Personalize how SecureDocs looks and notifies you.">
          <div className="space-y-6">
            {/* Theme */}
            <div>
              <p className="mb-2 text-sm font-medium">Theme</p>
              <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
                {themeOptions.map((opt) => {
                  const active = theme === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        active
                          ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                          : 'surface text-muted hover:text-[rgb(var(--text))]'
                      }`}
                      aria-pressed={active}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notifications */}
            <div className="border-t pt-4">
              <p className="mb-1 text-sm font-medium">Notifications</p>
              <div className="divide-y">
                <Toggle
                  label="Email notifications"
                  description="Receive important account emails."
                  checked={notifications.email}
                  onChange={(v) => setNotifications((n) => ({ ...n, email: v }))}
                />
                <Toggle
                  label="AI processing complete"
                  description="Get notified when a document finishes analysis."
                  checked={notifications.aiComplete}
                  onChange={(v) => setNotifications((n) => ({ ...n, aiComplete: v }))}
                />
                <Toggle
                  label="Weekly summary"
                  description="A digest of your document activity every week."
                  checked={notifications.weekly}
                  onChange={(v) => setNotifications((n) => ({ ...n, weekly: v }))}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-500/30 bg-red-500/[0.03] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <TriangleAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-red-500">Danger zone</h2>
              <p className="mt-0.5 text-sm text-muted">
                Permanently delete your account and all associated documents. This action cannot be undone.
              </p>
              <button
                className="btn-danger mt-4"
                onClick={() => {
                  setConfirmText('')
                  setDeleteOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Delete confirmation */}
      <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title="Delete account" size="sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <TriangleAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted">
              This will permanently delete your account, documents, and AI insights. To confirm, type{' '}
              <span className="font-mono font-semibold text-[rgb(var(--text))]">DELETE</span> below.
            </p>
          </div>
        </div>
        <input
          className="input mt-4"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE to confirm"
          aria-label="Type DELETE to confirm account deletion"
          autoFocus
        />
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleDeleteAccount}
            disabled={confirmText !== 'DELETE' || deleting}
          >
            {deleting && <LoadingSpinner size={16} className="text-white" />}
            Delete my account
          </button>
        </div>
      </Modal>
    </div>
  )
}
