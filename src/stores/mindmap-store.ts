import type { PlaitElement, PlaitTheme, Viewport } from '@plait/core'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MindmapData {
  children: PlaitElement[]
  viewport?: Viewport
  theme?: PlaitTheme
  markdown?: string
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
        }),
    }),
    {
      name: 'mindmap-state',
    },
  ),
)
