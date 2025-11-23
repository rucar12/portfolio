import { Briefcase, Calendar, ExternalLink } from 'lucide-react'
import Image from 'next/image'

import { Section } from '@/components/ui/Section'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TechBadge } from '@/components/ui/TechBadge'
import { getStrapiImageUrl, type WorkExperience } from '@/lib/strapi'

interface WorkExperienceSectionProps {
  experiences: WorkExperience[]
}

export function WorkExperienceSection({ experiences }: WorkExperienceSectionProps) {
  if (experiences.length === 0) {
    return null
  }

  return (
    <Section id="experience" bgColor="gray">
      <SectionTitle>Work Experience</SectionTitle>
      <div className="space-y-8">
        {experiences.map(exp => {
          const logoUrl = exp.companyLogo ? getStrapiImageUrl(exp.companyLogo) : null

          return (
            <div
              key={exp.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700 animate-fade-in-up"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {logoUrl && (
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={logoUrl}
                        alt={exp.company}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300">
                        <Briefcase className="w-5 h-5" />
                        {exp.companyWebsite ? (
                          <a
                            href={exp.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                          >
                            {exp.company}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm md:text-base">
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}{' '}
                        -{' '}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })
                          : 'Present'}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Responsibilities & Achievements:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech, idx) => (
                        <TechBadge key={idx} label={tech} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
