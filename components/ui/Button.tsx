import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'icon' | 'primary'
  children: ReactNode
}

export function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  const baseStyles =
    'rounded-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95'

  const variantStyles = {
    default: 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md',
    icon: 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md',
    primary:
      'flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5',
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
