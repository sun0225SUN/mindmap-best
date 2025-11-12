'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export function ThemeToggle({ strokeWidth = 2, className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'

    if (!document.startViewTransition) {
      setTheme(newTheme)
    } else {
      document.startViewTransition(() => setTheme(newTheme))
    }
  }

  return (
    <button
      aria-label='Toggle theme'
      className={cn('cursor-pointer', className)}
      onClick={toggleTheme}
      type='button'
    >
      <Sun
        absoluteStrokeWidth
        className={cn('size-6 dark:hidden', className)}
        strokeWidth={strokeWidth}
      />
      <Moon
        absoluteStrokeWidth
        className={cn('hidden size-6 dark:block', className)}
        strokeWidth={strokeWidth}
      />
    </button>
  )
}
