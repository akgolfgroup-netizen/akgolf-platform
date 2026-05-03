import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Code, Building2 } from "lucide-react";
import { LandingShell } from "@/components/website-v2/LandingShell";
import { UTVIKLING_HERO, SOFTWARE_FEATURES, KLUBB_FEATURES } from "@/lib/website-constants";

export const metadata: Metadata = {
  title: "Utvikling & Teknologi",
  description: "PlayersHQ, treningsverktøy og sportslig rådgiving for golfklubber og trenere.",
};

export default function UtviklingPage() {
  return (
    <LandingShell>
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
                {UTVIKLING_HERO.eyebrow}
              </div>
              <h1
                className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-balance"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
              >
                Teknologi og rådgiving for golfens{" "}
                <em
                  className="not-italic"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
                >
                  fremtid
                </em>
                .
              </h1>
              <p className="max-w-[52ch] text-base leading-relaxed md:text-lg" style={{ color: "var(--color-ink-muted)" }}>
                {UTVIKLING_HERO.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href="/landing/contact"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
                  style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
                >
                  Book en samtale
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </a>
              </div>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl"
              style={{ background: "var(--color-primary-soft)" }}
            >
              <Image
                src="/images/hero/utvikling.jpg"
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

      {/* Software */}
      <section className="px-4 py-16 md:px-8 md:py-24" style={{ background: "var(--color-card)" }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <div
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Software
            </div>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]"
              style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
            >
              Digitale treningsverktøy.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SOFTWARE_FEATURES.map((f, i) => (
              <FeatureCard key={i} icon={<Code className="h-5 w-5" />} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Klubb */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <div
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Klubbutvikling
            </div>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]"
              style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
            >
              Sportslig rådgiving.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {KLUBB_FEATURES.map((f, i) => (
              <FeatureCard key={i} icon={<Building2 className="h-5 w-5" />} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28" style={{ background: "var(--color-ink)" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[1280px] text-center">
          <h2
            className="mx-auto mb-5 max-w-[22ch] text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Interessert?{" "}
            <em className="not-italic" style={{ color: "var(--color-accent)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}>
              Book en samtale
            </em>
            .
          </h2>
          <p className="mx-auto mb-8 max-w-[50ch] text-base text-white/70">
            Vi starter alltid med en uforpliktende samtale for å forstå deres behov og ambisjoner.
          </p>
          <a
            href="/landing/contact"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
            style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
          >
            Book en samtale
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </a>
        </div>
      </section>
    </LandingShell>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
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
        <span style={{ color: "var(--color-primary)" }}>{icon}</span>
      </div>
      <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
        {description}
      </p>
    </div>
  );
}
