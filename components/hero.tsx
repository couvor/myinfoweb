export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* 环境光 + 精细网格 */}
      <div
        aria-hidden
        className="ambient parallax left-[-12vw] top-[-14%] h-[62vh] w-[76vw] bg-accent opacity-[0.13]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_78%_64%_at_52%_36%,black_28%,transparent_100%)]"
      />
      {/* 品牌空心大字 */}
      <div
        aria-hidden
        className="text-outline pointer-events-none absolute -right-8 top-[14vh] select-none font-serif text-[21vw] italic leading-none"
      >
        Mingyang
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-16 pt-32 lg:px-12">
        <div className="rise mb-12 flex items-center justify-between border-b border-line pb-5 font-mono text-[10.5px] tracking-[0.22em] text-dim">
          <span>XI&rsquo;AN MINGYANG INFORMATION TECHNOLOGY CO., LTD.</span>
          <span className="hidden sm:inline">34.34°N — 108.94°E · 西安</span>
        </div>

        <h1 className="rise rise-2 font-serifcn text-[clamp(2.45rem,8.6vw,8rem)] font-black leading-[1.12] tracking-[-0.015em]">
          以技术连接未来，
          <br />
          用<span className="text-accent-soft">智能</span>创造价值
        </h1>

        <div className="rise rise-3 mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30rem] text-[15px] leading-[2] text-mute">
            西安明旸信息技术有限公司专注
            <span className="text-fg">软件供应链安全</span>与
            <span className="text-fg">教育辅助</span>
            两大场景的人工智能产品研发——让可信的安全检测进入每一条流水线，让每一次教学都被认真记录。
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#products" className="btn btn-primary">
              探索产品 <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="btn btn-ghost">
              联系我们
            </a>
          </div>
        </div>
      </div>

      <div className="rise rise-4 relative mx-auto w-full max-w-[1440px] px-6 pb-9 lg:px-12">
        <div className="flex items-center justify-between border-t border-line pt-5 font-mono text-[10.5px] tracking-[0.2em] text-dim">
          <span>
            <span className="text-mute">MONITUS</span> — 供应链安全
          </span>
          <span className="hidden sm:inline">
            <span className="text-mute">师小评</span> — 家教辅助
          </span>
          <span className="flex items-center gap-4">
            SCROLL
            <span className="relative h-9 w-px overflow-hidden bg-line-strong">
              <span className="cue-line absolute inset-0 bg-accent-soft" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
