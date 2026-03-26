import type { Project } from "@/lib/notion/types"

interface HomeHeroProjectRailProps {
  projects: Project[]
  visualProjectIndices: number[]
  visualDisplayIndex: number
  edgePadding: number
  noProjectsLabel: string
  onScroll: () => void
  setProjectItemRef: (args: {
    index: number
    node: HTMLLIElement | null
  }) => void
  viewportRef: React.RefObject<HTMLDivElement | null>
}

export function HomeHeroProjectRail({
  projects,
  visualProjectIndices,
  visualDisplayIndex,
  edgePadding,
  noProjectsLabel,
  onScroll,
  setProjectItemRef,
  viewportRef,
}: HomeHeroProjectRailProps) {
  return (
    <nav className="flex w-full flex-col gap-0">
      {projects.length > 0 ? (
        <div
          ref={viewportRef}
          onScroll={onScroll}
          className="h-[340px] w-full shrink-0 overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:h-[420px] lg:h-[min(62vh,760px)] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex flex-col">
            <li
              aria-hidden
              className="w-2/3 shrink-0"
              style={{ height: `${edgePadding}px` }}
            />
            {visualProjectIndices.map((projectIndex, visualIndex) => {
              const project = projects[projectIndex]
              if (!project) {
                return null
              }

              return (
                <li
                  key={`${visualIndex}-${project.id}`}
                  ref={(node) => {
                    setProjectItemRef({ index: visualIndex, node })
                  }}
                  className="box-border flex h-[140px] w-2/3 min-w-0 flex-col justify-center border-t border-black/45 py-3 pr-4 pl-0"
                >
                  <p
                    className={`line-clamp-3 text-xl leading-snug ${
                      visualDisplayIndex === visualIndex
                        ? "text-black"
                        : "text-black/30"
                    }`}
                  >
                    {project.title}
                  </p>
                </li>
              )
            })}
            <li
              aria-hidden
              className="w-2/3 shrink-0"
              style={{ height: `${edgePadding}px` }}
            />
          </ul>
        </div>
      ) : (
        <p className="text-[clamp(1.2rem,2vw,2rem)] text-black/70">
          {noProjectsLabel}
        </p>
      )}
    </nav>
  )
}
