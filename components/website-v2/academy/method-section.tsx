import { ArrowRight } from "lucide-react";
import { WebButton } from "../web-button";
import { ACADEMY_METHOD_V3 } from "@/lib/website-constants";

const BAR_STYLES: Record<
  string,
  { width: string; gradient: string; ink: boolean }
> = {
  L5: {
    width: "30%",
    gradient: "linear-gradient(90deg, #0A1F18, #1a3a2a)",
    ink: false,
  },
  L4: {
    width: "50%",
    gradient: "linear-gradient(90deg, #005840, #007454)",
    ink: false,
  },
  L3: {
    width: "70%",
    gradient: "linear-gradient(90deg, #007454, #2c8a6d)",
    ink: false,
  },
  L2: {
    width: "90%",
    gradient: "linear-gradient(90deg, #2c8a6d, #5fa88b)",
    ink: false,
  },
  L1: {
    width: "100%",
    gradient: "linear-gradient(90deg, #D1F843, #b8d93a)",
    ink: true,
  },
};

export function AcademyMethodSection() {
  const s = ACADEMY_METHOD_V3;
  return (
    <section className="px-10 py-[100px]" style={{ background: "#fff" }}>
      <div className="mx-auto grid max-w-[1280px] items-center gap-20 md:grid-cols-2">
        <div>
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            {s.eyebrow}
          </div>
          <h2
            className="mb-6 text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {s.headingLead}{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              {s.headingItalic}
            </em>
            {s.headingTrail}
          </h2>
          <p className="max-w-[52ch] text-[18px] leading-[1.55] text-[var(--akgolf-text,#324D45)] text-pretty">
            {s.description}
          </p>
          <div className="mt-8">
            <WebButton href={s.ctaHref} variant="dark">
              {s.ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </WebButton>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {s.levels.map((lvl) => {
            const style = BAR_STYLES[lvl.num] ?? BAR_STYLES.L1;
            return (
              <div
                key={lvl.num}
                className="grid items-center gap-[18px]"
                style={{ gridTemplateColumns: "60px 1fr" }}
              >
                <div
                  className="text-right text-[14px] font-bold tracking-[0.05em] text-[var(--akgolf-muted,#A5B2AD)]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  {lvl.num}
                </div>
                <div
                  className="flex h-16 items-center rounded-lg px-[22px] text-[16px] font-bold"
                  style={{
                    width: style.width,
                    background: style.gradient,
                    color: style.ink ? "var(--akgolf-ink, #0A1F18)" : "#fff",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {lvl.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
