"use client";

export type TeamPerson = {
  name: string;
  photo: string;
  role: string;
  school: string;
  bio: string;
};

export default function TeamMember({ p, i }: { p: TeamPerson; i: number }) {
  // 浮窗位置：移动端在姓名上方弹出（左右对齐随 2 列网格）；
  // 电脑端固定向左展开，覆盖左侧简介段落区域
  const mobileAlign = i % 2 === 0 ? "left-0" : "right-0";
  return (
    <div className="group/p relative">
      <button
        type="button"
        aria-describedby={`person-tip-${i}`}
        className="cursor-help text-left"
      >
        <span className="name-hover block font-serifcn text-[22px] font-semibold leading-tight text-fg/90 transition-colors duration-300 group-hover/p:text-accent-soft">
          {p.name}
        </span>
        <span className="mt-1.5 block font-mono text-[10.5px] tracking-[0.14em] text-dim transition-colors duration-300 group-hover/p:text-mute">
          {p.role}
        </span>
      </button>
      <span
        role="tooltip"
        id={`person-tip-${i}`}
        className={`pointer-events-none absolute z-30 w-[440px] max-w-[min(440px,calc(100vw-40px))] rounded-2xl border border-line bg-bg p-7 opacity-0 shadow-[0_28px_90px_rgb(0_0_0/0.34)] transition-all duration-300 ease-out group-hover/p:pointer-events-auto group-hover/p:opacity-100 group-hover/p:translate-y-0 group-focus-within/p:pointer-events-auto group-focus-within/p:opacity-100 group-focus-within/p:translate-y-0 ${mobileAlign} translate-y-2.5 bottom-[calc(100%+16px)] md:bottom-auto md:left-auto md:right-[calc(100%+24px)] md:top-0`}
      >
        <span className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.photo}
            alt={`${p.name} 照片`}
            width={120}
            height={120}
            className="h-[120px] w-[120px] shrink-0 rounded-xl object-cover"
            onError={(e) => {
              // 偶发加载失败时自动重试一次
              const img = e.currentTarget;
              if (!img.dataset.retried) {
                img.dataset.retried = "1";
                img.src = `${p.photo}?r=1`;
              }
            }}
          />
          <span className="min-w-0">
            <span className="block font-serifcn text-[24px] font-semibold leading-tight text-fg">
              {p.name}
            </span>
            <span className="mt-2 block font-sans text-[12.5px] tracking-wide text-accent-soft">
              {p.role}
            </span>
            <span className="mt-1.5 block text-[13.5px] leading-snug text-mute">
              {p.school}
            </span>
          </span>
        </span>
        <span className="mt-5 block border-t border-line pt-4 text-[13.5px] leading-[1.9] text-mute">
          {p.bio}
        </span>
      </span>
    </div>
  );
}
