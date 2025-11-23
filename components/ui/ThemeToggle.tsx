'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/ThemeProvider'

import { Button } from './Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  )
}
