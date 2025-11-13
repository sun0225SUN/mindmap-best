'use client'

import type { PlaitBoard } from '@plait/core'
import { Export } from '@/components/mindmap/tools/export'
import { Layout } from '@/components/mindmap/tools/layout'
import { LineType } from '@/components/mindmap/tools/line-type'
import { NodeShape } from '@/components/mindmap/tools/node-shape'
import { ThemeToggleButton } from '@/components/theme/toggle'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface ToolsProps {
  board: PlaitBoard | null
}

export function Tools({ board }: ToolsProps) {
  const isMobile = useIsMobile()

  if (isMobile === true) {
    return null
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur-sm'>
        <Export board={board} />
      </div>
      <div className='flex flex-col items-center gap-2 rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur-sm'>
        <NodeShape board={board} />
        <div className='h-px w-full bg-border' />
        <Layout board={board} />
        <div className='h-px w-full bg-border' />
        <LineType />
      </div>
      <div className='rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur-sm'>
        <ThemeToggleButton className='size-7 p-0' />
      </div>
    </div>
  )
}
