import { AboutProfile } from "@/components/sections/about-profile"
import { AwardsSection } from "@/components/sections/awards"
import { ExperienceSection } from "@/components/sections/experience"
import { PublicationsSection } from "@/components/sections/publications"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getAwards, getExperience, getPublications } from "@/lib/data"
import { getProfile } from "@/lib/profile"
import Link from "next/link"
import { notFound } from "next/navigation"

interface AboutPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) {
    notFound()
  }

  const [dictionary, experience, awards, publications] = await Promise.all([
    getDictionary(locale),
    getExperience(locale),
    getAwards(locale),
    getPublications(locale),
  ])
  const profile = getProfile(locale)

  return (
    <div className="relative min-h-screen">
      <Link
        href={`/${locale}/home`}
        className="fixed top-14 left-12 z-20 text-lg text-black/80 underline-offset-4 hover:underline"
      >
        {"<< Back"}
      </Link>
      <div className="mx-auto max-w-4xl px-8 py-20 pt-36">
        <div className="space-y-14">
          <AboutProfile profile={profile} />
          <ExperienceSection
            experience={experience}
            title={dictionary.sections.experience}
          />
          <PublicationsSection
            publications={publications}
            title={dictionary.sections.publications}
          />
          <AwardsSection awards={awards} title={dictionary.sections.awards} />
        </div>
      </div>
    </div>
  )
}
