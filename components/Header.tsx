'use client'

import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'

import { downloadCV } from '@/lib/pdfExport'
import { getStrapiFileUrl, type StrapiFile } from '@/lib/strapi'

import { useTheme } from './ThemeProvider'
import { Button } from './ui/Button'

interface HeaderProps {
  cvFile?: StrapiFile
}

export function Header({ cvFile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleDownloadCV = () => {
    if (!cvFile || !cvFile.data) {
      console.warn('CV file is not available')

      return
    }
    const cvUrl = getStrapiFileUrl(cvFile)
    if (cvUrl) {
      downloadCV(cvUrl, cvFile.data.attributes?.name || 'Liubomyr_Danyshchuk_CV.pdf')
    } else {
      console.warn('CV URL could not be generated')
    }
  }

  const hasCV = cvFile && cvFile.data && cvFile.data.attributes

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#welcome"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#experience"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Experience
            </a>
            <a
              href="#technologies"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Technologies
            </a>
            {hasCV && (
              <Button variant="primary" onClick={handleDownloadCV}>
                <Download size={18} />
                <span>PDF</span>
              </Button>
            )}
            <Button variant="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            {hasCV && (
              <Button variant="icon" onClick={handleDownloadCV} aria-label="Download CV">
                <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Button>
            )}
            <Button variant="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
            <Button
              variant="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-200 dark:border-gray-800">
            <a
              href="#welcome"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              About
            </a>
            <a
              href="#experience"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Experience
            </a>
            <a
              href="#technologies"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Technologies
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
