"use client";

import { useEffect, useState } from "react";

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

// 主题切换按钮：navbar 与成员个人主页共用（样式与 navbar 中的圆角图标按钮一致）
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggleTheme = () => {
    const next = document.documentElement.classList.toggle("dark")
      ? "dark"
      : "light";
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-300 hover:border-line-strong hover:text-fg"
    >
      <ThemeIcon mode={theme} />
    </button>
  );
}
