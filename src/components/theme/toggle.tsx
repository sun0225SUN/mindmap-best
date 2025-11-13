'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  size?: number
  strokeWidth?: number
}

interface ThemeToggleIconProps {
  className?: string
  strokeWidth?: number
  size?: number
}

export function ThemeToggleIcon({
  className,
  strokeWidth = 2,
  size = 4,
}: ThemeToggleIconProps) {
  const sizeClass = size === 4 ? 'size-4' : size === 5 ? 'size-5' : 'size-6'
  return (
    <>
      <Sun
        absoluteStrokeWidth
        className={cn(sizeClass, 'dark:hidden', className)}
        strokeWidth={strokeWidth}
      />
      <Moon
        absoluteStrokeWidth
        className={cn('hidden', sizeClass, 'dark:block', className)}
        strokeWidth={strokeWidth}
      />
    </>
  )
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

interface ThemeToggleButtonProps {
  className?: string
  title?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
}

export function ThemeToggleButton({
  className,
  title = 'Toggle theme',
  variant = 'ghost',
}: ThemeToggleButtonProps) {
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
    <Button
      aria-label={title}
      className={cn(buttonVariants({ variant }), className)}
      onClick={toggleTheme}
      title={title}
      variant={variant}
    >
      <ThemeToggleIcon size={4} />
    </Button>
  )
}
