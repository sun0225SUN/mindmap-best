'use client'

import '@/styles/mindmap/react-board.css'
import '@/styles/mindmap/react-text.css'
import '@/styles/mindmap/styles.scss'

import type { StrokeStyle } from '@plait/common'
import { withGroup } from '@plait/common'
import type {
  PlaitBoard,
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitTheme,
} from '@plait/core'
import { ThemeColorMode, Transforms, updateViewBox } from '@plait/core'
import { withDraw } from '@plait/draw'
import { MindLayoutType as MindLayoutTypeEnum } from '@plait/layouts'
import type { MindElement } from '@plait/mind'
import {
  BranchShape,
  type MindElementShape,
  MindThemeColors,
  withMind,
} from '@plait/mind'
import {
  Board,
  type BoardChangeData,
  useBoard,
  Wrapper,
} from '@plait-board/react-board'
import { produce } from 'immer'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Tools } from '@/components/mindmap/tools'
import { Zoom } from '@/components/mindmap/tools/zoom'
import { useMindmapStore } from '@/stores/mindmap-store'

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
    spline,
    lineStrokeStyle,
    lineStrokeWidth,
    lineStrokeColor,
    nodeShape,
    updateData,
  } = useMindmapStore()
  const { resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const boardRef = useRef<PlaitBoard | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(children)
  const previousChildrenLengthRef = useRef(children?.length ?? 0)
  const hasInitializedRef = useRef(false)
  const previousLineStrokeColorRef = useRef<string | undefined>(lineStrokeColor)

  useEffect(() => {
    const currentLength = children?.length ?? 0
    const previousLength = previousChildrenLengthRef.current

    if (previousLength === 0 && currentLength > 0) {
      updateData({ viewport: undefined })
      hasInitializedRef.current = true
    }

    previousChildrenLengthRef.current = currentLength
  }, [children, updateData])

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

  useEffect(() => {
    if (!boardRef.current || !viewport) return

    const board = boardRef.current
    if (board.viewport.zoom !== viewport.zoom) {
      Transforms.setViewport(board, viewport)

      requestAnimationFrame(() => {
        try {
          updateViewBox(board)
        } catch (error) {
          console.warn('Failed to update viewBox:', error)
        }
      })
    }
  }, [viewport])

  const updateBranchShapeRecursively = useCallback(
    (element: MindElement, branchShape: BranchShape) => {
      element.branchShape = branchShape
      if (element.children && Array.isArray(element.children)) {
        for (const child of element.children) {
          if (
            child &&
            typeof child === 'object' &&
            'type' in child &&
            (child.type === 'mindmap' ||
              child.type === 'mind' ||
              child.type === 'mind_child')
          ) {
            updateBranchShapeRecursively(child as MindElement, branchShape)
          }
        }
      }
    },
    [],
  )

  const updateLineStyleRecursively = useCallback(
    (
      element: MindElement,
      strokeStyle?: StrokeStyle,
      strokeWidth?: number,
      strokeColor?: string | null,
    ) => {
      if (strokeStyle !== undefined) {
        element.strokeStyle = strokeStyle
      }
      if (strokeWidth !== undefined) {
        element.strokeWidth = strokeWidth
        element.branchWidth = strokeWidth
      }
      if (strokeColor !== undefined) {
        if (strokeColor === null) {
          delete element.strokeColor
          delete element.branchColor
        } else {
          element.strokeColor = strokeColor
          element.branchColor = strokeColor
        }
      }
      if (element.children && Array.isArray(element.children)) {
        for (const child of element.children) {
          if (
            child &&
            typeof child === 'object' &&
            'type' in child &&
            (child.type === 'mindmap' ||
              child.type === 'mind' ||
              child.type === 'mind_child')
          ) {
            updateLineStyleRecursively(
              child as MindElement,
              strokeStyle,
              strokeWidth,
              strokeColor,
            )
          }
        }
      }
    },
    [],
  )

  const updateNodeShapeRecursively = useCallback(
    (element: MindElement, shape: MindElementShape) => {
      element.shape = shape
      if (element.children && Array.isArray(element.children)) {
        for (const child of element.children) {
          if (
            child &&
            typeof child === 'object' &&
            'type' in child &&
            (child.type === 'mindmap' ||
              child.type === 'mind' ||
              child.type === 'mind_child')
          ) {
            updateNodeShapeRecursively(child as MindElement, shape)
          }
        }
      }
    },
    [],
  )

  const normalizedValue = useMemo((): PlaitElement[] => {
    if (!Array.isArray(children) || children.length === 0) return []

    return produce(children, (draft) => {
      for (const item of draft) {
        if (
          item &&
          typeof item === 'object' &&
          'type' in item &&
          item.type === 'mindmap'
        ) {
          item.isRoot = item.isRoot ?? true
          item.points =
            Array.isArray(item.points) && item.points.length > 0
              ? item.points
              : [[400, 300]]
          if (spline !== undefined) {
            const branchShape = spline
              ? BranchShape.bight
              : BranchShape.polyline
            item.branchShape = branchShape
            if (item.children && Array.isArray(item.children)) {
              for (const child of item.children) {
                if (
                  child &&
                  typeof child === 'object' &&
                  'type' in child &&
                  (child.type === 'mindmap' ||
                    child.type === 'mind' ||
                    child.type === 'mind_child')
                ) {
                  updateBranchShapeRecursively(
                    child as MindElement,
                    branchShape,
                  )
                }
              }
            }
          }
          const shouldUpdateLineStyle =
            lineStrokeStyle !== undefined ||
            lineStrokeWidth !== undefined ||
            lineStrokeColor !== undefined ||
            (previousLineStrokeColorRef.current !== undefined &&
              lineStrokeColor === undefined)

          if (shouldUpdateLineStyle) {
            updateLineStyleRecursively(
              item as MindElement,
              lineStrokeStyle,
              lineStrokeWidth,
              lineStrokeColor === undefined ? null : lineStrokeColor,
            )
          }
          if (nodeShape !== undefined) {
            updateNodeShapeRecursively(item as MindElement, nodeShape)
          }
        }
      }
    })
  }, [
    children,
    spline,
    lineStrokeStyle,
    lineStrokeWidth,
    lineStrokeColor,
    nodeShape,
    updateBranchShapeRecursively,
    updateLineStyleRecursively,
    updateNodeShapeRecursively,
  ])

  useEffect(() => {
    previousLineStrokeColorRef.current = lineStrokeColor
  }, [lineStrokeColor])

  const compareElementsIgnoringCollapse = useCallback(
    (a: PlaitElement, b: PlaitElement): boolean => {
      const normalizeElement = (el: PlaitElement): Record<string, unknown> => {
        const normalized: Record<string, unknown> = { ...el }
        delete normalized.collapsed
        delete normalized.isCollapsed
        if ('children' in normalized && Array.isArray(normalized.children)) {
          normalized.children = (normalized.children as PlaitElement[]).map(
            (child) => normalizeElement(child),
          )
        }
        return normalized
      }

      return (
        JSON.stringify(normalizeElement(a)) ===
        JSON.stringify(normalizeElement(b))
      )
    },
    [],
  )

  const hasStructuralChange = useCallback(
    (boardChildren: PlaitElement[], storeChildren: PlaitElement[]): boolean => {
      if (boardChildren.length !== storeChildren.length) {
        return true
      }

      for (let i = 0; i < boardChildren.length; i++) {
        const boardChild = boardChildren[i]
        const storeChild = storeChildren[i]
        if (!boardChild || !storeChild) {
          return true
        }
        if (!compareElementsIgnoringCollapse(boardChild, storeChild)) {
          return true
        }
      }

      return false
    },
    [compareElementsIgnoringCollapse],
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
        if (hasStructuralChange(boardChildren, children)) {
          updatePayload.children = produce(
            boardChildren,
            () => {},
          ) as PlaitElement[]
        }
      }

      updateData(updatePayload)
    },
    [updateData, theme, children, hasStructuralChange],
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
      if (
        mindmapElement.layout === MindLayoutTypeEnum.standard &&
        mindmapElement.children &&
        mindmapElement.rightNodeCount === undefined
      ) {
        const childCount = mindmapElement.children.length
        const rightNodeCount = childCount > 0 ? Math.ceil(childCount / 2) : 0

        const updatedChildren = produce(children, (draft) => {
          for (const item of draft) {
            if (
              item &&
              typeof item === 'object' &&
              'type' in item &&
              item.type === 'mindmap' &&
              item.id === mindmapElement.id
            ) {
              item.rightNodeCount = rightNodeCount
            }
          }
        })

        updateData({ children: updatedChildren })
      }
    }
  }, [normalizedValue, children, updateData])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const splineRef = useRef(spline)
  const previousThemeRef = useRef(theme?.themeColorMode)

  useEffect(() => {
    if (
      spline === undefined ||
      spline === splineRef.current ||
      !boardRef.current
    ) {
      splineRef.current = spline
      return
    }

    const expectedBranchShape = spline
      ? BranchShape.bight
      : BranchShape.polyline

    const checkBranchShapeChange = (element: MindElement): boolean => {
      if (element.branchShape !== expectedBranchShape) {
        return true
      }
      if (element.children && Array.isArray(element.children)) {
        return element.children.some((child) => {
          if (
            child &&
            typeof child === 'object' &&
            'type' in child &&
            (child.type === 'mindmap' ||
              child.type === 'mind' ||
              child.type === 'mind_child')
          ) {
            return checkBranchShapeChange(child as MindElement)
          }
          return false
        })
      }
      return false
    }

    const hasBranchShapeChange = children.some((item) => {
      if (
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'mindmap'
      ) {
        return checkBranchShapeChange(item as MindElement)
      }
      return false
    })

    if (hasBranchShapeChange) {
      const updatedChildren = produce(children, (draft) => {
        for (const item of draft) {
          if (
            item &&
            typeof item === 'object' &&
            'type' in item &&
            item.type === 'mindmap'
          ) {
            updateBranchShapeRecursively(
              item as MindElement,
              expectedBranchShape,
            )
          }
        }
      })

      updateData({ children: updatedChildren })
    }

    splineRef.current = spline
  }, [spline, children, updateData, updateBranchShapeRecursively])

  useEffect(() => {
    const currentThemeMode = theme?.themeColorMode
    if (
      previousThemeRef.current !== undefined &&
      currentThemeMode !== previousThemeRef.current
    ) {
      updateData({ viewport: undefined })
    }
    previousThemeRef.current = currentThemeMode
  }, [theme?.themeColorMode, updateData])

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
      className='relative h-full w-full overflow-hidden'
      ref={containerRef}
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

      <div className='absolute top-5 right-5 z-10'>
        <Zoom board={boardRef.current} />
      </div>

      <div className='absolute right-5 bottom-5 z-10'>
        <Tools board={boardRef.current} />
      </div>
    </div>
  )
}
