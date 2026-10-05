import TeamMember, { type TeamPerson } from "@/components/team-member";

const meta = [{ k: "布局", v: "软件供应链安全 × 教育辅助" }];

// 团队成员：姓名 / 头像路径（public/team/拼音.png）/ 职务 / 院校 / 简介
// ※ bio 与照片均为占位内容——把真实照片按同名放入 public/team/ 覆盖即可，bio 直接改引号内文字
const team: TeamPerson[] = [
  {
    name: "周高凡",
    photo: "/team/zhou-gaofan.png",
    role: "创始人 · 法人及总经理",
    school: "华侨大学土木工程学院",
    bio: "公司创始人，负责公司整体战略与产品方向。", // 占位简介，待替换
  },
  {
    name: "羿德钰",
    photo: "/team/yi-deyu.png",
    role: "财务",
    school: "西安邮电大学计算机学院",
    bio: "负责公司财务管理与运营支持。", // 占位简介，待替换
  },
  {
    name: "张明旸",
    photo: "/team/zhang-mingyang.png",
    role: "研发人员",
    school: "西北工业大学动力与能源学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
  },
  {
    name: "刘浩",
    photo: "/team/liu-hao.png",
    role: "研发人员",
    school: "西安电子科技大学计算机学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
  },
  {
    name: "谈宇森",
    photo: "/team/tan-yusen.png",
    role: "研发人员",
    school: "西安理工大学水利水电学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
  },
  {
    name: "欧阳兆秦",
    photo: "/team/ouyang-zhaoqin.png",
    role: "研发人员",
    school: "浙江大学信息与电子工程学院",
    bio: "负责核心产品研发工作。", // 占位简介，待替换
  },
];

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
