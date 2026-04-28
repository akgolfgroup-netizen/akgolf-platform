import { UTVIKLING_STATS_V2 } from "@/lib/website-constants";

const INK = "var(--akgolf-ink, #0A1F18)";
const ACCENT = "var(--akgolf-accent, #D1F843)";

export function UtviklingStatsRow() {
  return (
    <section className="px-10">
      <div className="mx-auto max-w-[1280px]">
        <div
          className="my-15 grid grid-cols-1 gap-10 rounded-3xl px-15 py-[50px] text-white sm:grid-cols-2 lg:grid-cols-4 lg:gap-15"
          style={{ background: INK }}
        >
          {UTVIKLING_STATS_V2.map(s => (
            <div key={s.label}>
              <div
                className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: ACCENT,
                }}
              >
                {s.label}
              </div>
              <div
                className="text-[clamp(48px,6vw,64px)] font-extrabold leading-none tracking-[-0.04em] text-white"
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                }}
              >
                {s.value}
                {s.valueEm ? (
                  <em
                    className="font-medium not-italic"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontStyle: "italic",
                      color: ACCENT,
                    }}
                  >
                    {s.valueEm}
                  </em>
                ) : null}
              </div>
              <div
                className="mt-2.5 text-[13px] leading-[1.5] text-white/70"
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
