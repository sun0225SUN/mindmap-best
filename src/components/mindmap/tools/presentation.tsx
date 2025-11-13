'use client'

import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMindmapStore } from '@/stores/mindmap-store'

export function Presentation() {
  const { presentationMode = false, updateData } = useMindmapStore()

  const handleToggle = () => {
    updateData({ presentationMode: !presentationMode })
  }

  if (presentationMode) {
    return (
      <Button
        className='size-7 p-0'
        size='sm'
        title='Exit Presentation Mode'
        variant='ghost'
        onClick={handleToggle}
      >
        <Minimize2 className='h-4 w-4' />
      </Button>
    )
  }

  return (
    <Button
      className='size-7 p-0'
      size='sm'
      title='Presentation Mode'
      variant='ghost'
      onClick={handleToggle}
    >
      <Maximize2 className='h-4 w-4' />
    </Button>
  )
}
