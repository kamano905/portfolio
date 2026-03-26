"use client"

import {
  PROJECT_RAIL_ITEM_HEIGHT,
  clampNumber,
  getProjectIndexFromScrollCenter,
  getProjectRailEdgePadding,
  wrapIndex,
} from "@/lib/project-rail-math"
import { useLayoutEffect, useRef, useState } from "react"

interface UseProjectRailControllerInput {
  projectCount: number
  itemHeight?: number
}

interface SetProjectItemRefInput {
  index: number
  node: HTMLLIElement | null
}

/**
 * Infinite rail contract:
 * - Keep a logical selected index for the center card.
 * - Render repeated visual blocks and derive logical index from center row.
 * - Rebase scroll position near edges so users can scroll endlessly.
 */
export function useProjectRailController({
  projectCount,
  itemHeight = PROJECT_RAIL_ITEM_HEIGHT,
}: UseProjectRailControllerInput) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)
  const [selectedVisualIndex, setSelectedVisualIndex] = useState(() =>
    projectCount > 1 ? projectCount * 3 : 0,
  )
  const [viewportHeight, setViewportHeight] = useState(0)

  const repeatBlockCount = projectCount > 1 ? 7 : projectCount > 0 ? 1 : 0
  const visualProjectCount = projectCount * repeatBlockCount
  const middleBlockIndex = Math.floor(repeatBlockCount / 2)
  const middleBlockStartIndex = middleBlockIndex * projectCount
  const visualProjectIndices =
    projectCount === 0
      ? []
      : Array.from(
          { length: visualProjectCount },
          (_, visualIndex) => visualIndex % projectCount,
        )

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const projectItemRefs = useRef<(HTMLLIElement | null)[]>([])
  const scrollSyncRafRef = useRef<number | null>(null)
  const railIdentityRef = useRef("")

  const edgePadding = getProjectRailEdgePadding(viewportHeight, itemHeight)
  const normalizedProjectIndex =
    projectCount === 0
      ? 0
      : clampNumber(selectedProjectIndex, 0, projectCount - 1)
  const normalizedVisualIndex =
    visualProjectCount === 0
      ? 0
      : clampNumber(selectedVisualIndex, 0, visualProjectCount - 1)

  useLayoutEffect(() => {
    projectItemRefs.current = projectItemRefs.current.slice(
      0,
      visualProjectCount,
    )
  }, [visualProjectCount])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const syncViewportHeight = () => {
      setViewportHeight(viewport.clientHeight)
    }

    syncViewportHeight()

    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(syncViewportHeight)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (projectCount === 0 || repeatBlockCount === 0) return

    const railIdentity = `${projectCount}:${repeatBlockCount}:${Math.round(edgePadding)}`
    if (railIdentityRef.current === railIdentity) return
    railIdentityRef.current = railIdentity

    const initialVisualIndex = middleBlockStartIndex + normalizedProjectIndex

    const viewport = viewportRef.current
    const activeItem = projectItemRefs.current[initialVisualIndex]
    if (!viewport || !activeItem) return

    const centerY =
      activeItem.offsetTop +
      activeItem.clientHeight / 2 -
      viewport.clientHeight / 2
    viewport.scrollTop = centerY

    let frameId = 0
    frameId = window.requestAnimationFrame(() => {
      setSelectedProjectIndex(normalizedProjectIndex)
      setSelectedVisualIndex(initialVisualIndex)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [
    edgePadding,
    middleBlockStartIndex,
    normalizedProjectIndex,
    projectCount,
    repeatBlockCount,
  ])

  useLayoutEffect(() => {
    return () => {
      if (scrollSyncRafRef.current !== null) {
        window.cancelAnimationFrame(scrollSyncRafRef.current)
      }
    }
  }, [])

  const setProjectItemRef = ({ index, node }: SetProjectItemRefInput) => {
    projectItemRefs.current[index] = node
  }

  const syncSelectedIndexFromScrollPosition = () => {
    if (projectCount === 0 || visualProjectCount === 0) return
    const viewport = viewportRef.current
    if (!viewport) return

    const nextVisualIndex = getProjectIndexFromScrollCenter({
      scrollTop: viewport.scrollTop,
      viewportHeight: viewport.clientHeight,
      edgePadding,
      projectCount: visualProjectCount,
      itemHeight,
    })
    const nextLogicalIndex = wrapIndex(nextVisualIndex, projectCount)

    setSelectedVisualIndex(nextVisualIndex)
    setSelectedProjectIndex(nextLogicalIndex)

    if (projectCount <= 1) return

    const blockIndex = Math.floor(nextVisualIndex / projectCount)
    const isNearTop = blockIndex <= 1
    const isNearBottom = blockIndex >= repeatBlockCount - 2
    if (!isNearTop && !isNearBottom) return

    const rebasedVisualIndex = middleBlockStartIndex + nextLogicalIndex
    const deltaRows = rebasedVisualIndex - nextVisualIndex
    viewport.scrollTop += deltaRows * itemHeight
    setSelectedVisualIndex(rebasedVisualIndex)
  }

  const handleScroll = () => {
    if (scrollSyncRafRef.current !== null) return
    scrollSyncRafRef.current = window.requestAnimationFrame(() => {
      scrollSyncRafRef.current = null
      syncSelectedIndexFromScrollPosition()
    })
  }

  return {
    displayIndex: normalizedProjectIndex,
    visualDisplayIndex: normalizedVisualIndex,
    visualProjectIndices,
    edgePadding,
    handleScroll,
    setProjectItemRef,
    viewportRef,
  }
}
