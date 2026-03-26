"use client"

import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/notion/types"
import type { Profile } from "@/lib/profile"
import { PROJECT_RAIL_ITEM_HEIGHT } from "@/lib/project-rail-math"
import Link from "next/link"
import { HomeHeroProfilePane } from "./home-hero/home-hero-profile-pane"
import { HomeHeroProjectRail } from "./home-hero/home-hero-project-rail"
import { HomeHeroSelectedProjectCard } from "./home-hero/home-hero-selected-project-card"
import { useProjectRailController } from "./home-hero/use-project-rail-controller"

interface HomeHeroProps {
  profile: Profile
  projects: Project[]
  locale: Locale
  labels: {
    fallbackName: string
    fallbackRole: string
    noProjects: string
    noProjectSelected: string
    socialTwitter: string
    socialGithub: string
    seekAboutMe: string
  }
}

/**
 * Splits a full name into [firstName, lastName/remaining].
 */
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/)
  return [first || "Portfolio", rest.join(" ")]
}

export function HomeHero({ profile, projects, locale, labels }: HomeHeroProps) {
  const {
    displayIndex,
    visualDisplayIndex,
    visualProjectIndices,
    edgePadding,
    handleScroll,
    setProjectItemRef,
    viewportRef,
  } = useProjectRailController({
    projectCount: projects.length,
    itemHeight: PROJECT_RAIL_ITEM_HEIGHT,
  })

  const selectedProject = projects[displayIndex]
  const [firstName, lastName] = splitName(profile.name || labels.fallbackName)
  const role = selectedProject?.role || labels.fallbackRole

  return (
    <section className="min-h-screen overflow-hidden">
      <div className="relative mx-auto grid min-h-screen max-w-[1800px] gap-14 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:gap-10 lg:px-14 lg:py-12">
        <HomeHeroProfilePane
          profile={profile}
          firstName={firstName}
          lastName={lastName}
          labels={{
            socialTwitter: labels.socialTwitter,
            socialGithub: labels.socialGithub,
          }}
        />

        <HomeHeroSelectedProjectCard
          locale={locale}
          selectedProject={selectedProject}
          role={role}
          noProjectSelectedLabel={labels.noProjectSelected}
        />

        <div className="flex flex-col justify-between lg:min-h-[calc(100vh-6rem)]">
          <HomeHeroProjectRail
            projects={projects}
            visualProjectIndices={visualProjectIndices}
            visualDisplayIndex={visualDisplayIndex}
            edgePadding={edgePadding}
            noProjectsLabel={labels.noProjects}
            onScroll={handleScroll}
            setProjectItemRef={setProjectItemRef}
            viewportRef={viewportRef}
          />

          <div className="self-end">
            <Link
              href={`/${locale}/about`}
              className="text-base text-black/90 underline-offset-4 hover:underline"
            >
              {labels.seekAboutMe}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
