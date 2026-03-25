"use client"

import type { Locale } from "@/lib/i18n/config"
import type { About, Project } from "@/lib/notion/types"
import Link from "next/link"
import { startTransition, useRef, useState } from "react"

interface HomeHeroProps {
  about: About | null
  projects: Project[]
  locale: Locale
  labels: {
    fallbackName: string
    fallbackRole: string
    noProjects: string
    noProjectSelected: string
    socialLinkedIn: string
    socialGithub: string
    seekAboutMe: string
  }
}

function splitName(name: string) {
  const chunks = name.trim().split(/\s+/)
  if (chunks.length <= 1) {
    return [chunks[0] || "Portfolio", ""]
  }

  return [chunks[0], chunks.slice(1).join(" ")]
}

export function HomeHero({ about, projects, locale, labels }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  const [firstName, lastName] = splitName(about?.title || labels.fallbackName)
  const normalizedActiveIndex =
    activeIndex >= 0 && activeIndex < projects.length ? activeIndex : 0
  const selectedProject = projects[normalizedActiveIndex] ?? projects[0]
  const role = selectedProject?.role || labels.fallbackRole

  const updateActiveProjectByScroll = (listElement: HTMLDivElement) => {
    if (projects.length === 0) return

    const viewportCenter = listElement.scrollTop + listElement.clientHeight / 2
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    itemRefs.current.forEach((item, index) => {
      if (!item) return

      const itemCenter = item.offsetTop + item.offsetHeight / 2
      const distance = Math.abs(itemCenter - viewportCenter)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    if (nearestIndex !== activeIndexRef.current) {
      activeIndexRef.current = nearestIndex
      startTransition(() => {
        setActiveIndex(nearestIndex)
      })
    }
  }

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
      <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden border-t border-black/35 lg:block" />

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
            {about?.linkedinUrl ? (
              <Link href={about.linkedinUrl} target="_blank" rel="noreferrer">
                {labels.socialLinkedIn}
              </Link>
            ) : null}
            {about?.githubUrl ? (
              <Link href={about.githubUrl} target="_blank" rel="noreferrer">
                {labels.socialGithub}
              </Link>
            ) : null}
            {about?.contact ? <p>{about.contact}</p> : null}
          </div>
        </div>

        <div className="relative flex min-h-[340px] items-center justify-center lg:min-h-[calc(100vh-6rem)]">
          {selectedProject ? (
            <article className="relative w-full max-w-[920px] px-7 py-10 text-black sm:px-14 sm:py-16">
              <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-black/45" />
              <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-black/45" />
              <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-black/45" />
              <span className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-black/45" />

              <h2 className="text-5xl leading-[0.95] tracking-[0.01em]">
                {selectedProject.title}
              </h2>
              <p className="mt-8 text-2xl leading-none">{role}</p>
              <p className="mt-6 max-w-[820px] text-xl leading-[1.45] text-black/85">
                {selectedProject.description}
              </p>
            </article>
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
                onScroll={(event) => {
                  updateActiveProjectByScroll(event.currentTarget)
                }}
                className="h-[52vh] snap-y snap-mandatory overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <ul className="space-y-4 pb-6">
                  {projects.map((project, index) => {
                    const active = selectedProject?.id === project.id

                    return (
                      <li key={project.id}>
                        <div
                          ref={(element) => {
                            itemRefs.current[index] = element
                          }}
                          className="min-h-[7.5rem] snap-center border-t border-black/45 pt-5"
                        >
                          <p
                            className={`text-[clamp(1.3rem,2.1vw,2.6rem)] tracking-[0.02em] ${
                              active ? "text-black" : "text-black/80"
                            }`}
                          >
                            {project.title}
                          </p>
                        </div>
                      </li>
                    )
                  })}
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
