import { ArrowRight, Calendar } from "lucide-react";
import { WebButton } from "../web-button";
import { WebPhoto } from "../web-photo";
import { JUNIOR_HERO_V3 } from "@/lib/website-constants";

export function JuniorHeroSection() {
  const h = JUNIOR_HERO_V3;
  return (
    <section
      className="relative px-10 pb-20 pt-[130px]"
      style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-15 md:grid-cols-[1fr_1.1fr]">
        <div>
          <div
            className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--akgolf-accent, #D1F843)",
                boxShadow: "0 0 0 4px rgba(209,248,67,0.30)",
              }}
            />
            {h.eyebrow}
          </div>
          <h1
            className="mb-6 text-[clamp(46px,6.2vw,80px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {h.headingLead}{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              {h.headingItalic}
            </em>
            {h.headingTrail}
          </h1>
          <p className="max-w-[56ch] text-[18px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
            {h.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <WebButton href={h.ctaPrimaryHref} variant="dark" size="lg">
              {h.ctaPrimary}
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
            <WebButton href={h.ctaSecondaryHref} variant="line" size="lg">
              {h.ctaSecondary}
              <Calendar className="h-4 w-4" strokeWidth={2} />
            </WebButton>
          </div>

          <div
            className="mt-10 flex flex-wrap items-center gap-7 border-t pt-7"
            style={{
              borderColor: "var(--akgolf-line-light, #e0e8e5)",
            }}
          >
            {h.stats.map((s, i) => (
              <div key={s.l} className="flex items-center gap-7">
                <div className="flex flex-col gap-0.5">
                  <div
                    className="text-[28px] font-extrabold tracking-[-0.025em] text-[var(--akgolf-ink,#0A1F18)] tabular-nums"
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: "var(--akgolf-muted, #A5B2AD)",
                    }}
                  >
                    {s.l}
                  </div>
                </div>
                {i < h.stats.length - 1 ? (
                  <span
                    className="h-8 w-px"
                    style={{
                      background: "var(--akgolf-line-light, #e0e8e5)",
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <WebPhoto
            ratio="16-9"
            variant="lime"
            src={h.photoSrc}
            description={h.photoDescription}
          />
        </div>
      </div>
    </section>
  );
}
