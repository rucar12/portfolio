import Image from 'next/image'

import { Section } from '@/components/ui/Section'
import { getStrapiImageUrl, type WelcomeData } from '@/lib/strapi'

interface WelcomeSectionProps {
  data: WelcomeData
}

export function WelcomeSection({ data }: WelcomeSectionProps) {
  const imageUrl = getStrapiImageUrl(data.profileImage)

  return (
    <Section id="welcome" bgColor="white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {imageUrl && (
            <div className="flex-shrink-0 animate-fade-in-up">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400">
                <Image
                  src={imageUrl}
                  alt={data.profileImage?.data?.attributes?.alternativeText || 'Profile'}
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  priority
                />
              </div>
            </div>
          )}
          <div
            className="flex-1 text-center md:text-left animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {data.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6">
              {data.subtitle}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
