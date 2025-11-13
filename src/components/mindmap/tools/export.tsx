'use client'

import type { PlaitBoard } from '@plait/core'
import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ExportProps {
  board: PlaitBoard | null
}

export function Export({ board }: ExportProps) {
  const handleExport = useCallback(async () => {
    if (!board) return

    try {
      const container = document.querySelector(
        '.plait-board-container',
      ) as HTMLElement

      if (!container) {
        console.error('Mindmap container not found')
        return
      }

      const svgElement = container.querySelector(
        'svg.board-host-svg',
      ) as HTMLElement
      const targetElement = svgElement || container

      const originalConsoleError = console.error
      const errors: unknown[] = []

      console.error = (...args) => {
        if (
          typeof args[0] === 'string' &&
          (args[0].includes('CSSStyleSheet') ||
            args[0].includes('cssRules') ||
            args[0].includes('SecurityError') ||
            args[0].includes('monaco') ||
            args[0].includes('Error inlining') ||
            args[0].includes('Error loading remote stylesheet') ||
            args[0].includes('Failed to execute') ||
            args[0].includes('insertRule') ||
            args[0].includes('embed-webfonts') ||
            args[0].includes('@font-face'))
        ) {
          errors.push(args)
          return
        }
        originalConsoleError(...args)
      }

      try {
        const getBackgroundColor = (element: HTMLElement): string => {
          const style = getComputedStyle(element)
          const bgColor = style.backgroundColor

          if (
            bgColor &&
            bgColor !== 'rgba(0, 0, 0, 0)' &&
            bgColor !== 'transparent'
          ) {
            return bgColor
          }

          const bodyStyle = getComputedStyle(document.body)
          const bodyBgColor = bodyStyle.backgroundColor

          if (
            bodyBgColor &&
            bodyBgColor !== 'rgba(0, 0, 0, 0)' &&
            bodyBgColor !== 'transparent'
          ) {
            return bodyBgColor
          }

          return '#ffffff'
        }

        const backgroundColor = getBackgroundColor(container)

        const dataUrl = await toPng(targetElement, {
          cacheBust: false,
          backgroundColor,
          pixelRatio: 3,
          quality: 1,
          fontEmbedCSS: '',
          filter: (node) => {
            if (node instanceof HTMLElement) {
              const classList = node.classList
              if (classList) {
                if (
                  classList.contains('monaco-editor') ||
                  classList.contains('monaco-container') ||
                  node.closest('.monaco-editor')
                ) {
                  return false
                }
              }
              if (
                node.tagName === 'LINK' &&
                node.getAttribute('rel') === 'stylesheet'
              ) {
                const href = node.getAttribute('href')
                if (
                  href &&
                  (href.includes('monaco') || href.includes('cdn.jsdelivr.net'))
                ) {
                  return false
                }
              }
            }
            return true
          },
        })

        const link = document.createElement('a')
        link.download = `mindmap-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      } finally {
        console.error = originalConsoleError
      }
    } catch (error) {
      console.error('Failed to export mindmap:', error)
    }
  }, [board])

  return (
    <Button
      className='size-7 p-0'
      title='Export as PNG'
      variant='ghost'
      onClick={handleExport}
    >
      <Download className='size-4' />
    </Button>
  )
}
