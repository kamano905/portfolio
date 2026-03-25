import { HomeHero } from "@/components/sections/home-hero"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getProjects } from "@/lib/data"
import { getProfile } from "@/lib/profile"
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

  const [dictionary, projects] = await Promise.all([
    getDictionary(locale),
    getProjects(locale),
  ])
  const profile = getProfile(locale)

  return (
    <HomeHero
      profile={profile}
      projects={projects}
      locale={locale}
      labels={{
        fallbackName: dictionary.home.fallbackName,
        fallbackRole: dictionary.home.fallbackRole,
        noProjects: dictionary.home.noProjects,
        noProjectSelected: dictionary.home.noProjectSelected,
        socialTwitter: dictionary.home.socialTwitter,
        socialGithub: dictionary.home.socialGithub,
        seekAboutMe: dictionary.navigation.seekAboutMe,
      }}
    />
  )
}
