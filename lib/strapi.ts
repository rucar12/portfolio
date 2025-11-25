import axios from 'axios'

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(
  /\/$/,
  ''
)

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
})

export interface StrapiImage {
  data: {
    id: number
    attributes: {
      url: string
      alternativeText: string
      width: number
      height: number
    }
  } | null
}

export interface StrapiFile {
  data: {
    id: number
    attributes: {
      url: string
      name: string
      mime: string
      size: number
    }
  } | null
}

export interface WelcomeData {
  title: string
  description: string
  subtitle: string
  profileImage: StrapiImage
}

export interface WorkExperience {
  id: number
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  responsibilities: string[] | string
  technologies: string[] | string
  companyLogo?: StrapiImage
  companyWebsite?: string | null
}

export interface Technology {
  id: number
  name: string
  yearsOfExperience: number
  category: string | null
}

export interface CVData {
  file: StrapiFile
}

export interface MetadataData {
  titleUk: string
  titleEn: string
  descriptionUk: string
  descriptionEn: string
  keywords: string[] | string
  ogImage?: StrapiImage
  twitterImage?: StrapiImage
}

export interface SocialLink {
  id: number
  name: string
  url: string
  handle?: string | null
  icon?: StrapiImage | null
}

export interface PortfolioData {
  welcome: WelcomeData
  workExperiences: WorkExperience[]
  technologies: Technology[]
  cv: CVData | null
  metadata: MetadataData | null
  socialLinks: SocialLink[]
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const [welcomeRes, experiencesRes, technologiesRes, cvRes, metadataRes, socialLinksRes] =
      await Promise.all([
        api.get('/welcome?populate=*').catch(error => {
          throw error
        }),
        api.get('/work-experiences?populate=*&sort=startDate:desc').catch(() => {
          return { data: { data: [] } }
        }),
        api.get('/technologies?populate=*&sort=yearsOfExperience:desc').catch(() => {
          return { data: { data: [] } }
        }),
        api.get('/cv?populate=*').catch(() => ({ data: { data: null } })),
        api.get('/metadata?populate=*').catch(() => ({ data: { data: null } })),
        api.get('/social-links?populate=icon').catch(() => ({ data: { data: [] } })),
      ])

    if (!welcomeRes.data?.data) {
      throw new Error(
        'Welcome data not found in Strapi. Please check if the "welcome" single type exists and is published.'
      )
    }

    const welcomeData = welcomeRes.data.data
    const profileImageData = welcomeData.profileImage
    const profileImage: StrapiImage = profileImageData
      ? {
          data: {
            id: profileImageData.id,
            attributes: {
              url:
                profileImageData.url ||
                profileImageData.formats?.large?.url ||
                profileImageData.formats?.medium?.url ||
                '',
              alternativeText: profileImageData.alternativeText || '',
              width: profileImageData.width || 0,
              height: profileImageData.height || 0,
            },
          },
        }
      : { data: null }

    const cvData = cvRes?.data?.data
    let cv: CVData | null = null

    if (cvData?.file) {
      const fileData = cvData.file
      cv = {
        file: {
          data: {
            id: fileData.id,
            attributes: {
              url: fileData.url || '',
              name: fileData.name || '',
              mime: fileData.mime || '',
              size: fileData.size || 0,
            },
          },
        },
      }
    }

    const metadataData = metadataRes?.data?.data
    let metadata: MetadataData | null = null

    if (metadataData) {
      const ogImageData = metadataData.ogImage
      const ogImage: StrapiImage = ogImageData
        ? {
            data: {
              id: ogImageData.id,
              attributes: {
                url:
                  ogImageData.url ||
                  ogImageData.formats?.large?.url ||
                  ogImageData.formats?.medium?.url ||
                  '',
                alternativeText: ogImageData.alternativeText || '',
                width: ogImageData.width || 0,
                height: ogImageData.height || 0,
              },
            },
          }
        : { data: null }

      const twitterImageData = metadataData.twitterImage
      const twitterImage: StrapiImage = twitterImageData
        ? {
            data: {
              id: twitterImageData.id,
              attributes: {
                url:
                  twitterImageData.url ||
                  twitterImageData.formats?.large?.url ||
                  twitterImageData.formats?.medium?.url ||
                  '',
                alternativeText: twitterImageData.alternativeText || '',
                width: twitterImageData.width || 0,
                height: twitterImageData.height || 0,
              },
            },
          }
        : { data: null }

      metadata = {
        titleUk: metadataData.titleUk || '',
        titleEn: metadataData.titleEn || '',
        descriptionUk: metadataData.descriptionUk || '',
        descriptionEn: metadataData.descriptionEn || '',
        keywords: (() => {
          if (Array.isArray(metadataData.keywords)) {
            return metadataData.keywords
          }
          if (typeof metadataData.keywords === 'string') {
            return metadataData.keywords.split(',').map((k: string) => k.trim())
          }

          return []
        })(),
        ogImage: ogImage.data ? ogImage : undefined,
        twitterImage: twitterImage.data ? twitterImage : undefined,
      }
    }

