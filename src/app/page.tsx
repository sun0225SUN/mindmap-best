import { MarkdownEditor } from "@/components/editor";
import { MindMap } from "@/components/mindmap";

export default function HomePage() {
	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<div className="flex h-full w-1/2 flex-col border-r">
				<div className="flex h-11 items-center border-b px-4">
					<span className="font-bold">Markdown Editor</span>
				</div>
				<div className="relative flex-1 overflow-hidden">
					<MarkdownEditor />
				</div>
			</div>

			<div className="flex h-full w-1/2 flex-col">
				<div className="flex h-11 items-center border-b px-4">
					<span className="font-bold">Mindmap Viewer</span>
				</div>
				<div className="flex-1 overflow-hidden">
					<MindMap />
				</div>
			</div>
		</div>
	);
}
