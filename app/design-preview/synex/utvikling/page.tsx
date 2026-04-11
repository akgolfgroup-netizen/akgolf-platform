"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  SynexCTABanner,
  SynexFooter,
  SynexHeroImage,
  SynexPageWrapper,
  SynexSectionHeader,
  SynexTopBar,
} from "../_components/shared";
import {
  UTVIKLING_CTA_V2,
  UTVIKLING_HERO_V2,
  UTVIKLING_REFERENCES_V2,
  UTVIKLING_SERVICES_V2,
} from "@/lib/website-constants";

export default function UtviklingPreview() {
  return (
    <SynexPageWrapper>
      <SynexTopBar activeHref="/design-preview/synex/utvikling" />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-[1100px]">
        <SynexHeroImage
          src="/images/sections/trackman.jpg"
          height="h-[1100px]"
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-16 text-center md:px-10 md:pt-24">
          <div className="mb-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5A6E66]">
            <span className="h-px w-10 bg-[#A5B2AD]" />
            {UTVIKLING_HERO_V2.label}
            <span className="h-px w-10 bg-[#A5B2AD]" />
          </div>

          <h1 className="mx-auto max-w-[980px] text-[clamp(44px,7.4vw,104px)] font-semibold leading-[0.96] tracking-[-0.035em]">
            <span className="block text-[#D1F843] [text-shadow:0_2px_20px_rgba(10,31,24,0.35)]">
              Vi bygger bedre
            </span>
            <span className="block text-[#0A1F18] [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
              golfklubber.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-[620px] text-[15px] leading-[1.65] text-[#324D45]">
            {UTVIKLING_HERO_V2.description}
          </p>

          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#tjenester"
              className="inline-flex items-center gap-2 rounded-full bg-[#D1F843] px-7 py-4 text-[14px] font-semibold text-[#0A1F18] shadow-[0_8px_24px_-8px_rgba(209,248,67,0.6)] transition hover:translate-y-[-1px] hover:brightness-95"
            >
              {UTVIKLING_HERO_V2.ctaLabel}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#tjenester"
              className="inline-flex items-center gap-2 rounded-full border border-[#D5DFDB] bg-white px-7 py-4 text-[14px] font-semibold text-[#0A1F18] transition hover:border-[#A5B2AD]"
            >
              Se tjenester
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TJENESTER (Bento grid) ═══════════════════════ */}
      <section
        id="tjenester"
        className="relative z-10 mx-auto mt-24 max-w-[1200px] px-6 md:px-10"
      >
        <SynexSectionHeader
          eyebrow={UTVIKLING_SERVICES_V2.label}
          heading={UTVIKLING_SERVICES_V2.heading}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {UTVIKLING_SERVICES_V2.items.map((item, idx) => {
            const isDark = item.theme === "dark";
            const isLarge = item.span === "large";
            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-[24px] border p-8 transition ${
                  isLarge ? "md:col-span-2 md:row-span-2" : ""
                } ${
                  isDark
                    ? "border-white/10 bg-[#0A1F18] text-white"
                    : "border-[#D5DFDB] bg-white text-[#0A1F18] hover:border-[#A5B2AD]"
                }`}
              >
                {isDark && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(209,248,67,0.22) 0%, rgba(209,248,67,0) 70%)",
                    }}
                  />
                )}

                <div
                  className={`relative text-[10px] font-semibold tracking-[0.18em] ${
                    isDark ? "text-[#D1F843]" : "text-[#7A8C85]"
                  }`}
                >
                  {item.label}
                </div>

                <div
                  className={`relative ${
                    isLarge ? "mt-16" : "mt-10"
                  } text-[clamp(22px,2.6vw,34px)] font-semibold tracking-[-0.02em] ${
                    isDark ? "text-white" : "text-[#0A1F18]"
                  }`}
                >
                  {item.title}
                </div>

                <p
                  className={`relative mt-4 max-w-[520px] text-[13px] leading-[1.65] ${
                    isDark ? "text-white/70" : "text-[#324D45]"
                  }`}
                >
                  {item.description}
                </p>

                {isLarge && (
                  <p className="relative mt-5 max-w-[560px] text-[12px] leading-[1.7] text-[#5A6E66]">
                    {item.expandedDescription}
                  </p>
                )}

                <div className="pointer-events-none absolute right-6 top-6 opacity-0 transition group-hover:opacity-100">
                  <ArrowUpRight
                    size={18}
                    className={isDark ? "text-[#D1F843]" : "text-[#0A1F18]"}
                  />
                </div>

                <div
                  className={`relative mt-8 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    isDark ? "text-[#D1F843]" : "text-[#005840]"
                  }`}
                >
                  Les mer
                  <ArrowRight size={12} />
                </div>

                <div
                  aria-hidden
                  className={`absolute bottom-6 left-6 font-mono text-[10px] ${
                    isDark ? "text-white/30" : "text-[#A5B2AD]"
                  }`}
                >
                  0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════ REFERANSER ═══════════════════════ */}
      <section className="mx-auto max-w-[1200px] px-6 py-28 md:px-10">
        <SynexSectionHeader
          eyebrow={UTVIKLING_REFERENCES_V2.label}
          heading={UTVIKLING_REFERENCES_V2.heading}
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {UTVIKLING_REFERENCES_V2.clubs.map((club) => (
            <div
              key={club}
              className="flex items-center justify-between rounded-[20px] border border-[#D5DFDB] bg-white p-7 transition hover:border-[#A5B2AD]"
            >
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85]">
                  Klubb
                </div>
                <div className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-[#0A1F18]">
                  {club}
                </div>
              </div>
              <ArrowUpRight size={20} className="text-[#7A8C85]" />
            </div>
          ))}
        </div>
      </section>

      <SynexCTABanner
        eyebrow="Klubbutvikling"
        heading={UTVIKLING_CTA_V2.heading}
        description={UTVIKLING_CTA_V2.description}
        ctaPrimary={UTVIKLING_CTA_V2.ctaPrimary}
      />

      <SynexFooter />
    </SynexPageWrapper>
  );
}
