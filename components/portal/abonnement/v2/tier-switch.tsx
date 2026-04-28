"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

export interface TierOption {
  key: string;
  name: string;
  price: string;
  per: string;
  meta: string;
  current?: boolean;
}

interface TierSwitchProps {
  tiers: TierOption[];
  lede: string;
  onSelect?: (key: string) => void;
}

export function TierSwitch({ tiers, lede, onSelect }: TierSwitchProps) {
  return (
    <section
      className="rounded-[16px] px-6 py-5.5"
      style={{
        background: "#0D2E23",
        border: "1px solid #1A4A3A",
      }}
    >
      <h3 className="m-0 text-sm font-semibold tracking-[-0.01em] text-white">
        Bytt plan
      </h3>
      <p
        className="mb-4.5 mt-1 text-[12.5px] leading-[1.5]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {lede}
      </p>
      <div className="flex flex-col gap-2.5">
        {tiers.map((tier) => (
          <button
            key={tier.key}
            type="button"
            disabled={tier.current}
            onClick={() => !tier.current && onSelect?.(tier.key)}
            className={cn(
              "rounded-[12px] px-4 py-3.5 text-left transition disabled:cursor-default",
              tier.current
                ? ""
                : "hover:border-white/15 hover:bg-white/5",
            )}
            style={{
              background: tier.current
                ? "rgba(209,248,67,0.05)"
                : "rgba(255,255,255,0.02)",
              border: tier.current
                ? "1px solid rgba(209,248,67,0.30)"
                : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold tracking-[-0.01em] text-white">
                {tier.name}
              </span>
              {tier.current ? (
                <span
                  className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase"
                  style={{
                    background: "#D1F843",
                    color: "#0A1F18",
                    letterSpacing: "0.14em",
                  }}
                >
                  Din plan
                </span>
              ) : null}
            </div>
            <div
              className="flex items-baseline gap-1"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              <span
                className="text-xl font-bold tabular-nums tracking-[-0.02em] text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {tier.price}
              </span>
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                / {tier.per}
              </span>
            </div>
            <div
              className="mt-1.5 text-[11.5px] leading-[1.5]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {tier.meta}
            </div>
          </button>
        ))}
      </div>
      <a
        className="mt-3.5 inline-flex items-center gap-1 border-t border-white/5 pt-3.5 text-xs"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        <ArrowRight className="h-3 w-3" />
        Sammenlign alle planer
      </a>
    </section>
  );
}
