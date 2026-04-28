"use client";

import { Info } from "lucide-react";
import type { CancellationRule } from "@/components/portal/booking/booking-types";

interface CancellationRulesProps {
  rules: readonly CancellationRule[];
}

export function CancellationRules({ rules }: CancellationRulesProps) {
  return (
    <div
      className="mb-6"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
        borderRadius: 14,
        padding: "16px 20px",
      }}
    >
      <div
        className="flex items-center gap-2 mb-3"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        <Info className="w-3.5 h-3.5" strokeWidth={2} /> Avbestillingsregler
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rules.map((rule) => (
          <div
            key={rule.hours}
            className="flex items-baseline gap-2"
            style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#D1F843",
                fontWeight: 600,
              }}
            >
              {rule.hours}t
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
              {rule.rule}
            </span>
            <span
              className="ml-auto"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {rule.fee}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
