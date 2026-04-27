"use client";

import {
  BarChart3,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Video,
  type LucideIcon,
} from "lucide-react";
import { ACADEMY_PRICING_V2 } from "@/lib/website-constants";
import { WebFooter } from "../web-footer";
import { WebNav } from "../web-nav";
import { AbonnementHero } from "./abonnement-hero";
import { CompareTable } from "./compare-table";
import { CtaBand } from "./cta-band";
import { FaqSection } from "./faq-section";
import { PlanCard } from "./plan-card";
import { colors, fonts } from "./pricing-tokens";

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Smartphone,
  Video,
  Snowflake,
  RotateCcw,
  ShieldCheck,
};

export function AbonnementPageClient() {
  const { hero, plansHead, plans, compare, included, faq, cta } =
    ACADEMY_PRICING_V2;

  return (
    <div
      className="min-h-screen"
      style={{
        background: colors.surface,
        color: colors.text,
        fontFamily: fonts.body,
      }}
    >
      <WebNav active="academy" />

      <AbonnementHero hero={hero} />

      {/* PLANS */}
      <section className="px-10 pb-[100px] pt-[30px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mx-auto mb-12 max-w-[60ch] text-center">
            <h2
              className="mb-4 text-[clamp(40px,4.6vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: fonts.display, color: colors.ink }}
            >
              {plansHead.headingPrefix}{" "}
              <em
                className="not-italic font-medium"
                style={{
                  fontFamily: fonts.italic,
                  fontStyle: "italic",
                  color: colors.primary,
                }}
              >
                {plansHead.headingItalic}
              </em>
              {plansHead.headingSuffix}
            </h2>
            <p
              className="mx-auto text-[17px] leading-[1.6]"
              style={{ color: colors.text }}
            >
              {plansHead.description}
            </p>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE TABLE */}
      <section className="bg-white px-10 py-[90px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-10">
            <div>
              <div
                className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ fontFamily: fonts.mono, color: colors.primary }}
              >
                {compare.eyebrow}
              </div>
              <h2
                className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em]"
                style={{ fontFamily: fonts.display, color: colors.ink }}
              >
                {compare.headingPrefix}{" "}
                <em
                  className="not-italic font-medium"
                  style={{
                    fontFamily: fonts.italic,
                    fontStyle: "italic",
                    color: colors.primary,
                  }}
                >
                  {compare.headingItalic}
                </em>
              </h2>
            </div>
          </div>

          <CompareTable rows={compare.rows} plans={plans} />
        </div>
      </section>

      {/* INCLUDED */}
      <section className="px-10 py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 max-w-[60ch]">
            <div
              className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ fontFamily: fonts.mono, color: colors.primary }}
            >
              {included.eyebrow}
            </div>
            <h2
              className="text-[clamp(36px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.03em]"
              style={{ fontFamily: fonts.display, color: colors.ink }}
            >
              {included.headingPrefix}{" "}
              <em
                className="not-italic font-medium"
                style={{
                  fontFamily: fonts.italic,
                  fontStyle: "italic",
                  color: colors.primary,
                }}
              >
                {included.headingItalic}
              </em>{" "}
              {included.headingSuffix}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {included.cards.map((card) => {
              const Icon = ICON_MAP[card.icon] ?? BarChart3;
              return (
                <article
                  key={card.title}
                  className="rounded-[24px] border bg-white p-8"
                  style={{ borderColor: colors.line }}
                >
                  <div
                    className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl"
                    style={{
                      background: "rgba(0,88,64,0.08)",
                      color: colors.primary,
                    }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <h4
                    className="mb-2.5 text-[18px] font-bold tracking-[-0.015em]"
                    style={{ fontFamily: fonts.display, color: colors.ink }}
                  >
                    {card.title}
                  </h4>
                  <p
                    className="text-[14px] leading-[1.6]"
                    style={{ color: colors.text }}
                  >
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FaqSection faq={faq} />
      <CtaBand cta={cta} />

      <WebFooter />
    </div>
  );
}
