"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "./number-ticker";

interface HeroStat {
  value: number;
  label: string;
  change?: string;
  positive?: boolean;
  decimals?: number;
}

interface HeroCardProps {
  userName: string | null;
  stats: HeroStat[];
  subtitle?: string;
}

export function HeroCard({ userName, stats, subtitle }: HeroCardProps) {
  const firstName = userName?.split(" ")[0] ?? "spiller";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative min-h-[260px] overflow-hidden rounded-[20px]"
      style={{
        boxShadow: "var(--shadow-portal-card)",
      }}
    >
      <img
        src="/images/hero/hero-main.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 85%), linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-7">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/70">
          Velkommen tilbake
        </p>
        <h1 className="mt-1.5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
          Hei, {firstName}
          <span className="text-[#52B788]">.</span>
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-[400px] text-sm leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}

        <div className="mt-5 flex gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <NumberTicker
                value={stat.value}
                decimalPlaces={stat.decimals ?? 0}
                delay={0.4}
                className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-white tabular-nums"
              />
              <span className="mt-1 text-[11px] uppercase tracking-[0.03em] text-white/50">
                {stat.label}
              </span>
              {stat.change && (
                <span
                  className={`mt-0.5 text-[11px] font-semibold ${
                    stat.positive !== false
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-error)]"
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
