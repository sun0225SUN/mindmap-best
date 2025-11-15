<div align="center">

  <img src="./readme/images/logo.png" alt="screenshot" width="100" />
  <h1>Mindmap Best</h1>

  [English](/README.md) | 简体中文

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/mindmap-best">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/mindmap-best?style=flat">
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/mindmap-best?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/mindmap-best">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/mindmap-best">
  <img alt="Page views" src="https://komarev.com/ghpvc/?username=mindmap-best&label=Views&color=orange&style=flat" />
  <p>一个美观且强大的思维导图工具，可实时将 Markdown 转换为交互式思维导图</p>

</div>

## ✨ 功能特性

- [x] 📝 支持实时预览的 Markdown 编辑器
- [x] 🎨 多种布局类型：标准思维导图、逻辑图、树状图
- [x] 🎯 可自定义节点形状（圆角矩形、矩形、椭圆等）
- [x] 🖊️ 灵活的连线类型：样条曲线、折线，支持自定义样式
- [x] 🎨 可自定义连线颜色和描边宽度
- [x] 📤 导出思维导图为 PNG 图片
- [x] 🎬 全屏演示模式
- [x] 🌓 支持深色/浅色主题
- [x] 📱 响应式设计，适配所有设备
- [x] 💾 自动保存到 IndexedDB（本地存储）
- [x] 🔄 编辑器与思维导图实时同步
- [x] 🎯 缩放控制，便于导航
- [x] 🎨 简约优雅的 UI 设计
- [ ] 🔗 通过 URL 分享思维导图
- [ ] 📥 导入/导出思维导图文件
- [ ] 👥 协作编辑
- [ ] 🎨 更多主题自定义选项
- [ ] 📊 思维导图统计和分析

## 🍭 交流群

- [Telegram](https://t.me/guoqisun)

## 🔨 技术栈

- ⚡ 框架 - [Next.js](https://nextjs.org) 16
- 🧩 语言 - [TypeScript](https://www.typescriptlang.org)
- ⚛️ UI 库 - [React](https://react.dev) 19
- 🌬️ 样式 - [Tailwind CSS](https://tailwindcss.com)
- 🎛️ UI 组件 - [shadcn/ui](https://ui.shadcn.com)
- 🐻 状态管理 - [Zustand](https://zustand-demo.pmnd.rs)
- 🗺️ 思维导图引擎 - [@plait-board/react-board](https://github.com/worktile/plait)
- 📝 代码编辑器 - [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- 📄 Markdown 解析器 - [@plait-board/markdown-to-drawnix](https://github.com/worktile/plait)
- 🎨 图标 - [Lucide React](https://lucide.dev)
- 🧹 代码格式化和检查 - [Biome](https://biomejs.dev)
- 📊 流量分析 - [@vercel/analytics](https://vercel.com/docs/analytics/quickstart)
- 🎨 主题管理 - [next-themes](https://github.com/pacocoursey/next-themes)
- 🖼️ 图片导出 - [html-to-image](https://github.com/bubkoo/html-to-image)

## 🚀 快速开始

### 前置要求

- Node.js 18+ 或 [Bun](https://bun.sh)
- npm、yarn、pnpm 或 bun 包管理器

### 安装

1. 克隆仓库

```bash
git clone https://github.com/sun0225SUN/mindmap-best.git
cd mindmap-best
```

2. 安装依赖

```bash
bun install
# 或
npm install
# 或
yarn install
# 或
pnpm install
```

3. 启动开发服务器

```bash
bun run dev
# 或
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📖 使用说明

### Markdown 语法

思维导图由以下结构的 Markdown 生成：

```markdown
# 根节点
  - 子节点 1
    - 孙节点 1.1
      - 曾孙节点 1.1.1
  - 子节点 2
    - 孙节点 2.1
  ## 第二个根节点
  ### 第三个根节点
```

- 使用 `#` 表示根节点
- 使用 `-` 表示子节点（用空格缩进）
- 缩进级别决定节点的层级关系

### 功能说明

1. **布局类型**：在标准思维导图、逻辑图（左/右）和树状图之间切换
2. **节点形状**：自定义节点外观（圆角矩形、矩形、椭圆等）
3. **连线类型**：选择样条曲线（曲线）或折线（直线）连接
4. **导出**：点击导出按钮将思维导图保存为 PNG 图片
5. **演示模式**：进入全屏演示模式以获得更好的观看体验
6. **主题**：在深色和浅色主题之间切换
7. **自动保存**：你的工作会自动保存到浏览器的 IndexedDB

## 🛠️ 开发

### 可用脚本

- `bun run dev` - 启动开发服务器
- `bun run build` - 构建生产版本
- `bun run start` - 启动生产服务器
- `bun run preview` - 构建并预览生产版本
- `bun run typecheck` - 运行 TypeScript 类型检查
- `bun run check` - 运行 Biome 代码检查
- `bun run check:write` - 运行 Biome 代码检查并自动修复

### 项目结构

```
mindmap-best/
├── src/
│   ├── app/              # Next.js 应用目录
│   ├── components/       # React 组件
│   │   ├── editor.tsx   # Markdown 编辑器
│   │   ├── mindmap/     # 思维导图组件
│   │   └── ui/          # UI 组件 (shadcn/ui)
│   ├── stores/          # Zustand 状态管理
│   ├── hooks/           # 自定义 React Hooks
│   ├── lib/             # 工具函数
│   ├── styles/          # 全局样式和 SCSS
│   └── utils/           # 辅助工具
├── public/              # 静态资源
└── package.json
```

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m '添加一些 AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 💖 赞助

如果你觉得这个项目有帮助，请在 GitHub 上给它一个 ⭐️！

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

## 🙏 致谢

- [Plait](https://github.com/worktile/plait) - 出色的思维导图渲染引擎
- [shadcn/ui](https://ui.shadcn.com) - 精美的 UI 组件
- [Next.js](https://nextjs.org) - React 框架
- 所有使这个项目成为可能的开源贡献者

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/mindmap-best&type=Date)](https://github.com/sun0225SUN/mindmap-best)

