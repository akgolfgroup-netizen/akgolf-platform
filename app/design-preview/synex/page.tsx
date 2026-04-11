"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  Flag,
  LayoutDashboard,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  SynexCTABanner,
  SynexFooter,
  SynexHeroImage,
  SynexPageWrapper,
  SynexSectionHeader,
  SynexSocialProof,
  SynexTopBar,
} from "./_components/shared";
import {
  FINAL_CTA,
  FOUNDATION_METHOD,
  HERO,
  HOW_IT_WORKS,
} from "@/lib/website-constants";

/**
 * AK Golf Academy — Synex-inspirert landing page preview
 * Referanse: https://dribbble.com/shots/27265126-Synex-AI-Fintech-Website
 *
 * Alle tekster hentes fra lib/website-constants.ts.
 * Alle farger fra AK Golf Brand Guide V2.0 tokens.
 */
export default function SynexLandingPreview() {
  const [handicap, setHandicap] = useState(18.2);

  useEffect(() => {
    const start = 18.2;
    const target = 12.4;
    const duration = 1800;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setHandicap(Number((start + (target - start) * eased).toFixed(1)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <SynexPageWrapper>
      <SynexTopBar activeHref="/design-preview/synex" />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative">
        <SynexHeroImage
          src="/images/academy/AK-Golf-Academy-30.jpg"
          height="h-[560px]"
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-16 text-center md:px-10 md:pt-24">
          {/* Eyebrow */}
          <div className="mb-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5A6E66]">
            <span className="h-px w-10 bg-[#A5B2AD]" />
            {HERO.eyebrow}
            <span className="h-px w-10 bg-[#A5B2AD]" />
          </div>

          {/* Split headline — "Effektiv 1-til-1 coaching." */}
          <h1 className="mx-auto max-w-[980px] text-[clamp(44px,7.4vw,104px)] font-semibold leading-[0.96] tracking-[-0.035em]">
            <span className="block text-[#D1F843] [text-shadow:0_2px_20px_rgba(10,31,24,0.35)]">
              Effektiv 1-til-1
            </span>
            <span className="block text-[#0A1F18] [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
              coaching.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-[620px] text-[15px] leading-[1.65] text-[#324D45]">
            {HERO.subheading}
          </p>

          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/design-preview/synex/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#D1F843] px-7 py-4 text-[14px] font-semibold text-[#0A1F18] shadow-[0_8px_24px_-8px_rgba(209,248,67,0.6)] transition hover:translate-y-[-1px] hover:brightness-95"
            >
              {HERO.ctaPrimary}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/design-preview/synex/booking"
              className="inline-flex items-center gap-2 rounded-full border border-[#D5DFDB] bg-white px-7 py-4 text-[14px] font-semibold text-[#0A1F18] transition hover:border-[#A5B2AD]"
            >
              {HERO.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* ═══════════ DASHBOARD MOCKUP ═══════════ */}
        <div className="relative z-10 mt-36">
          <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="overflow-hidden rounded-[28px] bg-[#0A1F18] p-3 shadow-[0_80px_160px_-30px_rgba(10,31,24,0.55)] ring-1 ring-black/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-3 pb-3 pt-1">
                <span className="h-[10px] w-[10px] rounded-full bg-[#FF5F57]" />
                <span className="h-[10px] w-[10px] rounded-full bg-[#FEBC2E]" />
                <span className="h-[10px] w-[10px] rounded-full bg-[#28C840]" />
                <div className="mx-auto flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-[11px] font-medium text-white/70">
                  akgolf.no/portal
                </div>
              </div>

              <div className="flex overflow-hidden rounded-[20px] bg-[#0A1F18]">
                {/* Sidebar */}
                <aside className="hidden w-[230px] shrink-0 border-r border-white/5 p-5 md:block">
                  <div className="flex items-center gap-3 pb-8">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#D1F843] text-[11px] font-bold text-[#0A1F18]">
                      LH
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-semibold text-white">
                        Lars Hansen
                      </div>
                      <div className="text-[10px] text-white/45">
                        Performance Pro
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Navigasjon
                  </div>
                  <nav className="space-y-1">
                    {[
                      {
                        icon: LayoutDashboard,
                        label: "Oversikt",
                        active: true,
                      },
                      { icon: Calendar, label: "Bookinger", badge: "2" },
                      { icon: Flag, label: "Treningsplan" },
                      { icon: BarChart3, label: "Statistikk" },
                      { icon: Sparkles, label: "AI-innsikter" },
                    ].map(({ icon: Icon, label, active, badge }) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] transition ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/55 hover:text-white/80"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={14} />
                          {label}
                        </span>
                        {badge && (
                          <span className="rounded-full bg-[#D1F843] px-1.5 py-0.5 text-[9px] font-bold text-[#0A1F18]">
                            {badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D1F843]">
                      Oppgrader
                    </div>
                    <div className="mt-2 text-[11px] leading-tight text-white/70">
                      Lås opp AI-analyse og ubegrenset treningsplan.
                    </div>
                  </div>
                </aside>

                {/* Content */}
                <div className="flex-1 bg-[#F5F8F7] p-5 md:p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5A6E66]">
                        Oversikt
                      </div>
                      <div className="mt-1 text-[17px] font-semibold text-[#0A1F18]">
                        God morgen, Lars
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-full border border-[#D5DFDB] bg-white text-[#5A6E66]">
                        <Search size={13} />
                      </button>
                      <button className="relative grid h-9 w-9 place-items-center rounded-full border border-[#D5DFDB] bg-white text-[#5A6E66]">
                        <Bell size={13} />
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B84233]" />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#D5DFDB] bg-white p-6 shadow-[0_1px_0_rgba(10,31,24,0.03)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5A6E66]">
                          Handicap-indeks
                        </div>
                        <div className="mt-2 flex items-baseline gap-3">
                          <span className="text-[44px] font-semibold leading-none tracking-[-0.02em] text-[#0A1F18] tabular-nums">
                            {handicap.toFixed(1)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EF] px-2 py-0.5 text-[10px] font-semibold text-[#1A4D36]">
                            <TrendingUp size={10} />
                            −5.8
                          </span>
                        </div>
                        <div className="mt-1.5 text-[10px] text-[#7A8C85]">
                          Siste 12 måneder · oppdatert 09.04
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-[0.12em] text-[#7A8C85]">
                          Neste booking
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-[#0A1F18]">
                          Fredag 14:00
                        </div>
                        <div className="text-[10px] text-[#5A6E66]">
                          Anders · 20 min
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex h-[64px] items-end gap-[3px]">
                      {[
                        24, 28, 22, 30, 26, 34, 32, 40, 38, 44, 42, 50, 48, 56,
                        54, 62, 66, 72, 70, 78, 76, 84, 82, 92,
                      ].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-[2px]"
                          style={{
                            height: `${h}%`,
                            background:
                              "linear-gradient(to top, rgba(10,31,24,0.08), rgba(10,31,24,0.55))",
                          }}
                        />
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[9px] font-medium text-[#7A8C85]">
                      <span>MAI</span>
                      <span>JUL</span>
                      <span>SEP</span>
                      <span>NOV</span>
                      <span>JAN</span>
                      <span>MAR</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Økter denne uken", value: "3", unit: "/4" },
                      {
                        label: "Fairway treff",
                        value: "62",
                        unit: "%",
                        delta: "+8",
                      },
                      {
                        label: "Putting · 2m",
                        value: "78",
                        unit: "%",
                        delta: "+12",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-[#D5DFDB] bg-white p-4"
                      >
                        <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5A6E66]">
                          {s.label}
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-[22px] font-semibold tracking-[-0.01em] text-[#0A1F18] tabular-nums">
                            {s.value}
                          </span>
                          <span className="text-[12px] text-[#7A8C85]">
                            {s.unit}
                          </span>
                          {s.delta && (
                            <span className="ml-auto text-[10px] font-semibold text-[#2A7D5A]">
                              {s.delta}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#AF52DE]/20 bg-gradient-to-r from-[#FAF5FF] to-white p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FAF5FF] text-[#AF52DE]">
                      <Sparkles size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#AF52DE]">
                        AI-innsikt
                      </div>
                      <div className="mt-0.5 text-[12px] font-medium leading-snug text-[#0A1F18]">
                        Putting innenfor 2 meter har størst effekt på score nå.
                        Legg inn 15 min fokusøkt før fredag.
                      </div>
                    </div>
                    <button className="shrink-0 rounded-full border border-[#D5DFDB] bg-white p-2 text-[#324D45]">
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[#7A8C85]">
              SCROLL FOR Å UTFORSKE
              <ChevronDown size={14} className="animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      <SynexSocialProof />

      {/* ═══════════════════════ METODIKK (The Foundation Method) ═══════════════════════ */}
      <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-10">
        <SynexSectionHeader
          eyebrow={FOUNDATION_METHOD.eyebrow}
          heading={FOUNDATION_METHOD.heading}
          muted={FOUNDATION_METHOD.description}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {FOUNDATION_METHOD.phases.map((phase) => (
            <div
              key={phase.id}
              className="group relative overflow-hidden rounded-[20px] border border-[#D5DFDB] bg-white p-7 transition hover:border-[#A5B2AD]"
            >
              <div className="text-[11px] font-semibold tracking-[0.16em] text-[#7A8C85]">
                {phase.name}
              </div>
              <div className="mt-10 text-[22px] font-semibold tracking-[-0.01em] text-[#0A1F18]">
                {phase.title}
              </div>
              <p className="mt-3 text-[13px] leading-[1.6] text-[#324D45]">
                {phase.description}
              </p>
              <div className="pointer-events-none absolute right-6 top-6 opacity-0 transition group-hover:opacity-100">
                <ArrowUpRight size={18} className="text-[#0A1F18]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ REISEN (How It Works) ═══════════════════════ */}
      <section className="relative overflow-hidden bg-[#F5F8F7] py-28">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <SynexSectionHeader
            eyebrow={HOW_IT_WORKS.eyebrow}
            heading={HOW_IT_WORKS.heading}
            muted={HOW_IT_WORKS.description}
          />

          {/* Timeline med steg */}
          <div className="relative mt-16">
            {/* Horisontal linje på desktop */}
            <div
              aria-hidden
              className="absolute left-[8%] right-[8%] top-[28px] hidden h-px bg-gradient-to-r from-[#D5DFDB] via-[#A5B2AD] to-[#D5DFDB] md:block"
            />
            <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
              {HOW_IT_WORKS.steps.map((step) => (
                <div key={step.number} className="relative">
                  {/* Node */}
                  <div className="flex items-center gap-4 md:flex-col md:items-start">
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#D5DFDB] bg-white text-[13px] font-bold tracking-tight text-[#0A1F18] shadow-[0_1px_0_rgba(10,31,24,0.04)]">
                      {step.number}
                      <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-[#D1F843]/0" />
                    </div>
                  </div>
                  <div className="mt-6 text-[20px] font-semibold tracking-[-0.01em] text-[#0A1F18]">
                    {step.title}
                  </div>
                  <p className="mt-3 max-w-[340px] text-[13px] leading-[1.6] text-[#324D45]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SynexCTABanner
        eyebrow={FINAL_CTA.eyebrow}
        heading="Ta det første steget"
        mutedHeading="mot ditt beste spill."
        description={FINAL_CTA.description}
        ctaPrimary={FINAL_CTA.ctaPrimary}
        ctaSecondary={FINAL_CTA.ctaSecondary}
      />

      <SynexFooter />
    </SynexPageWrapper>
  );
}
