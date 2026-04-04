"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { DARK_STATS } from "@/lib/website-constants";
import { RevealOnScroll } from "./RevealOnScroll";

function DarkStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useAnimatedCounter(value, 2000);
  const isDecimal = !Number.isInteger(value);

  return (
    <div className="text-center" ref={ref}>
      <span className="font-display text-5xl md:text-7xl font-bold text-white tabular-nums">
        {isDecimal ? count.toFixed(1) : Math.round(count)}
        {suffix}
      </span>
      <p className="text-sm md:text-base text-[#86868B] mt-3">{label}</p>
    </div>
  );
}

export function DarkStats() {
  return (
    <section className="py-28 md:py-40 bg-[#1D1D1F] grain-overlay">
      <div className="w-container">
        <RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {DARK_STATS.map((stat) => (
              <DarkStat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
