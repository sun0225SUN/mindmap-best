'use client'

import { BoardTransforms, type PlaitBoard } from '@plait/core'
import { GithubIcon, Minus, Plus, ScanFace } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'
import { Presentation } from '@/components/mindmap/tools/presentation'
import { Button } from '@/components/ui/button'
import { useMindmapStore } from '@/stores/mindmap-store'

interface ZoomProps {
  board: PlaitBoard | null
}

const DEFAULT_ZOOM = 1
const MIN_ZOOM = 0.1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.1

export function Zoom({ board }: ZoomProps) {
  const { viewport, updateData } = useMindmapStore()

  const currentZoom = viewport?.zoom ?? DEFAULT_ZOOM

  const handleZoomIn = useCallback(() => {
    if (!board) return

    const newZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM)
    const newViewport = {
      zoom: newZoom,
      origination: viewport?.origination,
    }

    updateData({ viewport: newViewport })
  }, [board, currentZoom, viewport, updateData])

  const handleZoomOut = useCallback(() => {
    if (!board) return

    const newZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM)
    const newViewport = {
      zoom: newZoom,
      origination: viewport?.origination,
    }

    updateData({ viewport: newViewport })
  }, [board, currentZoom, viewport, updateData])

  const handleFitToScreen = useCallback(() => {
    if (!board) return

    const hasContent =
      Array.isArray(board.children) && board.children.length > 0

    if (!hasContent) {
      updateData({ viewport: undefined })
      return
    }

    try {
      BoardTransforms.fitViewport(board)
    } catch (error) {
      console.warn('Failed to fit viewport:', error)
      updateData({ viewport: undefined })
      return
    }
  }, [board, updateData])

  const zoomPercentage = Math.round(currentZoom * 100)

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center rounded-lg border bg-background/95 px-2 py-1 shadow-lg backdrop-blur-sm'>
        <Button
          size='icon'
          variant='ghost'
          onClick={handleZoomOut}
          disabled={currentZoom <= MIN_ZOOM}
          className='size-7 p-0'
          title='Zoom Out'
        >
          <Minus className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-5 w-px bg-border' />

        <div className='flex h-7 min-w-12 items-center justify-center font-medium text-xs tabular-nums'>
          {zoomPercentage}%
        </div>

        <div className='mx-1 h-5 w-px bg-border' />

        <Button
          size='icon'
          variant='ghost'
          onClick={handleZoomIn}
          disabled={currentZoom >= MAX_ZOOM}
          className='size-7 p-0'
          title='Zoom In'
        >
          <Plus className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-5 w-px bg-border' />

        <Button
          size='icon'
          variant='ghost'
          onClick={handleFitToScreen}
          disabled={!board}
          className='size-7 p-0'
          title='Fit to screen'
        >
          <ScanFace className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-5 w-px bg-border' />

        <Presentation />
      </div>

      <div className='flex items-center rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur-sm'>
        <Button
          asChild
          size='icon'
          variant='ghost'
          className='size-7 p-0'
          title='View on GitHub'
        >
          <Link
            href='https://github.com/sun0225SUN/mindmap-best'
            target='_blank'
            rel='noopener noreferrer'
          >
            <GithubIcon className='h-4 w-4' />
          </Link>
        </Button>
      </div>
    </div>
  )
}
