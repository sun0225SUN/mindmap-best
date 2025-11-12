'use client'

import '@/styles/mindmap/react-board.css'
import '@/styles/mindmap/react-text.css'
import '@/styles/mindmap/styles.scss'
import '@/styles/mindmap/custom.css'

import { withGroup } from '@plait/common'
import type {
  PlaitBoard,
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitTheme,
} from '@plait/core'
import { ThemeColorMode } from '@plait/core'
import { withDraw } from '@plait/draw'
import type { MindLayoutType } from '@plait/layouts'
import { MindLayoutType as MindLayoutTypeEnum } from '@plait/layouts'
import type { MindElement } from '@plait/mind'
import {
  MindElement as MindElementUtils,
  MindThemeColors,
  MindTransforms,
  withMind,
} from '@plait/mind'
import {
  Board,
  type BoardChangeData,
  useBoard,
  Wrapper,
} from '@plait-board/react-board'
import { Layout } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMindmapStore } from '@/stores/mindmap-store'
import { LayoutPopover } from './layout-popover'

const BOARD_OPTIONS: PlaitBoardOptions = {
  readonly: true,
  hideScrollbar: true,
  disabledScrollOnNonFocus: false,
  themeColors: MindThemeColors,
}

const PLUGINS: PlaitPlugin[] = [withDraw, withGroup, withMind]

function BoardWithLayoutControl({
  onBoardReady,
}: {
  onBoardReady: (board: PlaitBoard) => void
}) {
  const board = useBoard()

  useEffect(() => {
    if (board) {
      onBoardReady(board)
    }
  }, [board, onBoardReady])

  return <Board />
}

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
  const [currentLayout, setCurrentLayout] = useState<
    MindLayoutType | undefined
  >()
  const boardRef = useRef<PlaitBoard | null>(null)
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

  const handleBoardReady = useCallback((board: PlaitBoard) => {
    boardRef.current = board
  }, [])

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

  const handleLayoutChange = useCallback(
    (layout: MindLayoutType) => {
      if (boardRef.current) {
        MindTransforms.setLayout(boardRef.current, layout)
        setCurrentLayout(layout)

        if (layout === MindLayoutTypeEnum.standard) {
          const rootElement = normalizedValue.find(
            (item): item is MindElement =>
              item &&
              typeof item === 'object' &&
              'type' in item &&
              item.type === 'mindmap' &&
              MindElementUtils.isMindElement(boardRef.current, item),
          )

          if (rootElement?.children) {
            const childCount = rootElement.children.length
            const rightNodeCount =
              childCount > 0 ? Math.ceil(childCount / 2) : 0

            const updatedChildren = children.map((item) => {
              if (
                item &&
                typeof item === 'object' &&
                'type' in item &&
                item.type === 'mindmap' &&
                item.id === rootElement.id
              ) {
                return {
                  ...item,
                  layout,
                  rightNodeCount,
                } as PlaitElement
              }
              return item
            })

            updateData({ children: updatedChildren })
            return
          }
        }

        requestAnimationFrame(() => {
          const updatedChildren = children.map((item) => {
            if (
              item &&
              typeof item === 'object' &&
              'type' in item &&
              item.type === 'mindmap'
            ) {
              return {
                ...item,
                layout,
                ...(layout !== MindLayoutTypeEnum.standard && {
                  rightNodeCount: undefined,
                }),
              } as PlaitElement
            }
            return item
          })

          updateData({ children: updatedChildren })
        })
      }
    },
    [children, normalizedValue, updateData],
  )

  const handleMindChange = useCallback(
    (data: BoardChangeData) => {
      const shouldUpdateTheme =
        data.theme &&
        theme &&
        data.theme.themeColorMode !== theme.themeColorMode

      const updatePayload: Partial<{
        viewport: typeof viewport
        theme: typeof storedTheme
        children: PlaitElement[]
      }> = {
        viewport: data.viewport,
        ...(shouldUpdateTheme && { theme: data.theme }),
      }

      if (boardRef.current?.children) {
        const boardChildren = boardRef.current.children
        if (JSON.stringify(boardChildren) !== JSON.stringify(children)) {
          updatePayload.children = JSON.parse(
            JSON.stringify(boardChildren),
          ) as PlaitElement[]
        }
      }

      updateData(updatePayload)
    },
    [updateData, theme, children],
  )

  useEffect(() => {
    const mindmapElement = normalizedValue.find(
      (item): item is MindElement =>
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'mindmap',
    )

    if (mindmapElement) {
      if (mindmapElement.layout) {
        setCurrentLayout(mindmapElement.layout)
      }

      if (
        mindmapElement.layout === MindLayoutTypeEnum.standard &&
        mindmapElement.children &&
        mindmapElement.rightNodeCount === undefined
      ) {
        const childCount = mindmapElement.children.length
        const rightNodeCount = childCount > 0 ? Math.ceil(childCount / 2) : 0

        const updatedChildren = children.map((item) => {
          if (
            item &&
            typeof item === 'object' &&
            'type' in item &&
            item.type === 'mindmap' &&
            item.id === mindmapElement.id
          ) {
            return {
              ...item,
              rightNodeCount,
            } as PlaitElement
          }
          return item
        })

        updateData({ children: updatedChildren })
      }
    }
  }, [normalizedValue, children, updateData])

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
        <BoardWithLayoutControl onBoardReady={handleBoardReady} />
      </Wrapper>

      <div className='absolute right-4 bottom-4 z-10'>
        <LayoutPopover
          currentLayout={currentLayout}
          onLayoutChange={handleLayoutChange}
          trigger={
            <button
              className='flex items-center justify-center rounded-lg border bg-background p-2 shadow-lg transition-all hover:bg-muted'
              title='Change Layout'
              type='button'
            >
              <Layout className='h-5 w-5' />
            </button>
          }
        />
      </div>
    </div>
  )
}
