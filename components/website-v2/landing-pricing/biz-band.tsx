"use client";

import { ArrowRight, Check, Download } from "lucide-react";
import { fonts, colors } from "../academy/pricing-tokens";
import { BIZ_BAND } from "./data";

export function BizBand() {
  return (
    <section
      className="relative overflow-hidden px-10 py-20"
      style={{ background: colors.ink, color: "#fff" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 50%, rgba(209,248,67,0.10), transparent 60%)",
        }}
      />
      <div className="relative z-[2] mx-auto grid max-w-[1280px] items-center gap-15 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: fonts.mono, color: colors.accent }}
          >
            {BIZ_BAND.eyebrow}
          </div>
          <h2
            className="mb-5 text-[clamp(34px,4.4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-white"
            style={{ fontFamily: fonts.display }}
          >
            {BIZ_BAND.headingPrefix}{" "}
            <em
              className="not-italic font-medium"
              style={{
                fontFamily: fonts.italic,
                fontStyle: "italic",
                color: colors.accent,
              }}
            >
              {BIZ_BAND.headingItalic}
            </em>{" "}
            {BIZ_BAND.headingSuffix}
          </h2>
          <p
            className="mb-7 max-w-[50ch] text-[17px] leading-[1.55]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {BIZ_BAND.description}
          </p>

          <div className="grid gap-x-6 gap-y-3.5 md:grid-cols-2">
            {BIZ_BAND.features.map((f) => (
              <div
                key={f}
                className="flex items-start gap-2.5 text-[14px]"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                <Check
                  className="mt-[3px] h-4 w-4 flex-shrink-0"
                  strokeWidth={2.2}
                  style={{ color: colors.accent }}
                />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl border p-9"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="mb-3.5 text-[14px] font-bold uppercase tracking-[0.14em]"
            style={{ fontFamily: fonts.mono, color: colors.accent }}
          >
            {BIZ_BAND.cardLabel}
          </div>
          <div
            className="mb-6 text-[22px] font-bold leading-[1.35] tracking-[-0.020em] text-white"
            style={{ textWrap: "pretty" }}
          >
            {BIZ_BAND.cardQuote}
          </div>
          <div
            className="mb-[22px] text-[13px] tracking-[0.06em]"
            style={{
              fontFamily: fonts.mono,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {BIZ_BAND.cardAuthor}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <a
              href={BIZ_BAND.primaryHref}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold transition-transform hover:-translate-y-px"
              style={{ background: colors.accent, color: colors.ink }}
            >
              {BIZ_BAND.primaryCta}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </a>
            <a
              href={BIZ_BAND.secondaryHref}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
              }}
            >
              {BIZ_BAND.secondaryCta}
              <Download className="h-3.5 w-3.5" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
