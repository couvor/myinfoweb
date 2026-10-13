import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { team } from "@/data/team";
import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";

// 静态导出：成员主页在构建时为每位成员生成独立 HTML（out/{slug}/index.html）
export const dynamicParams = false;

export function generateStaticParams() {
  return team.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = team.find((m) => m.slug === slug);
  if (!p) return { title: "成员不存在 — 明旸信息" };
  return {
    title: `${p.name} · ${p.role} — 明旸信息`,
    description: `${p.name}（${p.latin}），${p.school}，明旸信息${p.role}。`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = team.findIndex((m) => m.slug === slug);
  if (idx === -1) notFound();
  const p = team[idx];
  const prev = team[(idx - 1 + team.length) % team.length];
  const next = team[(idx + 1) % team.length];

  return (
    <>
      {/* 顶部：logo 锁定组合 + 返回首页 + 主题切换（液态玻璃，与首页导航同族） */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="成员页导航"
          className="glass mx-auto flex h-14 max-w-[1360px] items-center justify-between rounded-2xl px-4 sm:px-6"
        >
          <Link
            href="/"
            className="group relative z-10 flex items-baseline gap-3"
            aria-label="明旸信息 — 返回首页"
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
          </Link>
          <div className="relative z-10 flex items-center gap-2">
            <Link
              href="/"
              className="flex h-9 items-center rounded-lg border border-line px-3.5 font-mono text-[12px] tracking-[0.2em] text-mute transition-all duration-300 hover:border-line-strong hover:text-fg"
            >
              返回 <span aria-hidden>↩</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative">
        {/* 氛围：单个 accent 光斑 + 渐隐精细网格（克制使用，全屏各一） */}
        <div
          aria-hidden
          className="ambient parallax right-[-12vw] top-[-14%] h-[56vh] w-[62vw] bg-accent opacity-[0.11]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_62%_at_50%_16%,black_25%,transparent_100%)]"
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-28 pt-32 lg:px-12 lg:pb-44 lg:pt-44">
          {/* mono 信息行：TEAM 序号 / 全站定位 */}
          <div className="rise mb-14 flex items-center justify-between border-b border-line pb-5 font-mono text-[10.5px] tracking-[0.22em] text-dim">
            <span>
              <span className="text-accent-soft">TEAM</span> —{" "}
              {String(idx + 1).padStart(2, "0")} /{" "}
              {String(team.length).padStart(2, "0")}
            </span>
            <span className="hidden sm:inline">FOUNDING TEAM · 创始团队</span>
          </div>

          {/* 主体：不对称栅格（照片 5 / 文字 7） */}
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="rise rise-2 lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photo}
                  alt={`${p.name} 照片`}
                  width={640}
                  height={640}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-dim">
                <span>{p.school}</span>
                <span>/{p.slug}</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <h1 className="rise rise-2 font-serifcn text-[clamp(2.8rem,6vw,5.2rem)] font-black leading-[1.08] tracking-[-0.015em]">
                {p.name}
              </h1>
              <p className="rise rise-3 mt-5 font-serifcn text-[22px] font-semibold tracking-wide text-accent-soft">
                {p.role}
              </p>
              <p className="rise rise-3 mt-1.5 font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] italic leading-tight text-dim">
                {p.latin}
              </p>
              <p className="rise rise-3 mt-4 text-[15px] leading-[1.9] text-mute">
                {p.school}
              </p>

              <div className="rise rise-4 mt-12 border-t border-line pt-8">
                <div className="mb-6 font-mono text-[10.5px] tracking-[0.3em] text-dim">
                  简介 — PROFILE
                </div>
                <p className="text-[15px] leading-[2] text-mute">{p.intro}</p>
                <p className="mt-6 text-[13.5px] leading-[1.9] text-dim">{p.bio}</p>
              </div>

              {/* 资料行：编辑感列表（与首页「布局」行同族） */}
              <dl className="rise rise-5 mt-12">
                {[
                  { k: "职务", v: p.role },
                  { k: "院校", v: p.school },
                  { k: "主页", v: `mingyanginfo.com/${p.slug}` },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="row-item border-t border-line py-5 last:border-b"
                  >
                    <dt className="font-mono text-[10.5px] tracking-[0.3em] text-dim">
                      {m.k}
                    </dt>
                    <dd className="mt-2 font-serifcn text-[18px] font-semibold leading-relaxed text-fg/95">
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="rise rise-5 mt-12">
                <Link href="/#about" className="btn btn-ghost">
                  了解团队 <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 上一位 / 下一位（环形） */}
          <nav
            aria-label="团队成员切换"
            className="mt-28 flex flex-col gap-10 border-t border-line pt-8 sm:flex-row sm:items-start sm:justify-between"
          >
            <Link
              href={`/${prev.slug}`}
              className="group flex flex-col items-start transition-transform duration-500 ease-out hover:-translate-x-1.5"
            >
              <span className="font-mono text-[10.5px] tracking-[0.3em] text-dim transition-colors duration-300 group-hover:text-accent-soft">
                <span aria-hidden>← </span>PREV
              </span>
              <span className="mt-2.5 font-serifcn text-[22px] font-semibold leading-tight text-fg/90 transition-colors duration-300 group-hover:text-accent-soft">
                {prev.name}
              </span>
              <span className="mt-1.5 font-mono text-[10.5px] tracking-[0.14em] text-dim">
                {prev.role}
              </span>
            </Link>
            <Link
              href={`/${next.slug}`}
              className="group flex flex-col items-start transition-transform duration-500 ease-out hover:translate-x-1.5 sm:items-end"
            >
              <span className="font-mono text-[10.5px] tracking-[0.3em] text-dim transition-colors duration-300 group-hover:text-accent-soft">
                NEXT<span aria-hidden> →</span>
              </span>
              <span className="mt-2.5 font-serifcn text-[22px] font-semibold leading-tight text-fg/90 transition-colors duration-300 group-hover:text-accent-soft">
                {next.name}
              </span>
              <span className="mt-1.5 font-mono text-[10.5px] tracking-[0.14em] text-dim">
                {next.role}
              </span>
            </Link>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  );
}
