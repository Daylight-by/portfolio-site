# Daylight · 个人作品集站点

在线地址：**https://bsqdsq.top**（GitHub Pages，静态导出）

一个把「作品集 + 简历 + 博客」放在一起的个人站点。
首屏是实时流体模拟，下拉进入主界面 —— 主界面是一台 3D 键盘，
每颗键帽是一个技术栈，按下去有反馈。
另外内置了一层终端：访客可以敲命令把全站内容翻一遍。

## 为什么长这样

常规作品集是「我排版好，你从上往下滚」。
这里想试试反过来 —— 你问，我答。终端让访客自己决定看什么，
不想看的部分可以直接跳过。

## 三个页面

| 路由 | 内容 |
| --- | --- |
| `/` | 作品集：4 个项目 + 技能 + 经历 + 联系方式 |
| `/resume` | 简历页，网页直接渲染，可以在上面涂鸦，Ctrl/Cmd + P 存成 PDF |
| `/blogs` | 技术博客，`/blogs/[slug]` 是文章页 |

## 交互层

- **开屏**：WebGL 流体模拟（GPU 上的 Navier-Stokes 求解，GLSL 手写）。
  没有百分比读条，鼠标划过会推开染料，往下拉才进主界面。
- **3D 键盘**：`@chibi3d/runtime` + Three.js 渲染，键帽可交互。
- **终端**（快捷键 `` Ctrl+` ``）：命令表是自写的，不依赖 xterm.js。
  ```
  help  ls  cd  cat  whoami  show  projects  blog  open  theme  contact  clear
  ```
  支持 Tab 补全、↑↓ 翻历史、ESC 关闭。移动端自动降级隐藏。
  虚拟文件系统在 `src/components/terminal/fs.ts`，改那里就能改内容。
- **彩蛋**：右键菜单、彩蛋游戏、摩斯电码式提示。

## 技术要点

- **Next.js 16 静态导出**（`output: "export"`）：没有 API 路由、没有服务端运行时。
  所有动态能力（GitHub 星标、流体、终端）都是构建期预取或纯客户端运行。
- **字体自托管**：Space Grotesk / Unbounded 下载到 `public/fonts`，
  用 `@font-face` + `unicode-range` 引入，彻底摆脱 Google Fonts（国内网络会 502）。
- **构建期抓取带超时**：`src/lib/github-stars.ts` 里的 fetch 用
  `AbortSignal.timeout(4000)` 包住，超时降级为 0 ——
  国内网络访问 `api.github.com` 会长时间无响应，不加超时会让构建卡死。
- **图片**：封面图由 `gen_covers.py`（PIL）程序化生成，不依赖外部图床。

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # 产物输出到 out/
```

> pnpm 需要 `pnpm-workspace.yaml` 里的 `nodeLinker: hoisted`
> （pnpm 10+ 会忽略 `.npmrc` 里的这个配置）。

## 部署

`out/` 整个目录推到 `Daylight-by.github.io` 的 `main` 分支根路径，
仓库里有 `public/CNAME`（bsqdsq.top）和 `public/.nojekyll`，构建时会带出去。
Pages 用 legacy 模式，`Deploy from a branch` → `main` / `/`。

## 内容在哪改

| 想改什么 | 改哪个文件 |
| --- | --- |
| 名字、邮箱、域名、社交链接 | `src/data/config.ts` |
| 项目 | `src/data/projects.tsx` |
| 技能 / 经历 | `src/components/sections/skills.tsx`、`experience.tsx` |
| 终端里的内容 | `src/components/terminal/fs.ts` |
| 简历 | `src/app/resume/resume-view.tsx` |
| 文章 | `src/content/blogs/*.mdx` |

## 迁移记录

原站是 Hexo + Butterfly 主题，已整站替换。
原文 2 篇文章迁到 `src/content/blogs/`，关于页的内容进了终端的 `about.md`。
旧站完整备份在 `Daylight-by.github.io` 仓库：
- 分支 `backup-hexo`
- 标签 `backup-hexo-20261010`

## 来源与致谢

- 3D 键盘与整体交互框架基于 [Naresh-Khatri/3d-portfolio](https://github.com/Naresh-Khatri/3d-portfolio)（免费使用，感谢作者）。
- 流体模拟基于 [Pavel Dobryakov](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) 的实现（MIT），
  已移植为 TypeScript 模块并去掉后处理，只留核心场求解。
- 中文文案、项目内容、终端层、简历页、自托管字体与静态导出适配是本仓库新增的部分。
