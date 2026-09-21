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
  CheckCircle2,
  Bell,
} from 'lucide-react'

import PageHeader from '@/components/ui/PageHeader'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'


// =========================================================
// SECTION
// =========================================================

function Section({
  icon: Icon,
  title,
  description,
  children,
  accent = 'brand',
}) {
  const accents = {
    brand: 'bg-brand-500/10 text-brand-500 ring-brand-500/10',
    red: 'bg-red-500/10 text-red-500 ring-red-500/10',
    emerald:
      'bg-emerald-500/10 text-emerald-500 ring-emerald-500/10',
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[rgb(var(--border))]
        bg-[rgb(var(--surface-1))]
        shadow-sm
        transition-shadow
        duration-200
        hover:shadow-md
      "
    >
      {/* Section header */}
      <div
        className="
          flex
          items-start
          gap-4
          border-b
          border-[rgb(var(--border))]
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ring-1
            ${accents[accent]}
          `}
        >
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-5 text-muted">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Section content */}
      <div className="px-5 py-5 sm:px-6">
        {children}
      </div>
    </section>
  )
}


// =========================================================
// TOGGLE
// =========================================================

function Toggle({
  checked,
  onChange,
  label,
  description,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        px-3
        py-3
        transition-colors
        hover:bg-[rgb(var(--surface-2))]
      "
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {label}
        </p>

        {description && (
          <p className="mt-0.5 text-xs leading-5 text-muted">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition-all
          duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-brand-500/40
          ${
            checked
              ? 'bg-brand-gradient shadow-sm'
              : 'bg-[rgb(var(--border))]'
          }
        `}
      >
        <span
          className={`
            absolute
            top-0.5
            h-5
            w-5
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            duration-200
            ${
              checked
                ? 'translate-x-[22px]'
                : 'translate-x-0.5'
            }
          `}
        />
      </button>
    </div>
  )
}


// =========================================================
// SETTINGS PAGE
// =========================================================

