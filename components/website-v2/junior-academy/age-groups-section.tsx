import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { WebPhoto } from "../web-photo";
import { JUNIOR_AGE_GROUPS_V3 } from "@/lib/website-constants";

export function JuniorAgeGroupsSection() {
  const s = JUNIOR_AGE_GROUPS_V3;
  return (
    <section
      id="aldersgrupper"
      className="px-10 py-[100px]"
      style={{ background: "#fff" }}
    >
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

        <div className="grid gap-6 md:grid-cols-3">
          {s.groups.map((g) => (
            <article
              key={g.name}
              className="flex flex-col overflow-hidden rounded-[24px] border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,31,24,0.10)]"
              style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
            >
              <div className="relative">
                <WebPhoto
                  ratio="3-2"
                  variant={g.photoVariant}
                  src={g.photoSrc}
                  description={g.photoDescription}
                  rounded={false}
                />
                <span
                  className="absolute left-4 top-4 z-[3] rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  {g.ageRange}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3
                  className="mb-1.5 text-[24px] font-extrabold tracking-[-0.025em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                  }}
                >
                  {g.name}
                </h3>
                <div className="mb-4 text-[13px] text-[var(--akgolf-muted,#A5B2AD)]">
                  {g.tagline}
                </div>
                <p className="mb-5 text-[14px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                  {g.description}
                </p>
                <ul className="mb-6 flex flex-1 flex-col gap-2">
                  {g.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[13px] text-[var(--akgolf-text,#324D45)]"
                    >
                      <Check
                        className="mt-1 h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "var(--akgolf-primary, #005840)" }}
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div
                  className="mb-5 flex gap-5 border-y py-4"
                  style={{
                    borderColor: "var(--akgolf-line-light, #e0e8e5)",
                  }}
                >
                  <Stat v={g.groupSize} l={g.groupSizeLabel} />
                  <Stat v={g.price} l={g.priceLabel} />
                </div>
                <Link
                  href={g.ctaHref}
                  className="mt-auto inline-flex items-center gap-2 text-[14px] font-bold transition-all hover:gap-3"
                  style={{ color: "var(--akgolf-primary, #005840)" }}
                >
                  {g.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="text-[18px] font-extrabold tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)] tabular-nums"
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {v}
      </div>
      <div
        className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--akgolf-muted,#A5B2AD)]"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        {l}
      </div>
    </div>
  );
}
