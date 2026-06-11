import type { Project } from "@/lib/notion/types"

interface HomeHeroProjectRailProps {
  projects: Project[]
  visualProjectIndices: number[]
  visualDisplayIndex: number
  visualCenterProgress: number
  edgePadding: number
  itemHeight: number
  noProjectsLabel: string
  onScroll: () => void
  setProjectItemRef: (args: {
    index: number
    node: HTMLLIElement | null
  }) => void
  viewportRef: React.RefObject<HTMLDivElement | null>
}

const CYLINDER_ANGLE_DENSITY = 0.2
const CYLINDER_RADIUS_MULTIPLIER = 2.8
const CYLINDER_RADIUS_MIN = 280
const CYLINDER_RADIUS_MAX = 420
const CYLINDER_EXTRA_TURNS = 2

export function HomeHeroProjectRail({
  projects,
  visualProjectIndices,
  visualDisplayIndex,
  visualCenterProgress,
  edgePadding,
  itemHeight,
  noProjectsLabel,
  onScroll,
  setProjectItemRef,
  viewportRef,
}: HomeHeroProjectRailProps) {
  const projectCount = projects.length
  const angleStep =
    projectCount > 0 ? -((360 / projectCount) * CYLINDER_ANGLE_DENSITY) : 0
  const cylinderRotationDeg = -visualCenterProgress * angleStep
  const cylinderRadius = Math.max(
    CYLINDER_RADIUS_MIN,
    Math.min(CYLINDER_RADIUS_MAX, itemHeight * CYLINDER_RADIUS_MULTIPLIER),
  )
  const repeatsPerFullTurn =
    CYLINDER_ANGLE_DENSITY > 0 ? Math.ceil(1 / CYLINDER_ANGLE_DENSITY) : 1
  const cylinderRepeatCount = Math.max(
    3,
    repeatsPerFullTurn + CYLINDER_EXTRA_TURNS,
  )
  const cylinderHalfRepeatOffset =
    Math.floor(cylinderRepeatCount / 2) * projectCount

  const getWrappedAngleDistanceRatio = (angle: number) => {
    const wrapped = (((angle + 180) % 360) + 360) % 360 - 180
    return Math.min(1, Math.abs(wrapped) / 180)
  }

  return (
    <nav className="flex w-full flex-col gap-0">
      {projects.length > 0 ? (
        <div className="relative h-[42vh] max-h-[420px] min-h-[240px] w-full shrink-0 md:h-[420px] md:max-h-none md:min-h-0 lg:h-[min(62vh,760px)]">
          <div
            ref={viewportRef}
            onScroll={onScroll}
            className="h-full w-full overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex flex-col">
              <li
                aria-hidden
                className="w-full shrink-0 md:w-2/3"
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
                    className="box-border flex w-full min-w-0 flex-col justify-center border-t border-black/45 py-2 pr-2 pl-0 md:w-2/3 md:border-transparent md:py-3 md:pr-4"
                    style={{ height: `${itemHeight}px` }}
                  >
                    <p
                      className={`line-clamp-3 text-base leading-snug md:pointer-events-none md:select-none md:opacity-0 md:text-xl ${
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
                className="w-full shrink-0 md:w-2/3"
                style={{ height: `${edgePadding}px` }}
              />
            </ul>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center overflow-hidden [perspective:1100px] md:flex"
          >
            <div className="relative h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
              <div
                className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]"
                style={{
                  transform: `translate3d(-50%, -50%, 0) rotateX(${cylinderRotationDeg}deg)`,
                }}
              >
                {Array.from(
                  { length: projectCount * cylinderRepeatCount },
                  (_, repeatedIndex) => {
                    const slotIndex = repeatedIndex - cylinderHalfRepeatOffset
                    const projectIndex =
                      ((slotIndex % projectCount) + projectCount) % projectCount
                    const project = projects[projectIndex]
                    if (!project) {
                      return null
                    }

                    const relativeAngle = slotIndex * angleStep + cylinderRotationDeg
                    const distanceRatio =
                      getWrappedAngleDistanceRatio(relativeAngle)
                    const opacity = Math.max(0.14, 1 - distanceRatio * 0.86)

                    return (
                      <div
                        key={`${project.id}-${slotIndex}`}
                        className="absolute top-0 left-0 w-[210px] -translate-x-1/2 [transform-origin:50%_0%] [backface-visibility:hidden] lg:w-[240px]"
                        style={{
                          opacity,
                          transform: `rotateX(${slotIndex * angleStep}deg) translateZ(${cylinderRadius}px)`,
                        }}
                      >
                        <span className="mb-4 block w-full border-t border-black/45" />
                        <p className="text-lg leading-none tracking-[0.03em] whitespace-nowrap text-black lg:text-xl">
                          {project.title}
                        </p>
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[clamp(1.2rem,2vw,2rem)] text-black/70">
          {noProjectsLabel}
        </p>
      )}
    </nav>
  )
}
