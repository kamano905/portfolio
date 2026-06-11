"use client"

import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/notion/types"
import type { Profile } from "@/lib/profile"
import { PROJECT_RAIL_ITEM_HEIGHT } from "@/lib/project-rail-math"
import Link from "next/link"
import { useLayoutEffect, useRef, useState } from "react"
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

const MOBILE_PROJECT_RAIL_ITEM_HEIGHT = 80
const MOBILE_RAIL_SELECTION_OFFSET_PX = 0
const DESKTOP_RAIL_SELECTION_OFFSET_PX = 0
const DESKTOP_RAIL_ITEM_ANCHOR_OFFSET_PX = 0

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
  const [projectRailItemAnchorOffsetPx, setProjectRailItemAnchorOffsetPx] =
    useState(MOBILE_PROJECT_RAIL_ITEM_HEIGHT / 2)
  const selectionGuideRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const syncRailMetrics = () => {
      setProjectRailItemHeight(
        media.matches
          ? PROJECT_RAIL_ITEM_HEIGHT
          : MOBILE_PROJECT_RAIL_ITEM_HEIGHT,
      )
      setProjectRailItemAnchorOffsetPx(
        media.matches
          ? DESKTOP_RAIL_ITEM_ANCHOR_OFFSET_PX
          : MOBILE_PROJECT_RAIL_ITEM_HEIGHT / 2,
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
    visualCenterProgress,
    visualProjectIndices,
    edgePadding,
    handleScroll,
    setProjectItemRef,
    viewportRef,
  } = useProjectRailController({
    projectCount: projects.length,
    itemHeight: projectRailItemHeight,
    itemAnchorOffsetPx: projectRailItemAnchorOffsetPx,
    selectionOffsetPx: projectRailSelectionOffsetPx,
  })

  const selectedProject = projects[displayIndex]
  const [firstName, lastName] = splitName(profile.name || labels.fallbackName)
  const role = selectedProject?.role || labels.fallbackRole

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    if (!media.matches) {
      return
    }

    const syncGuideOffset = () => {
      const viewport = viewportRef.current
      const guide = selectionGuideRef.current
      if (!viewport || !guide) return

      const viewportRect = viewport.getBoundingClientRect()
      const guideRect = guide.getBoundingClientRect()
      const nextOffset = Math.round(
        guideRect.top +
          guideRect.height / 2 -
          (viewportRect.top + viewportRect.height / 2),
      )

      setProjectRailSelectionOffsetPx((currentOffset) =>
        currentOffset === nextOffset ? currentOffset : nextOffset,
      )
    }

    syncGuideOffset()
    window.addEventListener("resize", syncGuideOffset)

    const viewport = viewportRef.current
    const guide = selectionGuideRef.current
    const canObserve = typeof ResizeObserver !== "undefined"

    if (!viewport || !guide || !canObserve) {
      return () => {
        window.removeEventListener("resize", syncGuideOffset)
      }
    }

    const observer = new ResizeObserver(syncGuideOffset)
    observer.observe(viewport)
    observer.observe(guide)

    let cancelled = false
    const fontsReady = document.fonts?.ready
    if (fontsReady) {
      void fontsReady.then(() => {
        if (!cancelled) {
          syncGuideOffset()
        }
      })
    }

    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener("resize", syncGuideOffset)
    }
  }, [projectRailItemHeight, selectedProject?.id, viewportRef])

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
          selectionGuideRef={selectionGuideRef}
        />

        <div className="flex flex-col gap-8 md:min-h-[calc(100vh-6rem)] md:justify-between md:pt-20">
          <HomeHeroProjectRail
            projects={projects}
            visualProjectIndices={visualProjectIndices}
            visualDisplayIndex={visualDisplayIndex}
            visualCenterProgress={visualCenterProgress}
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
