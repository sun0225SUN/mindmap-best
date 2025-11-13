import { StrokeStyle } from '@plait/common'
import type { PlaitElement, PlaitTheme, Viewport } from '@plait/core'
import { MindElementShape } from '@plait/mind'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { indexedDBStorage } from '@/stores/indexed-db-storage'

export interface MindmapData {
  children: PlaitElement[]
  viewport?: Viewport
  theme?: PlaitTheme
  markdown?: string
  spline?: boolean
  presentationMode?: boolean
  lineStrokeStyle?: StrokeStyle
  lineStrokeWidth?: number
  lineStrokeColor?: string
  nodeShape?: MindElementShape
}

const DEMO_MARKDOWN = `# 我开始了
  - 让我看看是谁搞出了这个 bug 🕵️ ♂️ 🔍
    - 😯 💣
      - 原来是我 👈 🎯 💘
  - 竟然不可以运行，为什么呢 🚫 ⚙️ ❓
    - 竟然可以运行了，为什么呢？🎢 ✨
      - 🤯 ⚡ ➡️ 🎉
  - 能运行起来的 🐞 🚀
    - 就不要去动它 🛑 ✋
      - 👾 💥 🏹 🎯
  ## 男孩还是女孩 👶 ❓ 🤷 ♂️ ♀️
  ### Hello world 👋 🌍 ✨ 💻
  #### 哇 是个程序员 🤯 ⌨️ 💡 👩 💻`

interface MindmapStore extends MindmapData {
  updateData: (data: Partial<MindmapData>) => void
  updateMarkdown: (markdown: string) => void
  loadDemo: () => void
  reset: () => void
}

export const useMindmapStore = create<MindmapStore>()(
  persist(
    (set) => ({
      children: [],
      viewport: undefined,
      theme: undefined,
      markdown: '',
      spline: false,
      presentationMode: false,
      lineStrokeStyle: StrokeStyle.solid,
      lineStrokeWidth: 2,
      lineStrokeColor: undefined,
      nodeShape: MindElementShape.roundRectangle,
      updateData: (data) => set((state) => ({ ...state, ...data })),
      updateMarkdown: (markdown) => set({ markdown }),
      loadDemo: () =>
        set({
          markdown: DEMO_MARKDOWN,
          viewport: undefined,
          children: [],
        }),
      reset: () =>
        set({
          children: [],
          viewport: undefined,
          theme: undefined,
          markdown: '',
          spline: false,
          presentationMode: false,
          lineStrokeStyle: StrokeStyle.solid,
          lineStrokeWidth: 2,
          lineStrokeColor: undefined,
          nodeShape: MindElementShape.roundRectangle,
        }),
    }),
    {
      name: 'mindmap-state',
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
)
