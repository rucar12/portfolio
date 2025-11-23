import type { Metadata } from 'next'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TechnologiesSection } from '@/components/sections/TechnologiesSection'
import { WelcomeSection } from '@/components/sections/WelcomeSection'
import { WorkExperienceSection } from '@/components/sections/WorkExperienceSection'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { getPortfolioData, getStrapiImageUrl } from '@/lib/strapi'

export const revalidate = 3600

export const dynamic = 'force-static'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData()

  const metadata = data.metadata
  const title = metadata
    ? `${metadata.titleUk} | ${metadata.titleEn}`
    : `${data.welcome.title} - ${data.welcome.subtitle}`

  const description = metadata
    ? `${metadata.descriptionUk} ${metadata.descriptionEn}`
    : `${data.welcome.description}`

  let keywords: string[] = []
  if (metadata) {
    keywords = Array.isArray(metadata.keywords) ? metadata.keywords : [metadata.keywords]
  }

  const ogImage = metadata?.ogImage || data.welcome.profileImage
  const ogImageUrl = getStrapiImageUrl(ogImage)
  const twitterImage = metadata?.twitterImage || ogImage
  const twitterImageUrl = getStrapiImageUrl(twitterImage)

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'uk_UA',
      alternateLocale: ['en_US'],
      url: siteUrl,
      siteName: `${data.welcome.title} - Portfolio | Портфоліо`,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: ogImage?.data?.attributes?.width || 1200,
              height: ogImage?.data?.attributes?.height || 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: twitterImageUrl ? [twitterImageUrl] : [],
    },
  }
}

export default async function Home() {
  const data = await getPortfolioData()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.welcome.title,
    jobTitle: data.welcome.subtitle,
    description: data.welcome.description,
    url: siteUrl,
    sameAs: [],
    knowsAbout: data.technologies.map(tech => tech.name),
    alumniOf: data.workExperiences.map(exp => ({
      '@type': 'Organization',
      name: exp.company,
    })),
    hasOccupation: data.workExperiences.map(exp => ({
      '@type': 'Occupation',
      name: exp.position,
      occupationLocation: {
        '@type': 'City',
      },
      worksFor: {
        '@type': 'Organization',
        name: exp.company,
      },
      startDate: exp.startDate,
      endDate: exp.endDate || undefined,
    })),
    '@id': siteUrl,
    inLanguage: ['uk', 'en'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen relative">
        <AnimatedBackground />
        <Header cvFile={data.cv?.file} />
        <WelcomeSection data={data.welcome} />
        <WorkExperienceSection experiences={data.workExperiences} />
        <TechnologiesSection technologies={data.technologies} />
        <Footer />
      </main>
    </>
  )
}
