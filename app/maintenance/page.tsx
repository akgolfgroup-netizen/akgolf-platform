"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck, Mail, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

const ACUITY_URL_ANDERS =
  "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=11780416";
const ACUITY_URL_MARKUS =
  "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=13938964";
const ACUITY_URL_GENERAL =
  "https://app.acuityscheduling.com/schedule.php?owner=28391543";

export default function MaintenancePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-white"
      style={{
        background: "var(--akgolf-ink, #0A1F18)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 30%, rgba(209,248,67,0.12), transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,88,64,0.30), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[720px] py-12 text-center">
        <Link
          href="/"
          className="mx-auto mb-10 inline-flex items-center gap-2.5 text-[18px] font-extrabold tracking-[-0.02em] text-white"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-[14px] font-extrabold tracking-[-0.04em]"
            style={{
              background: "var(--akgolf-accent, #D1F843)",
              color: "#0A1F18",
            }}
          >
            AK
          </span>
          AK Golf
        </Link>

        <div
          className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(209,248,67,0.18)",
            color: "var(--akgolf-accent, #D1F843)",
          }}
        >
          <Wrench className="h-7 w-7" />
        </div>

        <div
          className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--akgolf-accent, #D1F843)",
          }}
        >
          / VEDLIKEHOLD PAGAR
        </div>

        <h1
          className="mb-5 text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white text-balance"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          Book{" "}
          <em
            className="font-medium not-italic"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--akgolf-accent, #D1F843)",
            }}
          >
            time direkte
          </em>{" "}
          mens vi finjusterer.
        </h1>

        <p className="mx-auto mb-10 max-w-[52ch] text-[17px] leading-[1.55] text-white/75">
          Spillerportalen er midlertidig nede mens vi gjor de siste
          forbedringene. Du kan booke time hos Anders eller Markus direkte
          her — det tar mindre enn ett minutt.
        </p>

        {/* CTA-kort */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 text-left">
          <BookingCard
            href={ACUITY_URL_ANDERS}
            eyebrow="Voksne · TrackMan · Bane"
            name="Book hos Anders"
            description="1:1 coaching pa Gamle Fredrikstad Golfklubb. TrackMan-analyse og videoanalyse inkludert."
            primary
          />
          <BookingCard
            href={ACUITY_URL_MARKUS}
            eyebrow="Junior · Nybegynnere"
            name="Book hos Markus"
            description="Coaching for juniorer og nye golfere. Sesjonene foregar pa Gamle Fredrikstad Golfklubb."
            primary={false}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ACUITY_URL_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[13px] font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
          >
            <CalendarCheck className="h-4 w-4" strokeWidth={2.2} />
            Se alle ledige tider
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </a>
          <a
            href="mailto:post@akgolf.no"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-bold text-white/85 transition-all hover:text-white"
          >
            <Mail className="h-4 w-4" strokeWidth={2.2} />
            post@akgolf.no
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.20em] text-white/40"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        © 2026 AK GOLF GROUP · ORG 925 884 102
      </div>
    </div>
  );
}

function BookingCard({
  href,
  eyebrow,
  name,
  description,
  primary,
}: {
  href: string;
  eyebrow: string;
  name: string;
  description: string;
  primary: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 backdrop-blur-md ${
        primary
          ? "border-2 border-[var(--akgolf-accent,#D1F843)] bg-white/10"
          : "border border-white/15 bg-white/5 hover:border-white/30"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{
            background: "rgba(209,248,67,0.20)",
            color: "var(--akgolf-accent, #D1F843)",
          }}
        >
          <CalendarCheck className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        <ArrowRight
          className="mt-1 h-4 w-4 text-white/55 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--akgolf-accent,#D1F843)]"
          strokeWidth={2}
        />
      </div>
      <div
        className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--akgolf-accent, #D1F843)",
        }}
      >
        {eyebrow}
      </div>
      <div className="mb-2 text-[19px] font-extrabold tracking-[-0.02em] text-white">
        {name}
      </div>
      <p className="text-[13px] leading-[1.5] text-white/70">{description}</p>
    </a>
  );
}
