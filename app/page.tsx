import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TechnologiesSection } from '@/components/sections/TechnologiesSection'
import { WelcomeSection } from '@/components/sections/WelcomeSection'
import { WorkExperienceSection } from '@/components/sections/WorkExperienceSection'
import { getPortfolioData } from '@/lib/strapi'

export const revalidate = 3600

export const dynamic = 'force-static'

export default async function Home() {
  const data = await getPortfolioData()

  return (
    <main className="min-h-screen">
      <Header cvFile={data.cv?.file} />
      <WelcomeSection data={data.welcome} />
      <WorkExperienceSection experiences={data.workExperiences} />
      <TechnologiesSection technologies={data.technologies} />
      <Footer />
    </main>
  )
}
