"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ACADEMY_PRICING_V2 } from "@/lib/website-constants";
import { colors, fonts } from "./pricing-tokens";

interface CtaBandProps {
  cta: typeof ACADEMY_PRICING_V2.cta;
}

export function CtaBand({ cta }: CtaBandProps) {
  return (
    <section
      className="px-10 py-[100px]"
      style={{ background: colors.ink, color: "#fff" }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-[60px] lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: fonts.mono, color: colors.accent }}
          >
            {cta.eyebrow}
          </div>
          <h2
            className="mb-[18px] text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.0] tracking-[-0.035em]"
            style={{ fontFamily: fonts.display }}
          >
            {cta.headingPrefix}{" "}
            <em
              className="not-italic font-medium"
              style={{
                fontFamily: fonts.italic,
                fontStyle: "italic",
                color: colors.accent,
              }}
            >
              {cta.headingItalic}
            </em>{" "}
            {cta.headingSuffix}
          </h2>
          <p className="mb-7 max-w-[50ch] text-[17px] leading-[1.6] text-white/70">
            {cta.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={cta.primaryHref}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
              style={{ background: colors.accent, color: colors.ink }}
            >
              {cta.primaryCta}
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
            <Link
              href={cta.secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.20)" }}
            >
              {cta.secondaryCta}
            </Link>
          </div>
        </div>
        <aside
          className="flex flex-col gap-[18px] rounded-[24px] border p-7"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="text-[24px] leading-[1.35]"
            style={{
              fontFamily: fonts.italic,
              fontStyle: "italic",
              fontWeight: 500,
              color: "#fff",
            }}
          >
            &ldquo;{cta.quote}&rdquo;
          </div>
          <div
            className="flex items-center gap-3 border-t pt-3"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            <div
              className="grid h-10 w-10 place-items-center rounded-full text-[14px] font-bold"
              style={{ background: colors.accent, color: colors.ink }}
            >
              KB
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">
                {cta.quoteAuthor}
              </div>
              <div
                className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55"
                style={{ fontFamily: fonts.mono }}
              >
                {cta.quoteContext}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
