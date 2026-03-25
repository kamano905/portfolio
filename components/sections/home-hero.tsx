"use client"

import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/notion/types"
import type { Profile } from "@/lib/profile"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  // Pick the slide whose vertical center is closest to the list viewport center
  // (robust vs scroll-snap, subpixels, and multiple visible rows).
  const syncIndexFromScroll = useCallback(() => {
    const root = listRef.current
    if (!root || projects.length === 0) return
    const items = root.querySelectorAll("li[data-slide]")
    if (items.length === 0) return

    const rootRect = root.getBoundingClientRect()
    const centerY = rootRect.top + rootRect.height / 2

    let bestIdx = 0
    let bestDist = Infinity

    items.forEach((node, i) => {
      const r = node.getBoundingClientRect()
      if (r.height <= 0) return
      const itemCenterY = r.top + r.height / 2
      const d = Math.abs(itemCenterY - centerY)
      if (d < bestDist) {
        bestDist = d
        bestIdx = i
      }
    })

    setSelectedIndex((prev) => (prev === bestIdx ? prev : bestIdx))
  }, [projects.length])

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    let raf = 0
    let rafInit = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(syncIndexFromScroll)
    }

    const scheduleSync = () => {
      cancelAnimationFrame(rafInit)
      rafInit = requestAnimationFrame(() => {
        syncIndexFromScroll()
      })
    }

    const ro = new ResizeObserver(scheduleSync)
    ro.observe(el)

    scheduleSync()
    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("scrollend", syncIndexFromScroll)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(rafInit)
      ro.disconnect()
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("scrollend", syncIndexFromScroll)
    }
  }, [syncIndexFromScroll, projects.length])

  const maxProjectIndex = Math.max(0, projects.length - 1)
  const displayIndex =
    projects.length === 0 ? 0 : Math.min(selectedIndex, maxProjectIndex)

  const selectedProject = projects[displayIndex]
  const [firstName, lastName] = splitName(profile.name || labels.fallbackName)
  const role = selectedProject?.role || labels.fallbackRole

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#efefeb]">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.11) 0.55px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto grid min-h-screen max-w-[1800px] gap-14 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:gap-10 lg:px-14 lg:py-12">
        <div className="flex flex-col justify-between lg:min-h-[calc(100vh-6rem)]">
          <header className="text-black">
            <p className="text-2xl leading-none tracking-[0.03em]">
              {firstName}
            </p>
            {lastName ? (
              <p className="mt-2 text-2xl leading-none tracking-[0.03em]">
                {lastName}
              </p>
            ) : null}
          </header>

          <div className="space-y-3 text-base text-black/85">
            {profile.twitterUrl ? (
              <Link href={profile.twitterUrl} target="_blank" rel="noreferrer">
                {labels.socialTwitter}
              </Link>
            ) : null}
            {profile.contact ? <p>{profile.contact}</p> : null}
          </div>
        </div>

        <div className="relative flex min-h-[340px] items-center justify-center lg:min-h-[calc(100vh-6rem)]">
          {selectedProject ? (
            <Link
              href={`/${locale}/projects/${selectedProject.id}`}
              aria-label={`${selectedProject.title} details`}
              className="group relative block w-full max-w-md px-5 py-6 text-black sm:px-8 sm:py-9"
            >
              <span className="absolute top-0 left-0 h-5 w-5 border-t border-l border-black/45" />
              <span className="absolute top-0 right-0 h-5 w-5 border-t border-r border-black/45" />
              <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-black/45" />
              <span className="absolute right-0 bottom-0 h-5 w-5 border-r border-b border-black/45" />

              <h2 className="text-5xl leading-[0.95] tracking-[0.01em] transition-opacity group-hover:opacity-75">
                {selectedProject.title}
              </h2>
              <div className="relative hidden py-6 lg:block">
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 w-screen -translate-x-1/2 -translate-y-1/2 border-t border-black/35"
                />
              </div>
              <p className="mt-6 text-2xl leading-none lg:mt-0">{role}</p>
              <p className="mt-5 max-w-full text-xl leading-[1.45] text-black/85">
                {selectedProject.description}
              </p>
            </Link>
          ) : (
            <p className="text-[clamp(1.2rem,2vw,2rem)] text-black/70">
              {labels.noProjectSelected}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between lg:min-h-[calc(100vh-6rem)]">
          <nav>
            {projects.length > 0 ? (
              <div
                ref={listRef}
                className="h-[60vh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <ul className="flex flex-col">
                  {projects.map((project, index) => (
                    <li
                      key={project.id}
                      data-slide
                      data-project-index={index}
                      className="box-border flex h-[calc(60vh/3)] shrink-0 snap-start flex-col justify-start pt-2 pb-3"
                    >
                      <div className="flex min-h-0 flex-1 flex-col border-t border-black/45 pt-3">
                        <p
                          className={`line-clamp-3 text-xl leading-snug tracking-[0.02em] transition-colors duration-300 ${
                            displayIndex === index
                              ? "text-black"
                              : "text-black/30"
                          }`}
                        >
                          {project.title}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[clamp(1.2rem,2vw,2rem)] text-black/70">
                {labels.noProjects}
              </p>
            )}
          </nav>

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
