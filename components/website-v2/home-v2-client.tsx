"use client";

import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Calendar,
  Check,
  Layers,
  Play,
  Target,
} from "lucide-react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { WebPhoto } from "./web-photo";
import { WebButton } from "./web-button";
import { HERO } from "@/lib/website-constants";

const SERVICES = [
  {
    pill: "VOKSEN",
    title: "Academy",
    description:
      "Strukturert utvikling med personlig coach, månedlig SG-måling og individuell treningsplan i appen.",
    bullets: [
      "1-til-1 lessons med personlig coach",
      "Månedlig HCP-progresjon",
      "Trackman + videoanalyse",
      "Tilgang til PlayerHQ-app",
    ],
    href: "/academy?v=2",
    cta: "Se Academy-pakker",
    photoVariant: "default" as const,
    photoDesc: "Voksen spiller i swing-posisjon på range, varm overcast lighting",
    photoSrc: "/images/sections/trackman.jpg",
  },
  {
    pill: "6–17 ÅR",
    title: "Junior Academy",
    description:
      "Aldersinndelte grupper, lekbasert metodikk og foreldreoppfølging gjennom dedikert app.",
    bullets: [
      "Tre nivåer: 6–9, 10–13, 14–17",
      "Egne juniortrenere",
      "Foreldreapp med fremgang",
      "Sommerleir + turneringer",
    ],
    href: "/junior-academy?v=2",
    cta: "Se Junior-program",
    photoVariant: "lime" as const,
    photoDesc: "Gruppe juniorer 10–13 år smiler på range, foreldrevennlig stemning",
    photoSrc: "/images/sections/instruksjon.jpg",
  },
  {
    pill: "FLEKSIBELT",
    title: "Booking",
    description:
      "Individual lesson, banecoaching, eller duo-time uten medlemskap — book direkte med din valgte coach.",
    bullets: [
      "Anders, Markus eller Flex",
      "20/50/90 min eller duo",
      "9 hulls banecoaching",
      "Ingen medlemskap nødvendig",
    ],
    href: "/booking-v2",
    cta: "Se priser",
    photoVariant: "warm" as const,
    photoDesc: "Banecoaching på fairway, coach og spiller i samtale, golden hour",
    photoSrc: "/images/sections/banecoaching.jpg",
  },
];

const WHY_POINTS = [
  {
    Icon: Target,
    title: "SG-data per økt",
    body: "Trackman på range, ShotScope på bane. Du ser nøyaktig hvor du tjener og taper slag.",
  },
  {
    Icon: Layers,
    title: "AK-pyramiden",
    body: "Fem nivåer: fysikk, teknikk, slagvalg, spill og turnering. Personlig fordeling per spiller.",
  },
  {
    Icon: Bot,
    title: "AI som coach-assistent",
    body: "PlayerHQ foreslår økter, oppdager risiko-mønstre, og prognostiserer HCP-utvikling 12 måneder fram.",
  },
];

