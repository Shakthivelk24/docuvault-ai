import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

/** Light/dark toggle. Preference persists via ThemeContext. */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-ghost rounded-xl p-2.5 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
