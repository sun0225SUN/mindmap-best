"use client";

import "@/styles/mindmap/react-board.css";
import "@/styles/mindmap/react-text.css";
import "@/styles/mindmap/styles.scss";

import { withGroup } from "@plait/common";
import type { PlaitBoardOptions, PlaitElement, PlaitPlugin } from "@plait/core";
import { withDraw } from "@plait/draw";
import { MindThemeColors, withMind } from "@plait/mind";
import { Board, type BoardChangeData, Wrapper } from "@plait-board/react-board";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMindmapStore } from "@/stores/mindmap-store";

const BOARD_OPTIONS: PlaitBoardOptions = {
	readonly: true,
	hideScrollbar: true,
	disabledScrollOnNonFocus: false,
	themeColors: MindThemeColors,
};

const PLUGINS: PlaitPlugin[] = [withDraw, withGroup, withMind];

export function MindMap() {
	const { children, viewport, theme, updateData } = useMindmapStore();
	const [isMounted, setIsMounted] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const valueRef = useRef(children);

	const handleMindChange = useCallback(
		(data: BoardChangeData) => {
			updateData({ viewport: data.viewport, theme: data.theme });
		},
		[updateData],
	);

	const normalizedValue = useMemo((): PlaitElement[] => {
		if (!Array.isArray(children) || children.length === 0) {
			return [];
		}
		return children.map((item) => {
			if (
				item &&
				typeof item === "object" &&
				"type" in item &&
				item.type === "mindmap"
			) {
				return {
					...item,
					isRoot: item.isRoot ?? true,
					points:
						item.points && Array.isArray(item.points) && item.points.length > 0
							? item.points
							: [[400, 300]],
				} as PlaitElement;
			}
			return item;
		});
	}, [children]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted || !containerRef.current) return;

		if (valueRef.current !== children) {
			valueRef.current = children;
			setIsReady(false);
		}

		let retryCount = 0;
		const maxRetries = 10;

		const checkReady = () => {
			const container = containerRef.current;
			if (container) {
				const { width, height } = container.getBoundingClientRect();
				if (width > 0 && height > 0) {
					setIsReady(true);
				} else if (retryCount < maxRetries) {
					retryCount++;
					requestAnimationFrame(checkReady);
				} else {
					setIsReady(true);
				}
			}
		};

		requestAnimationFrame(checkReady);
	}, [isMounted, children]);

	if (!isMounted || !isReady) {
		return (
			<div
				className="flex h-full w-full items-center justify-center"
				ref={containerRef}
			/>
		);
	}

	const mindmapElement = normalizedValue.find(
		(item) =>
			item &&
			typeof item === "object" &&
			"type" in item &&
			item.type === "mindmap" &&
			"id" in item &&
			"data" in item &&
			"isRoot" in item &&
			"points" in item,
	);

	if (!mindmapElement) {
		return null;
	}

	return (
		<div
			className="h-full w-full"
			ref={containerRef}
			style={{
				position: "relative",
				overflow: "hidden",
			}}
		>
			<Wrapper
				onChange={handleMindChange}
				options={BOARD_OPTIONS}
				plugins={PLUGINS}
				theme={theme}
				value={normalizedValue}
				viewport={viewport}
			>
				<Board />
			</Wrapper>
		</div>
	);
}
