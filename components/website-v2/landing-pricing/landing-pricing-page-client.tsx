"use client";

import { useState } from "react";
import { WebFooter } from "../web-footer";
import { WebNav } from "../web-nav";
import { fonts, colors } from "../academy/pricing-tokens";
import { AddOnsSection } from "./addons-section";
import { BillingToggle, type BillingMode } from "./billing-toggle";
import { BizBand } from "./biz-band";
import { PricingCtaSection } from "./cta-section";
import { DropInSection } from "./dropin-section";
import { PricingFaqSection } from "./faq-section";
import { MainPlanCard } from "./main-plan-card";
import { MAIN_PLANS, PRICING_HERO } from "./data";

export function LandingPricingPageClient() {
  const [billing, setBilling] = useState<BillingMode>("monthly");

  return (
    <div
      className="min-h-screen"
      style={{
        background: colors.surface,
        color: colors.text,
        fontFamily: fonts.body,
      }}
    >
      <WebNav active="pricing" />

      {/* HERO */}
      <section
        className="px-10 pb-[70px] pt-[140px] text-center"
        style={{ background: colors.surface }}
      >
        <div className="mx-auto max-w-[1280px]">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: fonts.mono, color: colors.primary }}
          >
            {PRICING_HERO.eyebrow}
          </div>
          <h1
            className="mx-auto mb-[22px] max-w-[18ch] text-[clamp(48px,6.5vw,84px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-balance"
            style={{ fontFamily: fonts.display, color: colors.ink }}
          >
            {PRICING_HERO.headingPrefix}{" "}
            <em
              className="not-italic font-medium"
              style={{
                fontFamily: fonts.italic,
                fontStyle: "italic",
                color: colors.primary,
              }}
            >
              {PRICING_HERO.headingItalic}
            </em>
            {PRICING_HERO.headingSuffix}
          </h1>
          <p
            className="mx-auto mb-9 max-w-[56ch] text-[19px] leading-[1.55]"
            style={{ color: colors.text }}
          >
            {PRICING_HERO.lede}
          </p>

          <div className="mb-2 flex justify-center">
            <BillingToggle mode={billing} onChange={setBilling} />
          </div>
        </div>
      </section>

      {/* MAIN PRICING GRID */}
      <section
        className="px-10 pb-[100px] pt-[30px]"
        style={{ background: colors.surface }}
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {MAIN_PLANS.map((plan) => (
              <MainPlanCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>
        </div>
      </section>

      <DropInSection />
      <AddOnsSection />
      <BizBand />
      <PricingFaqSection />
      <PricingCtaSection />

      <WebFooter />
    </div>
  );
}
