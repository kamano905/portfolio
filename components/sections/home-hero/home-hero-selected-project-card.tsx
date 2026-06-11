import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/notion/types"
import Link from "next/link"

interface HomeHeroSelectedProjectCardProps {
  locale: Locale
  selectedProject: Project | undefined
  role: string
  noProjectSelectedLabel: string
}

export function HomeHeroSelectedProjectCard({
  locale,
  selectedProject,
  role,
  noProjectSelectedLabel,
}: HomeHeroSelectedProjectCardProps) {
  return (
    <div className="relative flex min-h-[260px] items-start justify-start pt-16 md:min-h-[320px] md:pt-24 lg:min-h-[calc(100vh-6rem)] lg:pt-36">
      {selectedProject ? (
        <Link
          href={`/${locale}/projects/${selectedProject.id}`}
          aria-label={`${selectedProject.title} details`}
          className="group relative block px-4 py-6 text-black md:px-6 md:py-8"
        >
          <span className="absolute top-0 left-0 h-4 w-4 border-t border-l border-black/45 md:h-5 md:w-5" />
          <span className="absolute top-0 right-0 h-4 w-4 border-t border-r border-black/45 md:h-5 md:w-5" />
          <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-black/45 md:h-5 md:w-5" />
          <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-black/45 md:h-5 md:w-5" />

          <h2 className="text-3xl leading-[0.95] tracking-[0.01em] transition-opacity group-hover:opacity-75 md:text-5xl">
            {selectedProject.title}
          </h2>
          <div className="relative hidden py-4 md:block">
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 w-[200vw] -translate-x-1/2 -translate-y-1/2 border-t border-black/35"
            />
          </div>
          <p className="mt-3 text-lg leading-none md:mt-0 md:text-2xl">
            {role}
          </p>
          <p className="mt-3 max-w-full text-base leading-[1.5] text-black/85 md:mt-4 md:text-xl md:leading-[1.45]">
            {selectedProject.description}
          </p>
        </Link>
      ) : (
        <p className="text-[clamp(1.2rem,2vw,2rem)] text-black/70">
          {noProjectSelectedLabel}
        </p>
      )}
    </div>
  )
}
