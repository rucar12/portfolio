const START_YEAR = 2025

export function Footer() {
  const currentYear = new Date().getFullYear()
  const yearRange =
    START_YEAR === currentYear ? START_YEAR.toString() : `${START_YEAR}-${currentYear}`

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {yearRange} Liubomyr Danyshchuk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
