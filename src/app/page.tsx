'use client'

import { useEffect } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { MarkdownEditor } from '@/components/editor'
import { MindMap } from '@/components/mindmap'
import { ResizableHandle } from '@/components/ui/resizable'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useMindmapStore } from '@/stores/mindmap-store'

export default function HomePage() {
  const { markdown, loadDemo, presentationMode = false } = useMindmapStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!markdown?.trim()) {
      loadDemo()
    }
  }, [markdown, loadDemo])

  if (isMobile === undefined) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <div className='h-full w-full' />
      </div>
    )
  }

  if (presentationMode) {
    return (
      <div className='relative flex h-screen w-screen overflow-hidden'>
        <MindMap />
      </div>
    )
  }

  return (
    <div className='relative flex h-screen w-screen overflow-hidden'>
      <PanelGroup
        direction={isMobile ? 'vertical' : 'horizontal'}
        className='h-full w-full'
      >
        <Panel
          defaultSize={isMobile ? 50 : 40}
          minSize={isMobile ? 30 : 20}
        >
          <div className='flex h-full flex-col border-r border-b md:border-b-0'>
            <div className='flex h-16 items-center border-b px-4'>
              <span className='font-bold text-sm md:text-base'>
                Markdown Editor
              </span>
            </div>
            <div className='relative flex-1 overflow-hidden'>
              <MarkdownEditor />
            </div>
          </div>
        </Panel>
        <ResizableHandle withHandle />
        <Panel
          defaultSize={isMobile ? 50 : 60}
          minSize={isMobile ? 30 : 20}
        >
          <div className='flex h-full flex-col'>
            <div className='flex h-16 items-center border-b px-4'>
              <span className='font-bold text-sm md:text-base'>
                Mindmap Viewer
              </span>
            </div>
            <div className='flex-1 overflow-hidden'>
              <MindMap />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
