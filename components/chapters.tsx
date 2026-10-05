const monitus = {
  marker: "02·A",
  field: "PRODUCT / SECURITY",
  ghost: "01",
  desc: "AI 驱动的软件供应链安全检测工具。以华为昇腾 NPU 与微调千问（Qwen）大模型为智能分析底座，采用「规则 + AI 双引擎」架构，把安全检测嵌入软件开发、构建与发布的全流程。",
  langs: ["PYTHON", "JAVASCRIPT / TS", "JAVA", "GO", "RUST"],
  caps: [
    {
      t: "依赖漏洞检测",
      d: "解析项目依赖清单，比对 OSV / NVD 漏洞库与版本区间，定位已知 CVE 并给出修复版本建议。",
    },
    {
      t: "许可证合规",
      d: "按允许、警告、禁止三级策略审查依赖许可证，提前暴露版权与合规隐患。",
    },
    {
      t: "SBOM 生成",
      d: "输出 CycloneDX 1.5 与 SPDX 2.3 标准软件物料清单，支撑供应链透明度建设。",
    },
    {
      t: "AI 恶意代码检测",
      d: "启发式规则预过滤，叠加 AI 语义分析，识别后门、挖矿、窃密、混淆与反弹 Shell 等行为。",
    },
    {
      t: "安全态势评估",
      d: "从依赖健康度、维护者信任、更新频率、代码质量、安全实践与已知安全事件六个维度评分，输出 A—F 评级。",
    },
    {
      t: "多入口交付",
      d: "CLI 与 Web API 双入口，JSON / HTML / Markdown / SARIF 四种报告，按严重度控制流水线退出码。",
    },
  ],
};

const shixiaoping = {
  marker: "02·B",
  field: "PRODUCT / EDUCATION",
  ghost: "02",
  desc: "面向家教场景的微信小程序。围绕「记录课堂、形成点评、同步家长、持续跟进」构建产品闭环，把分散的教学信息整理为可持续更新的学员档案，不改变原有授课方式。",
  langs: ["家教老师", "学生", "家长", "家教工作室"],
  caps: [
    {
      t: "学员档案",
      d: "基础信息、学习目标、薄弱知识点与课程计划，帮助老师课前快速回顾。",
    },
    {
      t: "课堂记录",
      d: "出勤、授课内容、课堂表现与本次作业，课程信息连续沉淀、无需重新回忆。",
    },
    {
      t: "学习点评",
      d: "按学科与场景套用点评模板，形成个性化学习反馈，提升表达一致性。",
    },
    {
      t: "作业跟进",
      d: "记录作业内容与完成情况，形成布置、检查、复习的完整闭环。",
    },
    {
      t: "家长反馈",
      d: "把课堂记录整理为家长易读的课后反馈，说明学习内容、表现与后续安排。",
    },
    {
      t: "学习看板",
      d: "汇总课时、作业完成与薄弱点变化，让学习趋势与阶段目标进度可视。",
    },
  ],
};

