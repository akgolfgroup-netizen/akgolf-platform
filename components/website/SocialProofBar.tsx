"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { SOCIAL_PROOF_STATS } from "@/lib/website-constants";
import { RevealOnScroll } from "./RevealOnScroll";

function CountUpStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useAnimatedCounter(value, 2000);
  const isDecimal = !Number.isInteger(value);

  return (
    <div className="text-center md:px-8" ref={ref}>
      <span className="font-display text-4xl md:text-[48px] font-extrabold text-white tabular-nums">
        {isDecimal ? count.toFixed(1) : Math.round(count)}
        {suffix}
      </span>
      <p className="text-white/50 uppercase tracking-[0.05em] text-[13px] mt-2">{label}</p>
    </div>
  );
}

export function SocialProofBar() {
  return (
    <section className="py-20 md:py-28 bg-[#1D1D1F] grain-overlay">
      <div className="w-container">
        <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/10">
            {SOCIAL_PROOF_STATS.map((stat) => (
              <CountUpStat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
