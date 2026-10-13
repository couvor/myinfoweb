import { team } from "@/data/team";
import TeamMember from "@/components/team-member";

const meta = [{ k: "布局", v: "软件供应链安全 × 教育辅助" }];

export default function Narrative() {
  return (
    <section id="about" aria-label="关于明旸信息" className="relative">
      <div className="mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-44">
        <div className="reveal mb-16 flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] text-dim">
          <span className="text-accent-soft">01</span>
          <span className="h-px w-12 bg-line-strong" />
          ABOUT
        </div>

        <div className="grid gap-16 lg:grid-cols-12">
          <p className="reveal font-serifcn text-[clamp(1.65rem,3vw,2.65rem)] font-semibold leading-[1.75] lg:col-span-7">
            明旸信息是一家立足西安的人工智能软件公司。我们相信，可靠的技术应当回应真实的场景——为此，我们围绕
            <span className="text-accent-soft">软件供应链安全</span>与
            <span className="text-accent-soft">教育辅助</span>
            两条产品线持续研发，让每一个团队都获得可信的安全检测，让每一次教学都被认真记录。
          </p>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="reveal reveal-late">
              <div className="font-mono text-[10.5px] tracking-[0.3em] text-dim">
                创始团队
              </div>
              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-3">
                {team.map((p, i) => (
                  <TeamMember key={p.name} p={p} i={i} />
                ))}
              </div>

              <dl className="mt-10">
                {meta.map((m) => (
                  <div
                    key={m.k}
                    className="row-item border-t border-line py-7 last:border-b"
                  >
                    <dt className="font-mono text-[11px] tracking-[0.3em] text-dim">
                      {m.k}
                    </dt>
                    <dd className="mt-3 font-serifcn text-[20px] font-semibold leading-relaxed text-fg/95">
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <p className="reveal mt-24 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.26em] text-mute">
          <span className="text-dim">FOCUS —</span>
          <span>人工智能</span>
          <span className="text-dim">/</span>
          <span>软件开发</span>
          <span className="text-dim">/</span>
          <span>数据服务</span>
          <span className="text-dim">/</span>
          <span>行业解决方案</span>
        </p>
      </div>
    </section>
  );
}
