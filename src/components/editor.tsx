'use client'

import type { OnChange } from '@monaco-editor/react'
import Editor from '@monaco-editor/react'
import type { PlaitElement } from '@plait/core'
import type { MindLayoutType } from '@plait/layouts'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { useMindmapStore } from '@/stores/mindmap-store'
import { parseMarkdownToDrawnixWrapper } from '@/utils/markdown-to-drawnix'

export function MarkdownEditor() {
  const { markdown, updateMarkdown, updateData, children } = useMindmapStore()
  const { resolvedTheme } = useTheme()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const layoutRef = useRef<{
    layout?: MindLayoutType
    rightNodeCount?: number
  } | null>(null)

  useEffect(() => {
    const existingMindmap = children?.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        'type' in item &&
        item.type === 'mindmap',
    )
    if (existingMindmap && 'layout' in existingMindmap) {
      layoutRef.current = {
        layout: existingMindmap.layout,
        rightNodeCount: existingMindmap.rightNodeCount,
      }
    }
  }, [children])

  const handleEditorChange: OnChange = (value) => {
    updateMarkdown(value ?? '')
  }

  useEffect(() => {
    const currentMarkdown = markdown || ''
    if (!currentMarkdown.trim()) {
      updateData({ children: [], viewport: undefined })
      layoutRef.current = null
      return
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const mind = await parseMarkdownToDrawnixWrapper(currentMarkdown)
        if (mind?.length) {
          const newMindmap = mind[0]

          if (layoutRef.current?.layout) {
            const updatedMind = [
              {
                ...newMindmap,
                layout: layoutRef.current.layout,
                ...(layoutRef.current.rightNodeCount !== undefined && {
                  rightNodeCount: layoutRef.current.rightNodeCount,
                }),
              } as PlaitElement,
            ]
            updateData({ children: updatedMind })
          } else {
            updateData({ children: mind })
          }
        } else {
          updateData({ children: [] })
        }
      } catch (error) {
        console.error('Failed to generate mindmap:', error)
      }
    }, 200)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [markdown, updateData])

  return (
    <Editor
      height='100%'
      language='markdown'
      onChange={handleEditorChange}
      options={{
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
      value={markdown || ''}
    />
  )
}
