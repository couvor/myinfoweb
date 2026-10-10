# 明旸信息 设计规范（供登录页 / 其他页面保持一致性）

> 给实现 agent 的指令：新页面必须复用本项目的设计系统。若在同一个 Next.js 项目中，直接 `import "./globals.css"` 并使用下述类名与变量，禁止自行另起配色或字体。若为独立项目，按本文件复刻 tokens。

## 1. 技术基座

- Next.js (App Router) + Tailwind CSS v4（`@theme inline` 映射 CSS 变量）
- 字体：`@fontsource` 自托管（Noto Serif SC 600/900、Instrument Serif 400+italic、IBM Plex Mono 400/500），**禁止**运行时拉取 Google Fonts
- 全局样式唯一来源：`app/globals.css`

## 2. 主题系统（必须支持）

- 亮色为默认；`<html>` 加 `.dark` 类切换暗色，偏好存 `localStorage("theme")`
- 首帧防闪烁脚本（放在 `<body>` 第一个子元素）：

```js
(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(dark)document.documentElement.classList.add("dark");}catch(e){}})()
```

- `<html lang="zh-CN" suppressHydrationWarning>`；切主题的过渡：`body { transition: background-color .6s ease, color .6s ease }`

## 3. 色彩（CSS 变量，勿用写死的色值）

| 变量 | 亮色（默认） | 暗色（.dark） | 用途 |
|---|---|---|---|
| `--bg` | `#f4f1ea` | `#0a0a0c` | 页面背景 |
| `--fg` | `#17171b` | `#eceae4` | 主文字 |
| `--mute` | `#63636b` | `#90909a` | 次要文字 |
| `--dim` | `#9a9aa1` | `#5a5a63` | 弱化文字/标签 |
| `--surface` | `#e7e3d9` | `#1d1d23` | 节点/填充 |
| `--line` | `rgb(23 23 27 / .1)` | `rgb(236 234 228 / .08)` | 发丝线 |
| `--line-strong` | `rgb(23 23 27 / .24)` | `rgb(236 234 228 / .18)` | 分割线/边框强调 |
| `--accent` | `#1d67ea` | `#1d67ea` | 唯一品牌蓝（按钮/强调） |
| `--accent-soft` | `#1a5adf` | `#6ea8ff` | 悬停/浅强调 |

**Tailwind 工具类**（v4 自动生成）：`bg-bg` `text-fg` `text-mute` `text-dim` `border-line` `border-line-strong` `bg-surface` `bg-accent` `text-accent-soft` 等。

硬性规则：黑白灰为主，**全站唯一 accent = 品牌蓝**；禁止紫色渐变、彩虹色、大面积高饱和色块、大渐变文字。

## 4. 字体排印

- `font-serifcn`（Noto Serif SC）— 中文大标题、人名、品牌文字；`font-black`(900) 或 `font-semibold`(600)
- `font-serif`（Instrument Serif）— 拉丁装饰词、数字大字、斜体点缀（如 `italic`）
- `font-mono`（IBM Plex Mono）— 小标签、按钮、meta 信息：10.5–12px、`tracking-[0.2em]~[0.3em]`、常配 `text-dim`
- 正文 `font-sans`（系统栈）13.5–15px、`leading-[1.8]~[2]`、`text-mute`
- 层级靠字号/字重/颜色区分，标题可到 clamp(2.5rem, 6vw, 5.4rem)

## 5. 组件基准

**按钮**（用现成类 `.btn` `.btn-primary` `.btn-ghost`）：
- 方角 `border-radius: 2px`（导航中圆角图标按钮为特例：`rounded-lg`）、mono 13px、`tracking-[0.08em]`
- hover：`translateY(-2px)`；primary 变 `--accent-soft` 底 + 蓝色 glow；ghost 边框变 `accent-soft/55` + 内侧蓝色微光

**表单/输入框**（登录页核心，须按此风格新建）：
- 容器：方角（2px）、`bg-transparent`、`border border-line`、`focus: border-accent-soft` + `box-shadow: 0 0 0 3px rgb(29 103 234 / .15)`
- Label：mono 10.5px `tracking-[0.3em] text-dim`；错误提示：mono 11px（可用 `#e5484d` 唯一例外色）
- 表单卡：`border border-line bg-bg rounded-2xl shadow-[0_28px_90px_rgb(23_23_27/0.14)]`（亮色默认投影；暗色用 `rgb(0_0_0/0.34)`），宽度 ≤ 420px 居中

**卡片/浮窗**：发丝边框 + `bg-bg`（或玻璃 `.glass`）+ 大柔和阴影，圆角 `rounded-lg~2xl`

**图标**：不用图标库；内联 SVG `stroke="currentColor" strokeWidth={1.6}`（参考 navbar 的主题切换按钮）；GitHub 用官方 mark path（见 `components/navbar.tsx`）

## 6. 纹理与氛围（克制使用）

- `.grain` 全局噪点覆盖层（layout 中已有，勿重复添加）
- `.bg-grid` 精细网格（配 `[mask-image:radial-gradient(...)]` 渐隐）
- `.ambient` 环境光斑：`bg-accent` + `blur(110px)`，opacity 8–13%，每屏最多一个
- `.glass` 液态玻璃（导航级元素专用，勿用于普通卡片）
- `.text-outline` 空心大字（背景装饰）

## 7. 布局

- 容器：`mx-auto max-w-[1440px] px-6 lg:px-12`；分区留白 `py-28 lg:py-44`
- 不对称栅格 `grid lg:grid-cols-12`（如 7/5 分栏），避免所有区块同宽对齐
- 登录页建议：液态玻璃表单卡居中 + 背景网格 + 单个 accent 光斑 + 左上角 logo（`/logo-icon.svg` + 明旸信息 serifcn 17px + MINGYANGINFO mono 10px）

## 8. 动效

- 缓动统一 `cubic-bezier(0.16, 1, 0.3, 1)`；时长 0.3–1.15s；偏慢、自然
- 进场：`.rise`（错落延迟 `.rise-2~5`）；滚动显现：`.reveal`（CSS scroll-driven，渐进增强）
- 悬停微交互：颜色/边框/位移/下划线滑入（`.link-slide` `.name-hover`），不要弹跳缩放
- 必须保留 `@media (prefers-reduced-motion: reduce)` 全部禁用逻辑

## 9. 品牌资产

- Logo 图标：`/logo-icon.svg`（蓝色渐变网络节点，透明底）；锁屏组合 = 图标 + 「明旸信息」(serifcn 600) + `MINGYANGINFO`(mono 10px tracking .34em text-dim)
- 公司全称：西安明旸信息技术有限公司 / XI'AN MINGYANG INFORMATION TECHNOLOGY CO., LTD.

## 10. 禁止清单

默认 Inter + 全粗体 ｜ 紫/蓝渐变大字 ｜ 玻璃拟态滥用 ｜ 图标库堆砌（Lucide/emoji）｜ 胶囊按钮泛滥 ｜ 每区块同宽卡片阵列 ｜ Trusted-by/Testimonials 模板块 ｜ 写死色值绕过主题变量 ｜ 暗色模式下直接用亮色 token
