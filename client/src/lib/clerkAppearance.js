// Themed appearance for Clerk's prebuilt components so sign-in/up and the
// user button match the SecureDocs navy + indigo design in both themes.

export function getClerkAppearance(isDark) {
  return {
    variables: {
      colorPrimary: '#4f46e5',
      colorText: isDark ? '#e2e8f0' : '#0f172a',
      colorTextSecondary: isDark ? '#94a3b8' : '#64748b',
      colorBackground: isDark ? '#111a2e' : '#ffffff',
      colorInputBackground: isDark ? '#0f1729' : '#ffffff',
      colorInputText: isDark ? '#e2e8f0' : '#0f172a',
      colorDanger: '#ef4444',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      borderRadius: '0.75rem',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    },
    elements: {
      rootBox: 'w-full',
      card: 'bg-transparent shadow-none border-none',
      headerTitle: 'font-display text-xl',
      headerSubtitle: 'text-sm',
      socialButtonsBlockButton:
        'border border-[rgb(var(--border))] hover:bg-[rgb(var(--surface-2))]',
      formButtonPrimary:
        'bg-brand-gradient hover:brightness-110 text-sm normal-case font-semibold shadow-glow-sm',
      formFieldInput:
        'rounded-xl border-[rgb(var(--border))] focus:border-brand-500 focus:ring-brand-500/30',
      footerActionLink: 'text-brand-500 hover:text-brand-400',
      identityPreviewEditButton: 'text-brand-500',
      badge: 'bg-brand-500/10 text-brand-500',
      userButtonPopoverCard: 'shadow-soft',
    },
  }
}
