import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mindmap Best",
	description: "A beautiful mindmap application built with Next.js and Plait",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}
