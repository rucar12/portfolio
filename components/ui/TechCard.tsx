import { type ReactNode } from 'react'

interface TechCardProps {
  children: ReactNode
}

export function TechCard({ children }: TechCardProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  )
}
