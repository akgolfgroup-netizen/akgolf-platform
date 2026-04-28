"use client";

import {
  ArrowRight,
  Check,
  Crown,
  Flag,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { WebButton } from "./web-button";

interface Tier {
  name: string;
  coach: string;
  price: string;
  unit: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  Icon: LucideIcon;
}

const SUBSCRIPTIONS: Tier[] = [
  {
    name: "Performance",
    coach: "Markus",
    price: "1 000",
    unit: "kr/mnd",
    description:
      "Klubbcoaching med Markus. 2 × 20 min coaching/mnd. Selvbooking 7 dager frem. PlayerHQ inkludert.",
    features: [
      "2 × 20 min coaching/mnd",
      "Klubbcoaching med Markus",
      "Selvbooking 7 dager frem",
      "PlayerHQ inkludert",
    ],
    cta: "Bli medlem",
    href: "/booking-v2?serviceTypeId=performance-markus",
    Icon: Users,
  },
  {
    name: "Performance",
    coach: "Anders",
    price: "1 200",
    unit: "kr/mnd",
    description:
      "Strukturert utvikling. 2 × 20 min individuell coaching/mnd med Anders. Selvbooking 7 dager frem.",
    features: [
      "2 × 20 min coaching/mnd",
      "TrackMan + videoanalyse",
      "Selvbooking 7 dager frem",
      "PlayerHQ inkludert",
    ],
    cta: "Bli medlem",
    href: "/booking-v2?serviceTypeId=performance-anders",
    Icon: TrendingUp,
  },
  {
    name: "Performance Pro",
    coach: "Anders",
    price: "2 200",
    unit: "kr/mnd",
    badge: "Mest populær",
    description:
      "For den ambisiøse. 4 × 20 min individuell coaching/mnd med Anders. Prioritert booking 14 dager frem.",
    features: [
      "4 × 20 min coaching/mnd",
      "TrackMan + videoanalyse",
      "Prioritert booking 14 dager frem",
      "PlayerHQ + AI-assistent",
    ],
    cta: "Velg Performance Pro",
    href: "/booking-v2?serviceTypeId=performance-pro-anders",
    featured: true,
    Icon: Crown,
  },
  {
    name: "PlayerHQ Standalone",
    coach: "Selvgående",
    price: "300",
    unit: "kr/mnd",
    description:
      "Digital app-tilgang uten coaching. Treningsdagbok, øvelsesbank, statistikk Pro, AI-analyse.",
    features: [
      "PlayerHQ-app",
      "Treningsdagbok",
      "Øvelsesbank",
      "Statistikk Pro + AI-analyse",
    ],
    cta: "Start gratis",
    href: "/portal/login",
    Icon: Sparkles,
  },
];

const FLEX_PACKAGES: Tier[] = [
  {
    name: "Flex 20",
    coach: "Markus",
    price: "300",
    unit: "kr",
    description: "20 minutter individuell coaching med Markus, ingen binding.",
    features: [
      "20 min 1-til-1",
      "Ingen binding",
      "Book 48 t i forveien",
    ],
    cta: "Book Flex 20",
    href: "/booking-v2",
    Icon: Zap,
  },
  {
    name: "Flex 20",
    coach: "Anders",
    price: "600",
    unit: "kr",
    description: "20 minutter individuell coaching med Anders, ingen binding.",
    features: [
      "20 min 1-til-1",
      "Ingen binding",
      "Book 48 t i forveien",
    ],
    cta: "Book Flex 20",
    href: "/booking-v2",
    Icon: Zap,
  },
  {
    name: "Flex 50 Solo",
    coach: "Anders",
    price: "1 500",
    unit: "kr",
    description:
      "50 minutter individuell coaching med Anders. Coaching-notater i appen.",
    features: [
      "50 min 1-til-1",
      "Coaching-notater i app",
      "Book 48 t i forveien",
    ],
    cta: "Book Flex 50",
    href: "/booking-v2",
    Icon: Zap,
  },
  {
    name: "Flex 90 Solo",
    coach: "Anders",
    price: "2 500",
    unit: "kr",
    description: "90 minutter dypdykk med full TrackMan-analyse, ingen binding.",
    features: [
      "90 min 1-til-1",
      "Full TrackMan-analyse",
      "Coaching-notater i app",
    ],
    cta: "Book Flex 90",
    href: "/booking-v2",
    Icon: Zap,
  },
];

const ON_COURSE: Tier[] = [
  {
    name: "On-Course Par 3",
    coach: "Markus",
    price: "500",
    unit: "kr",
    description:
      "9 hull på korthullsbanen med Markus. 90 min, maks 4 spillere. Banemanagement for nybegynnere.",
    features: [
      "9 hull korthullsbanen",
      "90 min med Markus",
      "Maks 4 spillere",
    ],
    cta: "Book On-Course Par 3",
    href: "/booking-v2",
    Icon: Flag,
  },
  {
    name: "On-Course 9",
    coach: "Anders",
    price: "3 000",
    unit: "kr",
    description:
      "9 hull med Anders på 18-hullsbanen. Performance-strategi live på banen. Maks 2 spillere.",
    features: [
      "9 hull 18-hullsbanen",
      "Performance-strategi live",
      "Maks 2 spillere",
    ],
    cta: "Book On-Course 9",
    href: "/booking-v2",
    Icon: Flag,
  },
];

export function PricingPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav active="pricing" />

      {/* HERO */}
      <section
        className="px-10 pb-12 pt-[140px] text-center"
        style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
      >
        <div className="mx-auto max-w-[960px]">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            PRISER
          </div>
          <h1
            className="mx-auto mb-5 max-w-[20ch] text-[clamp(48px,6.5vw,84px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Klare priser.{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              Ingen overraskelser.
            </em>
          </h1>
          <p className="mx-auto max-w-[56ch] text-[19px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
            Velg abonnement for fast utvikling, eller book Flex/On-Course
            engang når du trenger det. PlayerHQ-app er inkludert i alle
            abonnement.
          </p>
        </div>
      </section>

      {/* SUBSCRIPTIONS */}
      <SectionGrid
        eyebrow="ABONNEMENT"
        heading="Treningsabonnement"
        description="Fast oppfølging, lavere pris per økt og full app-tilgang."
        tiers={SUBSCRIPTIONS}
      />

      {/* FLEX */}
      <SectionGrid
        eyebrow="ENGANGSØKTER"
        heading="Flex"
        description="Ingen binding. Book når du trenger det."
        tiers={FLEX_PACKAGES}
        bg="surface"
      />

      {/* ON-COURSE */}
      <SectionGrid
        eyebrow="BANECOACHING"
        heading="On-Course"
        description="Coaching der det virkelig teller — på banen."
        tiers={ON_COURSE}
      />

      {/* FAQ teaser → CTA */}
      <section
        className="relative overflow-hidden px-10 py-[120px]"
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
            className="mx-auto mb-6 max-w-[18ch] text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            Usikker på hva som{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-accent, #D1F843)",
              }}
            >
              passer deg
            </em>
            ?
          </h2>
          <p className="mx-auto mb-9 max-w-[50ch] text-[17px] text-white/70">
            Send oss en melding så finner vi ut sammen hvilken vei som er
            best for ditt nivå og dine mål.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <WebButton href="/kontakt?v=2" variant="primary" size="lg">
              Kontakt oss
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
            <WebButton href="/academy?v=2" variant="ghost" size="lg">
              Se Academy
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </WebButton>
          </div>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}