export function HomeV2Client() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav active="home" />

      {/* MAIN content — anchor for skip-link i app/layout.tsx */}
      <main id="main-content">

      {/* HERO — next/image for optimalisert LCP (var CSS background-image, 407 KB) */}
      <section className="relative flex min-h-screen items-end overflow-hidden pb-20">
        <Image
          src="/images/hero/forside.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={78}
          className="object-cover object-[center_30%] -z-10"
        />
        {/* Mobil: tyngre overlay slik at hvit hero-tekst forblir lesbar pa lyse partier av bildet */}
        <div
          className="absolute inset-0 -z-[5] pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,31,24,0.65) 0%, rgba(10,31,24,0.55) 30%, rgba(10,31,24,0.65) 60%, rgba(10,31,24,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-[5] pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,31,24,0.45) 0%, rgba(10,31,24,0.20) 30%, rgba(10,31,24,0.30) 60%, rgba(10,31,24,0.85) 100%)",
          }}
        />
        <div className="relative z-[2] mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-end gap-15 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div
                className="mb-[18px] inline-flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.18em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--akgolf-accent, #D1F843)",
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "var(--akgolf-accent, #D1F843)",
                    boxShadow: "0 0 0 4px rgba(209,248,67,0.20)",
                  }}
                />
                {HERO.eyebrow}
              </div>
              <h1
                className="mb-7 text-[clamp(56px,8vw,104px)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white text-balance"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
              >
                {HERO.heading.replace(HERO.greenWord, "")}
                <em
                  className="font-medium not-italic"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontStyle: "italic",
                    color: "var(--akgolf-accent, #D1F843)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {HERO.greenWord}
                </em>
              </h1>
              <p
                className="mb-7 max-w-[60ch] text-[19px] leading-[1.55] font-normal text-white md:text-white/[0.92]"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}
              >
                {HERO.subheading}
              </p>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md md:border-white/20 md:bg-white/10 md:text-white/85">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "var(--akgolf-accent, #D1F843)",
                    boxShadow: "0 0 0 3px rgba(209,248,67,0.20)",
                  }}
                />
                {HERO.statusBadge}
              </div>
              <div className="flex flex-wrap items-center gap-3.5">
                <WebButton href="/booking-v2" variant="primary" size="lg">
                  {HERO.ctaPrimary}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </WebButton>
                <WebButton href="#services" variant="ghost" size="lg">
                  {HERO.ctaSecondary}
                  <Play className="h-4 w-4" strokeWidth={2.4} />
                </WebButton>
              </div>
            </div>

          </div>
        </div>

        <div
          className="absolute bottom-[30px] left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.20em] text-white/55"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          SCROLL
          <div
            className="h-[30px] w-px"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.5))",
            }}
          />
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="px-4 sm:px-6 lg:px-10 py-[80px_40px] md:py-[120px_80px]"
        style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-15 grid items-end gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <div
                className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                Tre veier inn
              </div>
              <h2
                className="text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                Velg veien som{" "}
                <em
                  className="font-medium not-italic"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontStyle: "italic",
                    color: "var(--akgolf-primary, #005840)",
                  }}
                >
                  passer deg
                </em>
                .
              </h2>
            </div>
            <WebButton href="/pricing?v=2" variant="line">
              Sammenlign alt
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group flex flex-col overflow-hidden rounded-[24px] border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(10,31,24,0.04),0_24px_60px_rgba(10,31,24,0.10)]"
                style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
              >
                <WebPhoto
                  variant={s.photoVariant}
                  ratio="3-2"
                  src={s.photoSrc}
                  description={s.photoDesc}
                  rounded={false}
                  tag={`[Foto · ${s.pill}]`}
                >
                  <span
                    className="absolute left-[18px] top-[18px] z-[3] rounded-full bg-white/95 px-2.5 py-[5px] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-ink,#0A1F18)]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {s.pill}
                  </span>
                </WebPhoto>
                <div className="flex flex-1 flex-col p-7">
                  <h3
                    className="mb-2.5 text-[26px] font-extrabold tracking-[-0.025em] text-[var(--akgolf-ink,#0A1F18)]"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mb-5 text-[15px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                    {s.description}
                  </p>
                  <ul className="mb-6 flex flex-1 flex-col gap-2 text-sm text-[var(--akgolf-text,#324D45)]">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <Check
                          className="mt-1 h-3.5 w-3.5 flex-shrink-0"
                          style={{ color: "var(--akgolf-primary, #005840)" }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={s.href}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                    style={{ color: "var(--akgolf-primary, #005840)" }}
                  >
                    {s.cta}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-white px-4 sm:px-6 lg:px-10 py-[60px] md:py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid items-center gap-20 md:grid-cols-2">
            <WebPhoto
              ratio="4-3"
              src="/images/branding/ak-golf-academy-anders.jpg"
              description="Nærbilde av Anders som studerer Trackman-skjerm sammen med spiller, range bakgrunn"
              tag="[Foto]"
            >
              <div
                className="absolute bottom-[22px] left-[22px] rounded-[16px] px-[22px] py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-ink,#0A1F18)]"
                style={{
                  background: "var(--akgolf-accent, #D1F843)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                SISTE 12 MND
                <strong
                  className="mt-1 block text-[32px] font-extrabold tracking-[-0.03em]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  −3.2 HCP
                </strong>
              </div>
            </WebPhoto>
            <div>
              <div
                className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                Hvorfor AK Golf
              </div>
              <h2
                className="mb-4 text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                Coaching som{" "}
                <em
                  className="font-medium not-italic"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontStyle: "italic",
                    color: "var(--akgolf-primary, #005840)",
                  }}
                >
                  faktisk måler
                </em>{" "}
                at du blir bedre.
              </h2>
              <p className="mb-7 max-w-[60ch] text-[19px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                Vi bygger en sammenhengende digital reise rundt hver spiller —
                fra første intro til fast handicap-utvikling. Ikke flere
                sporadiske lessons uten retning.
              </p>
              <div className="mt-10 flex flex-col gap-6">
                {WHY_POINTS.map(({ Icon, title, body }) => (
                  <div key={title} className="grid grid-cols-[44px_1fr] gap-[18px]">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{
                        background: "rgba(0,88,64,0.10)",
                        color: "var(--akgolf-primary, #005840)",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-[17px] font-bold tracking-[-0.01em] text-[var(--akgolf-ink,#0A1F18)]">
                        {title}
                      </h4>
                      <p className="text-sm leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* BIG CTA */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-10 py-[80px] md:py-[120px]"
        style={{ background: "var(--akgolf-ink, #0A1F18)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[1280px] text-center">
          <h2
            className="mx-auto mb-6 max-w-[18ch] text-[clamp(44px,6vw,80px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Klar for å bli en{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-accent, #D1F843)",
              }}
            >
              bedre golfer
            </em>
            ?
          </h2>
          <p className="mx-auto mb-9 max-w-[50ch] text-[17px] text-white/70">
            Book et 30-minutters intro-møte med en av våre coacher. Vi går
            gjennom dagens spill, dine mål, og hvilken vei som passer deg.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <WebButton href="/booking-v2" variant="primary" size="lg">
              Bli medlem
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
            <WebButton href="/booking?v=2" variant="ghost" size="lg">
              Book intro-møte
              <Calendar className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
          </div>
        </div>
      </section>

      </main>

      <WebFooter />
    </div>
  );
}
