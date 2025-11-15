<div align="center">

  <img src="./readme/images/logo.png" alt="screenshot" width="100" />
  <h1>Mindmap Best</h1>

  English | [简体中文](/README_zh.md)

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/mindmap-best">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/mindmap-best?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/mindmap-best">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/mindmap-best">
  <img alt="Page views" src="https://komarev.com/ghpvc/?username=mindmap-best&label=Views&color=orange&style=flat" />
  <p>A beautiful and powerful mindmap tool that converts Markdown to interactive mindmaps in real-time</p>

</div>

## ✨ Features

- [x] 📝 Markdown editor with real-time mindmap preview
- [x] 🎨 Multiple layout types: Standard Mindmap, Logic Diagram, Tree
- [x] 🎯 Customizable node shapes (Round Rectangle, Rectangle, Ellipse, etc.)
- [x] 🖊️ Flexible line types: Spline, Polyline with customizable styles
- [x] 🎨 Customizable line colors and stroke widths
- [x] 📤 Export mindmap to PNG image
- [x] 🎬 Presentation mode for full-screen viewing
- [x] 🌓 Supports dark/light themes
- [x] 📱 Responsive design for all devices
- [x] 💾 Auto-save to IndexedDB (local storage)
- [x] 🔄 Real-time synchronization between editor and mindmap
- [x] 🎯 Zoom controls for better navigation
- [x] 🎨 Minimalist and elegant UI design
- [ ] 🔗 Share mindmaps via URL
- [ ] 📥 Import/Export mindmap files
- [ ] 👥 Collaborative editing
- [ ] 🎨 More theme customization options
- [ ] 📊 Mindmap statistics and analytics

## 🍭 Community

- [Telegram](https://t.me/guoqisun)

## 🔨 Tech Stack

- ⚡ Framework - [Next.js](https://nextjs.org) 16
- 🧩 Language - [TypeScript](https://www.typescriptlang.org)
- ⚛️ UI Library - [React](https://react.dev) 19
- 🌬️ Styling - [Tailwind CSS](https://tailwindcss.com)
- 🎛️ UI Components - [shadcn/ui](https://ui.shadcn.com)
- 🐻 State Management - [Zustand](https://zustand-demo.pmnd.rs)
- 🗺️ Mindmap Engine - [@plait-board/react-board](https://github.com/worktile/plait)
- 📝 Code Editor - [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- 📄 Markdown Parser - [@plait-board/markdown-to-drawnix](https://github.com/worktile/plait)
- 🎨 Icons - [Lucide React](https://lucide.dev)
- 🧹 Formatter and Linter - [Biome](https://biomejs.dev)
- 📊 Traffic Analysis - [@vercel/analytics](https://vercel.com/docs/analytics/quickstart)
- 🎨 Theme Management - [next-themes](https://github.com/pacocoursey/next-themes)
- 🖼️ Image Export - [html-to-image](https://github.com/bubkoo/html-to-image)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/sun0225SUN/mindmap-best.git
cd mindmap-best
```

2. Install dependencies

```bash
bun install
# or
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server

```bash
bun run dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Markdown Syntax

The mindmap is generated from Markdown with the following structure:

```markdown
# Root Node
  - Child Node 1
    - Grandchild Node 1.1
      - Great Grandchild Node 1.1.1
  - Child Node 2
    - Grandchild Node 2.1
  ## Second Root Node
  ### Third Root Node
```

- Use `#` for root nodes
- Use `-` for child nodes (indented with spaces)
- The indentation level determines the node hierarchy

### Features

1. **Layout Types**: Switch between Standard Mindmap, Logic Diagram (Left/Right), and Tree layouts
2. **Node Shapes**: Customize node appearance (Round Rectangle, Rectangle, Ellipse, etc.)
3. **Line Types**: Choose between Spline (curved) and Polyline (straight) connections
4. **Export**: Click the export button to save your mindmap as a PNG image
5. **Presentation Mode**: Enter full-screen presentation mode for better viewing
6. **Theme**: Toggle between dark and light themes
7. **Auto-save**: Your work is automatically saved to browser's IndexedDB

## 🛠️ Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run preview` - Build and preview production build
- `bun run typecheck` - Run TypeScript type checking
- `bun run check` - Run Biome linter
- `bun run check:write` - Run Biome linter and auto-fix

### Project Structure

```
mindmap-best/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── editor.tsx   # Markdown editor
│   │   ├── mindmap/     # Mindmap components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── stores/          # Zustand stores
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles and SCSS
│   └── utils/           # Helper utilities
├── public/              # Static assets
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 💖 Sponsors

If you find this project helpful, please give it a ⭐️ on GitHub!

<table>
	<tbody>
		<tr>
      <td align="center">
         <img src="https://files.guoqi.dev/wxpay.png" width="250px"  alt="wxpay" style="border-radius:10px;" />
      </td>
      <td align="center">
        <img src="https://files.guoqi.dev/alipay.jpg" width="250px"  alt="alipay" style="border-radius:10px;" />
      </td>
		</tr>
	<tbody>
</table>

## 🙏 Acknowledgments

- [Plait](https://github.com/worktile/plait) - The amazing mindmap rendering engine
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Next.js](https://nextjs.org) - The React framework
- All the open-source contributors who made this possible

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/mindmap-best&type=Date)](https://github.com/sun0225SUN/mindmap-best)

