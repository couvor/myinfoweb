// Worker 脚本：处理 /api/contact（校验 Turnstile 后把留言写入 Workers 日志），
// 其余未命中静态资产的请求透传给 ASSETS（由 not_found_handling 兜底 404 页）。
// 静态资产请求默认不经过本脚本（Workers 智能路由），只有 /api/* 这类未命中路径会进来。

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  RECAPTCHA_SECRET_KEY?: string;
  MESSAGES_DB: {
    prepare: (sql: string) => {
      bind: (...values: (string | null)[]) => { run: () => Promise<unknown> };
    };
  };
}

interface SiteverifyResult {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
}

// reCAPTCHA v2 siteverify：主用 recaptcha.net（大陆可访问的官方镜像域名），google.com 等价
const SITEVERIFY_URL = "https://www.recaptcha.net/recaptcha/api/siteverify";
const SITEVERIFY_HOSTS = new Set(["www.recaptcha.net", "www.google.com"]);
const ALLOWED_HOSTNAMES = ["mingyanginfo.com", "www.mingyanginfo.com"];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

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
  const token = str(body.token);
  if (!email || !message) return json({ ok: false, error: "missing_fields" }, 400);
  if (!token) return json({ ok: false, error: "captcha_missing" }, 403);

  // 出站请求前校验目标：仅允许 https 且为 siteverify 官方域名
  const target = new URL(SITEVERIFY_URL);
  if (target.protocol !== "https:" || !SITEVERIFY_HOSTS.has(target.hostname)) {
    return json({ ok: false, error: "server_config" }, 500);
  }

  const params = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET_KEY ?? "",
    response: token,
  });
  const ip = request.headers.get("cf-connecting-ip");
  if (ip) params.set("remoteip", ip);

  let result: SiteverifyResult;
  try {
    const verifyRes = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!verifyRes.ok) return json({ ok: false, error: "verify_unavailable" }, 502);
    result = (await verifyRes.json()) as SiteverifyResult;
  } catch {
    return json({ ok: false, error: "verify_unavailable" }, 502);
  }

  if (!result.success) {
    console.log(JSON.stringify({ event: "recaptcha_rejected", codes: result["error-codes"] ?? [] }));
    // invalid-input-secret 是服务端配置问题，其余（token 过期/重放/伪造）都按验证失败处理
    const code = result["error-codes"]?.[0];
    return json(
      { ok: false, error: code === "invalid-input-secret" ? "server_config" : "captcha_failed" },
      403,
    );
  }
  const host = result.hostname ?? "";
  if (!ALLOWED_HOSTNAMES.includes(host) && !host.endsWith(".workers.dev")) {
    return json({ ok: false, error: "captcha_failed" }, 403);
  }

  // 留言双写：Workers Logs（便于即时排查）+ D1 永久存储（查看留言.cmd 读取）
  console.log(
    JSON.stringify({
      event: "contact_submission",
      at: new Date().toISOString(),
      name: name || null,
      email,
      message,
      ip: ip ?? null,
      userAgent: request.headers.get("user-agent") ?? null,
    }),
  );
  try {
    await env.MESSAGES_DB.prepare(
      "INSERT INTO messages (name, email, message, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    ).bind(name || null, email, message, ip, request.headers.get("user-agent")).run();
  } catch (e) {
    console.log(JSON.stringify({ event: "storage_failed", error: String(e).slice(0, 500) }));
    return json({ ok: false, error: "storage_failed" }, 503);
  }
  return json({ ok: true });
}
