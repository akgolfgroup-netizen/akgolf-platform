"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { SOCIAL_PROOF_STATS } from "@/lib/website-constants";
import { RevealOnScroll } from "./RevealOnScroll";

function CountUpStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useAnimatedCounter(value, 2000);
  const isDecimal = !Number.isInteger(value);

  return (
    <div className="text-center" ref={ref}>
      <span className="font-display text-3xl md:text-4xl font-bold text-[#1D1D1F] tabular-nums">
        {isDecimal ? count.toFixed(1) : Math.round(count)}
        {suffix}
      </span>
      <p className="text-sm text-[#6E6E73] mt-1">{label}</p>
    </div>
  );
}

export function SocialProofBar() {
  return (
    <section className="py-16 md:py-20 bg-[#F5F5F7]">
      <div className="w-container">
        <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {SOCIAL_PROOF_STATS.map((stat) => (
              <CountUpStat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
