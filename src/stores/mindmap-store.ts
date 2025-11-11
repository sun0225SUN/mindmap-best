import type { PlaitElement, PlaitTheme, Viewport } from "@plait/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MindmapData {
	children: PlaitElement[];
	viewport?: Viewport;
	theme?: PlaitTheme;
	markdown?: string;
}

interface MindmapStore extends MindmapData {
	updateData: (data: Partial<MindmapData>) => void;
	updateMarkdown: (markdown: string) => void;
	reset: () => void;
}

export const useMindmapStore = create<MindmapStore>()(
	persist(
		(set) => ({
			children: [],
			viewport: undefined,
			theme: undefined,
			markdown: "",
			updateData: (data) => set((state) => ({ ...state, ...data })),
			updateMarkdown: (markdown) => set({ markdown }),
			reset: () =>
				set({
					children: [],
					viewport: undefined,
					theme: undefined,
					markdown: "",
				}),
		}),
		{
			name: "mindmap-state",
		},
	),
);
