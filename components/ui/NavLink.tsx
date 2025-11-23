interface NavLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
  variant?: 'desktop' | 'mobile'
  className?: string
}

export function NavLink({
  href,
  children,
  onClick,
  variant = 'desktop',
  className = '',
}: NavLinkProps) {
  const baseClasses =
    'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200'

  const variantClasses =
    variant === 'mobile'
      ? 'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hover:translate-x-1'
      : 'hover:scale-105'

  return (
    <a href={href} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </a>
  )
}
