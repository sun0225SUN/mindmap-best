'use client'

import type { PlaitBoard } from '@plait/core'
import type { MindLayoutType as MindLayoutTypeType } from '@plait/layouts'
import { MindLayoutType as MindLayoutTypeEnum } from '@plait/layouts'
import type { MindElement } from '@plait/mind'
import { MindElement as MindElementUtils, MindTransforms } from '@plait/mind'
import { produce } from 'immer'
import { Workflow } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useMemo } from 'react'
import LogicIconSvg from '@/assets/images/logic.svg'
import MindmapStandardIconSvg from '@/assets/images/mindmap.svg'
import TreeIconSvg from '@/assets/images/tree.svg'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useMindmapStore } from '@/stores/mindmap-store'

interface LayoutProps {
  board: PlaitBoard | null
}

const MINDMAP_LAYOUTS = [
  {
    value: MindLayoutTypeEnum.standard,
    icon: MindmapStandardIconSvg,
    label: 'Standard Mindmap',
  },
] as const

const LOGIC_LAYOUTS = [
  {
    value: MindLayoutTypeEnum.right,
    icon: LogicIconSvg,
    label: 'Logic Diagram Right',
  },
  {
    value: MindLayoutTypeEnum.left,
    icon: LogicIconSvg,
    label: 'Logic Diagram Left',
    style: {
      transform: 'rotate(180deg)',
      transformOrigin: 'center center',
    },
  },
  {
    value: MindLayoutTypeEnum.upward,
    icon: LogicIconSvg,
    label: 'Logic Diagram Upward',
    style: {
      transform: 'rotate(-90deg)',
      transformOrigin: 'center center',
    },
  },
  {
    value: MindLayoutTypeEnum.downward,
    icon: LogicIconSvg,
    label: 'Logic Diagram Downward',
    style: {
      transform: 'rotate(90deg)',
      transformOrigin: 'center center',
    },
  },
] as const

const TREE_LAYOUTS = [
  {
    value: MindLayoutTypeEnum.rightBottomIndented,
    icon: TreeIconSvg,
    label: 'Tree Diagram Right Bottom',
  },
  {
    value: MindLayoutTypeEnum.rightTopIndented,
    icon: TreeIconSvg,
    label: 'Tree Diagram Right Top',
    style: {
      transform: 'rotate(180deg) scaleX(-1)',
      transformOrigin: 'center center',
    },
  },
  {
    value: MindLayoutTypeEnum.leftTopIndented,
    icon: TreeIconSvg,
    label: 'Tree Diagram Left Top',
    style: {
      transform: 'rotate(180deg)',
      transformOrigin: 'center center',
    },
  },
  {
    value: MindLayoutTypeEnum.leftBottomIndented,
    icon: TreeIconSvg,
    label: 'Tree Diagram Left Bottom',
    style: {
      transform: 'scaleX(-1)',
      transformOrigin: 'center center',
    },
  },
] as const

function LayoutGrid({
  layouts,
  columns,
  currentLayout,
  onLayoutChange,
}: {
  layouts: readonly {
    value: MindLayoutTypeType
    icon: React.ComponentType<ComponentProps<'svg'>>
    label: string
    style?: React.CSSProperties
  }[]
  columns: 1 | 4 | 5
  currentLayout?: MindLayoutTypeType
  onLayoutChange: (layout: MindLayoutTypeType) => void
}) {
  const gridColsClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 4
        ? 'grid-cols-4'
        : 'grid-cols-5'

  return (
    <div className={cn('grid gap-2', gridColsClass)}>
      {layouts.map((option) => {
        const Icon = option.icon
        const isSelected = currentLayout === option.value

        return (
          <button
            key={option.value}
            className={cn(
              'relative flex items-center justify-center rounded-md border p-2.5 font-medium text-sm outline-none transition-all',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'active:scale-[0.98]',
              isSelected
                ? 'border-primary/40 bg-primary/5 text-primary'
                : 'border-border bg-background',
            )}
            onClick={() => {
              onLayoutChange(option.value)
            }}
            title={option.label}
            type='button'
          >
            <Icon
              className='size-4 shrink-0'
              style={option.style}
            />
          </button>
        )
      })}
    </div>
  )
}

export function Layout({ board }: LayoutProps) {
  const { children, updateData } = useMindmapStore()

  const currentLayout = useMemo((): MindLayoutTypeType | undefined => {
    if (!Array.isArray(children) || children.length === 0 || !board) {
      return undefined
    }

    const rootElement = children.find(
      (item): item is MindElement =>
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'mindmap' &&
        MindElementUtils.isMindElement(board, item),
    )

    return rootElement?.layout
  }, [children, board])

  const handleLayoutChange = (layout: MindLayoutTypeType) => {
    if (!board) return

    MindTransforms.setLayout(board, layout)

    if (layout === MindLayoutTypeEnum.standard) {
      const rootElement = children.find(
        (item): item is MindElement =>
          item &&
          typeof item === 'object' &&
          'type' in item &&
          item.type === 'mindmap' &&
          MindElementUtils.isMindElement(board, item),
      )

      if (rootElement?.children) {
        const childCount = rootElement.children.length
        const rightNodeCount = childCount > 0 ? Math.ceil(childCount / 2) : 0

        const updatedChildren = produce(children, (draft) => {
          for (const item of draft) {
            if (
              item &&
              typeof item === 'object' &&
              'type' in item &&
              item.type === 'mindmap' &&
              item.id === rootElement.id
            ) {
              item.layout = layout
              item.rightNodeCount = rightNodeCount
            }
          }
        })

        updateData({ children: updatedChildren })
        return
      }
    }

    requestAnimationFrame(() => {
      const updatedChildren = produce(children, (draft) => {
        for (const item of draft) {
          if (
            item &&
            typeof item === 'object' &&
            'type' in item &&
            item.type === 'mindmap'
          ) {
            item.layout = layout
            if (layout !== MindLayoutTypeEnum.standard) {
              item.rightNodeCount = undefined
            }
          }
        }
      })

      updateData({ children: updatedChildren })
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='size-7 p-0'
          title='Change Layout'
          variant='ghost'
        >
          <Workflow className='size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        side='left'
        sideOffset={15}
        className='w-80 p-4'
      >
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2.5'>
            <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
              Mindmap
            </h3>
            <LayoutGrid
              columns={1}
              currentLayout={currentLayout}
              layouts={MINDMAP_LAYOUTS}
              onLayoutChange={handleLayoutChange}
            />
          </div>

          <div className='flex flex-col gap-2.5'>
            <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
              Logic Diagram
            </h3>
            <LayoutGrid
              columns={4}
              currentLayout={currentLayout}
              layouts={LOGIC_LAYOUTS}
              onLayoutChange={handleLayoutChange}
            />
          </div>

          <div className='flex flex-col gap-2.5'>
            <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
              Tree Diagram
            </h3>
            <LayoutGrid
              columns={4}
              currentLayout={currentLayout}
              layouts={TREE_LAYOUTS}
              onLayoutChange={handleLayoutChange}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
