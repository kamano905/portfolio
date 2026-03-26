"use client"

import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/notion/types"
import type { Profile } from "@/lib/profile"
import { ChevronDownIcon, ChevronUpIcon, Github, Twitter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

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

  useEffect(() => {
    setSelectedIndex((i) =>
      projects.length === 0 ? 0 : Math.min(i, projects.length - 1),
    )
  }, [projects.length])

  const prev = () => {
    if (projects.length === 0) return
    setSelectedIndex((i) => (i - 1 + projects.length) % projects.length)
  }

  const next = () => {
    if (projects.length === 0) return
    setSelectedIndex((i) => (i + 1) % projects.length)
  }

  const maxProjectIndex = Math.max(0, projects.length - 1)
  const displayIndex =
    projects.length === 0 ? 0 : Math.min(selectedIndex, maxProjectIndex)

  const selectedProject = projects[displayIndex]
  const [firstName, lastName] = splitName(profile.name || labels.fallbackName)
  const role = selectedProject?.role || labels.fallbackRole

  const canStep = projects.length > 0

  return (
    <section className="min-h-screen overflow-hidden bg-[#efefeb]">
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

          <div className="flex gap-2 text-base text-black/85 items-center">
            {profile.twitterUrl ? (
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <Link href={profile.twitterUrl} target="_blank" rel="noreferrer">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            {profile.githubUrl ? (
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <Link href={profile.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            {profile.contact ? (
              <Button size="sm" asChild className="h-8">
                <Link
                  href={`mailto:${profile.contact}`}
                  aria-label="Send email"
                >
                  Contact
                </Link>
              </Button>
            ) : null}
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
          <nav className="flex w-full flex-col gap-0">
            {projects.length > 0 ? (
              <>
                <div className="flex w-2/3 justify-center">
                  <button
                    type="button"
                    className="py-2 text-left text-sm text-black"
                    onClick={prev}
                    disabled={!canStep}
                    aria-label="Previous project"
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="w-full shrink-0 overflow-y-auto overscroll-y-contain">
                  <ul className="flex flex-col">
                    {projects.map((project, index) => (
                      <li
                        key={project.id}
                        className="box-border flex w-2/3 min-w-0 flex-col justify-center border-t border-black/45 py-3 pr-4 pl-0 h-[140px]"
                      >
                        <p
                          className={`line-clamp-3 text-xl leading-snug ${
                            displayIndex === index
                              ? "text-black"
                              : "text-black/30"
                          }`}
                        >
                          {project.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-2/3 justify-center">
                  <button
                    type="button"
                    className="py-2 text-left text-sm text-black"
                    onClick={next}
                    disabled={!canStep}
                    aria-label="Next project"
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </>
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
