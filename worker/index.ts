// Worker 脚本：处理 /api/contact —— 双重人机校验（进站 Turnstile + 提交时 reCAPTCHA），
// 都通过后把留言写入 Workers 日志与 D1；其余未命中静态资产的请求透传给 ASSETS。
// 静态资产请求默认不经过本脚本，只有 /api/* 这类未命中路径会进来。

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  TURNSTILE_SECRET_KEY?: string;
  RECAPTCHA_SECRET_KEY?: string;
  MESSAGES_DB: {
    prepare: (sql: string) => {
      bind: (...values: (string | null)[]) => { run: () => Promise<unknown> };
    };
  };
}

interface VerifyResult {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
}

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RECAPTCHA_VERIFY_URL = "https://www.recaptcha.net/recaptcha/api/siteverify";
// 出站 host 白名单（recaptcha.net 是 Google 官方国内可访问镜像，与 google.com 等价）
const VERIFY_HOSTS = new Set(["challenges.cloudflare.com", "www.recaptcha.net", "www.google.com"]);
const ALLOWED_HOSTNAMES = ["mingyanginfo.com", "www.mingyanginfo.com"];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// 统一的 siteverify 调用：返回 null 表示服务不可用/配置错误，否则返回核验结果
async function verifyToken(
  url: string,
  secret: string,
  token: string,
  ip: string | null,
): Promise<VerifyResult | null> {
  const target = new URL(url);
  if (target.protocol !== "https:" || !VERIFY_HOSTS.has(target.hostname)) return null;
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!res.ok) return null;
    return (await res.json()) as VerifyResult;
  } catch {
    return null;
  }
}

const hostnameAllowed = (host: string) =>
  ALLOWED_HOSTNAMES.includes(host) || host.endsWith(".workers.dev");

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  const name = str(body.name).slice(0, 80);
  const email = str(body.email).slice(0, 200);
  const message = str(body.message).slice(0, 5000);
  const turnstileToken = str(body.turnstileToken);
  const recaptchaToken = str(body.recaptchaToken);
  if (!email || !message) return json({ ok: false, error: "missing_fields" }, 400);
  if (!turnstileToken || !recaptchaToken) return json({ ok: false, error: "captcha_missing" }, 403);

  const ip = request.headers.get("cf-connecting-ip");
  const userAgent = request.headers.get("user-agent");

  // 第一道：进站时签发的 Turnstile token
  const ts = await verifyToken(
    TURNSTILE_VERIFY_URL,
    env.TURNSTILE_SECRET_KEY ?? "",
    turnstileToken,
    ip,
  );
  if (!ts) return json({ ok: false, error: "verify_unavailable" }, 502);
  if (!ts.success) {
    console.log(JSON.stringify({ event: "turnstile_rejected", codes: ts["error-codes"] ?? [] }));
    const code = ts["error-codes"]?.[0];
    return json(
      { ok: false, error: code === "invalid-input-secret" ? "server_config" : "turnstile_failed" },
      403,
    );
  }
  if (!hostnameAllowed(ts.hostname ?? "")) {
    return json({ ok: false, error: "turnstile_failed" }, 403);
  }

  // 第二道：提交时勾选的 reCAPTCHA v2 token（单次有效，verify 即消耗）
  const rc = await verifyToken(
    RECAPTCHA_VERIFY_URL,
    env.RECAPTCHA_SECRET_KEY ?? "",
    recaptchaToken,
    ip,
  );
  if (!rc) return json({ ok: false, error: "verify_unavailable" }, 502);
  if (!rc.success) {
    console.log(JSON.stringify({ event: "recaptcha_rejected", codes: rc["error-codes"] ?? [] }));
    const code = rc["error-codes"]?.[0];
    return json(
      { ok: false, error: code === "invalid-input-secret" ? "server_config" : "recaptcha_failed" },
      403,
    );
  }
  if (!hostnameAllowed(rc.hostname ?? "")) {
    return json({ ok: false, error: "recaptcha_failed" }, 403);
  }

  // 双写：Workers Logs（即时排查）+ D1 永久存储
  console.log(
    JSON.stringify({
      event: "contact_submission",
      at: new Date().toISOString(),
      name: name || null,
      email,
      message,
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    }),
  );
  try {
    await env.MESSAGES_DB.prepare(
      "INSERT INTO messages (name, email, message, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    ).bind(name || null, email, message, ip, userAgent).run();
  } catch (e) {
    console.log(JSON.stringify({ event: "storage_failed", error: String(e).slice(0, 500) }));
    return json({ ok: false, error: "storage_failed" }, 503);
  }
  return json({ ok: true });
}
