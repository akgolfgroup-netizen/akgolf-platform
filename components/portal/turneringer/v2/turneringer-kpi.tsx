"use client";

import { cardStyle, monoFont } from "./styles";

export interface Kpi {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "pos" | "neg" | "neutral";
}

export function TurneringerKpiStrip({ items }: { items: Kpi[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} style={cardStyle} className="px-5 py-[18px] text-white">
          <div
            className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50"
            style={{ fontFamily: monoFont }}
          >
            {k.label}
          </div>
          <div
            className="mt-1.5 text-[28px] font-bold leading-none tracking-[-0.03em]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {k.value}
            {k.unit ? (
              <span className="ml-1 text-[13px] font-medium text-white/50">{k.unit}</span>
            ) : null}
          </div>
          {k.delta ? (
            <div
              className="mt-1.5 text-[10px] font-bold"
              style={{
                fontFamily: monoFont,
                color:
                  k.deltaTone === "neg"
                    ? "#F49283"
                    : k.deltaTone === "neutral"
                    ? "rgba(255,255,255,0.5)"
                    : "#6FCBA1",
              }}
            >
              {k.delta}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
