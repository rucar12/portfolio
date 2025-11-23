'use client'

import { Download, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { downloadCV } from '@/lib/pdfExport'
import { getStrapiFileUrl, type StrapiFile } from '@/lib/strapi'

import { Button } from './ui/Button'
import { Logo } from './ui/Logo'
import { NavLink } from './ui/NavLink'
import { ThemeToggle } from './ui/ThemeToggle'

interface HeaderProps {
  cvFile?: StrapiFile
}

const navigationItems = [
  { href: '#welcome', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#technologies', label: 'Technologies' },
]

export function Header({ cvFile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Logo />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map(item => (
              <NavLink key={item.href} href={item.href} variant="desktop">
                {item.label}
              </NavLink>
            ))}
            {hasCV && (
              <Button variant="primary" onClick={handleDownloadCV}>
                <Download size={18} />
                <span>PDF</span>
              </Button>
            )}
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center space-x-2">
            {hasCV && (
              <Button variant="icon" onClick={handleDownloadCV} aria-label="Download CV">
                <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Button>
            )}
            <ThemeToggle />
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
          <>
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 -mx-4 sm:-mx-6 lg:-mx-8" />
            <div className="md:hidden py-4 space-y-3">
              {navigationItems.map(item => (
                <NavLink key={item.href} href={item.href} variant="mobile" onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
