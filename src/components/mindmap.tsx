'use client'

import '@/styles/mindmap/react-board.css'
import '@/styles/mindmap/react-text.css'
import '@/styles/mindmap/styles.scss'
import '@/styles/mindmap/custom.css'

import { withGroup } from '@plait/common'
import type {
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitTheme,
} from '@plait/core'
import { ThemeColorMode } from '@plait/core'
import { withDraw } from '@plait/draw'
import { MindThemeColors, withMind } from '@plait/mind'
import { Board, type BoardChangeData, Wrapper } from '@plait-board/react-board'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMindmapStore } from '@/stores/mindmap-store'

const BOARD_OPTIONS: PlaitBoardOptions = {
  readonly: true,
  hideScrollbar: true,
  disabledScrollOnNonFocus: false,
  themeColors: MindThemeColors,
}

const PLUGINS: PlaitPlugin[] = [withDraw, withGroup, withMind]

function getPlaitThemeFromNextTheme(
  resolvedTheme: string | undefined,
): PlaitTheme {
  return {
    themeColorMode:
      resolvedTheme === 'dark' ? ThemeColorMode.dark : ThemeColorMode.default,
  }
}

function isAutoSyncTheme(theme: PlaitTheme | undefined): boolean {
  return (
    !theme ||
    theme.themeColorMode === ThemeColorMode.default ||
    theme.themeColorMode === ThemeColorMode.dark
  )
}

export function MindMap() {
  const {
    children,
    viewport,
    theme: storedTheme,
    updateData,
  } = useMindmapStore()
  const { resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(children)
  const previousChildrenLengthRef = useRef(children?.length ?? 0)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    const currentLength = children?.length ?? 0
    const previousLength = previousChildrenLengthRef.current

    if (previousLength === 0 && currentLength > 0) {
      updateData({ viewport: undefined })
    }

    if (!hasInitializedRef.current && currentLength > 0 && viewport) {
      updateData({ viewport: undefined })
      hasInitializedRef.current = true
    }

    previousChildrenLengthRef.current = currentLength
  }, [children, viewport, updateData])

  const theme = useMemo((): PlaitTheme | undefined => {
    if (!resolvedTheme) return storedTheme

    const newTheme = getPlaitThemeFromNextTheme(resolvedTheme)
    if (isAutoSyncTheme(storedTheme)) {
      return newTheme
    }
    return storedTheme
  }, [storedTheme, resolvedTheme])

  useEffect(() => {
    if (!resolvedTheme || !isAutoSyncTheme(storedTheme)) return

    const newTheme = getPlaitThemeFromNextTheme(resolvedTheme)
    if (
      !storedTheme ||
      storedTheme.themeColorMode !== newTheme.themeColorMode
    ) {
      updateData({ theme: newTheme })
    }
  }, [resolvedTheme, storedTheme, updateData])

  const handleMindChange = useCallback(
    (data: BoardChangeData) => {
      const shouldUpdateTheme =
        data.theme &&
        theme &&
        data.theme.themeColorMode !== theme.themeColorMode

      updateData({
        viewport: data.viewport,
        ...(shouldUpdateTheme && { theme: data.theme }),
      })
    },
    [updateData, theme],
  )

  const normalizedValue = useMemo((): PlaitElement[] => {
    if (!Array.isArray(children) || children.length === 0) return []

    return children.map((item) => {
      if (
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'mindmap'
      ) {
        return {
          ...item,
          isRoot: item.isRoot ?? true,
          points:
            Array.isArray(item.points) && item.points.length > 0
              ? item.points
              : [[400, 300]],
        } as PlaitElement
      }
      return item
    })
  }, [children])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !containerRef.current) return

    if (valueRef.current !== children) {
      valueRef.current = children
      setIsReady(false)
    }

    let retryCount = 0
    const maxRetries = 10

    const checkReady = () => {
      const container = containerRef.current
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setIsReady(true)
      } else if (retryCount < maxRetries) {
        retryCount++
        requestAnimationFrame(checkReady)
      } else {
        setIsReady(true)
      }
    }

    requestAnimationFrame(checkReady)
  }, [isMounted, children])

  if (!isMounted || !isReady) {
    return (
      <div
        className='flex h-full w-full items-center justify-center'
        ref={containerRef}
      />
    )
  }

  const hasMindmap = normalizedValue.some(
    (item) =>
      item &&
      typeof item === 'object' &&
      'type' in item &&
      item.type === 'mindmap' &&
      'id' in item &&
      'data' in item,
  )

  if (!hasMindmap) return null

  return (
    <div
      className='h-full w-full'
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <Wrapper
        key={theme?.themeColorMode ?? 'default'}
        onChange={handleMindChange}
        options={BOARD_OPTIONS}
        plugins={PLUGINS}
        theme={theme}
        value={normalizedValue}
        viewport={viewport}
      >
        <Board />
      </Wrapper>
    </div>
  )
}
