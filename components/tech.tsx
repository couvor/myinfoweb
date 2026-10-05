const layers = [
  {
    en: "ENTRY — 入口层",
    mods: "scg 命令行（Typer）· REST API（FastAPI）",
  },
  {
    en: "ORCHESTRATION — 编排层",
    mods: "ScanOrchestrator 并行调度 · 去重与严重度过滤 · 风险评分",
  },
  {
    en: "SCANNING — 解析与扫描层",
    mods: "多语言依赖解析器 · dependency / license / sbom / malware / posture",
  },
  {
    en: "INFERENCE — 智能推理层",
    mods: "华为昇腾 NPU · MindSpore（MindNLP）· Mock 后端自动切换",
  },
  {
    en: "REPORTING — 报告层",
    mods: "JSON · HTML · Markdown · SARIF 四种格式统一导出",
  },
];

export default function Tech() {
  return (
    <section id="tech" aria-label="技术架构" className="relative overflow-hidden">
      <div
        aria-hidden
        className="ambient right-[-16vw] top-[30%] h-[46vh] w-[52vw] bg-accent opacity-[0.09]"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-44">
        <div className="reveal mb-14 flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] text-dim">
          <span className="text-accent-soft">03</span>
          <span className="h-px w-12 bg-line-strong" />
          TECHNOLOGY
        </div>

        <h2 className="reveal font-serifcn text-[clamp(2.4rem,5.4vw,4.8rem)] font-black leading-[1.15]">
          规则 <span className="font-serif italic font-normal text-accent-soft">×</span> AI
          双引擎
        </h2>
        <p className="reveal reveal-late mt-7 max-w-xl text-[14.5px] leading-[2] text-mute">
          静态规则负责快速、可解释的确定性检测；AI 模型负责语义级深度研判。两类结果统一汇总为风险评分与分级报告，兼顾效率与深度。
        </p>

        {/* 双引擎对照 */}
        <div className="reveal mt-20 grid border-y border-line md:grid-cols-2 md:divide-x md:divide-line">
          <div className="py-12 md:py-16 md:pr-16">
            <div className="font-mono text-[10.5px] tracking-[0.3em] text-dim">
              RULES — DETERMINISTIC
            </div>
            <h3 className="mt-5 font-serifcn text-2xl font-semibold">
              静态规则引擎
            </h3>
            <p className="mt-4 max-w-md text-[13.5px] leading-[1.95] text-mute">
              覆盖漏洞比对、许可证策略与启发式恶意特征预过滤，秒级返回可解释结果。
            </p>
            <ul className="mt-8 space-y-2.5 font-mono text-[11px] tracking-[0.16em] text-dim">
              <li>— 零依赖即可启动</li>
              <li>— --no-ai 纯规则模式</li>
              <li>— 每一项结果可追溯、可复核</li>
            </ul>
          </div>
          <div className="py-12 md:py-16 md:pl-16">
            <div className="font-mono text-[10.5px] tracking-[0.3em] text-accent-soft">
              AI — SEMANTIC
            </div>
            <h3 className="mt-5 font-serifcn text-2xl font-semibold">
              AI 语义研判
            </h3>
            <p className="mt-4 max-w-md text-[13.5px] leading-[1.95] text-mute">
              面向复杂、隐蔽的供应链攻击行为进行语义级深度研判，提升检出能力。
            </p>
            <ul className="mt-8 space-y-2.5 font-mono text-[11px] tracking-[0.16em] text-dim">
              <li>— 华为昇腾 NPU 硬件加速</li>
              <li>— 微调千问（Qwen）大模型</li>
              <li>— CANN 8.0+ · MindSpore / MindNLP</li>
            </ul>
          </div>
        </div>

        {/* 分层架构：纵向发丝线 + 节点（呼应 logo 母题） */}
        <div className="reveal mt-24">
          <div className="mb-10 font-mono text-[10.5px] tracking-[0.3em] text-dim">
            SYSTEM ARCHITECTURE — 分层架构
          </div>
          <ol className="relative ml-1 border-l border-line-strong">
            {layers.map((l) => (
              <li
                key={l.en}
                className="group relative border-b border-line py-7 pl-10 last:border-b-0"
              >
                <span
                  aria-hidden
                  className="absolute top-[2.55rem] -left-[4.5px] h-[8px] w-[8px] rounded-full bg-surface ring-1 ring-line-strong transition-all duration-500 group-hover:bg-accent-soft group-hover:ring-accent-soft/60"
                />
                <div className="row-item flex flex-wrap items-baseline gap-x-8 gap-y-1.5">
                  <h3 className="font-mono text-[11px] tracking-[0.24em] text-mute transition-colors duration-300 group-hover:text-fg">
                    {l.en}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-dim transition-colors duration-300 group-hover:text-mute">
                    {l.mods}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
