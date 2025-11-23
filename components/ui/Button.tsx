import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'icon' | 'primary'
  children: ReactNode
}

export function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'rounded-lg transition-colors'

  const variantStyles = {
    default: 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800',
    icon: 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800',
    primary:
      'flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100',
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
