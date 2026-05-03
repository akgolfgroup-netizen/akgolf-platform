import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Users, Calendar, Target } from "lucide-react";
import { LandingShell } from "@/components/website-v2/LandingShell";
import { JUNIOR_HERO, JUNIOR_PROGRAMS, JUNIOR_FAQ, JUNIOR_GFGK_V2, JUNIOR_WANG_V2 } from "@/lib/website-constants";

export const metadata: Metadata = {
  title: "Junior Academy",
  description: "Treningsprogram for unge spillere fra første turnering til elite-nivå. Gruppetrening, individuell oppfølging og sesongplanlegging.",
};

export default function JuniorAcademyPage() {
  return (
    <LandingShell active="junior">
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <div
                className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-accent)", boxShadow: "0 0 0 4px rgba(209,248,67,0.30)" }}
                />
                {JUNIOR_HERO.eyebrow}
              </div>
              <h1
                className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-balance"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
              >
                Neste generasjon golfere starter{" "}
                <em
                  className="not-italic"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
                >
                  her
                </em>
                .
              </h1>
              <p className="max-w-[52ch] text-base leading-relaxed md:text-lg" style={{ color: "var(--color-ink-muted)" }}>
                {JUNIOR_HERO.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href="/landing/contact"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
                  style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
                >
                  Ta kontakt
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </a>
              </div>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl"
              style={{ background: "var(--color-primary-soft)" }}
            >
              <Image
                src="/images/hero/junior.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="px-4 py-16 md:px-8 md:py-24" style={{ background: "var(--color-card)" }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <div
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Treningsnivåer
            </div>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]"
              style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
            >
              Fra første sving til elite.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {JUNIOR_PROGRAMS.map((prog, i) => (
              <div
                key={i}
                className="rounded-2xl border p-6 transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-line)",
                  boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
                }}
              >
                <div
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {prog.level}
                </div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
                >
                  {prog.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                  {prog.description}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {prog.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-ink-muted)" }}>
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-primary)" }} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <div
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Samarbeidspartnere
            </div>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]"
              style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
            >
              I tett samarbeid med klubb og skole.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[JUNIOR_GFGK_V2, JUNIOR_WANG_V2].map((partner) => (
              <div
                key={partner.heading}
                className="rounded-2xl border p-6"
                style={{
                  background: "var(--color-card)",
                  borderColor: "var(--color-line)",
                  boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
                }}
              >
                <div
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {partner.label}
                </div>
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
                >
                  {partner.heading}
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--color-ink-muted)" }}>
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[800px]">
          <h2
            className="mb-8 text-center text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.025em]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            Ofte stilte spørsmål
          </h2>
          <div className="flex flex-col gap-4">
            {JUNIOR_FAQ.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--color-card)",
                  borderColor: "var(--color-line)",
                  boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
                }}
              >
                <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}>
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
