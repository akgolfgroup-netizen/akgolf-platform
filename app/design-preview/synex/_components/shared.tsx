"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
 * Shared Synex-preview components for /design-preview/synex/*
 * Bruker kun AK Golf brand tokens (Brand Guide V2.0)
 * ═══════════════════════════════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { label: "ACADEMY", href: "/design-preview/synex" },
  { label: "JUNIOR", href: "/design-preview/synex/junior-academy" },
  { label: "UTVIKLING", href: "/design-preview/synex/utvikling" },
  { label: "BOOKING", href: "/design-preview/synex/booking" },
];

export function SynexTopBar({ activeHref }: { activeHref?: string }) {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-7 md:px-10">
        <Link href="/design-preview/synex" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#005840] text-[12px] font-bold text-[#D1F843]">
            AK
          </div>
          <span className="text-[16px] font-semibold tracking-tight text-[#0A1F18]">
            akgolf<span className="text-[#7A8C85]">/academy</span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12px] font-semibold tracking-[0.14em] transition ${
                  isActive
                    ? "text-[#0A1F18]"
                    : "text-[#324D45] hover:text-[#0A1F18]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-1.5 text-[12px] font-medium text-[#324D45] transition hover:text-[#0A1F18] md:flex">
            <Globe size={13} /> NO
          </button>
          <Link
            href="/design-preview/synex/booking"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A1F18] px-5 py-2.5 text-[12px] font-semibold tracking-[0.02em] text-white transition hover:bg-[#1A3529]"
          >
            Book nå
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Hero image — full bredde, kort container, people kroppet bort  */
/* ─────────────────────────────────────────────────────────────── */

export function SynexHeroImage({
  src,
  objectPosition = "object-top",
  height = "h-[560px]",
}: {
  src: string;
  objectPosition?: string;
  height?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 ${height} overflow-hidden`}
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover ${objectPosition}`}
      />
      {/* Vertikal fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(236,240,239,0.4) 0%, rgba(236,240,239,0.1) 12%, rgba(236,240,239,0) 35%, rgba(236,240,239,0.6) 70%, #ECF0EF 100%)",
        }}
      />
      {/* Horisontal fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #ECF0EF 0%, rgba(236,240,239,0.25) 10%, rgba(236,240,239,0) 28%, rgba(236,240,239,0) 72%, rgba(236,240,239,0.25) 90%, #ECF0EF 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[#0A1F18]/10" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Section wrapper with eyebrow + heading                          */
/* ─────────────────────────────────────────────────────────────── */

export function SynexSectionHeader({
  eyebrow,
  heading,
  muted,
  center = false,
}: {
  eyebrow: string;
  heading: string;
  muted?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-[720px] ${center ? "mx-auto text-center" : ""}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5A6E66]">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-[clamp(32px,4.4vw,56px)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#0A1F18]">
        {heading}
      </h2>
      {muted && (
        <p
          className={`mt-5 text-[15px] leading-[1.65] text-[#324D45] ${
            center ? "mx-auto max-w-[580px]" : "max-w-[580px]"
          }`}
        >
          {muted}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  CTA Banner (final)                                              */
/* ─────────────────────────────────────────────────────────────── */

export function SynexCTABanner({
  eyebrow,
  heading,
  mutedHeading,
  description,
  ctaPrimary,
  ctaPrimaryHref = "/design-preview/synex/booking",
  ctaSecondary,
  ctaSecondaryHref = "#",
}: {
  eyebrow: string;
  heading: string;
  mutedHeading?: string;
  description: string;
  ctaPrimary: string;
  ctaPrimaryHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-10">
      <div className="relative overflow-hidden rounded-[28px] bg-[#0A1F18] p-10 md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(209,248,67,0.18) 0%, rgba(209,248,67,0) 70%)",
          }}
        />
        <div className="relative max-w-[640px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D1F843]">
            {eyebrow}
          </div>
          <h3 className="mt-5 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.02] tracking-[-0.025em] text-white">
            {heading}
            {mutedHeading && (
              <>
                <br />
                <span className="text-white/45">{mutedHeading}</span>
              </>
            )}
          </h3>
          <p className="mt-6 max-w-[480px] text-[14px] leading-[1.65] text-white/60">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#D1F843] px-7 py-4 text-[14px] font-semibold text-[#0A1F18] transition hover:brightness-95"
            >
              {ctaPrimary}
              <ArrowRight size={16} />
            </Link>
            {ctaSecondary && (
              <Link
                href={ctaSecondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-[14px] font-semibold text-white transition hover:border-white/40"
              >
                {ctaSecondary}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Footer                                                          */
/* ─────────────────────────────────────────────────────────────── */

export function SynexFooter() {
  return (
    <footer className="border-t border-[#D5DFDB]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-[11px] text-[#5A6E66] md:px-10">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-[#005840] text-[9px] font-bold text-[#D1F843]">
            AK
          </div>
          <span>© 2026 AK Golf Academy</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/personvern" className="hover:text-[#0A1F18]">
            Personvern
          </Link>
          <a href="#" className="hover:text-[#0A1F18]">
            Vilkår
          </a>
          <a href="#" className="hover:text-[#0A1F18]">
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Social proof — golf clubs                                       */
/* ─────────────────────────────────────────────────────────────── */

export function SynexSocialProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 md:px-10">
      <div className="text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5A6E66]">
        Spillere fra
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-5 text-[17px] font-semibold tracking-tight text-[#324D45]">
        <span>Gamle Fredrikstad GK</span>
        <span className="text-[#A5B2AD]">·</span>
        <span>Huseby Hankø</span>
        <span className="text-[#A5B2AD]">·</span>
        <span>Onsøy GK</span>
        <span className="text-[#A5B2AD]">·</span>
        <span>Hvaler GK</span>
        <span className="text-[#A5B2AD]">·</span>
        <span>WANG Toppidrett</span>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Page wrapper — gir felles bakgrunn/font-setup                  */
/* ─────────────────────────────────────────────────────────────── */

export function SynexPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ECF0EF] font-sans text-[#0A1F18] antialiased">
      {children}
    </div>
  );
}
