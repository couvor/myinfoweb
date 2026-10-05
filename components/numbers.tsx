const stats = [
  { n: "02", cn: "条产品线", en: "PRODUCT LINES" },
  { n: "05", cn: "种开发语言", en: "LANGUAGES" },
  { n: "06", cn: "维态势评估", en: "DIMENSIONS" },
  { n: "04", cn: "种报告格式", en: "REPORT FORMATS" },
];

export default function Numbers() {
  return (
    <section aria-label="关键数字" className="border-y border-line">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.en}
            className={`reveal border-line px-7 py-14 lg:px-12 lg:py-24 ${
              i % 2 === 1 ? "border-l" : ""
            } ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""}`}
          >
            <div className="font-serif text-[clamp(4.2rem,7.5vw,7.5rem)] leading-none text-fg">
              {s.n}
            </div>
            <div className="mt-5 text-[13.5px] tracking-wide text-mute">
              {s.cn}
            </div>
            <div className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-dim">
              {s.en}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
