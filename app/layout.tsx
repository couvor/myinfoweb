import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/noto-serif-sc/600.css";
import "@fontsource/noto-serif-sc/900.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mingyanginfo.com"),
  title: "明旸信息 mingyanginfo — 软件供应链安全 × 教育辅助",
  description:
    "西安明旸信息技术有限公司（明旸信息）以技术连接未来、用智能创造价值：AI 驱动的软件供应链安全检测工具 Monitus，与家教辅助微信小程序师小评。",
  keywords: [
    "明旸信息",
    "西安明旸信息技术有限公司",
    "Monitus",
    "软件供应链安全",
    "SBOM",
    "师小评",
    "人工智能",
    "软件开发",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "明旸信息 mingyanginfo",
    title: "明旸信息 mingyanginfo — 软件供应链安全 × 教育辅助",
    description:
      "以技术连接未来，用智能创造价值。AI 驱动的软件供应链安全检测工具 Monitus 与家教辅助微信小程序师小评。",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
  ],
};

// 首帧之前同步主题，避免暗色用户看到亮色闪烁
const themeInit = `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(dark)document.documentElement.classList.add("dark");}catch(e){}})()`;

// Cloudflare Web Analytics：在 Cloudflare 控制台启用站点的 Web Analytics 后，把 beacon token 填入此处即可开启统计
const cfAnalyticsToken = "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
        {cfAnalyticsToken && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfAnalyticsToken })}
          />
        )}
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
