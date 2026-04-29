"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { ACADEMY_PRICING_V2 } from "@/lib/website-constants";
import { colors, fonts } from "./pricing-tokens";

interface AbonnementHeroProps {
  hero: typeof ACADEMY_PRICING_V2.hero;
}

export function AbonnementHero({ hero }: AbonnementHeroProps) {
  return (
    <section className="px-10 pb-[60px] pt-[180px]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-[60px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: fonts.mono, color: colors.primary }}
          >
            {hero.eyebrow}
          </div>
          <h1
            className="mb-[22px] text-[clamp(54px,6.4vw,88px)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance"
            style={{ fontFamily: fonts.display, color: colors.ink }}
          >
            {hero.headingPrefix}{" "}
            <em
              className="not-italic font-medium"
              style={{
                fontFamily: fonts.italic,
                fontStyle: "italic",
                color: colors.primary,
              }}
            >
              {hero.headingItalic}
            </em>{" "}
            {hero.headingSuffix}
          </h1>
          <p
            className="mb-7 max-w-[52ch] text-[19px] leading-[1.6]"
            style={{ color: colors.text }}
          >
            {hero.lede}
          </p>
          <div
            className="flex flex-wrap gap-9 border-y py-6"
            style={{ borderColor: colors.line }}
          >
            {hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <div
                  className="text-[36px] font-medium leading-none tracking-[-0.02em]"
                  style={{
                    fontFamily: fonts.italic,
                    fontStyle: "italic",
                    color: colors.ink,
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ fontFamily: fonts.mono, color: colors.muted }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[20px]"
          style={{
            background: "linear-gradient(135deg, #0A1F18 0%, #005840 100%)",
          }}
        >
          <Image
            src="/images/academy/AK-Golf-Academy-20.jpg"
            alt="Coaching-øyeblikk på range med Anders"
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 45vw"
            priority
          />
          <div
            className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md"
            style={{ background: "rgba(10,31,24,0.55)", color: "#fff" }}
          >
            <Camera className="h-3.5 w-3.5" strokeWidth={2} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ fontFamily: fonts.mono }}
            >
              AK Golf Academy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