export default function Settings() {
  const { user } = useUser()
  const {
    openUserProfile,
    signOut,
  } = useClerk()

  const {
    theme,
    setTheme,
  } = useTheme()

  const toast = useToast()

  const [
    notifications,
    setNotifications,
  ] = useState({
    email: true,
    aiComplete: true,
    weekly: false,
  })

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false)

  const [
    confirmText,
    setConfirmText,
  ] = useState('')

  const [
    deleting,
    setDeleting,
  ] = useState(false)


  // =========================================================
  // USER DATA
  // =========================================================

  const name =
    user?.fullName ||
    user?.username ||
    'User'

  const email =
    user?.primaryEmailAddress
      ?.emailAddress || ''

  const initial =
    (name?.[0] || 'U')
      .toUpperCase()


  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  async function handleDeleteAccount() {
    setDeleting(true)

    try {
      await user?.delete()

      toast.success(
        'Your account has been deleted.'
      )

      await signOut({
        redirectUrl: '/',
      })
    } catch (err) {
      toast.error(
        err.message ||
          'Could not delete your account. Please try again.'
      )

      setDeleting(false)
    }
  }


  // =========================================================
  // THEME OPTIONS
  // =========================================================

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
    },
  ]


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-4xl">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Settings"
        subtitle="Manage your profile, security, and preferences."
      />


      <div className="space-y-5">

        {/* ===================================================
            PROFILE
        =================================================== */}

        <Section
          icon={UserIcon}
          title="Profile"
          description="Your account details are managed securely by Clerk."
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* User */}
            <div className="flex min-w-0 items-center gap-4">

              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={name}
                  className="
                    h-14
                    w-14
                    shrink-0
                    rounded-2xl
                    object-cover
                    ring-2
                    ring-brand-500/20
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-brand-gradient
                    text-lg
                    font-semibold
                    text-white
                    shadow-sm
                  "
                >
                  {initial}
                </div>
              )}

              <div className="min-w-0">

                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">
                    {name}
                  </p>

                  <span
                    className="
                      hidden
                      items-center
                      gap-1
                      rounded-full
                      bg-emerald-500/10
                      px-2
                      py-0.5
                      text-[10px]
                      font-medium
                      text-emerald-500
                      sm:inline-flex
                    "
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>

                {email && (
                  <p
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1.5
                      truncate
                      text-sm
                      text-muted
                    "
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {email}
                  </p>
                )}

              </div>

            </div>


            {/* Manage account */}
            <button
              type="button"
              className="
                btn-secondary
                shrink-0
                rounded-xl
              "
              onClick={() =>
                openUserProfile()
              }
            >
              Manage account

              <ExternalLink className="h-4 w-4" />
            </button>

          </div>
        </Section>


        {/* ===================================================
            SECURITY
        =================================================== */}

        <Section
          icon={ShieldCheck}
          title="Security"
          description="Passwords, two-factor authentication, and active sessions."
        >

          <div className="space-y-4">

            <div
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-[rgb(var(--border))]
                bg-[rgb(var(--surface-2))]
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[rgb(var(--surface-1))]
                    text-muted
                  "
                >
                  <KeyRound className="h-4 w-4" />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-medium">
                    Password &amp; 2FA
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-muted">
                    Update your password or enable
                    multi-factor authentication.
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="
                  btn-ghost
                  shrink-0
                  rounded-xl
                "
                onClick={() =>
                  openUserProfile()
                }
              >
                Manage
              </button>

            </div>


            {/* Security information */}
            <div
              className="
                flex
                gap-3
                rounded-xl
                bg-brand-500/[0.05]
                px-4
                py-3
              "
            >

              <ShieldCheck
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                  text-brand-500
                "
              />

              <p className="text-xs leading-5 text-muted">
                SecureDocs never stores your password
                or authentication tokens. Sessions are
                handled by Clerk and secured with
                short-lived tokens.
              </p>

            </div>

          </div>

        </Section>


        {/* ===================================================
            PREFERENCES
        =================================================== */}

        <Section
          icon={SlidersHorizontal}
          title="Preferences"
          description="Personalize how SecureDocs looks and notifies you."
        >

          <div className="space-y-6">

            {/* =================================================
                THEME
            ================================================= */}

            <div>

              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-medium">
                  Theme
                </p>

                <span
                  className="
                    rounded-full
                    bg-[rgb(var(--surface-2))]
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    text-muted
                  "
                >
                  Appearance
                </span>
              </div>


              <div className="grid max-w-sm grid-cols-2 gap-3">

                {themeOptions.map(
                  (option) => {
                    const Icon =
                      option.icon

                    const active =
                      theme ===
                      option.value

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() =>
                          setTheme(
                            option.value
                          )
                        }
                        className={`
                          group
                          flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-sm
                          font-medium
                          transition-all
                          duration-200
                          ${
                            active
                              ? 'border-brand-500 bg-brand-500/10 text-brand-500 shadow-sm'
                              : 'border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] text-muted hover:border-brand-500/30 hover:text-[rgb(var(--text))]'
                          }
                        `}
                        aria-pressed={
                          active
                        }
                      >

                        <Icon
                          className={`
                            h-4
                            w-4
                            transition-transform
                            ${
                              active
                                ? 'scale-110'
                                : 'group-hover:scale-105'
                            }
                          `}
                        />

                        {option.label}

                        {active && (
                          <CheckCircle2
                            className="
                              ml-1
                              h-3.5
                              w-3.5
                            "
                          />
                        )}

                      </button>
                    )
                  }
                )}

              </div>

            </div>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div
              className="
                border-t
                border-[rgb(var(--border))]
                pt-5
              "
            >

              <div className="mb-3 flex items-center gap-2">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-brand-500/10
                    text-brand-500
                  "
                >
                  <Bell className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Notifications
                  </p>

                  <p className="text-xs text-muted">
                    Choose what you want to hear about.
                  </p>
                </div>

              </div>


              <div className="space-y-1">

                <Toggle
                  label="Email notifications"
                  description="Receive important account emails."
                  checked={
                    notifications.email
                  }
                  onChange={(value) =>
                    setNotifications(
                      (current) => ({
                        ...current,
                        email: value,
                      })
                    )
                  }
                />

                <Toggle
                  label="AI processing complete"
                  description="Get notified when a document finishes analysis."
                  checked={
                    notifications.aiComplete
                  }
                  onChange={(value) =>
                    setNotifications(
                      (current) => ({
                        ...current,
                        aiComplete:
                          value,
                      })
                    )
                  }
                />

                <Toggle
                  label="Weekly summary"
                  description="A digest of your document activity every week."
                  checked={
                    notifications.weekly
                  }
                  onChange={(value) =>
                    setNotifications(
                      (current) => ({
                        ...current,
                        weekly: value,
                      })
                    )
                  }
                />

              </div>

            </div>

          </div>

        </Section>


        {/* ===================================================
            DANGER ZONE
        =================================================== */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/[0.025]
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
              p-5
              sm:p-6
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-500
                ring-1
                ring-red-500/10
              "
            >
              <TriangleAlert
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>


            <div className="min-w-0 flex-1">

              <div
                className="
                  flex
                  flex-col
                  gap-1
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <h2 className="text-base font-semibold text-red-500">
                  Danger zone
                </h2>

                <span
                  className="
                    w-fit
                    rounded-full
                    bg-red-500/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-red-500
                  "
                >
                  Irreversible
                </span>

              </div>

              <p
                className="
                  mt-1
                  max-w-2xl
                  text-sm
                  leading-5
                  text-muted
                "
              >
                Permanently delete your account
                and all associated documents.
                This action cannot be undone.
              </p>

              <button
                type="button"
                className="
                  btn-danger
                  mt-4
                  rounded-xl
                "
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


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      <Modal
        open={deleteOpen}
        onClose={() =>
          !deleting &&
          setDeleteOpen(false)
        }
        title="Delete account"
        size="sm"
      >

        <div className="space-y-5">

          {/* Warning */}
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-500
              "
            >
              <TriangleAlert
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">

              <p className="text-sm leading-6 text-muted">
                This will permanently delete
                your account, documents, and
                AI insights.
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                To confirm, type{' '}

                <span
                  className="
                    rounded
                    bg-[rgb(var(--surface-2))]
                    px-1.5
                    py-0.5
                    font-mono
                    font-semibold
                    text-[rgb(var(--text))]
                  "
                >
                  DELETE
                </span>

                {' '}below.
              </p>

            </div>

          </div>


          {/* Confirmation input */}
          <input
            className="input"
            value={confirmText}
            onChange={(event) =>
              setConfirmText(
                event.target.value
              )
            }
            placeholder="Type DELETE to confirm"
            aria-label="Type DELETE to confirm account deletion"
            autoFocus
            disabled={deleting}
          />


          {/* Actions */}
          <div
            className="
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >

            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                setDeleteOpen(false)
              }
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="
                btn-danger
                justify-center
              "
              onClick={
                handleDeleteAccount
              }
              disabled={
                confirmText !==
                  'DELETE' ||
                deleting
              }
            >

              {deleting && (
                <LoadingSpinner
                  size={16}
                  className="text-white"
                />
              )}

              {deleting
                ? 'Deleting...'
                : 'Delete my account'}

            </button>

          </div>

        </div>

      </Modal>

    </div>
  )
}