function CapabilityRows({ caps }: { caps: { t: string; d: string }[] }) {
  return (
    <ul>
      {caps.map((c, i) => (
        <li
          key={c.t}
          className="row-item group border-t border-line py-6 last:border-b"
        >
          <div className="flex items-baseline gap-6">
            <span className="row-index font-mono text-[11px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="font-serifcn text-[17px] font-semibold tracking-wide text-fg">
                {c.t}
              </h4>
              <p className="mt-1.5 max-w-[54ch] text-[13.5px] leading-[1.9] text-mute">
                {c.d}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ChapterHeader({
  marker,
  field,
  ghost,
  title,
  subtitle,
}: {
  marker: string;
  field: string;
  ghost: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="reveal flex flex-wrap items-end justify-between gap-8 border-b border-line pb-10">
      <div>
        <div className="mb-8 font-mono text-[11px] tracking-[0.32em] text-dim">
          <span className="text-accent-soft">{marker}</span>
          <span className="mx-4 inline-block h-px w-10 translate-y-[-3px] bg-line-strong" />
          {field}
        </div>
        {title}
        <p className="mt-4 font-serifcn text-lg tracking-wide text-mute">
          {subtitle}
        </p>
      </div>
      <div
        aria-hidden
        className="text-outline hidden select-none font-serif text-[9rem] italic leading-none lg:block"
      >
        {ghost}
      </div>
    </div>
  );
}

export default function Chapters() {
  return (
    <section id="products" aria-label="产品线" className="relative">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        {/* ——— Monitus ——— */}
        <div className="pb-32 lg:pb-44">
          <ChapterHeader
            marker={monitus.marker}
            field={monitus.field}
            ghost={monitus.ghost}
            title={
              <h3 className="font-serif text-[clamp(3.4rem,8vw,7rem)] italic leading-[0.95] text-fg">
                Monitus
              </h3>
            }
            subtitle="软件供应链安全检测工具"
          />

          <ul className="reveal mt-7 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10.5px] tracking-[0.22em] text-dim">
            {["MIT LICENSE", "CLI — SCG", "WEB API", "CI/CD", "V0.1.0 ALPHA"].map(
              (t) => (
                <li key={t} className="border-l border-line-strong pl-3">
                  {t}
                </li>
              ),
            )}
          </ul>

          <div className="mt-16 flex flex-col gap-14 lg:mt-20 lg:flex-row lg:justify-between">
            <div className="reveal lg:sticky lg:top-28 lg:self-start lg:w-[30%]">
              <p className="text-[14.5px] leading-[2.05] text-mute">
                {monitus.desc}
              </p>
              <div className="mt-8 font-mono text-[10.5px] leading-[2.4] tracking-[0.22em] text-dim">
                {monitus.langs.map((l) => (
                  <div key={l} className="border-b border-line py-1">
                    {l}
                  </div>
                ))}
              </div>
              <a
                href="https://github.com/couvor/monituos"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost mt-10"
              >
                GITHUB <span aria-hidden>↗</span>
              </a>
            </div>
            <div className="reveal reveal-late lg:w-[62%]">
              <CapabilityRows caps={monitus.caps} />
            </div>
          </div>
        </div>

        {/* ——— 师小评（镜像布局）——— */}
        <div className="pb-32 lg:pb-44">
          <ChapterHeader
            marker={shixiaoping.marker}
            field={shixiaoping.field}
            ghost={shixiaoping.ghost}
            title={
              <h3 className="font-serifcn text-[clamp(3rem,7.4vw,6.5rem)] font-black leading-[1.05] text-fg">
                师小评
              </h3>
            }
            subtitle="家教辅助微信小程序"
          />

          <ul className="reveal mt-7 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10.5px] tracking-[0.22em] text-dim">
            {["WECHAT MINI PROGRAM", "轻量应用形态", "一对一 / 小班课", "教学服务规范化"].map(
              (t) => (
                <li key={t} className="border-l border-line-strong pl-3">
                  {t}
                </li>
              ),
            )}
          </ul>

          <div className="mt-16 flex flex-col gap-14 lg:mt-20 lg:flex-row lg:justify-between">
            <div className="reveal reveal-late lg:order-1 lg:w-[62%]">
              <CapabilityRows caps={shixiaoping.caps} />
            </div>
            <div className="reveal lg:order-2 lg:sticky lg:top-28 lg:self-start lg:w-[30%]">
              <p className="text-[14.5px] leading-[2.05] text-mute">
                {shixiaoping.desc}
              </p>
              <div className="mt-8 font-mono text-[10.5px] leading-[2.4] tracking-[0.22em] text-dim">
                <div className="mb-3 text-mute">使用角色 —</div>
                {shixiaoping.langs.map((l) => (
                  <div key={l} className="border-b border-line py-1">
                    {l}
                  </div>
                ))}
              </div>
              <p className="mt-10 font-mono text-[11px] tracking-[0.2em] text-dim">
                微信内搜索「<span className="text-accent-soft">师小评</span>」
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
