export const PROJECT_RAIL_ITEM_HEIGHT = 140

export function clampNumber(value: number, min: number, max: number): number {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

export function wrapIndex(value: number, size: number): number {
  if (size <= 0) return 0
  return ((value % size) + size) % size
}

export function getProjectRailEdgePadding(
  viewportHeight: number,
  itemHeight = PROJECT_RAIL_ITEM_HEIGHT,
): number {
  return Math.max(0, (viewportHeight - itemHeight) / 2)
}

interface ProjectIndexFromScrollCenterInput {
  scrollTop: number
  viewportHeight: number
  edgePadding: number
  projectCount: number
  itemHeight?: number
}

export function getProjectIndexFromScrollCenter({
  scrollTop,
  viewportHeight,
  edgePadding,
  projectCount,
  itemHeight = PROJECT_RAIL_ITEM_HEIGHT,
}: ProjectIndexFromScrollCenterInput): number {
  if (projectCount <= 0) return 0

  const centerY = scrollTop + viewportHeight / 2
  const relativeY = centerY - edgePadding - itemHeight / 2
  const rawIndex = Math.round(relativeY / itemHeight)

  return clampNumber(rawIndex, 0, projectCount - 1)
}

interface CenteredScrollTopForItemInput {
  itemOffsetTop: number
  itemHeight: number
  viewportHeight: number
  scrollHeight: number
}

export function getCenteredScrollTopForItem({
  itemOffsetTop,
  itemHeight,
  viewportHeight,
  scrollHeight,
}: CenteredScrollTopForItemInput): number {
  const targetTop = itemOffsetTop - (viewportHeight - itemHeight) / 2
  const maxTop = Math.max(0, scrollHeight - viewportHeight)

  return clampNumber(targetTop, 0, maxTop)
}
