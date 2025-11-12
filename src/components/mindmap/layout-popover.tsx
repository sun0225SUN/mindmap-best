'use client'

import type { MindLayoutType as MindLayoutTypeType } from '@plait/layouts'
import { MindLayoutType } from '@plait/layouts'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Layout,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface LayoutPopoverProps {
  onLayoutChange: (layout: MindLayoutTypeType) => void
  currentLayout?: MindLayoutTypeType
  trigger: React.ReactNode
}

const LOGIC_LAYOUTS = [
  {
    value: MindLayoutType.right,
    icon: ArrowRight,
  },
  {
    value: MindLayoutType.left,
    icon: ArrowLeft,
  },
  {
    value: MindLayoutType.upward,
    icon: ArrowUp,
  },
  {
    value: MindLayoutType.downward,
    icon: ArrowDown,
  },
  {
    value: MindLayoutType.standard,
    icon: Layout,
  },
] as const

const INDENTED_LAYOUTS = [
  {
    value: MindLayoutType.rightBottomIndented,
    icon: ChevronDown,
  },
  {
    value: MindLayoutType.rightTopIndented,
    icon: ChevronUp,
  },
  {
    value: MindLayoutType.leftTopIndented,
    icon: ChevronUp,
  },
  {
    value: MindLayoutType.leftBottomIndented,
    icon: ChevronDown,
  },
] as const

export function LayoutPopover({
  onLayoutChange,
  currentLayout,
  trigger,
}: LayoutPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-auto p-3'
        side='top'
      >
        <div className='flex flex-col gap-3'>
          <div className='grid grid-cols-5 gap-2'>
            {LOGIC_LAYOUTS.map((option) => {
              const Icon = option.icon
              const isSelected = currentLayout === option.value

              return (
                <button
                  key={option.value}
                  className={cn(
                    'flex items-center justify-center rounded-md border p-2 transition-all hover:bg-muted',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border',
                  )}
                  onClick={() => {
                    onLayoutChange(option.value)
                  }}
                  type='button'
                >
                  <Icon className='h-5 w-5' />
                </button>
              )
            })}
          </div>

          <div className='grid grid-cols-4 gap-2'>
            {INDENTED_LAYOUTS.map((option) => {
              const Icon = option.icon
              const isSelected = currentLayout === option.value

              return (
                <button
                  key={option.value}
                  className={cn(
                    'flex items-center justify-center rounded-md border p-2 transition-all hover:bg-muted',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border',
                  )}
                  onClick={() => {
                    onLayoutChange(option.value)
                  }}
                  type='button'
                >
                  <Icon className='h-5 w-5' />
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
