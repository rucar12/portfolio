import { type ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  bgColor?: 'white' | 'gray'
}

export function Section({ id, children, bgColor = 'white' }: SectionProps) {
  const bgStyles = bgColor === 'gray' ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'

  return (
    <section id={id} className={`py-20 px-4 sm:px-6 lg:px-8 ${bgStyles}`}>
      <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
