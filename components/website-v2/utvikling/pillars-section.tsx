import { UTVIKLING_PILLARS_V2 } from "@/lib/website-constants";

const p = UTVIKLING_PILLARS_V2;

const INK = "var(--akgolf-ink, #0A1F18)";
const PRIMARY = "var(--akgolf-primary, #005840)";
const TEXT = "var(--akgolf-text, #324D45)";

const FRAUNCES: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontStyle: "italic",
  color: PRIMARY,
};

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

export function UtviklingPillarsSection() {
  return (
    <section className="px-10 py-25">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-end gap-15 md:grid-cols-2">
          <div>
            <div
              className="mb-[22px] inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ ...MONO, color: PRIMARY }}
            >
              <span
                className="block h-px w-[34px]"
                style={{ background: PRIMARY }}
              />
              {p.label}
            </div>
            <h2
              className="text-[clamp(34px,4.6vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: INK,
              }}
            >
              {p.headingStart}{" "}
              <em className="font-medium not-italic" style={FRAUNCES}>
                {p.headingEm}
              </em>
            </h2>
          </div>
          <p
            className="max-w-[50ch] text-[16px] leading-[1.65]"
            style={{ color: TEXT }}
          >
            {p.intro}
          </p>
        </div>

        <div className="mt-[50px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {p.items.map(item => (
            <article
              key={item.num}
              className="rounded-[18px] bg-white px-[26px] py-7"
              style={{ border: "1px solid rgba(10,31,24,0.08)" }}
            >
              <div
                className="text-[11px] font-bold tracking-[0.14em]"
                style={{ ...MONO, color: PRIMARY }}
              >
                {item.num}
              </div>
              <h3
                className="mb-3 mt-2 text-[24px] font-extrabold tracking-[-0.025em]"
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  color: INK,
                }}
              >
                {item.titleStart}{" "}
                <em className="font-medium not-italic" style={FRAUNCES}>
                  {item.titleEm}
                </em>
              </h3>
              <p
                className="m-0 text-[13.5px] leading-[1.6]"
                style={{ color: TEXT }}
              >
                {item.description}
              </p>
              <ul className="m-0 mt-3.5 list-none p-0">
                {item.bullets.map((b, i) => (
                  <li
                    key={b}
                    className="relative py-[7px] pl-[18px] text-[12.5px]"
                    style={{
                      color: TEXT,
                      borderTop:
                        i === 0
                          ? "none"
                          : "1px solid rgba(10,31,24,0.06)",
                    }}
                  >
                    <span
                      className="absolute left-0 top-1.5 text-[14px] font-bold"
                      style={{ color: PRIMARY }}
                    >
                      ›
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
