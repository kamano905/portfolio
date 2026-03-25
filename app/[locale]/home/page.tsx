import { HomeHero } from "@/components/sections/home-hero"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getHomeData } from "@/lib/data"
import { notFound } from "next/navigation"

interface HomePageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  if (!isLocale(locale)) {
    notFound()
  }

  const [dictionary, homeData] = await Promise.all([
    getDictionary(locale),
    getHomeData(locale),
  ])

  return (
    <HomeHero
      about={homeData.about}
      projects={homeData.projects}
      locale={locale}
      labels={{
        fallbackName: dictionary.home.fallbackName,
        fallbackRole: dictionary.home.fallbackRole,
        noProjects: dictionary.home.noProjects,
        noProjectSelected: dictionary.home.noProjectSelected,
        socialLinkedIn: dictionary.home.socialLinkedIn,
        socialGithub: dictionary.home.socialGithub,
        seekAboutMe: dictionary.navigation.seekAboutMe,
      }}
    />
  )
}
