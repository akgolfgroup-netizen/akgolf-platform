"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar, Users } from "lucide-react";
import {
  SynexCTABanner,
  SynexFooter,
  SynexHeroImage,
  SynexPageWrapper,
  SynexSectionHeader,
  SynexTopBar,
} from "../_components/shared";
import {
  JUNIOR_ACADEMY_PROGRAM,
  JUNIOR_AGE_GROUPS_V2,
  JUNIOR_CTA_V2,
  JUNIOR_HERO_V2,
  JUNIOR_WANG_V2,
} from "@/lib/website-constants";

export default function JuniorAcademyPreview() {
  return (
    <SynexPageWrapper>
      <SynexTopBar activeHref="/design-preview/synex/junior-academy" />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-[1100px]">
        <SynexHeroImage src={JUNIOR_HERO_V2.heroImage} height="h-[1100px]" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-16 text-center md:px-10 md:pt-24">
          <div className="mb-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5A6E66]">
            <span className="h-px w-10 bg-[#A5B2AD]" />
            {JUNIOR_HERO_V2.label}
            <span className="h-px w-10 bg-[#A5B2AD]" />
          </div>

          <h1 className="mx-auto max-w-[980px] text-[clamp(44px,7.4vw,104px)] font-semibold leading-[0.96] tracking-[-0.035em]">
            <span className="block text-[#D1F843] [text-shadow:0_2px_20px_rgba(10,31,24,0.35)]">
              Morgendagens
            </span>
            <span className="block text-[#0A1F18] [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
              golfspillere.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-[620px] text-[15px] leading-[1.65] text-[#324D45]">
            {JUNIOR_HERO_V2.description}
          </p>

          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/design-preview/synex/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#D1F843] px-7 py-4 text-[14px] font-semibold text-[#0A1F18] shadow-[0_8px_24px_-8px_rgba(209,248,67,0.6)] transition hover:translate-y-[-1px] hover:brightness-95"
            >
              {JUNIOR_HERO_V2.ctaPrimary}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#grupper"
              className="inline-flex items-center gap-2 rounded-full border border-[#D5DFDB] bg-white px-7 py-4 text-[14px] font-semibold text-[#0A1F18] transition hover:border-[#A5B2AD]"
            >
              {JUNIOR_HERO_V2.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ACADEMY PROGRAM ═══════════════════════ */}
      <section className="relative z-10 mx-auto mt-24 max-w-[1200px] px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[28px] border border-[#D5DFDB] bg-white p-10 md:grid md:grid-cols-[1.3fr_1fr] md:gap-10 md:p-14">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5A6E66]">
              {JUNIOR_ACADEMY_PROGRAM.label}
            </div>
            <h2 className="mt-4 text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[#0A1F18]">
              {JUNIOR_ACADEMY_PROGRAM.heading}
            </h2>
            <p className="mt-5 max-w-[520px] text-[14px] leading-[1.65] text-[#324D45]">
              {JUNIOR_ACADEMY_PROGRAM.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F8F7] px-4 py-2 text-[12px] font-semibold text-[#0A1F18]">
                <Calendar size={13} className="text-[#005840]" />
                {JUNIOR_ACADEMY_PROGRAM.price}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F8F7] px-4 py-2 text-[12px] font-semibold text-[#0A1F18]">
                <Users size={13} className="text-[#005840]" />
                {JUNIOR_ACADEMY_PROGRAM.capacity}
              </div>
            </div>

            <Link
              href="/design-preview/synex/booking"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A1F18] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#1A3529]"
            >
              {JUNIOR_ACADEMY_PROGRAM.ctaLabel}
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mini image grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 md:mt-0">
            {JUNIOR_ACADEMY_PROGRAM.images.map((img, i) => (
              <div
                key={img}
                className={`relative overflow-hidden rounded-[16px] border border-[#D5DFDB] ${
                  i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                }`}
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRENINGSGRUPPER ═══════════════════════ */}
      <section id="grupper" className="mx-auto max-w-[1200px] px-6 py-28 md:px-10">
        <SynexSectionHeader
          eyebrow={JUNIOR_AGE_GROUPS_V2.label}
          heading={JUNIOR_AGE_GROUPS_V2.heading}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {JUNIOR_AGE_GROUPS_V2.groups.map((group) => (
            <div
              key={group.ageRange}
              className="group relative overflow-hidden rounded-[20px] border border-[#D5DFDB] bg-white p-7 transition hover:border-[#A5B2AD]"
            >
              <div className="text-[11px] font-semibold tracking-[0.16em] text-[#D1F843] [text-shadow:0_1px_2px_rgba(10,31,24,0.3)]">
                <span className="rounded-md bg-[#0A1F18] px-2 py-1 text-[#D1F843]">
                  {group.ageRange}
                </span>
              </div>
              <div className="mt-8 text-[22px] font-semibold tracking-[-0.01em] text-[#0A1F18]">
                {group.name}
              </div>
              <p className="mt-3 text-[13px] leading-[1.6] text-[#324D45]">
                {group.description}
              </p>

              <div className="mt-6 space-y-2 border-t border-[#D5DFDB] pt-5 text-[12px] text-[#5A6E66]">
                <div className="flex items-start gap-2">
                  <Calendar size={12} className="mt-0.5 shrink-0 text-[#7A8C85]" />
                  <span>{group.schedule}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users size={12} className="mt-0.5 shrink-0 text-[#7A8C85]" />
                  <span>{group.maxParticipants}</span>
                </div>
              </div>

              <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#7A8C85]">
                {group.note}
              </div>

              <div className="pointer-events-none absolute right-6 top-6 opacity-0 transition group-hover:opacity-100">
                <ArrowUpRight size={18} className="text-[#0A1F18]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ WANG SAMARBEID ═══════════════════════ */}
      <section className="relative overflow-hidden bg-[#F5F8F7] py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <SynexSectionHeader
                eyebrow={JUNIOR_WANG_V2.label}
                heading={JUNIOR_WANG_V2.heading}
                muted={JUNIOR_WANG_V2.description}
              />
              <Link
                href="#"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A1F18] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#1A3529]"
              >
                {JUNIOR_WANG_V2.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-[#D5DFDB]"
              style={{
                backgroundImage:
                  "url(/images/academy/AK-Golf-Academy-15.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </section>

      <SynexCTABanner
        eyebrow="Junior Academy"
        heading={JUNIOR_CTA_V2.heading}
        description={JUNIOR_CTA_V2.description}
        ctaPrimary={JUNIOR_CTA_V2.ctaPrimary}
        ctaSecondary={JUNIOR_CTA_V2.ctaSecondary}
      />

      <SynexFooter />
    </SynexPageWrapper>
  );
}
