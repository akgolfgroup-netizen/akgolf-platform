import { ArrowRight } from "lucide-react";
import { WebButton } from "../web-button";
import { WebPhoto } from "../web-photo";
import { JUNIOR_SEASON_V3 } from "@/lib/website-constants";

export function JuniorSeasonSection() {
  const s = JUNIOR_SEASON_V3;
  if (s.programs.length === 0) return null;
  return (
    <section className="px-10 py-[100px]" style={{ background: "#fff" }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-15 text-center">
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
            className="mx-auto max-w-[22ch] text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {s.programs.map((p) => (
            <article
              key={p.title}
              className="grid overflow-hidden rounded-[24px] border bg-white"
              style={{
                gridTemplateRows: "240px 1fr",
                borderColor: "var(--akgolf-line-light, #e0e8e5)",
              }}
            >
              <WebPhoto
                ratio="16-9"
                variant={p.photoVariant}
                src={p.photoSrc}
                description={p.photoDescription}
                rounded={false}
              />
              <div className="flex flex-col p-8">
                <div
                  className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--akgolf-primary, #005840)",
                  }}
                >
                  {p.label}
                </div>
                <h3
                  className="mb-3 text-[26px] font-extrabold tracking-[-0.025em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                  }}
                >
                  {p.title}
                </h3>
                <p className="mb-5 text-[14.5px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                  {p.description}
                </p>
                <div
                  className="mb-5 grid grid-cols-2 gap-5 border-t py-5"
                  style={{
                    borderColor: "var(--akgolf-line-light, #e0e8e5)",
                  }}
                >
                  {p.stats.map((st) => (
                    <div key={st.l} className="flex flex-col gap-0.5">
                      <div
                        className="text-[18px] font-extrabold tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)] tabular-nums"
                        style={{
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {st.v}
                      </div>
                      <div
                        className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--akgolf-muted,#A5B2AD)]"
                        style={{
                          fontFamily:
                            "var(--font-jetbrains-mono), monospace",
                        }}
                      >
                        {st.l}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="self-start">
                  <WebButton href={p.ctaHref} variant="dark">
                    {p.ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </WebButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
