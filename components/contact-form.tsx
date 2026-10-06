"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

// 进站验证：Cloudflare Turnstile（低风险静默通过，高风险才弹挑战）
const TURNSTILE_SITE_KEY = "0x4AAAAAAFOx-yRO2d8yNr05";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// 提交验证：Google reCAPTCHA v2 勾选框（官方国内可访问镜像域名，与 google.com 等价）
const RECAPTCHA_SITE_KEY = "6Ldnk-EtAAAAANsujJQFeyQNSE4GfJb94eMpKF-q";
const RECAPTCHA_SRC = "https://www.recaptcha.net/recaptcha/api.js?render=explicit&hl=zh-CN";

type TurnstileApi = {
  ready: (cb: () => void) => void;
  render: (el: HTMLElement, opts: Record<string, unknown>) => string | undefined;
  getResponse: (id?: string) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
  execute: (id?: string) => void;
};

type RecaptchaApi = {
  ready: (cb: () => void) => void;
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  getResponse: (id?: number) => string;
  reset: (id?: number) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    grecaptcha?: RecaptchaApi;
  }
}

type Status = "idle" | "verifying" | "sending" | "sent" | "error";

// siteverify 错误码 → 用户可读文案
const errorText: Record<string, string> = {
  captcha_missing: "请先完成人机验证。",
  turnstile_failed: "进站人机验证未通过，请刷新页面重试。",
  recaptcha_failed: "Google 人机验证未通过，请重新勾选后发送。",
  missing_fields: "请填写邮箱与留言内容。",
  invalid_body: "提交内容格式有误，请重试。",
  server_config: "服务端验证配置未生效，请通过邮件联系我们。",
  verify_unavailable: "验证服务暂时不可用，请稍后再试。",
  storage_failed: "服务器存储暂时不可用，请稍后再试，或直接发邮件联系我们。",
};

