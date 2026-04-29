import type { Metadata } from "next";
import { ArrowRight, Check, Target, Calendar, BarChart3, Users, Sparkles } from "lucide-react";
import { LandingShell } from "@/components/website-v2/LandingShell";
import { ACADEMY_HERO, FINAL_CTA } from "@/lib/website-constants";

export const metadata: Metadata = {
  title: "Academy",
  description: "Treningsabonnement for voksne golfspillere. 1-til-1 coaching med TrackMan, PlayersHQ og personlig treningsplan.",
};

export default function AcademyPage() {
  return (
    <LandingShell active="academy">
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
                  style={{
                    background: "var(--color-accent)",
                    boxShadow: "0 0 0 4px rgba(209,248,67,0.30)",
                  }}
                />
                {ACADEMY_HERO.eyebrow}
              </div>
              <h1
                className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-balance"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
              >
                Tren golf med{" "}
                <em
                  className="not-italic"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
                >
                  system
                </em>
                .
              </h1>
              <p
                className="max-w-[52ch] text-base leading-relaxed md:text-lg"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {ACADEMY_HERO.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href="/academy/abonnement"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
                  style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
                >
                  Se treningsabonnement
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </a>
                <a
                  href="/booking-v2"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors"
                  style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-line)" }}
                >
                  Book enkeltøkt
                  <Calendar className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl"
              style={{ background: "var(--color-primary-soft)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="h-20 w-20" style={{ color: "var(--color-primary)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Features */}
      <section className="px-4 py-16 md:px-8 md:py-24" style={{ background: "var(--color-card)" }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <div
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Inkludert i alle abonnement
            </div>
            <h2
              className="mb-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]"
              style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
            >
              Alt du trenger for å utvikle deg.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Target className="h-5 w-5" />, title: "TrackMan-analyse", description: "Data fra hver sesjon. Spin, launch, club path — alt logget i profilen din." },
              { icon: <BarChart3 className="h-5 w-5" />, title: "Personlig treningsplan", description: "Oppdatert etter hver sesjon med øvelser, fokusområder og progresjon." },
              { icon: <Users className="h-5 w-5" />, title: "1-til-1 coaching", description: "20 minutter med fullt fokus. Én ting per sesjon — ingen fyllminutter." },
              { icon: <Sparkles className="h-5 w-5" />, title: "PlayersHQ-app", description: "Se planen, logg økter, følg statistikk og få AI-analyse — alt i én app." },
              { icon: <Calendar className="h-5 w-5" />, title: "Selvbooking", description: "Book når det passer deg. Performance Pro = 14 dager frem, Performance = 7 dager." },
              { icon: <Check className="h-5 w-5" />, title: "Ingen binding", description: "Månedlig oppsigelse. Vi er overbevist om at du blir — fordi det fungerer." },
            ].map((f, i) => (
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
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "var(--color-primary-soft)" }}
                >
                  <span style={{ color: "var(--color-primary)" }}>{f.icon}</span>
                </div>
                <h3
                  className="mb-2 text-base font-semibold"
                  style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28" style={{ background: "var(--color-ink)" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[1280px] text-center">
          <h2
            className="mx-auto mb-5 max-w-[22ch] text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            {FINAL_CTA.heading.split(" ").slice(0, -2).join(" ")}{" "}
            <em
              className="not-italic"
              style={{ color: "var(--color-accent)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
            >
              {FINAL_CTA.heading.split(" ").slice(-2).join(" ")}
            </em>
          </h2>
          <p className="mx-auto mb-8 max-w-[50ch] text-base text-white/70">
            {FINAL_CTA.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="/academy/abonnement"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
              style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
            >
              {FINAL_CTA.ctaPrimary}
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </a>
            <a
              href="/landing/contact"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {FINAL_CTA.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
