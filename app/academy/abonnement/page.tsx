import type { Metadata } from "next";
import { ArrowRight, Check, Crown, TrendingUp, Users, Sparkles } from "lucide-react";
import { LandingShell } from "@/components/website-v2/LandingShell";
import { COACHING_PACKAGES } from "@/lib/website-constants";

export const metadata: Metadata = {
  title: "Academy-medlemskap",
  description: "Tre veier inn i AK Golf Academy. Performance med Markus fra 1 000 kr/mnd, Performance med Anders fra 1 200 kr/mnd, Performance Pro fra 2 200 kr/mnd.",
};

export default function AcademyAbonnementPage() {
  return (
    <LandingShell active="academy">
      {/* Hero */}
      <section className="px-4 pb-12 pt-28 text-center md:px-8 md:pb-16 md:pt-36">
        <div className="mx-auto max-w-[960px]">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Priser
          </div>
          <h1
            className="mx-auto mb-5 max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-balance"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            Klare priser.{" "}
            <em
              className="not-italic"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
            >
              Ingen overraskelser.
            </em>
          </h1>
          <p className="mx-auto max-w-[56ch] text-base leading-relaxed md:text-lg" style={{ color: "var(--color-ink-muted)" }}>
            Velg abonnement for fast utvikling, eller book Flex/On-Course engang når du trenger det. PlayerHQ-app er inkludert i alle abonnement.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="px-4 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COACHING_PACKAGES.map((pkg) => {
              const isHighlighted = pkg.highlighted;
              const Icon = pkg.name.includes("Pro") ? Crown : pkg.coach === "Anders" ? TrendingUp : Users;
              return (
                <article
                  key={`${pkg.name}-${pkg.coach}`}
                  className={`relative flex flex-col rounded-3xl border p-6 transition-all hover:-translate-y-1 ${
                    isHighlighted ? "-translate-y-2" : ""
                  }`}
                  style={{
                    background: isHighlighted ? "var(--color-ink)" : "var(--color-card)",
                    borderColor: isHighlighted ? "var(--color-ink)" : "var(--color-line)",
                    boxShadow: isHighlighted
                      ? "0 24px 60px rgba(10,31,24,0.15)"
                      : "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
                  }}
                >
                  {pkg.badge && (
                    <span
                      className="absolute -top-2.5 left-6 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        background: "var(--color-accent)",
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-jetbrains-mono)",
                      }}
                    >
                      {pkg.badge}
                    </span>
                  )}
                  <div
                    className="mb-4 grid h-10 w-10 place-items-center rounded-xl"
                    style={{
                      background: isHighlighted ? "rgba(209,248,67,0.18)" : "var(--color-primary-soft)",
                      color: isHighlighted ? "var(--color-accent)" : "var(--color-primary)",
                    }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      color: isHighlighted ? "rgba(255,255,255,0.5)" : "var(--color-ink-subtle)",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {pkg.coach}
                  </div>
                  <h3
                    className="mt-1 text-xl font-bold tracking-[-0.025em]"
                    style={{ color: isHighlighted ? "var(--color-card)" : "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
                  >
                    {pkg.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span
                      className="text-3xl font-bold tracking-[-0.035em] tabular-nums"
                      style={{ color: isHighlighted ? "var(--color-card)" : "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
                    >
                      {pkg.price}
                    </span>
                    <span className="text-sm font-medium" style={{ color: isHighlighted ? "rgba(255,255,255,0.65)" : "var(--color-ink-subtle)" }}>
                      {pkg.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: isHighlighted ? "rgba(255,255,255,0.75)" : "var(--color-ink-muted)" }}>
                    {pkg.description}
                  </p>
                  <ul className="mb-6 mt-4 flex flex-col gap-2">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                        style={{ color: isHighlighted ? "rgba(255,255,255,0.85)" : "var(--color-ink-muted)" }}
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0"
                          style={{ color: isHighlighted ? "var(--color-accent)" : "var(--color-primary)" }}
                          strokeWidth={2.5}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/booking-v2"
                    className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all hover:-translate-y-px ${
                      isHighlighted
                        ? "hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
                        : ""
                    }`}
                    style={{
                      background: isHighlighted ? "var(--color-accent)" : "var(--color-ink)",
                      color: isHighlighted ? "var(--color-ink)" : "var(--color-card)",
                    }}
                  >
                    {pkg.coach === "Anders" && pkg.name.includes("Pro") ? "Velg Performance Pro" : "Bli medlem"}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
