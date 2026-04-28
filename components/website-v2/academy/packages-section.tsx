import { ArrowRight, Check, Target, TrendingUp, Users } from "lucide-react";
import type { ComponentType } from "react";
import { ACADEMY_PACKAGES_V3 } from "@/lib/website-constants";

const ICON_MAP = {
  target: Target,
  trendingUp: TrendingUp,
  users: Users,
} as const satisfies Record<string, ComponentType<{ className?: string; strokeWidth?: number }>>;

type IconKey = keyof typeof ICON_MAP;

export function AcademyPackagesSection() {
  const s = ACADEMY_PACKAGES_V3;
  return (
    <section id="pakker" className="px-10 py-[100px]" style={{ background: "#fff" }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-15 grid items-end gap-10 md:grid-cols-[1fr_auto]">
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
              className="text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
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
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
          {s.packages.map((p) => {
            const Icon = ICON_MAP[p.icon as IconKey];
            const featured = p.featured;
            return (
              <article
                key={p.name}
                className={`relative flex flex-col rounded-[24px] border px-8 pb-8 pt-9 transition-all duration-200 ${
                  featured
                    ? "md:-translate-y-2 hover:md:-translate-y-3"
                    : "hover:-translate-y-1"
                }`}
                style={{
                  background: featured ? "var(--akgolf-ink, #0A1F18)" : "#fff",
                  color: featured ? "#fff" : "inherit",
                  borderColor: featured
                    ? "var(--akgolf-ink, #0A1F18)"
                    : "var(--akgolf-line-light, #e0e8e5)",
                  boxShadow: featured
                    ? "0 24px 60px rgba(10,31,24,0.18)"
                    : undefined,
                }}
              >
                {featured && "badge" in p && p.badge ? (
                  <span
                    className="absolute -top-3 left-8 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      background: "var(--akgolf-accent, #D1F843)",
                      color: "var(--akgolf-ink, #0A1F18)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    {p.badge}
                  </span>
                ) : null}

                <div
                  className="mb-6 grid h-14 w-14 place-items-center rounded-2xl"
                  style={{
                    background: featured
                      ? "rgba(209,248,67,0.18)"
                      : "rgba(0,88,64,0.10)",
                    color: featured
                      ? "var(--akgolf-accent, #D1F843)"
                      : "var(--akgolf-primary, #005840)",
                  }}
                >
                  <Icon className="h-[26px] w-[26px]" strokeWidth={1.8} />
                </div>

                <div
                  className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: featured
                      ? "var(--akgolf-accent, #D1F843)"
                      : "var(--akgolf-primary, #005840)",
                  }}
                >
                  {p.tier}
                </div>
                <h3
                  className="mb-1.5 text-[32px] font-extrabold tracking-[-0.030em]"
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: featured ? "#fff" : "var(--akgolf-ink, #0A1F18)",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  className="mb-6 text-[14px]"
                  style={{
                    color: featured
                      ? "rgba(255,255,255,0.65)"
                      : "var(--akgolf-text, #324D45)",
                  }}
                >
                  {p.tagline}
                </p>

                <div
                  className="mb-2 flex items-baseline gap-1.5 border-t pt-6"
                  style={{
                    borderColor: featured
                      ? "rgba(255,255,255,0.10)"
                      : "var(--akgolf-line-light, #e0e8e5)",
                  }}
                >
                  <span
                    className="text-[44px] font-extrabold tracking-[-0.035em] tabular-nums"
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontVariantNumeric: "tabular-nums",
                      color: featured ? "#fff" : "var(--akgolf-ink, #0A1F18)",
                    }}
                  >
                    {p.price}
                  </span>
                  <span
                    className="text-[11px] font-semibold tracking-[0.10em]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: featured
                        ? "rgba(255,255,255,0.55)"
                        : "var(--akgolf-muted, #A5B2AD)",
                    }}
                  >
                    {p.priceUnit}
                  </span>
                </div>
                <div
                  className="mb-7 text-[13px]"
                  style={{
                    color: featured
                      ? "rgba(255,255,255,0.55)"
                      : "var(--akgolf-muted, #A5B2AD)",
                  }}
                >
                  {p.sub}
                </div>

                <ul className="mb-8 flex flex-1 flex-col gap-3">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[14px] leading-[1.5]"
                      style={{
                        color: featured
                          ? "rgba(255,255,255,0.85)"
                          : "var(--akgolf-text, #324D45)",
                      }}
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0"
                        style={{
                          color: featured
                            ? "var(--akgolf-accent, #D1F843)"
                            : "var(--akgolf-primary, #005840)",
                        }}
                        strokeWidth={2.4}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={p.ctaHref}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold transition-all duration-200 hover:-translate-y-px ${
                    featured
                      ? "hover:shadow-[0_12px_28px_rgba(209,248,67,0.40)]"
                      : "hover:bg-[#112e22]"
                  }`}
                  style={{
                    background: featured
                      ? "var(--akgolf-accent, #D1F843)"
                      : "var(--akgolf-ink, #0A1F18)",
                    color: featured ? "var(--akgolf-ink, #0A1F18)" : "#fff",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                  }}
                >
                  {p.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