export default function ContactForm() {
  const tsHolder = useRef<HTMLDivElement | null>(null);
  const tsWidgetId = useRef<string | undefined>(undefined);
  const tsInteractive = useRef(false);
  const tsResolve = useRef<((token: string) => void) | null>(null);
  const tsReject = useRef<((e: Error) => void) | null>(null);

  const rcHolder = useRef<HTMLDivElement | null>(null);
  const rcWidgetId = useRef<number | undefined>(undefined);

  const [tsReady, setTsReady] = useState(false);
  const [rcReady, setRcReady] = useState(false);
  const [tsToken, setTsToken] = useState("");
  const [rcToken, setRcToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");

  const busy = status === "verifying" || status === "sending";

  // —— Turnstile：进站即验证，token 常备常新 ——
  const settleTsToken = (token?: string) => {
    const resolve = tsResolve.current;
    const reject = tsReject.current;
    tsResolve.current = null;
    tsReject.current = null;
    if (token && resolve) resolve(token);
    else if (!token && reject) reject(new Error("challenge"));
  };

  const renderTurnstile = useCallback(() => {
    if (!tsHolder.current || !window.turnstile || tsWidgetId.current) return;
    const theme = document.documentElement.classList.contains("light") ? "light" : "dark";
    tsWidgetId.current = window.turnstile.render(tsHolder.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action: "contact",
      theme,
      appearance: "interaction-only",
      "refresh-expired": "auto",
      callback: (token: string) => {
        setTsToken(token);
        settleTsToken(token);
      },
      "error-callback": () => {
        setTsToken("");
        settleTsToken();
      },
      "timeout-callback": () => {
        setTsToken("");
        settleTsToken();
      },
      "before-interactive-callback": () => {
        tsInteractive.current = true;
        setNote("检测到访问风险较高，请完成人机验证。");
      },
      "after-interactive-callback": () => {
        tsInteractive.current = false;
        setNote("");
      },
    });
  }, []);

  const attachTsHolder = useCallback(
    (el: HTMLDivElement | null) => {
      tsHolder.current = el;
      if (!el) {
        tsWidgetId.current = undefined;
        return;
      }
      if (window.turnstile) renderTurnstile();
    },
    [renderTurnstile],
  );

  useEffect(() => {
    // 不能用 turnstile.ready()：next/script 注入的 api.js 带 async 属性，ready() 会直接抛
    // TurnstileError 炸掉整个应用；onReady 已保证脚本执行完毕，显式渲染直接调用即可
    if (tsReady) renderTurnstile();
  }, [tsReady, renderTurnstile]);

  // —— reCAPTCHA v2 勾选框 ——
  const renderRecaptcha = useCallback(() => {
    if (!rcHolder.current || !window.grecaptcha || rcWidgetId.current !== undefined) return;
    const theme = document.documentElement.classList.contains("light") ? "light" : "dark";
    rcWidgetId.current = window.grecaptcha.render(rcHolder.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme,
      callback: (t: string) => setRcToken(t),
      "expired-callback": () => {
        setRcToken("");
        setNote("Google 验证已过期，请重新勾选。");
      },
      "error-callback": () => {
        setRcToken("");
        setNote("Google 人机验证出错，请重试。");
      },
    });
  }, []);

  const attachRcHolder = useCallback(
    (el: HTMLDivElement | null) => {
      rcHolder.current = el;
      if (!el) {
        rcWidgetId.current = undefined;
        return;
      }
      if (window.grecaptcha) renderRecaptcha();
    },
    [renderRecaptcha],
  );

  useEffect(() => {
    if (rcReady) window.grecaptcha?.ready(renderRecaptcha);
  }, [rcReady, renderRecaptcha]);

  const resetTurnstile = () => {
    setTsToken("");
    window.turnstile?.reset(tsWidgetId.current);
  };
  const resetRecaptcha = () => {
    setRcToken("");
    window.grecaptcha?.reset(rcWidgetId.current);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;

    if (!rcToken) {
      setStatus("error");
      setNote(errorText.captcha_missing);
      return;
    }

    const form = e.currentTarget;

    // Turnstile token 应在进站时就绪；过期自动续签。缺失时（被消耗/出错）重跑一遍并等待结果
    let turnstileToken = tsWidgetId.current
      ? window.turnstile?.getResponse(tsWidgetId.current) ?? ""
      : "";
    if (!turnstileToken) {
      setStatus("verifying");
      setNote("");
      if (!tsInteractive.current) resetTurnstile();
      try {
        turnstileToken = await new Promise<string>((resolve, reject) => {
          tsResolve.current = resolve;
          tsReject.current = reject;
        });
      } catch {
        tsInteractive.current = false;
        setStatus("error");
        setNote(errorText.turnstile_failed);
        resetTurnstile();
        return;
      }
    }

    setStatus("sending");
    setNote("");
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          turnstileToken,
          recaptchaToken: rcToken,
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && result.ok) {
        setStatus("sent");
        form.reset();
        // Turnstile token 已被服务器消耗，回来再写时需要重新签发
        setTsToken("");
        window.turnstile?.reset(tsWidgetId.current);
      } else {
        setStatus("error");
        setNote(errorText[result.error ?? ""] ?? "发送失败，请稍后再试。");
        // 两个 token 在 siteverify 时都会被消耗，失败后全部重置
        resetTurnstile();
        resetRecaptcha();
      }
    } catch {
      setStatus("error");
      setNote("网络异常，请稍后再试。");
      resetTurnstile();
      resetRecaptcha();
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
            setRcToken("");
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
        src={TURNSTILE_SRC}
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onReady={() => setTsReady(true)}
      />
      <Script
        src={RECAPTCHA_SRC}
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onReady={() => setRcReady(true)}
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
            placeholder="想聊点什么：合作、产品、还是仅仅打个招呼，发送邮件会更快与我们取得联系"
            className={`${fieldInput} resize-none leading-relaxed`}
          />
        </div>

        {/* 提交区：细线收束表单，验证居左、动作居右，像签名栏一样收尾 */}
        <div className="mt-14 border-t border-line pt-8">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div ref={attachRcHolder} aria-label="Google 人机验证" />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy || !rcToken}
              title={rcToken ? "" : "请先完成「我不是机器人」验证"}
            >
              {status === "verifying"
                ? "人机验证中 …"
                : status === "sending"
                  ? "发送中 …"
                  : "发送留言"}
              {busy ? null : <span aria-hidden>→</span>}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div ref={attachTsHolder} aria-label="进站人机验证" />
            <p
              role="status"
              aria-live="polite"
              className={`font-mono text-[12px] tracking-[0.08em] ${
                status === "error" ? "text-accent-soft" : "text-dim"
              }`}
            >
              {rcToken ? note : "发送前请先完成「我不是机器人」验证"}
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
