// 查看网站联系表单收到的留言（存在 Cloudflare D1 mingyang-messages 库里）
// 用法：node tools/view-messages.mjs [条数]，默认显示最近 200 条，最新在前
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const limit = Math.min(Number(process.argv[2]) || 200, 1000);

const sql =
  `SELECT id, datetime(created_at, '+8 hours') AS at, ` +
  `COALESCE(NULLIF(name, ''), '（未填）') AS name, email, message, ip ` +
  `FROM messages ORDER BY id DESC LIMIT ${limit}`;

let raw;
try {
  raw = execSync(
    `npx wrangler d1 execute mingyang-messages --remote --json --command ${JSON.stringify(sql)}`,
    { cwd: projectRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, shell: true },
  );
} catch (e) {
  const err = `${e.stderr || ""}${e.stdout || ""}`;
  if (err.includes("not authenticated")) {
    console.error("还没有登录 Cloudflare：请先运行  npx wrangler login  并在浏览器完成授权。");
  } else {
    console.error("查询失败：\n" + err.slice(-1500));
  }
  process.exit(1);
}

// wrangler --json 输出是语句结果数组，做容错截取
const start = raw.indexOf("[");
const end = raw.lastIndexOf("]");
let rows = [];
try {
  const parsed = JSON.parse(raw.slice(start, end + 1));
  rows = (Array.isArray(parsed) ? parsed[0] : parsed)?.results ?? [];
} catch {
  console.error("解析 wrangler 输出失败，原始输出末尾：\n" + raw.slice(-800));
  process.exit(1);
}

if (rows.length === 0) {
  console.log("还没有留言。去网站表单发一条试试（线上后约几秒即可查到）。");
  process.exit(0);
}

console.log(`共 ${rows.length} 条留言（最新在前，时间为北京时间）\n${"─".repeat(56)}`);
for (const r of rows) {
  const meta = [r.name, `<${r.email}>`, r.ip ? `IP ${r.ip}` : null].filter(Boolean).join("  ");
  console.log(`#${r.id} · ${r.at}`);
  console.log(`  ${meta}`);
  for (const line of String(r.message).split("\n")) console.log(`  ${line}`);
  console.log(`${"─".repeat(56)}`);
}
