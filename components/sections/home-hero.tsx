"use client"

import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/notion/types"
import type { Profile } from "@/lib/profile"
import { PROJECT_RAIL_ITEM_HEIGHT } from "@/lib/project-rail-math"
import Link from "next/link"
import { useLayoutEffect, useState } from "react"
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

const MOBILE_PROJECT_RAIL_ITEM_HEIGHT = 88
const MOBILE_RAIL_SELECTION_OFFSET_PX = 0
const DESKTOP_RAIL_SELECTION_OFFSET_PX = -80

/**
 * Splits a full name into [firstName, lastName/remaining].
 */
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/)
  return [first || "Portfolio", rest.join(" ")]
}

export function HomeHero({ profile, projects, locale, labels }: HomeHeroProps) {
  const [projectRailItemHeight, setProjectRailItemHeight] = useState(
    PROJECT_RAIL_ITEM_HEIGHT,
  )
  const [projectRailSelectionOffsetPx, setProjectRailSelectionOffsetPx] =
    useState(MOBILE_RAIL_SELECTION_OFFSET_PX)

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const syncRailMetrics = () => {
      setProjectRailItemHeight(
        media.matches
          ? PROJECT_RAIL_ITEM_HEIGHT
          : MOBILE_PROJECT_RAIL_ITEM_HEIGHT,
      )
      setProjectRailSelectionOffsetPx(
        media.matches
          ? DESKTOP_RAIL_SELECTION_OFFSET_PX
          : MOBILE_RAIL_SELECTION_OFFSET_PX,
      )
    }

    syncRailMetrics()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncRailMetrics)
      return () => media.removeEventListener("change", syncRailMetrics)
    }

    media.addListener(syncRailMetrics)
    return () => media.removeListener(syncRailMetrics)
  }, [])

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
    itemHeight: projectRailItemHeight,
    selectionOffsetPx: projectRailSelectionOffsetPx,
  })

  const selectedProject = projects[displayIndex]
  const [firstName, lastName] = splitName(profile.name || labels.fallbackName)
  const role = selectedProject?.role || labels.fallbackRole

  return (
    <section className="min-h-screen overflow-hidden">
      <div className="relative mx-auto flex min-h-screen max-w-[1800px] flex-col gap-10 px-4 py-6 md:grid md:grid-cols-[220px_minmax(0,1fr)_280px] md:gap-10 md:px-10 md:py-12 lg:px-14">
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

        <div className="flex flex-col gap-8 md:min-h-[calc(100vh-6rem)] md:justify-between md:pt-20">
          <HomeHeroProjectRail
            projects={projects}
            visualProjectIndices={visualProjectIndices}
            visualDisplayIndex={visualDisplayIndex}
            edgePadding={edgePadding}
            itemHeight={projectRailItemHeight}
            noProjectsLabel={labels.noProjects}
            onScroll={handleScroll}
            setProjectItemRef={setProjectItemRef}
            viewportRef={viewportRef}
          />

          <div className="self-start md:self-end">
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
