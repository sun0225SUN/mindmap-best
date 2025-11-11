"use client";

import type { OnChange } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { useMindmapStore } from "@/stores/mindmap-store";
import { parseMarkdownToDrawnixWrapper } from "@/utils/markdown-to-drawnix";

export function MarkdownEditor() {
	const { markdown, updateMarkdown, updateData } = useMindmapStore();
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const handleEditorChange: OnChange = (value) => {
		updateMarkdown(value ?? "");
	};

	useEffect(() => {
		const currentMarkdown = markdown || "";
		if (!currentMarkdown.trim()) {
			updateData({ children: [] });
			return;
		}

		timeoutRef.current = setTimeout(async () => {
			try {
				const mind = await parseMarkdownToDrawnixWrapper(currentMarkdown);
				updateData({ children: mind?.length ? mind : [] });
			} catch (error) {
				console.error("Failed to generate mindmap:", error);
			}
		}, 200);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [markdown, updateData]);

	return (
		<Editor
			height="100%"
			language="markdown"
			onChange={handleEditorChange}
			options={{
				automaticLayout: true,
				fontSize: 14,
				lineNumbers: "on",
				minimap: { enabled: false },
				scrollBeyondLastLine: false,
				wordWrap: "on",
			}}
			theme="vs"
			value={markdown || ""}
		/>
	);
}