    return {
      welcome: {
        title: welcomeData.title,
        description: welcomeData.description,
        subtitle: welcomeData.subtitle,
        profileImage,
      },
      metadata,
      workExperiences: experiencesRes.data.data.map(
        (item: {
          id: number
          company: string
          position: string
          startDate: string
          endDate: string | null
          description: string
          responsibilities: string[]
          technologies: string[]
          companyLogo?: unknown
          companyWebsite?: string | null
        }) => {
          const companyLogo = item.companyLogo
            ? {
                data: { id: (item.companyLogo as { id: number }).id, attributes: item.companyLogo },
              }
            : undefined

          return {
            id: item.id,
            company: item.company,
            position: item.position,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : [],
            technologies: Array.isArray(item.technologies) ? item.technologies : [],
            companyLogo,
            companyWebsite: item.companyWebsite || null,
          }
        }
      ),
      technologies: technologiesRes.data.data.map(
        (item: {
          id: number
          name: string
          yearsOfExperience: number
          category: string | null
        }) => ({
          id: item.id,
          name: item.name,
          yearsOfExperience: item.yearsOfExperience,
          category: item.category,
        })
      ),
      cv,
      socialLinks: (() => {
        const rawData = socialLinksRes.data.data || []

        // Remove duplicates by URL (more reliable than ID since duplicates can have different IDs)
        const uniqueByUrl = new Map<string, (typeof rawData)[0]>()
        rawData.forEach((item: { id: number; url: string; name: string }) => {
          const urlKey = item.url.toLowerCase().trim()
          if (!uniqueByUrl.has(urlKey)) {
            uniqueByUrl.set(urlKey, item)
          }
        })

        const uniqueData = Array.from(uniqueByUrl.values())

        const processed = uniqueData.map(
          (item: {
            id: number
            name: string
            url: string
            handle?: string | null
            icon?: unknown
          }) => {
            const iconData = item.icon
            let icon: StrapiImage | null = null

            if (iconData) {
              const iconObj = iconData as {
                id?: number
                data?: {
                  id: number
                  attributes: {
                    url?: string
                    formats?: {
                      large?: { url: string }
                      thumbnail?: { url: string }
                      small?: { url: string }
                      medium?: { url: string }
                    }
                    alternativeText?: string
                    width?: number
                    height?: number
                  }
                }
                url?: string
                formats?: {
                  large?: { url: string }
                  thumbnail?: { url: string }
                  small?: { url: string }
                  medium?: { url: string }
                }
                alternativeText?: string
                width?: number
                height?: number
              }

              if (iconObj.data?.attributes) {
                const attrs = iconObj.data.attributes
                icon = {
                  data: {
                    id: iconObj.data.id,
                    attributes: {
                      url:
                        attrs.url ||
                        attrs.formats?.large?.url ||
                        attrs.formats?.medium?.url ||
                        attrs.formats?.small?.url ||
                        attrs.formats?.thumbnail?.url ||
                        '',
                      alternativeText: attrs.alternativeText || '',
                      width: attrs.width || 0,
                      height: attrs.height || 0,
                    },
                  },
                }
              } else if (iconObj.id) {
                const formats = iconObj.formats || {}
                const iconUrl =
                  (iconObj.url && iconObj.url.trim()) ||
                  formats.large?.url ||
                  formats.medium?.url ||
                  formats.small?.url ||
                  formats.thumbnail?.url ||
                  ''

                if (iconUrl && iconUrl.trim()) {
                  icon = {
                    data: {
                      id: iconObj.id,
                      attributes: {
                        url: iconUrl,
                        alternativeText: iconObj.alternativeText || '',
                        width: iconObj.width || 0,
                        height: iconObj.height || 0,
                      },
                    },
                  }
                }
              }
            }

            return {
              id: item.id,
              name: item.name,
              url: item.url,
              handle: item.handle || null,
              icon,
            }
          }
        )
        
return processed
      })(),
    }
  } catch (error) {
    return {
      welcome: {
        title: 'Liubomyr Danyshchuk',
        description: 'Full Stack Developer',
        subtitle: 'Experienced developer focused on creating quality web applications',
        profileImage: { data: null },
      },
      workExperiences: [],
      technologies: [],
      cv: null,
      metadata: null,
      socialLinks: [],
    }
  }
}

export function getStrapiImageUrl(image: StrapiImage): string | null {
  if (!image?.data?.attributes) {
    return null
  }
  const url =
    image.data.attributes.url ||
    (image.data.attributes as { formats?: { large?: { url: string } } })?.formats?.large?.url
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${STRAPI_URL}${url}`
}

export function getStrapiFileUrl(file: StrapiFile): string | null {
  if (!file?.data?.attributes?.url) {
    return null
  }

  const url = file.data.attributes.url

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${STRAPI_URL}${url}`
}
