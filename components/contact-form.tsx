"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

// reCAPTCHA v2 site key（公开值，非机密）
const SITE_KEY = "6Ldnk-EtAAAAANsujJQFeyQNSE4GfJb94eMpKF-q";
// 官方国内可访问镜像域名（google.com 等价）；hl 指定组件中文界面
const RECAPTCHA_SRC = "https://www.recaptcha.net/recaptcha/api.js?render=explicit&hl=zh-CN";

type RecaptchaApi = {
  ready: (cb: () => void) => void;
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  getResponse: (id?: number) => string;
  reset: (id?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
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
  storage_failed: "服务器存储暂时不可用，请稍后再试，或直接发邮件联系我们。",
};

export default function ContactForm() {
  const holder = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<number | undefined>(undefined);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");

  const renderWidget = useCallback(() => {
    if (!holder.current || !window.grecaptcha || widgetId.current !== undefined) return;
    const theme = document.documentElement.classList.contains("light") ? "light" : "dark";
    widgetId.current = window.grecaptcha.render(holder.current, {
      sitekey: SITE_KEY,
      theme,
      callback: (t: string) => setToken(t),
      // v2 token 两分钟过期；过期/出错后组件会自行提示重新勾选
      "expired-callback": () => {
        setToken("");
        setNote("验证已过期，请重新勾选。");
      },
      "error-callback": () => {
        setToken("");
        setNote("人机验证出错，请重试。");
      },
    });
  }, []);

  // callback ref：holder 挂载/卸载时同步 widget 生命周期
  // （"已收到"面板会卸载表单，回来时需要重新渲染组件）
  const attachHolder = useCallback(
    (el: HTMLDivElement | null) => {
      holder.current = el;
      if (!el) {
        widgetId.current = undefined;
        return;
      }
      if (window.grecaptcha) renderWidget();
    },
    [renderWidget],
  );

  useEffect(() => {
    if (scriptReady) window.grecaptcha?.ready(renderWidget);
  }, [scriptReady, renderWidget]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!token) {
      setStatus("error");
      setNote(errorText.captcha_missing);
      return;
    }

    setStatus("sending");
    setNote("");
    const form = e.currentTarget;
    const data = new FormData(form);
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
        window.grecaptcha?.reset(widgetId.current);
        setToken("");
      }
    } catch {
      setStatus("error");
      setNote("网络异常，请稍后再试。");
      window.grecaptcha?.reset(widgetId.current);
      setToken("");
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
          留言已送达，重要信息请使用电子邮件联系。
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-10 self-start"
          onClick={() => {
            setToken("");
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
      <Script src={RECAPTCHA_SRC} strategy="lazyOnload" onReady={() => setScriptReady(true)} />
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
            placeholder="想聊点什么：合作、产品、还是仅仅打个招呼，发送邮件会更快与我们取得联系"
            className={`${fieldInput} resize-none leading-relaxed`}
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "sending" || !token}
            title={token ? "" : "请先完成人机验证"}
          >
            {status === "sending" ? "发送中 …" : "发送留言"}
            {status === "sending" ? null : <span aria-hidden>→</span>}
          </button>
          <div ref={attachHolder} aria-label="人机验证" />
          <p
            role="status"
            aria-live="polite"
            className={`font-mono text-[12px] tracking-[0.08em] ${
              status === "error" ? "text-accent-soft" : "text-dim"
            }`}
          >
            {token ? note : "发送前请先完成「我不是机器人」验证"}
          </p>
        </div>
      </form>
    </>
  );
}
