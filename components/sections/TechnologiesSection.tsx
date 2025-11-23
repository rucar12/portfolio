import { Section } from '@/components/ui/Section'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TechCard } from '@/components/ui/TechCard'
import { type Technology } from '@/lib/strapi'

interface TechnologiesSectionProps {
  technologies: Technology[]
}

export function TechnologiesSection({ technologies }: TechnologiesSectionProps) {
  if (technologies.length === 0) {
    return null
  }

  const groupedByYears = technologies.reduce(
    (acc, tech) => {
      const years = tech.yearsOfExperience
      if (!acc[years]) {
        acc[years] = []
      }
      acc[years].push(tech)

      return acc
    },
    {} as Record<number, Technology[]>
  )

  const sortedYears = Object.keys(groupedByYears)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <Section id="technologies" bgColor="white">
      <SectionTitle>Technologies</SectionTitle>
      <div className="space-y-12">
        {sortedYears.map(years => {
          const techs = groupedByYears[years]

          return (
            <div key={years}>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                {years} {years === 1 ? 'year' : 'years'} of experience
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {techs.map(tech => (
                  <TechCard key={tech.id}>
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {tech.name}
                    </span>
                    {tech.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {tech.category}
                      </span>
                    )}
                  </TechCard>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
