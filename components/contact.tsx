import ContactForm from "./contact-form";

const channels = [
  {
    k: "GITHUB",
    v: "github.com/couvor/monituos",
    href: "https://github.com/couvor/monituos",
  },
  {
    k: "EMAIL",
    v: "contact@mingyanginfo.com",
    href: "mailto:contact@mingyanginfo.com",
  },
  { k: "WECHAT", v: "微信小程序 · 搜索「师小评」" },
  { k: "ADDRESS", v: "陕西省西安市雁塔区电子三路悦熙广场" },
];

export default function Contact() {
  return (
    <section id="contact" aria-label="联系我们" className="relative">
      <div className="mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-44">
        <div className="reveal mb-16 flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] text-dim">
          <span className="text-accent-soft">04</span>
          <span className="h-px w-12 bg-line-strong" />
          CONTACT
        </div>

        <h2 className="reveal font-serifcn text-[clamp(2.5rem,6vw,5.4rem)] font-black leading-[1.18]">
          以技术连接未来，
          <br />
          也期待连接<span className="font-serif font-normal italic text-accent-soft">你</span>。
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="text-[13.5px] leading-[2] text-mute">
              无论是供应链安全检测的落地评估，还是家教场景的数字化协作，都欢迎与我们聊聊。留下你的想法，我们尽快回复。
            </p>

            <div className="mt-14">
              {channels.map((c) => {
                const inner = (
                  <>
                    <span className="w-24 shrink-0 font-mono text-[10.5px] tracking-[0.3em] text-dim">
                      {c.k}
                    </span>
                    <span className="flex-1 text-[clamp(0.95rem,1.6vw,1.15rem)] leading-snug text-fg/90 transition-colors duration-300 group-hover:text-fg">
                      {c.v}
                    </span>
                    {c.href && (
                      <span
                        aria-hidden
                        className="font-mono text-[13px] text-accent-soft opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    )}
                  </>
                );
                return c.href ? (
                  <a
                    key={c.k}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                    className="row-item group flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={c.k}
                    className="row-item group flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="reveal reveal-late lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
