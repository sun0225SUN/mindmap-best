'use client'

import { StrokeStyle } from '@plait/common'
import type { ColorResult } from '@uiw/react-color'
import Circle from '@uiw/react-color-circle'
import { Minus, RotateCcw, Spline } from 'lucide-react'
import type { ComponentProps, ComponentType } from 'react'
import { useEffect, useMemo, useState } from 'react'
import PolylineIconSvg from '@/assets/images/polyline.svg'
import SplineIconSvg from '@/assets/images/spline.svg'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useMindmapStore } from '@/stores/mindmap-store'

interface LineTypeOption {
  value: boolean
  icon: ComponentType<ComponentProps<'svg'>>
  label: string
}

interface StrokeStyleOption {
  value: StrokeStyle
  icon: ComponentType<ComponentProps<'svg'>>
  label: string
  iconClassName?: string
}

const DEFAULT_STROKE_COLOR = '#83aee6'

const DEFAULT_COLORS = [
  '#F44E3B',
  '#FE9200',
  '#FCDC00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#83aee6',
  '#AEA1FF',
  '#FDA1FF',
  '#FF6B9D',
  '#C44569',
  '#000000',
  '#666666',
  '#cccccc',
  '#FFFFFF',
  '#E8E8E8',
]

const LINE_TYPE_OPTIONS: readonly LineTypeOption[] = [
  {
    value: false,
    icon: PolylineIconSvg,
    label: 'Polyline',
  },
  {
    value: true,
    icon: SplineIconSvg,
    label: 'Spline',
  },
] as const

const STROKE_STYLE_OPTIONS: readonly StrokeStyleOption[] = [
  {
    value: StrokeStyle.solid,
    label: 'Solid',
    icon: Minus,
    iconClassName: 'size-4 shrink-0',
  },
  {
    value: StrokeStyle.dashed,
    label: 'Dashed',
    icon: Minus,
    iconClassName: 'size-4 shrink-0 stroke-dasharray-[4,2]',
  },
  {
    value: StrokeStyle.dotted,
    label: 'Dotted',
    icon: Minus,
    iconClassName: 'size-4 shrink-0 stroke-dasharray-[1,3]',
  },
] as const

export function LineType() {
  const {
    spline = false,
    lineStrokeStyle = StrokeStyle.solid,
    lineStrokeWidth = 2,
    lineStrokeColor,
    updateData,
  } = useMindmapStore()

  const [localWidth, setLocalWidth] = useState(String(lineStrokeWidth))

  const normalizedStrokeColor = useMemo(
    () => lineStrokeColor ?? DEFAULT_STROKE_COLOR,
    [lineStrokeColor],
  )

  useEffect(() => {
    setLocalWidth(String(lineStrokeWidth))
  }, [lineStrokeWidth])

  const handleWidthChange = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!Number.isNaN(numValue) && numValue > 0 && numValue <= 20) {
      setLocalWidth(value)
      updateData({ lineStrokeWidth: numValue })
    }
  }

  const handleWidthBlur = () => {
    const numValue = Number.parseInt(localWidth, 10)
    if (Number.isNaN(numValue) || numValue <= 0) {
      setLocalWidth(String(lineStrokeWidth))
    } else if (numValue > 20) {
      setLocalWidth('20')
      updateData({ lineStrokeWidth: 20 })
    }
  }

  const _incrementWidth = () => {
    const numValue = Number.parseInt(localWidth, 10) || lineStrokeWidth
    const newValue = Math.min(numValue + 1, 20)
    setLocalWidth(String(newValue))
    updateData({ lineStrokeWidth: newValue })
  }

  const _decrementWidth = () => {
    const numValue = Number.parseInt(localWidth, 10) || lineStrokeWidth
    const newValue = Math.max(numValue - 1, 1)
    setLocalWidth(String(newValue))
    updateData({ lineStrokeWidth: newValue })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='size-7 p-0'
          title='Change Line Type'
          variant='ghost'
        >
          <Spline className='size-4' />
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
              Thickness
            </h3>
            <input
              className='h-9 w-16 rounded-md border border-input bg-background px-3 text-center font-medium text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              id='stroke-width-input'
              max={20}
              min={1}
              onBlur={handleWidthBlur}
              onChange={(event) => {
                handleWidthChange(event.target.value)
              }}
              type='number'
              value={localWidth}
            />
          </div>

          <div className='flex flex-col gap-2.5'>
            <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
              Line Type
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              {LINE_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = spline === option.value

                return (
                  <button
                    key={String(option.value)}
                    aria-pressed={isSelected}
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
                      updateData({ spline: option.value })
                    }}
                    title={option.label}
                    type='button'
                  >
                    <Icon className='size-4 shrink-0' />
                  </button>
                )
              })}
            </div>
          </div>

          <div className='flex flex-col gap-2.5'>
            <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
              Line Style
            </h3>
            <div className='grid grid-cols-3 gap-2'>
              {STROKE_STYLE_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = lineStrokeStyle === option.value

                return (
                  <button
                    key={option.value}
                    aria-pressed={isSelected}
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
                      updateData({ lineStrokeStyle: option.value })
                    }}
                    title={option.label}
                    type='button'
                  >
                    <Icon className={cn(option.iconClassName)} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-foreground text-sm leading-none tracking-tight'>
                Color
              </h3>
              <Button
                className='text-xs'
                onClick={() => {
                  updateData({ lineStrokeColor: undefined })
                }}
                size='sm'
                title='Reset to default theme color'
                variant='ghost'
              >
                <RotateCcw className='size-3' />
                Reset
              </Button>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='w-full'>
                <Circle
                  color={normalizedStrokeColor}
                  colors={DEFAULT_COLORS}
                  onChange={(color: ColorResult) => {
                    updateData({ lineStrokeColor: color.hex })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
