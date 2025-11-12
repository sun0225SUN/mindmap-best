import type { PlaitElement } from '@plait/core'

export async function parseMarkdownToDrawnixWrapper(
  markdown: string,
): Promise<PlaitElement[]> {
  if (!markdown?.trim()) {
    return []
  }

  try {
    const { parseMarkdownToDrawnix } = await import(
      '@plait-board/markdown-to-drawnix'
    )
    const result = parseMarkdownToDrawnix(markdown)

    if (!result) {
      return []
    }

    return [result as PlaitElement]
  } catch (error) {
    console.error('Parse error:', error)
    return []
  }
}
