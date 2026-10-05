const nav = [
  { href: "#about", label: "关于" },
  { href: "#products", label: "产品" },
  { href: "#tech", label: "技术" },
  { href: "#contact", label: "联系" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="#top" className="group flex items-baseline gap-3" aria-label="明旸信息 — 返回顶部">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon.svg?v=2"
                alt=""
                width={30}
                height={25}
                className="translate-y-[3px] transition-transform duration-700 group-hover:rotate-[10deg]"
              />
              <span className="font-serifcn text-[17px] font-semibold tracking-[0.1em] text-fg">
                明旸信息
              </span>
              <span className="font-mono text-[10px] tracking-[0.34em] text-dim">
                MINGYANGINFO
              </span>
            </a>
            <p className="mt-5 text-[12.5px] leading-[1.9] text-dim">
              西安明旸信息技术有限公司
              <br />
              XI&rsquo;AN MINGYANG INFORMATION TECHNOLOGY CO., LTD.
            </p>
          </div>

          <nav aria-label="页脚导航" className="flex flex-wrap gap-x-10 gap-y-3">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="link-slide font-mono text-[11.5px] tracking-[0.2em] text-mute transition-colors hover:text-fg"
              >
                {n.label}
              </a>
            ))}
            <a
              href="https://github.com/couvor/monituos"
              target="_blank"
              rel="noreferrer"
              className="link-slide font-mono text-[11.5px] tracking-[0.2em] text-mute transition-colors hover:text-fg"
            >
              MONITUS ↗
            </a>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[10.5px] tracking-[0.18em] text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 MINGYANG INFO · ALL RIGHTS RESERVED</span>
          {/* ICP 备案号占位：备案下来后替换为真实备案号并链接至 beian.miit.gov.cn */}
          <span>陕ICP备XXXXXXXX号</span>
        </div>
      </div>
    </footer>
  );
}
