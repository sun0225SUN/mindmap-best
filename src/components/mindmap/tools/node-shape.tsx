'use client'

import type { PlaitBoard } from '@plait/core'
import type { MindElement } from '@plait/mind'
import { MindElementShape, MindElement as MindElementUtils } from '@plait/mind'
import { RectangleHorizontal, Underline } from 'lucide-react'
import type { ComponentProps, ComponentType } from 'react'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useMindmapStore } from '@/stores/mindmap-store'

interface NodeShapeProps {
  board: PlaitBoard | null
}

interface ShapeOption {
  value: MindElementShape
  icon: ComponentType<ComponentProps<'svg'>>
  label: string
}

const NODE_SHAPE_OPTIONS: readonly ShapeOption[] = [
  {
    value: MindElementShape.roundRectangle,
    icon: RectangleHorizontal,
    label: 'Round Rectangle',
  },
  {
    value: MindElementShape.underline,
    icon: Underline,
    label: 'Underline',
  },
] as const

function ShapeGrid({
  options,
  currentShape,
  onShapeChange,
}: {
  options: readonly ShapeOption[]
  currentShape?: MindElementShape | null
  onShapeChange: (shape: MindElementShape) => void
}) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = currentShape === option.value

        return (
          <button
            key={option.value}
            className={cn(
              'relative flex items-center justify-center rounded-md border p-2 text-xs outline-none transition-all',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'active:scale-[0.98]',
              isSelected
                ? 'border-primary/40 bg-primary/5 text-primary'
                : 'border-border bg-background',
            )}
            onClick={() => {
              onShapeChange(option.value)
            }}
            title={option.label}
            type='button'
            aria-pressed={isSelected}
          >
            <Icon className='size-4 shrink-0' />
          </button>
        )
      })}
    </div>
  )
}

export function NodeShape({ board }: NodeShapeProps) {
  const { children, nodeShape, updateData } = useMindmapStore()

  const currentShape = useMemo(() => {
    if (!Array.isArray(children) || children.length === 0 || !board) {
      return nodeShape
    }

    const rootElement = children.find(
      (item): item is MindElement =>
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'mindmap' &&
        MindElementUtils.isMindElement(board, item),
    )

    return rootElement?.shape ?? nodeShape
  }, [children, board, nodeShape])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='size-7 p-0'
          title='Change Node Shape'
          variant='ghost'
        >
          <RectangleHorizontal className='size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        side='left'
        sideOffset={15}
        className='w-60 p-4'
      >
        <div className='flex flex-col gap-2.5'>
          <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
            Node Shape
          </h3>
          <ShapeGrid
            currentShape={currentShape}
            onShapeChange={(shape) => {
              updateData({ nodeShape: shape })
            }}
            options={NODE_SHAPE_OPTIONS}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
