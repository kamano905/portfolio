"use client"

import {
  PROJECT_RAIL_ITEM_HEIGHT,
  clampNumber,
  getCenteredScrollTopForItem,
  getProjectIndexFromScrollCenter,
  getProjectRailEdgePadding,
} from "@/lib/project-rail-math"
import { useLayoutEffect, useRef, useState } from "react"

type SelectionSource = "scroll" | "programmatic" | null

interface UseProjectRailControllerInput {
  projectCount: number
  itemHeight?: number
}

interface SetProjectItemRefInput {
  index: number
  node: HTMLLIElement | null
}

/**
 * Scroll sync contract:
 * - User scroll updates selectedIndex and never forces scrollTop.
 * - Programmatic selection recenters the target item.
 * - Users can always reach the min/max scroll position manually.
 */
export function useProjectRailController({
  projectCount,
  itemHeight = PROJECT_RAIL_ITEM_HEIGHT,
}: UseProjectRailControllerInput) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const projectItemRefs = useRef<(HTMLLIElement | null)[]>([])
  const selectionSourceRef = useRef<SelectionSource>(null)
  const scrollSyncRafRef = useRef<number | null>(null)

  const maxIndex = Math.max(0, projectCount - 1)
  const displayIndex =
    projectCount === 0 ? 0 : Math.min(selectedIndex, maxIndex)
  const edgePadding = getProjectRailEdgePadding(viewportHeight, itemHeight)

  useLayoutEffect(() => {
    projectItemRefs.current = projectItemRefs.current.slice(0, projectCount)
  }, [projectCount])

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
    if (projectCount === 0) return

    if (selectionSourceRef.current === "scroll") {
      selectionSourceRef.current = null
      return
    }

    const viewport = viewportRef.current
    const activeItem = projectItemRefs.current[displayIndex]
    if (!viewport || !activeItem) return

    const nextTop = getCenteredScrollTopForItem({
      itemOffsetTop: activeItem.offsetTop,
      itemHeight: activeItem.clientHeight,
      viewportHeight: viewport.clientHeight,
      scrollHeight: viewport.scrollHeight,
    })

    const behavior =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"

    viewport.scrollTo({ top: nextTop, behavior })
    selectionSourceRef.current = null
  }, [displayIndex, projectCount, itemHeight])

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

  const selectProjectIndex = (index: number) => {
    if (projectCount === 0) return
    const nextIndex = clampNumber(index, 0, maxIndex)

    setSelectedIndex((currentIndex) => {
      if (currentIndex === nextIndex) return currentIndex
      selectionSourceRef.current = "programmatic"
      return nextIndex
    })
  }

  const syncSelectedIndexFromScrollPosition = () => {
    if (projectCount === 0) return

    const viewport = viewportRef.current
    if (!viewport) return

    const nextIndex = getProjectIndexFromScrollCenter({
      scrollTop: viewport.scrollTop,
      viewportHeight: viewport.clientHeight,
      edgePadding,
      projectCount,
      itemHeight,
    })

    setSelectedIndex((currentIndex) => {
      if (currentIndex === nextIndex) return currentIndex
      selectionSourceRef.current = "scroll"
      return nextIndex
    })
  }

  const handleScroll = () => {
    if (scrollSyncRafRef.current !== null) return
    scrollSyncRafRef.current = window.requestAnimationFrame(() => {
      scrollSyncRafRef.current = null
      syncSelectedIndexFromScrollPosition()
    })
  }

  return {
    displayIndex,
    edgePadding,
    handleScroll,
    selectProjectIndex,
    setProjectItemRef,
    viewportRef,
  }
}
