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
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                <Image
                  src={imageUrl}
                  alt={data.profileImage?.data?.attributes?.alternativeText || 'Profile'}
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
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
