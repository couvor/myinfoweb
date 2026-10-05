"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const SITE_KEY = "0x4AAAAAAFOx-yRO2d8yNr05";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string | undefined;
  getResponse: (id?: string) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = "idle" | "sending" | "sent" | "error";

// siteverify 错误码 → 用户可读文案
const errorText: Record<string, string> = {
  captcha_missing: "请先完成人机验证。",
  captcha_failed: "人机验证未通过，请重试。",
  missing_fields: "请填写邮箱与留言内容。",
  invalid_body: "提交内容格式有误，请重试。",
  server_config: "服务端验证配置未生效，请通过邮件联系我们。",
  verify_unavailable: "验证服务暂时不可用，请稍后再试。",
};

export default function ContactForm() {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");

  const renderWidget = useCallback(() => {
    if (!holder.current || !window.turnstile || widgetId.current) return;
    // interaction-only：正常情况下隐形，仅在需要交互式挑战时展开，不破坏版面
    const theme = document.documentElement.classList.contains("light") ? "light" : "dark";
    widgetId.current = window.turnstile.render(holder.current, {
      sitekey: SITE_KEY,
      action: "contact",
      theme,
      appearance: "interaction-only",
    });
  }, []);

  useEffect(() => {
    renderWidget();
  }, [scriptReady, renderWidget]);

  useEffect(() => {
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const token = widgetId.current ? window.turnstile?.getResponse(widgetId.current) ?? "" : "";
    if (!token) {
      setStatus("error");
      setNote(errorText.captcha_missing);
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setNote("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          token,
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && result.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setNote(errorText[result.error ?? ""] ?? "发送失败，请稍后再试。");
        window.turnstile?.reset(widgetId.current);
      }
    } catch {
      setStatus("error");
      setNote("网络异常，请稍后再试。");
      window.turnstile?.reset(widgetId.current);
    }
  };

  const fieldLabel =
    "block font-mono text-[10.5px] tracking-[0.3em] text-dim uppercase";
  const fieldInput =
    "mt-2 w-full bg-transparent border-b border-line py-3 text-[1.05rem] text-fg placeholder:text-dim outline-none transition-colors duration-300 focus:border-accent-soft";

  if (status === "sent") {
    return (
      <div className="flex h-full flex-col justify-center" aria-live="polite">
        <p className="font-serifcn text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-snug">
          已收到。
          <span className="font-serif font-normal italic text-accent-soft"> Thank you.</span>
        </p>
        <p className="mt-5 max-w-md text-[13.5px] leading-[2] text-mute">
          留言已送达，我们通常在一个工作日内回复你的邮箱。
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-10 self-start"
          onClick={() => {
            window.turnstile?.reset(widgetId.current);
            setStatus("idle");
            setNote("");
          }}
        >
          再写一条 <span aria-hidden>↺</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className={fieldLabel}>
              Name · 姓名（选填）
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              placeholder="怎么称呼你"
              className={fieldInput}
            />
          </div>
          <div>
            <label htmlFor="cf-email" className={fieldLabel}>
              Email · 邮箱
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              placeholder="you@example.com"
              className={fieldInput}
            />
          </div>
        </div>

        <div className="mt-10">
          <label htmlFor="cf-message" className={fieldLabel}>
            Message · 留言
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={4}
            maxLength={5000}
            placeholder="想聊点什么：合作、产品、还是仅仅打个招呼"
            className={`${fieldInput} resize-none leading-relaxed`}
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "发送中 …" : "发送留言"}
            <span aria-hidden>→</span>
          </button>
          <div ref={holder} aria-label="人机验证" />
          <p
            role="status"
            aria-live="polite"
            className={`font-mono text-[12px] tracking-[0.08em] ${
              status === "error" ? "text-accent-soft" : "text-dim"
            }`}
          >
            {note}
          </p>
        </div>
      </form>
    </>
  );
}
