"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { fonts, colors } from "../academy/pricing-tokens";
import { PRICING_CTA } from "./data";

export function PricingCtaSection() {
  return (
    <section
      className="px-10 py-[100px]"
      style={{ background: colors.surface }}
    >
      <div className="mx-auto max-w-[1280px] text-center">
        <h2
          className="mx-auto mb-5 max-w-[22ch] text-[clamp(40px,5.4vw,68px)] font-extrabold leading-[1.05] tracking-[-0.030em]"
          style={{ fontFamily: fonts.display, color: colors.ink }}
        >
          {PRICING_CTA.headingPrefix}{" "}
          <em
            className="not-italic font-medium"
            style={{
              fontFamily: fonts.italic,
              fontStyle: "italic",
              color: colors.primary,
            }}
          >
            {PRICING_CTA.headingItalic}
          </em>
          {PRICING_CTA.headingSuffix}
        </h2>
        <p
          className="mx-auto mb-9 max-w-[50ch] text-[17px] leading-[1.55]"
          style={{ color: colors.text }}
        >
          {PRICING_CTA.description}
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-3.5">
          <a
            href={PRICING_CTA.primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[14px] font-bold transition-transform hover:-translate-y-px"
            style={{ background: colors.ink, color: "#fff" }}
          >
            {PRICING_CTA.primaryCta}
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </a>
          <a
            href={PRICING_CTA.secondaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-[14px] font-bold transition-colors hover:bg-[var(--akgolf-ink,#0A1F18)] hover:text-white"
            style={{ borderColor: colors.ink, color: colors.ink }}
          >
            {PRICING_CTA.secondaryCta}
            <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
