"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#about", cn: "关于", en: "ABOUT" },
  { href: "#products", cn: "产品", en: "PRODUCTS" },
  { href: "#tech", cn: "技术", en: "TECHNOLOGY" },
  { href: "#contact", cn: "联系", en: "CONTACT" },
];

// 腾讯云服务器登录页地址（当前为占位，无法访问）。
// 部署前替换为真实地址，形如 https://<服务器IP或域名>/<登录路径>
const LOGIN_URL = "https://your-tencent-server.invalid/login";

function ThemeIcon({ mode }: { mode: "dark" | "light" }) {
  return mode === "dark" ? (
    // 太阳：切到亮色
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.9 1.9M17.1 17.1 19 19M19 5l-1.9 1.9M6.9 17.1 5 19" strokeLinecap="round" />
    </svg>
  ) : (
    // 月亮：切到暗色
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const glassRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark",
    );
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const toggleTheme = () => {
    const next = document.documentElement.classList.toggle("light")
      ? "light"
      : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  // 液态玻璃：高光跟随指针
  const handleMove = (e: React.MouseEvent) => {
    const el = glassRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        ref={glassRef}
        onMouseMove={handleMove}
        onMouseLeave={() => glassRef.current?.style.setProperty("--mx", "50%")}
        aria-label="主导航"
        className="glass mx-auto flex h-14 max-w-[1360px] items-center justify-between rounded-2xl px-4 sm:px-6"
      >
        <a
          href="#top"
          className="group relative z-10 flex items-baseline gap-3"
          aria-label="明旸信息 — 返回顶部"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.svg?v=2"
            alt=""
            width={30}
            height={25}
            className="translate-y-[3px] transition-transform duration-700 ease-out group-hover:rotate-[10deg]"
          />
          <span className="font-serifcn text-[17px] font-semibold tracking-[0.1em] text-fg">
            明旸信息
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.34em] text-dim sm:inline">
            MINGYANGINFO
          </span>
        </a>

        <div className="relative z-10 hidden items-center gap-9 md:flex">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="link-slide font-mono text-[12px] tracking-[0.2em] text-mute transition-colors duration-300 hover:text-fg"
            >
              <span className="mr-1.5 text-[10px] text-dim">0{i + 1}</span>
              {l.cn}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-300 hover:border-line-strong hover:text-fg"
          >
            <ThemeIcon mode={theme} />
          </button>
          <a
            href="https://github.com/couvor/monituos"
            target="_blank"
            rel="noreferrer"
            aria-label="Monitus GitHub 仓库"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-300 hover:border-line-strong hover:text-fg"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a
            href={LOGIN_URL}
            aria-label="登录"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-300 hover:border-line-strong hover:text-fg"
          >
            {/* 人形图标：与主题图标的描线风格一致 */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="12" cy="8.2" r="3.7" />
              <path d="M4.8 20.2c1.4-3.4 4-5.1 7.2-5.1s5.8 1.7 7.2 5.1" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        <div className="relative z-10 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-300 hover:border-line-strong hover:text-fg"
          >
            <ThemeIcon mode={theme} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "关闭菜单" : "打开菜单"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[7px]"
          >
            <span
              className={`h-px w-6 bg-fg transition-transform duration-300 ${
                open ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-fg transition-transform duration-300 ${
                open ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* 移动端全屏菜单 */}
      <div
        className={`fixed inset-x-3 bottom-3 top-[76px] rounded-2xl border border-line bg-bg transition-opacity duration-500 sm:inset-x-5 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="移动端导航"
          className="flex h-full flex-col justify-center px-8"
        >
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`group flex items-baseline gap-4 border-b border-line py-6 transition-all duration-700 ease-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              style={{ transitionDelay: `${80 + i * 70}ms` }}
            >
              <span className="font-mono text-[11px] text-dim">0{i + 1}</span>
              <span className="font-serifcn text-4xl font-semibold text-fg transition-colors group-hover:text-accent-soft">
                {l.cn}
              </span>
              <span className="ml-auto font-mono text-[10px] tracking-[0.28em] text-dim">
                {l.en}
              </span>
            </a>
          ))}
          <a
            href="https://github.com/couvor/monituos"
            target="_blank"
            rel="noreferrer"
            className={`mt-10 flex items-center gap-2 font-mono text-[12px] tracking-[0.28em] text-mute transition-all duration-700 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "380ms" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GITHUB
          </a>
          <a
            href={LOGIN_URL}
            className={`flex items-center gap-2 pt-8 font-mono text-[12px] tracking-[0.28em] text-mute transition-all duration-700 hover:text-fg ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            登录
            <span aria-hidden>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
