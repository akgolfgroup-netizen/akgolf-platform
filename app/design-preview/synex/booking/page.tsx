"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock, Zap } from "lucide-react";
import {
  SynexFooter,
  SynexHeroImage,
  SynexPageWrapper,
  SynexSectionHeader,
  SynexTopBar,
} from "../_components/shared";
import {
  COACHING_PACKAGES,
  FLEX_PACKAGES,
  MARKUS_SESSIONS,
} from "@/lib/website-constants";

export default function BookingPreview() {
  return (
    <SynexPageWrapper>
      <SynexTopBar activeHref="/design-preview/synex/booking" />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-[1100px]">
        <SynexHeroImage
          src="/images/sections/putting.jpg"
          height="h-[1100px]"
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-16 text-center md:px-10 md:pt-24">
          <div className="mb-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5A6E66]">
            <span className="h-px w-10 bg-[#A5B2AD]" />
            Book coaching
            <span className="h-px w-10 bg-[#A5B2AD]" />
          </div>

          <h1 className="mx-auto max-w-[980px] text-[clamp(44px,7.4vw,104px)] font-semibold leading-[0.96] tracking-[-0.035em]">
            <span className="block text-[#D1F843] [text-shadow:0_2px_20px_rgba(10,31,24,0.35)]">
              Velg pakken
            </span>
            <span className="block text-[#0A1F18] [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
              som passer deg.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-[620px] text-[15px] leading-[1.65] text-[#324D45]">
            Abonnement for strukturert utvikling eller Flex-sesjoner uten
            binding. Begge inkluderer TrackMan, videoanalyse og portaltilgang.
          </p>
        </div>
      </section>

      {/* ═══════════════════════ COACHING PAKKER ═══════════════════════ */}
      <section className="relative z-10 mx-auto mt-24 max-w-[1200px] px-6 md:px-10">
        <SynexSectionHeader
          eyebrow="Abonnement"
          heading="Performance-pakker"
          muted="Månedlig coaching med prioritert booking, full portaltilgang og løpende treningsplan."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {COACHING_PACKAGES.map((pkg) => {
            const isHighlighted = pkg.highlighted;
            return (
              <div
                key={pkg.name}
                className={`relative overflow-hidden rounded-[24px] p-9 transition ${
                  isHighlighted
                    ? "border border-white/10 bg-[#0A1F18] text-white"
                    : "border border-[#D5DFDB] bg-white text-[#0A1F18] hover:border-[#A5B2AD]"
                }`}
              >
                {isHighlighted && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(209,248,67,0.22) 0%, rgba(209,248,67,0) 70%)",
                    }}
                  />
                )}

                {pkg.badge && (
                  <div className="relative mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#D1F843] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0A1F18]">
                    <Zap size={11} />
                    {pkg.badge}
                  </div>
                )}

                <div
                  className={`relative text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    isHighlighted ? "text-[#D1F843]" : "text-[#7A8C85]"
                  }`}
                >
                  {pkg.name}
                </div>

                <div className="relative mt-5 flex items-baseline gap-2">
                  <span
                    className={`text-[56px] font-semibold leading-none tracking-[-0.03em] tabular-nums ${
                      isHighlighted ? "text-white" : "text-[#0A1F18]"
                    }`}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className={`text-[14px] font-medium ${
                      isHighlighted ? "text-white/60" : "text-[#7A8C85]"
                    }`}
                  >
                    {pkg.period}
                  </span>
                </div>

                <p
                  className={`relative mt-4 max-w-[360px] text-[13px] leading-[1.6] ${
                    isHighlighted ? "text-white/70" : "text-[#324D45]"
                  }`}
                >
                  {pkg.tagline}
                </p>

                <ul className="relative mt-8 space-y-3">
                  {pkg.features.map((feat) => (
                    <li
                      key={feat}
                      className={`flex items-start gap-3 text-[13px] ${
                        isHighlighted ? "text-white/85" : "text-[#324D45]"
                      }`}
                    >
                      <Check
                        size={14}
                        className={`mt-0.5 shrink-0 ${
                          isHighlighted ? "text-[#D1F843]" : "text-[#005840]"
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="#"
                  className={`relative mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-semibold transition ${
                    isHighlighted
                      ? "bg-[#D1F843] text-[#0A1F18] hover:brightness-95"
                      : "bg-[#0A1F18] text-white hover:bg-[#1A3529]"
                  }`}
                >
                  Velg {pkg.name}
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════ FLEX ═══════════════════════ */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6 md:px-10">
        <SynexSectionHeader
          eyebrow="Uten binding"
          heading="Flex-sesjoner"
          muted="Enkeltøkter for deg som vil prøve, eller bare trenger en rask justering."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {FLEX_PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className="rounded-[24px] border border-[#D5DFDB] bg-white p-9 transition hover:border-[#A5B2AD]"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A8C85]">
                {pkg.name}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-[48px] font-semibold leading-none tracking-[-0.03em] text-[#0A1F18] tabular-nums">
                  {pkg.price}
                </span>
                <span className="text-[14px] font-medium text-[#7A8C85]">
                  {pkg.period}
                </span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#005840]">
                <Clock size={11} />
                {pkg.duration}
              </div>
              <p className="mt-5 text-[13px] leading-[1.6] text-[#324D45]">
                {pkg.tagline}
              </p>

              <ul className="mt-7 space-y-3">
                {pkg.includes.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 text-[13px] text-[#324D45]"
                  >
                    <Check size={14} className="mt-0.5 shrink-0 text-[#005840]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D5DFDB] bg-white px-5 py-3 text-[12px] font-semibold text-[#0A1F18] transition hover:border-[#A5B2AD]"
              >
                Book Flex-sesjon
                <ArrowRight size={13} />
              </Link>
            </div>
          ))}

          {/* Flex 20 (Markus) */}
          <div className="rounded-[24px] border border-[#D5DFDB] bg-white p-9 transition hover:border-[#A5B2AD]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A8C85]">
              {MARKUS_SESSIONS.name}
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-[48px] font-semibold leading-none tracking-[-0.03em] text-[#0A1F18] tabular-nums">
                {MARKUS_SESSIONS.price}
              </span>
              <span className="text-[14px] font-medium text-[#7A8C85]">
                {MARKUS_SESSIONS.period}
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#005840]">
              <Clock size={11} />
              20 min · Markus
            </div>
            <p className="mt-5 text-[13px] leading-[1.6] text-[#324D45]">
              {MARKUS_SESSIONS.description}
            </p>
            <Link
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D5DFDB] bg-white px-5 py-3 text-[12px] font-semibold text-[#0A1F18] transition hover:border-[#A5B2AD]"
            >
              {MARKUS_SESSIONS.bookingNote}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ INFO-BÅND ═══════════════════════ */}
      <section className="mx-auto mt-24 max-w-[1200px] px-6 pb-28 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Ingen binding",
              body: "Alle abonnement løper månedlig og kan sies opp når som helst.",
            },
            {
              title: "Maks 65 plasser",
              body: "Vi holder et strengt tak for å sikre tett oppfølging og god tilgjengelighet.",
            },
            {
              title: "2 timers avbestilling",
              body: "Avbestill eller flytt timen din direkte i appen inntil 2 timer før oppstart.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[20px] border border-[#D5DFDB] bg-[#F5F8F7] p-6"
            >
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[#0A1F18]">
                <Check size={14} className="text-[#005840]" />
                {item.title}
              </div>
              <p className="mt-3 text-[12px] leading-[1.6] text-[#324D45]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SynexFooter />
    </SynexPageWrapper>
  );
}