function SectionGrid({
  eyebrow,
  heading,
  description,
  tiers,
  bg = "white",
}: {
  eyebrow: string;
  heading: string;
  description: string;
  tiers: Tier[];
  bg?: "white" | "surface";
}) {
  return (
    <section
      className="px-10 py-[80px]"
      style={{
        background:
          bg === "white" ? "#fff" : "var(--akgolf-surface, #ECF0EF)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 max-w-[640px]">
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            {eyebrow}
          </div>
          <h2
            className="mb-3 text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)]"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {heading}
          </h2>
          <p className="text-[16px] text-[var(--akgolf-text,#324D45)]">
            {description}
          </p>
        </div>

        <div
          className={`grid gap-5 ${
            tiers.length === 4
              ? "md:grid-cols-2 lg:grid-cols-4"
              : tiers.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {tiers.map((tier) => (
            <PricingCard key={`${tier.name}-${tier.coach}`} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: Tier }) {
  const Icon = tier.Icon;
  const isFeatured = tier.featured;

  return (
    <article
      className={`relative flex flex-col rounded-[24px] border p-7 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,31,24,0.10)] ${
        isFeatured
          ? "border-[var(--akgolf-ink,#0A1F18)] bg-[var(--akgolf-ink,#0A1F18)] text-white -translate-y-2"
          : "bg-white"
      }`}
      style={{
        borderColor: isFeatured
          ? "var(--akgolf-ink, #0A1F18)"
          : "var(--akgolf-line-light, #e0e8e5)",
      }}
    >
      {tier.badge ? (
        <span
          className="absolute -top-2.5 left-6 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-ink,#0A1F18)]"
          style={{
            background: "var(--akgolf-accent, #D1F843)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          {tier.badge}
        </span>
      ) : null}

      <div
        className="mb-5 grid h-11 w-11 place-items-center rounded-xl"
        style={{
          background: isFeatured
            ? "rgba(209,248,67,0.18)"
            : "rgba(0,88,64,0.10)",
          color: isFeatured
            ? "var(--akgolf-accent, #D1F843)"
            : "var(--akgolf-primary, #005840)",
        }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>

      <div
        className="text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: isFeatured ? "rgba(255,255,255,0.5)" : "var(--akgolf-muted,#A5B2AD)",
        }}
      >
        {tier.coach}
      </div>
      <h3
        className={`mt-1 text-[24px] font-extrabold tracking-[-0.025em] ${
          isFeatured ? "text-white" : "text-[var(--akgolf-ink,#0A1F18)]"
        }`}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {tier.name}
      </h3>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span
          className={`text-[40px] font-extrabold tracking-[-0.035em] tabular-nums ${
            isFeatured ? "text-white" : "text-[var(--akgolf-ink,#0A1F18)]"
          }`}
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {tier.price}
        </span>
        <span
          className={`text-[14px] font-medium ${
            isFeatured ? "text-white/65" : "text-[var(--akgolf-muted,#A5B2AD)]"
          }`}
        >
          {tier.unit}
        </span>
      </div>

      <p
        className={`mt-4 text-[14px] leading-[1.55] ${
          isFeatured ? "text-white/75" : "text-[var(--akgolf-text,#324D45)]"
        }`}
      >
        {tier.description}
      </p>

      <ul className="mt-5 mb-6 flex flex-col gap-2.5">
        {tier.features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-2.5 text-[13px] leading-[1.5] ${
              isFeatured ? "text-white/85" : "text-[var(--akgolf-text,#324D45)]"
            }`}
          >
            <Check
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
              style={{
                color: isFeatured
                  ? "var(--akgolf-accent, #D1F843)"
                  : "var(--akgolf-primary, #005840)",
              }}
              strokeWidth={2.5}
            />
            {f}
          </li>
        ))}
      </ul>

      <a
        href={tier.href}
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold transition-all hover:-translate-y-px ${
          isFeatured
            ? "bg-[var(--akgolf-accent,#D1F843)] text-[var(--akgolf-ink,#0A1F18)] hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
            : "bg-[var(--akgolf-ink,#0A1F18)] text-white hover:bg-[#112e22]"
        }`}
      >
        {tier.cta}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
      </a>
    </article>
  );
}
