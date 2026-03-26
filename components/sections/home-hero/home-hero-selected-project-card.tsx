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
    <div className="relative flex min-h-[340px] items-start justify-start lg:min-h-[calc(100vh-6rem)] pt-36">
      {selectedProject ? (
        <Link
          href={`/${locale}/projects/${selectedProject.id}`}
          aria-label={`${selectedProject.title} details`}
          className="group relative block text-black px-6 py-8"
        >
          <span className="absolute top-0 left-0 h-5 w-5 border-t border-l border-black/45" />
          <span className="absolute top-0 right-0 h-5 w-5 border-t border-r border-black/45" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-black/45" />
          <span className="absolute right-0 bottom-0 h-5 w-5 border-r border-b border-black/45" />

          <h2 className="text-5xl leading-[0.95] tracking-[0.01em] transition-opacity group-hover:opacity-75">
            {selectedProject.title}
          </h2>
          <div className="relative hidden py-4 lg:block">
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 w-screen -translate-x-1/2 -translate-y-1/2 border-t border-black/35"
            />
          </div>
          <p className="mt-4 text-2xl leading-none lg:mt-0">{role}</p>
          <p className="mt-4 max-w-full text-xl leading-[1.45] text-black/85">
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
